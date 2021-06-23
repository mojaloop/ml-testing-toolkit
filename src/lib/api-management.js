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
  await Utils.makeDirectoryAsync(apiDefinitionsPath + name + '_' + version)
  await Utils.renameFileAsync(apiFilePath, apiDefinitionsPath + name + '_' + version + '/api_spec.yaml')
  // Add the entry to system config
  const apiDefinitions = Config.getSystemConfig().API_DEFINITIONS
  apiDefinitions.push({
    type: name,
    version,
    folderPath: name + '_' + version,
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
