'use strict'

const OpenApiBackend = require('openapi-backend').default
const OpenApiDefinitionsModel = require('./openApiDefinitionsModel')
const OpenApiVersionTools = require('./openApiVersionTools')
const customLogger = require('../requestLogger')
const fs = require('fs')
const { promisify } = require('util')
const RulesEngine = require('./openApiRulesEngine')

const readFileAsync = promisify(fs.readFile)

var path = require('path')

var apis = []

const jsfRefFilePathPrefix = 'spec_files/jsf_ref_files/'
const rulesRespFilePathPrefix = 'spec_files/rules_response/'

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
      strict: false,
      handlers: {
        notImplemented: async (context, req, h) => {
          customLogger.logMessage('debug', 'Schema Validation Passed')

          // After schema validation passed we are running additional validation based on the Json Rules Engine
          const rulesRespRawdata = await readFileAsync(rulesRespFilePathPrefix + 'rules1.json')
          const rulesResp = JSON.parse(rulesRespRawdata)
          const rulesEngine = new RulesEngine()
          rulesEngine.loadRules(rulesResp)

          const facts = {
            path: context.operation.path,
            body: context.request.body,
            method: context.request.method
          }

          const res = await rulesEngine.evaluate(facts)
          if (res) {
            customLogger.logMessage('debug', 'Validation rules matched', res)
            const curEvent = res[0]
            if (curEvent.type === 'errorResponse') {
              let status
              let mock
              // If the body is not supplied in the event then we will generate a mock body from the openAPI
              if (curEvent.params.body) {
                status = curEvent.params.statusCode
                mock = curEvent.params.body
              } else {
                const mockResp = context.api.mockResponseForOperation(context.operation.operationId, { code: curEvent.params.statusCode })
                status = mockResp.status
                mock = mockResp.mock
              }
              return h.response(mock).code(status)
            }
          }

          // Generate mock response from openAPI spec file
          const { status, mock } = context.api.mockResponseForOperation(context.operation.operationId)

          // Verify that it is a success code, then generate callback
          if (status >= 200 && status <= 299) {
            // Testing: generate mock callback and log it for now
            setImmediate(async () => {
              // Check for the http method and define appropriate callback method and path
              const cbMapRawdata = await readFileAsync(item.callbackMapFile)
              const callbackMap = JSON.parse(cbMapRawdata)
              if (!callbackMap[context.operation.path]) {
                customLogger.logMessage('error', 'Callback not found for path in callback map file for ' + context.operation.path)
              }
              if (!callbackMap[context.operation.path][context.request.method]) {
                customLogger.logMessage('error', 'Callback not found for method in callback map file for ' + context.request.method)
              }
              const callbackMethod = callbackMap[context.operation.path][context.request.method].method
              const callbackPath = callbackMap[context.operation.path][context.request.method].path

              if (callbackMethod) {
                const callbackGenerator = new (require('./openApiRequestGenerator'))(path.join(item.specFile))
                const rawdata = await readFileAsync(jsfRefFilePathPrefix + 'test1.json')
                const jsfRefs1 = JSON.parse(rawdata)
                const generatedCallback = await callbackGenerator.generateRequestBody(callbackPath, callbackMethod, jsfRefs1)
                customLogger.logMessage('debug', 'Generated callback body', generatedCallback)
                // customLogger.logMessage('debug', context.operation.path)
                // customLogger.logMessage('debug', context.request.method)
              }
            })
          }

          return h.response(mock).code(status)
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
  // Validate the accept header here
  const acceptHeaderValidationResult = OpenApiVersionTools.validateAcceptHeader(req.headers.accept)
  if (acceptHeaderValidationResult.validationFailed) {
    return h.response(errorResponseBuilder('3001', acceptHeaderValidationResult.message)).code(400)
  }

  // Pick the right API object based on the major and minor versions (Version negotiation as per the API Definition file)
  const versionNegotiationResult = OpenApiVersionTools.negotiateVersion(req.headers.accept, apis)
  if (versionNegotiationResult.negotiationFailed) {
    // Create extensionList property as per the API specification document with supported versions
    const extensionList = apis.map(item => {
      return {
        key: item.majorVersion + '',
        value: item.minorVersion + ''
      }
    })
    return h.response(errorResponseBuilder('3001', 'The Client requested an unsupported version, see exten- sion list for supported version(s).', { extensionList })).code(406)
  }
  req.plugins.negotiatedContentType = versionNegotiationResult.responseContentTypeHeader

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
