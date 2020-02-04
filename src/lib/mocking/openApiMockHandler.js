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
          // Generate mock response from openAPI spec file
          const { status, mock } = context.api.mockResponseForOperation(context.operation.operationId)

          // Verify that it is a success code, then generate callback and only if the method is post or get
          if ( (req.method === 'post' || req.method === 'get') && status >= 200 && status <= 299) {
            // Generate callback asynchronously
            setImmediate(async () => {
              // Getting callback info from callback map file
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

              // Additional validation based on the Json Rules Engine, send error callback on failure
              const generatedErrorCallback = await OpenApiRulesEngine.validateRules(context, req)
              if (generatedErrorCallback.body) {
                // TODO: Handle method and path verifications against the generated ones
                customLogger.logMessage('error', 'Sending error callback', null, true, req)
                CallbackHandler.handleCallback(generatedErrorCallback, context, req)
                return
              }

              // Handle quotes for transfer association
              require('./middleware-functions/quotesAssociation').handleQuotes(context, req)
              const matchFound = require('./middleware-functions/quotesAssociation').handleTransfers(context, req)
              if (!matchFound) {
                customLogger.logMessage('error', 'Matching Quote Not Found', null, true, req)
                const generatedErrorCallback = await OpenApiRulesEngine.generateMockErrorCallback(context, req)
                generatedErrorCallback.body = {
                  errorInformation: {
                    errorCode: '9999',
                    errorDescription: 'Matching Quote Not Found'
                  }
                }
                CallbackHandler.handleCallback(generatedErrorCallback, context, req)
                return
              }

              // Callback Rules engine - match the rules and generate the specified callback
              const generatedCallback = await OpenApiRulesEngine.callbackRules(context, req)
              if (generatedCallback.body) {
                // TODO: Handle method and path verifications against the generated ones
                CallbackHandler.handleCallback(generatedCallback, context, req)
              }
            })
          }
          if (_.isEmpty(mock)) {
            return h.response().code(status)
          } else {
            return h.response(mock).code(status)
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
        notFound: async (context, req, h) => h.response({ context, err: 'not found' }).code(404)
      }
    })

    return {
      ...item,
      openApiBackendObject: tempObj
    }
  })

  // Loop through the apis and initialize them
  apis.forEach(api => {
    api.openApiBackendObject.init()
  })
}

module.exports.handleRequest = (req, h) => {
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
  const versionNegotiationResult = OpenApiVersionTools.negotiateVersion(req, apis)
  if (versionNegotiationResult.negotiationFailed) {
    // Create extensionList property as per the API specification document with supported versions
    const extensionList = apis.map(item => {
      return {
        key: item.majorVersion + '',
        value: item.minorVersion + ''
      }
    })
    return h.response(errorResponseBuilder('3001', 'The Client requested an unsupported version, see extension list for supported version(s).', { extensionList })).code(406)
  }
  req.customInfo.negotiatedContentType = versionNegotiationResult.responseContentTypeHeader

  return apis[versionNegotiationResult.negotiatedIndex].openApiBackendObject.handleRequest(
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
