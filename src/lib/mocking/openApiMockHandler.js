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
 * Vijaya Kumar Guthi <vijaya.guthi@modusbox.com> (Original Author)
 --------------
 ******/

'use strict'

const OpenApiBackend = require('openapi-backend').default
const OpenApiDefinitionsModel = require('./openApiDefinitionsModel')
const OpenApiVersionTools = require('./openApiVersionTools')
const customLogger = require('../requestLogger')
const fs = require('fs')
const { promisify } = require('util')
const OpenApiRulesEngine = require('./openApiRulesEngine')
const CallbackHandler = require('../callbackHandler')
const _ = require('lodash')
const MyEventEmitter = require('../MyEventEmitter')
const readFileAsync = promisify(fs.readFile)
const Config = require('../config')
const assertionStore = require('../assertionStore')
const JwsSigning = require('../jws/JwsSigning')

var path = require('path')

var apis = []

// TODO: Implement a logger and log the messages with different verbosity
// TODO: Write unit tests

/**
 * Operations on /
 */
module.exports.initilizeMockHandler = async () => {
  // Get API Definitions from configuration
  const apiDefinitions = await OpenApiDefinitionsModel.getApiDefinitions()

  // Create create openApiBackend objects for all the api definitions
  apis = apiDefinitions.map(item => {
    const tempObj = new OpenApiBackend({
      definition: path.join(item.specFile),
      strict: true,
      handlers: {
        notImplemented: openApiBackendNotImplementedHandler(item),
        validationFail: async (context, req, h) => {
          const extensionList = [
            {
              key: 'keyword',
              value: context.validation.errors[0].keyword
            },
            {
              key: 'dataPath',
              value: context.validation.errors[0].dataPath
            }
          ]
          for (const [key, value] of Object.entries(context.validation.errors[0].params)) {
            extensionList.push({
              key,
              value
            })
          }
          return h.response(errorResponseBuilder('3100', context.validation.errors[0].message, { extensionList })).code(400)
        },
        notFound: async (context, req, h) => {
          customLogger.logMessage('error', 'Resource not found', null, true, req)
          return h.response({ error: 'Not Found' }).code(404)
        }
      }
    })

    return {
      ...item,
      openApiBackendObject: tempObj
    }
  })

  // Loop through the apis and initialize them
  // apis.forEach(api => {
  //   customLogger.logMessage('info', 'Initializing the api spec file: ' + api.specFile, null, false)
  //   api.openApiBackendObject.init()
  // })

  for (const api of apis) {
    customLogger.logMessage('info', 'Initializing the api spec file: ' + api.specFile, null, false)
    await api.openApiBackendObject.init()
  }
}

module.exports.handleRequest = (req, h) => {
  // JWS Validation
  try {
    const jwsValidated = JwsSigning.validate(req)
    if (jwsValidated) {
      customLogger.logMessage('debug', 'JWS Signature Validated', null, true, req)
    }
  } catch (err) {
    // TODO: The errorCode should be checked with the api specification
    customLogger.logMessage('error', 'JWS validation failed', err.message, true, req)
    return h.response(errorResponseBuilder('3105', 'Invalid signature')).code(400)
  }

  let selectedVersion = 0
  // Pick a right api definition by searching for the requested resource in the definitions sequentially
  // TODO: This should be optimized by defining a hash table (object) of all the resources in all definition files on startup.
  selectedVersion = pickApiByMethodAndPath(req)
  if (selectedVersion === -1) {
    customLogger.logMessage('error', 'Resource not found', null, true, req)
    return h.response({ error: 'Not Found' }).code(404)
  }

  if (apis[selectedVersion].type === 'fspiop' && Config.getUserConfig().VERSIONING_SUPPORT_ENABLE) {
    const fspiopApis = apis.filter(item => {
      return item.type === 'fspiop'
    })
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
    const versionNegotiationResult = OpenApiVersionTools.negotiateVersion(req, fspiopApis)
    if (versionNegotiationResult.negotiationFailed) {
      // Create extensionList property as per the API specification document with supported versions
      const extensionList = fspiopApis.map(item => {
        return {
          key: item.majorVersion + '',
          value: item.minorVersion + ''
        }
      })
      return h.response(errorResponseBuilder('3001', 'The Client requested an unsupported version, see extension list for supported version(s).', { extensionList })).code(406)
    }
    req.customInfo.negotiatedContentType = versionNegotiationResult.responseContentTypeHeader
    selectedVersion = versionNegotiationResult.negotiatedIndex
  }
  return apis[selectedVersion].openApiBackendObject.handleRequest(
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
}

const pickApiByMethodAndPath = (req) => {
  return apis.findIndex(item => {
    if (item.openApiBackendObject.matchOperation(req)) {
      return true
    } else {
      return false
    }
  })
}

const errorResponseBuilder = (errorCode, errorDescription, additionalProperties = null) => {
  return {
    errorInformation: {
      errorCode: errorCode,
      errorDescription: errorDescription,
      ...additionalProperties
    }
  }
}

module.exports.getOpenApiObjects = () => {
  return apis
}

const openApiBackendNotImplementedHandler = (item) => {
  return async (context, req, h) => {
    customLogger.logMessage('debug', 'Schema Validation Passed', null, true, req)
    if (req.method === 'put') {
      // MyEventEmitter.getTestOutboundEmitter().emit('incoming', req.payload)
      MyEventEmitter.getTestOutboundEmitter().emit(req.method + ' ' + req.path, req.headers, req.payload)
      let assertionPath = req.path
      const assertionData = { headers: req.headers, body: req.payload }
      if (assertionPath.endsWith('/error')) {
        assertionPath = assertionPath.replace('/error', '')
        assertionData.error = true
      }
      assertionStore.pushRequest(assertionPath, assertionData)
      MyEventEmitter.getAssertionRequestEmitter().emit(assertionPath, assertionData)
    }
    req.customInfo.specFile = item.specFile
    req.customInfo.jsfRefFile = item.jsfRefFile
    let responseBody, responseStatus
    // Check for response map file
    try {
      const respMapRawdata = await readFileAsync(item.responseMapFile)
      const responseMap = JSON.parse(respMapRawdata)
      const responseInfo = responseMap[context.operation.path][context.request.method]
      if (!responseInfo) {
        customLogger.logMessage('error', 'Response info not found for method in response map file for ' + context.operation.path + context.request.method, null, true, req)
        return
      }
      req.customInfo.responseInfo = responseInfo
    } catch (err) { }
    // Check for the synchronous response rules
    const generatedResponse = await OpenApiRulesEngine.responseRules(context, req)
    responseStatus = +generatedResponse.status
    responseBody = generatedResponse.body
    customLogger.logMessage('info', 'Generated response', generatedResponse, true, req)
    if (!responseBody) {
      // Generate mock response from openAPI spec file
      const { status, mock } = context.api.mockResponseForOperation(context.operation.operationId)
      responseBody = mock
      responseStatus = +status
    }
    // Verify that it is a success code, then generate callback and only if the method is post or get
    if ((req.method === 'post' || req.method === 'get') && responseStatus >= 200 && responseStatus <= 299) {
      // Generate callback asynchronously
      setImmediate(generateAsyncCallback, item, context, req)
    }
    if (_.isEmpty(responseBody)) {
      return h.response().code(responseStatus)
    } else {
      return h.response(responseBody).code(responseStatus)
    }
  }
}

const generateAsyncCallback = async (item, context, req) => {
  // Getting callback info from callback map file
  try {
    const cbMapRawdata = await readFileAsync(item.callbackMapFile)
    const callbackMap = JSON.parse(cbMapRawdata)
    if (!callbackMap[context.operation.path]) {
      customLogger.logMessage('error', 'Callback not found for path in callback map file for ' + context.operation.path, null, true, req)
      return
    }
    if (!callbackMap[context.operation.path][context.request.method]) {
      customLogger.logMessage('error', 'Callback not found for method in callback map file for ' + context.request.method, null, true, req)
      return
    }
    const callbackInfo = callbackMap[context.operation.path][context.request.method]
    if (!callbackInfo) {
      customLogger.logMessage('error', 'Callback info not found for method in callback map file for ' + context.operation.path + context.request.method, null, true, req)
      return
    }
    req.customInfo.callbackInfo = callbackInfo
  } catch (err) {
    customLogger.logMessage('error', 'Callback file not found.', null, true, req)
    return
  }
  // Additional validation based on the Json Rules Engine, send error callback on failure
  const generatedErrorCallback = await OpenApiRulesEngine.validateRules(context, req)
  if (generatedErrorCallback.body) {
    // TODO: Handle method and path verifications against the generated ones
    customLogger.logMessage('error', 'Sending error callback', null, true, req)
    CallbackHandler.handleCallback(generatedErrorCallback, context, req)
    return
  }
  // Handle quotes for transfer association
  if (Config.getUserConfig().TRANSFERS_VALIDATION_WITH_PREVIOUS_QUOTES) {
    require('./middleware-functions/quotesAssociation').handleQuotes(context, req)
    const matchFound = require('./middleware-functions/quotesAssociation').handleTransfers(context, req)
    if (!matchFound) {
      customLogger.logMessage('error', 'Matching Quote Not Found', null, true, req)
      const generatedErrorCallback = await OpenApiRulesEngine.generateMockErrorCallback(context, req)
      generatedErrorCallback.body = {
        errorInformation: {
          errorCode: '3208',
          errorDescription: 'Provided Transfer ID was not found on the server.'
        }
      }
      CallbackHandler.handleCallback(generatedErrorCallback, context, req)
      return
    }
  }
  // Callback Rules engine - match the rules and generate the specified callback
  const generatedCallback = await OpenApiRulesEngine.callbackRules(context, req)
  if (generatedCallback.body) {
    // TODO: Handle method and path verifications against the generated ones
    CallbackHandler.handleCallback(generatedCallback, context, req)
    // Handle triggers for a transaction request
    require('./middleware-functions/transactionRequestsService').handleRequest(context, req, generatedCallback, item.triggerTemplatesFolder)
  }
}

module.exports.openApiBackendNotImplementedHandler = openApiBackendNotImplementedHandler
module.exports.generateAsyncCallback = generateAsyncCallback
