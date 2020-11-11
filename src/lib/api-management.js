const OpenApiBackend = require('openapi-backend').default
const Utils = require('./utils')
const path = require('path')
const Config = require('./config')
const OpenApiDefinitionsModel = require('./mocking/openApiDefinitionsModel')
const OpenApiMockHandler = require('./mocking/openApiMockHandler')

const apiDefinitionsPath = 'spec_files/api_definitions/'

const validateDefinition = async (apiFilePath) => {
  const newApi = new OpenApiBackend({
    definition: path.join(apiFilePath),
    strict: true,
    quick: true
  })
  await newApi.loadDocument()
  newApi.validateDefinition()
  return newApi.document
}

const addDefinition = async (apiFilePath, name, version, asynchronous) => {
  // Validate the definition first
  await validateDefinition(apiFilePath)
  // Create a folder with api name and copy the uploaded file there
  await Utils.makeDirectoryAsync(apiDefinitionsPath + name)
  await Utils.renameFileAsync(apiFilePath, apiDefinitionsPath + name + '/api_spec.yaml')
  // Add the entry to system config
  const apiDefinitions = Config.getSystemConfig().API_DEFINITIONS
  apiDefinitions.push({
    type: name,
    version,
    folderPath: name,
    asynchronous: asynchronous === 'true' || asynchronous === 'TRUE',
    additionalApi: true
  })
  await Config.setSystemConfig({ API_DEFINITIONS: apiDefinitions })

  // Reload the opneapi definitions model
  await OpenApiDefinitionsModel.refreshApiDefinitions()

  // Reload the openapimock handlers
  OpenApiMockHandler.initilizeMockHandler()
}

const deleteDefinition = async (name, version) => {
  // Make sure the requested API is not an inbuilt API
  const apiDefinitions = Config.getSystemConfig().API_DEFINITIONS
  const matchedApiIndex = apiDefinitions.findIndex(item => {
    return item.type === name && item.version === version
  })

  if (matchedApiIndex === -1) {
    throw new Error('Requested API is not found')
  }
  const matchedApi = apiDefinitions[matchedApiIndex]
  if (!matchedApi.additionalApi) {
    throw new Error('Requested API is an inbuilt API and can not be deleted')
  }

  // Remove entry in system config file
  apiDefinitions.splice(matchedApiIndex, 1)
  await Config.setSystemConfig({ API_DEFINITIONS: apiDefinitions })

  // Remove the folder from spec_files
  await Utils.rmdirAsync(apiDefinitionsPath + name, { recursive: true })

  // Refresh openapi Definitions
  await OpenApiDefinitionsModel.refreshApiDefinitions()

  // Reload the openapimock handlers
  OpenApiMockHandler.initilizeMockHandler()

  return true
}

module.exports = {
  validateDefinition,
  addDefinition,
  deleteDefinition
}
