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

const APIManagement = require('../../../src/lib/api-management')
const Utils = require('../../../src/lib/utils')
const Config = require('../../../src/lib/config')
const OpenApiBackend = require('openapi-backend').default
const fs = require('fs')

jest.mock('../../../src/lib/utils')
jest.mock('../../../src/lib/config')
jest.mock('openapi-backend')

const specFilePrefix = 'test/'
const apiSpecSyncFile = fs.readFileSync(specFilePrefix + 'api_spec_sync.yaml')

fs.readFile = jest.fn((path, callback) => { return callback(null, apiSpecSyncFile); });

const SpyGetSystemConfig = jest.spyOn(Config, 'getSystemConfig')
const SpyGetUserConfig = jest.spyOn(Config, 'getUserConfig')


describe('API Management', () => {
  describe('validateDefinition', () => {
    it('should not throw an error', async () => {
      await expect(APIManagement.validateDefinition(specFilePrefix + 'api_spec_sync.yaml')).resolves.not.toThrowError()
      expect(OpenApiBackend).toHaveBeenCalledTimes(1);
    })
  })
  describe('addDefinition', () => {
    SpyGetSystemConfig.mockReturnValue({
      API_DEFINITIONS: []
    })
    SpyGetUserConfig.mockReturnValue({
      ILP_SECRET: 'sample'
    })
    it('should not throw an error', async () => {
      await expect(APIManagement.addDefinition(specFilePrefix + 'api_spec_sync.yaml', 'name', '1.0', 'false')).resolves.toBeUndefined()
    })
  })
  describe('deleteDefinition', () => {
    it('Happy path', async () => {
      SpyGetSystemConfig.mockReturnValue({
        API_DEFINITIONS: [
          {
            type: 'name',
            version: '1.0',
            folderPath: "name_1.0",
            additionalApi: true
          }
        ]
      })
      SpyGetUserConfig.mockReturnValue({
        ILP_SECRET: 'sample'
      })
      await expect(APIManagement.deleteDefinition('name', '1.0')).resolves.toBe(true)
    })
    it('should throw an error when API is inbuilt API', async () => {

      SpyGetSystemConfig.mockReturnValue({
        API_DEFINITIONS: [
          {
            type: 'name',
            version: '1.0',
            folderPath: "name_1.0",
            additionalApi: false
          }
        ]
      })
      SpyGetUserConfig.mockReturnValue({
        ILP_SECRET: 'sample'
      })
      await expect(APIManagement.deleteDefinition('name', '1.0')).rejects.toThrowError()
    })
    it('should throw an error when API not found', async () => {
      SpyGetSystemConfig.mockReturnValue({
        API_DEFINITIONS: []
      })
      SpyGetUserConfig.mockReturnValue({
        ILP_SECRET: 'sample'
      })
      await expect(APIManagement.deleteDefinition('name', '1.0')).rejects.toThrowError()
    })
  })
  describe('patchDefinitionParams', () => {
    it('should not throw an error when patching hostnames', async () => {
      SpyGetSystemConfig.mockReturnValue({
        API_DEFINITIONS: [
          {
            type: 'name',
            version: '1.0',
            folderPath: "name_1.0",
            additionalApi: true
          }
        ]
      })
      await expect(APIManagement.patchDefinitionParams('name', '1.0', { hostnames: ['hostname1', 'hostname2'] })).resolves.toBe(true)
    })
    it('should not throw an error when patching prefix', async () => {
      SpyGetSystemConfig.mockReturnValue({
        API_DEFINITIONS: [
          {
            type: 'name',
            version: '1.0',
            folderPath: "name_1.0",
            additionalApi: true
          }
        ]
      })
      await expect(APIManagement.patchDefinitionParams('name', '1.0', { prefix: '/new-prefix' })).resolves.toBe(true)
    })
    it('should throw an error when API not found', async () => {
      SpyGetSystemConfig.mockReturnValue({
        API_DEFINITIONS: []
      })
      await expect(APIManagement.patchDefinitionParams('name', '1.0', { hostnames: ['hostname1', 'hostname2'] })).rejects.toThrowError()
    })
  })
})
