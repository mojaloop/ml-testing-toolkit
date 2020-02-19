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
        notImplemented: async (context, req, h) => {
          customLogger.logMessage('debug', 'Schema Validation Passed', null, true, req)
          if (req.method === 'put') {
            // MyEventEmitter.getTestOutboundEmitter().emit('incoming', req.payload)
            MyEventEmitter.getTestOutboundEmitter().emit(req.method + ' ' + req.path, req.headers, req.payload)
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
          } catch (err) {}

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
          if ( (req.method === 'post' || req.method === 'get') && responseStatus >= 200 && responseStatus <= 299) {
            // Generate callback asynchronously
            setImmediate(async () => {
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
              if (Config.USER_CONFIG.TRANSFERS_VALIDATION_WITH_PREVIOUS_QUOTES) {
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
              }
            })
          }
          if (_.isEmpty(responseBody)) {
            return h.response().code(responseStatus)
          } else {
            return h.response(responseBody).code(responseStatus)
          }
        },
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
  apis.forEach(api => {
    customLogger.logMessage('info', 'Initializing the api spec file: ' + api.specFile, null, false)
    api.openApiBackendObject.init()
  })
}

module.exports.handleRequest = (req, h) => {
  let selectedVersion = 0
  // Pick a right api definition by searching for the requested resource in the definitions sequentially
  // TODO: This should be optimized by defining a hash table (object) of all the resources in all definition files on startup.
  selectedVersion = pickApiByMethodAndPath(req)
  if (selectedVersion === -1) {
    customLogger.logMessage('error', 'Resource not found', null, true, req)
    return h.response({ error: 'Not Found' }).code(404)
  }

  console.log(selectedVersion)
  if (apis[selectedVersion].type === 'fspiop' && Config.USER_CONFIG.VERSIONING_SUPPORT_ENABLE) {
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
    return item.openApiBackendObject.matchOperation(req) ? true : false
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
