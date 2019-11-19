'use strict'

const OpenApiBackend = require('openapi-backend').default
const OpenApiDefinitionsModel = require('./openApiDefinitionsModel')
const OpenApiVersionTools = require('./openApiVersionTools')

var path = require('path')

var apis = []

const specFilePathPrefix = 'spec_files/'

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
      definition: path.join(specFilePathPrefix + item.specFile),
      strict: false,
      handlers: {
        notImplemented: async (context, req, h) => {
          const { status, mock } = context.api.mockResponseForOperation(context.operation.operationId)
          return h.response(mock).code(status)
        },
        validationFail: async (context, req, h) => h.response({ err: context.validation.errors }).code(400),
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
    return h.response(errorResponseBuilder(3001, acceptHeaderValidationResult.message)).code(400)
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
    req.plugins.kumar = 'nitya'
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
