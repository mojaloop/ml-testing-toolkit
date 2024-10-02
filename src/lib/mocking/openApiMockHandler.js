/*****
 License
 --------------
 Copyright © 2017 Bill & Melinda Gates Foundation
 The Mojaloop files are made available by the Bill & Melinda Gates Foundation under the Apache License, Version 2.0 (the "License") and you may not use these files except in compliance with the License. You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, the Mojaloop files are distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 Contributors
 --------------
 This is the official list of the Mojaloop project contributors for this file.
 Names of the original copyright holders (individuals or organizations)
 should be listed with a '*' in the first column. People who have
 contributed from an organization can be listed under the organization
 that actually holds the copyright for their contributions (see the
 Gates Foundation organization for an example). Those individuals should have
 their names indented and be marked with a '-'. Email address can be added
 optionally within square brackets <email>.
 * Gates Foundation

 * ModusBox
 * Georgi Logodazhki <georgi.logodazhki@modusbox.com>
 * Vijaya Kumar Guthi <vijaya.guthi@modusbox.com> (Original Author)
 --------------
 ******/

'use strict'

const OpenApiBackend = require('openapi-backend').default
const OpenApiDefinitionsModel = require('./openApiDefinitionsModel')
const OpenApiVersionTools = require('./openApiVersionTools')
const customLogger = require('../requestLogger')
const OpenApiRulesEngine = require('./openApiRulesEngine')
const CallbackHandler = require('../callbackHandler')
const _ = require('lodash')
const MyEventEmitter = require('../MyEventEmitter')
const utils = require('../utils')
const Config = require('../config')
const objectStore = require('../objectStore')
const arrayStore = require('../arrayStore')
const JwsSigning = require('../jws/JwsSigning')

const path = require('path')

const IlpModel = require('./middleware-functions/ilpModel')
const { generateULID } = require('./custom-functions/generic')

let apis = []

// TODO: Implement a logger and log the messages with different verbosity
// TODO: Write unit tests

/**
 * Operations on /
 */
module.exports.initilizeMockHandler = async () => {
  // Initialize ILP
  IlpModel.init((await Config.getUserConfig()).ILP_SECRET)
  // Get API Definitions from configuration
  const apiDefinitions = await OpenApiDefinitionsModel.getApiDefinitions()
  // Create create openApiBackend objects for all the api definitions
  apis = apiDefinitions.map(item => {
    const tempObj = new OpenApiBackend({
      definition: path.join(item.specFile),
      strict: true,
      quick: true,
      handlers: {
        notImplemented: async (context, req, h) => {
          const resp = await openApiBackendNotImplementedHandler(context, req, h, item)
          return resp
        },
        validationFail: async (context, req, h) => {
          const extensionList = [{
            key: 'keyword',
            value: context.validation.errors[0].keyword
          },
          {
            key: 'instancePath',
            value: context.validation.errors[0].instancePath
          }]
          for (const [key, value] of Object.entries(context.validation.errors[0].params)) {
            extensionList.push({ key, value })
          }
          return h.response(errorResponseBuilder('3100', context.validation.errors[0].message, { extensionList })).code(400)
        },
        notFound: async (context, req, h) => {
          customLogger.logMessage('error', 'Resource not found', { request: req })
          return h.response({ error: 'Not Found' }).code(404)
        }
      }
    })

    return {
      ...item,
      openApiBackendObject: tempObj
    }
  })

  for (const api of apis) {
    customLogger.logMessage('info', 'Initializing the api spec file: ' + api.specFile, { notification: false })
    await api.openApiBackendObject.init()
  }
}

module.exports.handleRequest = async (req, h) => {
  // JWS Validation
  try {
    const jwsValidated = await JwsSigning.validate(req)
    if (jwsValidated) {
      customLogger.logMessage('debug', 'JWS Signature Validated', { request: req })
    }
  } catch (err) {
    // TODO: The errorCode should be checked with the api specification
    customLogger.logMessage('error', 'JWS validation failed', { additionalData: err.message, request: req })
    return h.response(errorResponseBuilder('3105', 'Invalid signature')).code(400)
  }

  let selectedApi
  // Pick a right api definition by searching for the requested resource in the definitions sequentially
  // TODO: This should be optimized by defining a hash table (object) of all the resources in all definition files on startup.

  const pickedApis = pickApiByMethodPathHostnameAndPrefix(req)

  // Let's pick the first one for now and swap it with the right version later
  selectedApi = pickedApis.length > 0 ? pickedApis[0] : null

  if (!selectedApi) {
    customLogger.logMessage('error', 'Resource not found', { request: req })
    return h.response({ error: 'Not Found' }).code(404)
  }

  customLogger.logMessage('info', 'API matched: ' + selectedApi.type, { request: req })
  // Modify request
  if (selectedApi && selectedApi.prefix) {
    req.path = req.path.slice(selectedApi.prefix.length)
    customLogger.logMessage('info', 'Trimmed prefix from request path: ' + selectedApi.prefix, { request: req })
  }

  if ((selectedApi.type === 'fspiop' || selectedApi.type === 'iso20022') && (await Config.getUserConfig(req.customInfo.user)).VERSIONING_SUPPORT_ENABLE) {
    // Validate accept header for POST & GET.
    if (req.method === 'post' || req.method === 'get') {
      // Validate the accept header here
      const acceptHeaderValidationResult = OpenApiVersionTools.validateAcceptHeader(req.headers.accept)
      if (acceptHeaderValidationResult.validationFailed) {
        return h.response(errorResponseBuilder('3001', acceptHeaderValidationResult.message)).code(400)
      }
    } else {
      // Validate content-type header for all the remaining requests
      const contentTypeHeaderValidationResult = OpenApiVersionTools.validateContentTypeHeader(req.headers['content-type'])
      if (contentTypeHeaderValidationResult.validationFailed) {
        return h.response(errorResponseBuilder('3001', contentTypeHeaderValidationResult.message)).code(400)
      }
    }
    // Pick the right API object based on the major and minor versions (Version negotiation as per the API Definition file)
    const versionNegotiationResult = OpenApiVersionTools.negotiateVersion(req, pickedApis)
    if (versionNegotiationResult.negotiationFailed) {
      // Create extensionList property as per the API specification document with supported versions
      const extensionList = pickedApis.map(item => {
        return {
          key: item.majorVersion + '',
          value: item.minorVersion + ''
        }
      })
      return h.response(errorResponseBuilder('3001', 'The Client requested an unsupported version, see extension list for supported version(s).', { extensionList })).code(406)
    }
    req.customInfo.negotiatedContentType = versionNegotiationResult.responseContentTypeHeader
    selectedApi = pickedApis[versionNegotiationResult.negotiatedIndex]
    req.customInfo.selectedApi = selectedApi
  }
  try {
    return await selectedApi.openApiBackendObject.handleRequest(
      {
        method: req.method,
        path: req.path,
        body: req.payload,
        query: req.query,
        headers: req.headers
      },
      req,
      h
    )
  } catch (err) {
    customLogger.logMessage('error', err.message, { request: req })
    return h.response({ error: 'Not Found' }).code(404)
  }
}

const pickApiByMethodPathHostnameAndPrefix = (req) => {
  let potentialApis = apis

  // Match path
  const matchedPrefixApis = apis.filter(item => {
    return item.prefix ? req.path.startsWith(item.prefix) : false
  })
  if (matchedPrefixApis.length > 0) {
    return matchedPrefixApis.filter(item => {
      return item.openApiBackendObject.matchOperation({ ...req, path: req.path.slice(item.prefix.length) })
    })
  } else {
    // apis without prefix
    potentialApis = potentialApis.filter(item => {
      return !item.prefix
    })
  }

  // Match hostnames
  const matchedHostnameApis = potentialApis.filter(item => {
    return item.hostnames && req.info && req.info.hostname ? item.hostnames.includes(req.info.hostname) : false
  })
  potentialApis = matchedHostnameApis.length > 0 ? matchedHostnameApis : potentialApis.filter(item => !item.hostnames || item.hostnames.length === 0)

  // FSPIOP and ISO20022 version negotiation
  let headerToCompare = req.headers['content-type']
  if (req.method === 'get') {
    headerToCompare = req.headers.accept
  }
  const headerComparisonResult = OpenApiVersionTools.parseAcceptHeader(headerToCompare)
  if (headerComparisonResult.apiType === 'fspiop' || headerComparisonResult.apiType === 'iso20022') {
    potentialApis = potentialApis.filter(item => {
      return item.type === headerComparisonResult.apiType
    })
  }

  const pickedApis = potentialApis.filter(item => {
    return item.openApiBackendObject.matchOperation(req)
  })

  return pickedApis
}

const errorResponseBuilder = (errorCode, errorDescription, additionalProperties = null) => {
  return {
    errorInformation: {
      errorCode,
      errorDescription,
      ...additionalProperties
    }
  }
}

module.exports.getOpenApiObjects = () => {
  return apis
}

const openApiBackendNotImplementedHandler = async (context, req, h, item) => {
  customLogger.logMessage('debug', 'Schema Validation Passed', { request: req })
  MyEventEmitter.getEmitter('inboundRequest', req.customInfo.user).emit('newInbound', { method: req.method, path: req.path, headers: req.headers, body: req.payload })
  if (req.method === 'put') {
    MyEventEmitter.getEmitter('testOutbound', req.customInfo.user).emit(req.method + ' ' + req.path, req.headers, req.payload, req.method, req.path)
    let assertionPath = req.path
    const assertionData = { headers: req.headers, body: req.payload }
    if (assertionPath.endsWith('/error')) {
      assertionPath = assertionPath.replace('/error', '')
      assertionData.error = true
    }
    objectStore.push('requests', assertionPath, assertionData)
    MyEventEmitter.getEmitter('assertionRequest', req.customInfo.user).emit(assertionPath, assertionData)
  }
  // Store all the inbound requests
  arrayStore.push('requestsHistory', { timestamp: Date.now(), method: req.method, path: req.path, headers: req.headers, body: req.payload })

  req.customInfo.specFile = item.specFile
  req.customInfo.jsfRefFile = item.jsfRefFile
  let responseBody, responseStatus
  // Check for response map file
  try {
    const respMapRawdata = await utils.readFileAsync(item.responseMapFile)
    const responseMap = JSON.parse(respMapRawdata)
    if (responseMap && responseMap[context.operation.path] && responseMap[context.operation.path][context.request.method]) {
      const responseInfo = responseMap[context.operation.path][context.request.method]
      req.customInfo.responseInfo = responseInfo
    } else {
      customLogger.logMessage('error', 'Response info not found for method in response map file for ' + context.request.method + ' ' + context.operation.path, { request: req })
      return
    }
  } catch (err) { }
  // Check for the synchronous response rules
  const generatedResponse = await OpenApiRulesEngine.responseRules(context, req)
  responseStatus = +generatedResponse.status
  responseBody = generatedResponse.body
  customLogger.logMessage('info', 'Generated response', { additionalData: generatedResponse, request: req })
  if (generatedResponse.delay) {
    await new Promise(resolve => setTimeout(resolve, generatedResponse.delay))
  }
  if (!responseBody) {
    // Generate mock response from openAPI spec file
    const { status, mock } = context.api.mockResponseForOperation(context.operation.operationId)
    responseBody = mock
    responseStatus = +status
  }
  // Verify that it is a success code, then generate callback
  if (item.asynchronous && (req.method === 'post' || req.method === 'get' || req.method === 'put') && responseStatus >= 200 && responseStatus <= 299) {
    // Generate callback asynchronously
    setImmediate(generateAsyncCallback, item, context, req)
  }
  if (_.isEmpty(responseBody)) {
    return h.response().code(responseStatus)
  } else {
    return h.response(responseBody).code(responseStatus)
  }
}

const generateAsyncCallback = async (item, context, req) => {
  const userConfig = await Config.getUserConfig(req.customInfo.user)
  if (req.method === 'put') {
    if (!userConfig.HUB_ONLY_MODE) {
      return
    }
  } else {
    // Getting callback info from callback map file
    try {
      const cbMapRawdata = await utils.readFileAsync(item.callbackMapFile)
      const callbackMap = JSON.parse(cbMapRawdata)
      if (!callbackMap[context.operation.path]) {
        customLogger.logMessage('error', 'Callback not found for path in callback map file for ' + context.operation.path, req.customInfo.user, { request: req })
        return
      }
      const callbackInfo = callbackMap[context.operation.path][context.request.method]
      if (!callbackInfo) {
        customLogger.logMessage('error', 'Callback info not found for method in callback map file for ' + context.operation.path + context.request.method, { request: req })
        return
      }
      req.customInfo.callbackInfo = callbackInfo
    } catch (err) {
      customLogger.logMessage('error', 'Callback file not found.', { request: req })
      return
    }
    // Additional validation based on the Json Rules Engine, send error callback on failure
    const generatedErrorCallback = await OpenApiRulesEngine.validateRules(context, req)
    if (generatedErrorCallback.skipCallback) {
      return
    }
    if (generatedErrorCallback.body) {
      // TODO: Handle method and path verifications against the generated ones
      customLogger.logMessage('error', 'Sending error callback', { request: req })
      CallbackHandler.handleCallback(generatedErrorCallback, context, req)
      return
    }
  }

  // Callback Rules engine - match the rules and generate the specified callback
  const generatedCallback = await OpenApiRulesEngine.callbackRules(context, req)
  if (generatedCallback.skipCallback) {
    return
  }

  // forward request after validation
  if (userConfig.HUB_ONLY_MODE) {
    const forwardRequest = await OpenApiRulesEngine.forwardRules(context, req)
    if (forwardRequest) {
      CallbackHandler.handleCallback(forwardRequest, context, req)
    }
    return
  }
  // TODO: Need to handle iso20022 error payloads.
  // Handle quotes and transfer association - should do this first to get the associated quote
  if (userConfig.TRANSFERS_VALIDATION_WITH_PREVIOUS_QUOTES) {
    const matchFound = require('./middleware-functions/quotesAssociation').handleTransfers(context, req)
    if (!matchFound) {
      customLogger.logMessage('error', 'Matching Quote Not Found', { request: req })
      const generatedErrorCallback = await OpenApiRulesEngine.generateMockErrorCallback(context, req)
      if (req.customInfo.selectedApi?.type === 'iso20022') {
        _handleISO20022ErrorCallback(generatedErrorCallback, '3208')
      } else {
        generatedErrorCallback.body = {
          errorInformation: {
            errorCode: '3208',
            errorDescription: 'Provided Transfer ID was not found on the server.'
          }
        }
      }
      CallbackHandler.handleCallback(generatedErrorCallback, context, req)
      return
    }
  }

  // Handle transfer validation against decoded ILP Packet
  if (userConfig.TRANSFERS_VALIDATION_ILP_PACKET) {
    const validated = IlpModel.validateTransferIlpPacket(context, req)
    if (!validated) {
      customLogger.logMessage('error', 'ILP Packet is not matching with the content', { request: req })
      const generatedErrorCallback = await OpenApiRulesEngine.generateMockErrorCallback(context, req)
      if (req.customInfo.selectedApi?.type === 'iso20022') {
        _handleISO20022ErrorCallback(generatedErrorCallback, '3106')
      } else {
        generatedErrorCallback.body = {
          errorInformation: {
            errorCode: '3106',
            errorDescription: 'ILP Packet is not matching with the content.'
          }
        }
      }
      CallbackHandler.handleCallback(generatedErrorCallback, context, req)
      return
    }
  }

  // Handle condition validation in transfer request
  if (userConfig.TRANSFERS_VALIDATION_CONDITION) {
    const validated = IlpModel.validateTransferCondition(context, req)
    if (!validated) {
      customLogger.logMessage('error', 'Condition can not be validated', { request: req })
      const generatedErrorCallback = await OpenApiRulesEngine.generateMockErrorCallback(context, req)
      if (req.customInfo.selectedApi?.type === 'iso20022') {
        _handleISO20022ErrorCallback(generatedErrorCallback, '3106')
      } else {
        generatedErrorCallback.body = {
          errorInformation: {
            errorCode: '3106',
            errorDescription: 'Condition can not be validated.'
          }
        }
      }
      CallbackHandler.handleCallback(generatedErrorCallback, context, req)
      return
    }
  }

  if (generatedCallback.body) {
    // Append ILP properties to callback
    const fulfilment = IlpModel.handleQuoteIlp(context, generatedCallback)
    IlpModel.handleTransferIlp(context, generatedCallback)
    if (userConfig.TRANSFERS_VALIDATION_WITH_PREVIOUS_QUOTES) {
      require('./middleware-functions/quotesAssociation').handleQuotes(context, req, fulfilment)
    }
    // TODO: Handle method and path verifications against the generated ones
    CallbackHandler.handleCallback(generatedCallback, context, req)
    // Handle triggers for a transaction request
    require('./middleware-functions/transactionRequestsService').handleRequest(context, req, generatedCallback, item.triggerTemplatesFolder)
  }
}

const _handleISO20022ErrorCallback = (generatedErrorCallback, errorCode) => {
  generatedErrorCallback.headers = {
    ...generatedErrorCallback.headers,
    'content-type': 'application/vnd.interoperability.iso20022.transfers+json;version=2.0'
  }
  generatedErrorCallback.body = {
    GrpHdr: {
      MsgId: generateULID(),
      CreDtTm: new Date().toISOString()
    },
    TxInfAndSts: {
      StsRsnInf: {
        Rsn: {
          Cd: errorCode
        }
      }
    }
  }
  return generatedErrorCallback
}

module.exports.openApiBackendNotImplementedHandler = openApiBackendNotImplementedHandler
module.exports.generateAsyncCallback = generateAsyncCallback
