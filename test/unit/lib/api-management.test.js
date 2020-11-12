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
jest.mock('../../../src/lib/utils')
jest.mock('../../../src/lib/config')

const SpyGetSystemConfig = jest.spyOn(Config, 'getSystemConfig')

const specFilePrefix = 'test/'

describe('API Management', () => { 
  describe('validateDefinition', () => {
    it('should not throw an error', async () => {
      await expect(APIManagement.validateDefinition(specFilePrefix + 'api_spec_sync.yaml')).resolves.not.toBeUndefined()
    })
    it('should return proper parsed swagger definition', async () => {
      const document = await APIManagement.validateDefinition(specFilePrefix + 'api_spec_sync.yaml')
      expect(document).toHaveProperty('openapi')
    })
  })
  describe('addDefinition', () => {
    SpyGetSystemConfig.mockReturnValue({
      API_DEFINITIONS: []
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
            additionalApi: true
          }
        ]
      })
      await expect(APIManagement.deleteDefinition('name', '1.0')).resolves.toBe(true)
    })
    it('should throw an error when API is inbuilt API', async () => {
      SpyGetSystemConfig.mockReturnValue({
        API_DEFINITIONS: [
          {
            type: 'name',
            version: '1.0',
            additionalApi: false
          }
        ]
      })
      await expect(APIManagement.deleteDefinition('name', '1.0')).rejects.toThrowError()
    })
    it('should throw an error when API not found', async () => {
      SpyGetSystemConfig.mockReturnValue({
        API_DEFINITIONS: []
      })
      await expect(APIManagement.deleteDefinition('name', '1.0')).rejects.toThrowError()
    })
  })
})
