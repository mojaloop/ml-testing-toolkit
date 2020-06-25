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

const Config = require('../../../src/lib/config')
const Utils = require('../../../src/lib/utils')
const SpyReadFileAsync = jest.spyOn(Utils, 'readFileAsync')
const SpyWriteFileAsync = jest.spyOn(Utils, 'writeFileAsync')

describe('Config', () => {
  describe('when getUserConfig is called', () => {
    it('should not throw an error ', () => {
      expect(() => Config.getUserConfig()).toBeDefined()
    })
  })
  describe('when getSystemConfig is called', () => {
    it('should not throw an error ', () => {
      expect(() => Config.getSystemConfig()).toBeDefined()
    })
  })
  describe('when getStoredUserConfig throws an error', () => {
    it('the response should not be empty object', async () => {
      const userConfig = await Config.getStoredUserConfig()
      expect(userConfig).toBeDefined()
    })
    it('the response should be empty object', async () => {
      SpyReadFileAsync.mockRejectedValueOnce({})
      const userConfig = await Config.getStoredUserConfig()
      expect(userConfig).toStrictEqual({})
    })
  })
  describe('when setStoredUserConfig throws an error', () => {
    it('the response should be false', async () => {
      SpyWriteFileAsync.mockResolvedValueOnce()
      const storedUserConfig = await Config.setStoredUserConfig({})
      expect(storedUserConfig).toBe(true)
    })
    it('the response should be false', async () => {
      SpyWriteFileAsync.mockRejectedValueOnce()
      const storedUserConfig = await Config.setStoredUserConfig()
      expect(storedUserConfig).toBe(false)
    })
  })
  describe('when loadUserConfig throws an error', () => {
    it('the response should be true', async () => {
      const loadUserConfig = await Config.loadUserConfig()
      expect(loadUserConfig).toBe(true)
    })
    it('the response should be true', async () => {
      SpyReadFileAsync.mockRejectedValueOnce()
      const loadUserConfig = await Config.loadUserConfig()
      expect(loadUserConfig).toBe(true)
    })
  })
  describe('when loadSystemConfig throws an error', () => {
    it('the response should be true', async () => {
      const loadSystemConfig = await Config.loadSystemConfig()
      expect(loadSystemConfig).toBe(true)
    })
    it('the response should be true', async () => {
      SpyReadFileAsync.mockRejectedValueOnce()
      const loadSystemConfig = await Config.loadSystemConfig()
      expect(loadSystemConfig).toBe(true)
    })
  })
})
