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

const Config = require('../../../../src/lib/config')

const SpyGetSystemConfig = jest.spyOn(Config, 'getSystemConfig')
const SpyloadSystemConfig = jest.spyOn(Config, 'loadSystemConfig')

const OpenApiDefinitionsModel = require('../../../../src/lib/mocking/openApiDefinitionsModel')

describe('OpenApiDefinitionsModel', () => {
  describe('getApiDefinitions', () => {
    it('Result must contain the required properties', async () => {
      SpyGetSystemConfig.mockReturnValueOnce({
        API_DEFINITIONS: null
      })
      SpyloadSystemConfig.mockResolvedValue()
      SpyGetSystemConfig.mockReturnValueOnce({
        API_DEFINITIONS: [{
          version: '1.0',
          type: 'response',
          asynchronous: false,
          folderPath: 'central_admin_9.3'
        }]
      })
      const result = await OpenApiDefinitionsModel.getApiDefinitions()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      expect(result[0]).toHaveProperty('majorVersion')
      expect(result[0]).toHaveProperty('minorVersion')
      expect((typeof result[0]['majorVersion']) === 'number').toBe(true)
      expect((typeof result[0]['minorVersion']) === 'number').toBe(true)
      expect(result[0]).toHaveProperty('type')
      expect(result[0]).toHaveProperty('asynchronous')
      expect(result[0]).toHaveProperty('specFile')
      expect(result[0]).toHaveProperty('callbackMapFile')
      expect(result[0]).toHaveProperty('responseMapFile')
      expect(result[0]).toHaveProperty('jsfRefFile')
    })
  })
})
