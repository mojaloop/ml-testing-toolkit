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
const requestLogger = require('../../../src/lib/requestLogger')
const storageAdapter = require('../../../src/lib/storageAdapter')

jest.mock('../../../src/lib/requestLogger')
jest.mock('../../../src/lib/storageAdapter')

describe('Config', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    requestLogger.logMessage.mockReturnValue()
  })
  afterEach(() => {
    jest.resetAllMocks()
  })
  describe('when getUserConfig is called', () => {
    it('should load userConfig only once', async () => {
      storageAdapter.read.mockResolvedValueOnce({
        data: {}
      })
      const userConfig1 = await Config.getUserConfig('testConfig')
      const userConfig2 = await Config.getUserConfig('testConfig')
      expect(userConfig1).toStrictEqual(userConfig2)
    })
    it('should not throw an error ', async () => {
      storageAdapter.read.mockResolvedValueOnce({
        data: {}
      })
      const userConfig = await Config.getUserConfig()
      expect(userConfig).toBeDefined()
    })
  })
  describe('when getSystemConfig is called', () => {
    it('should not throw an error ', () => {
      expect(Config.getSystemConfig()).toBeDefined()
    })
  })
  describe('when getStoredUserConfig throws an error', () => {
    it('the response should not be empty object', async () => {
      storageAdapter.read.mockResolvedValueOnce({
        data: {}
      })
      const userConfig = await Config.getStoredUserConfig()
      expect(userConfig).toBeDefined()
    })
    it('the response should be empty object', async () => {
      storageAdapter.read.mockRejectedValueOnce()
      const userConfig = await Config.getStoredUserConfig()
      expect(userConfig).toStrictEqual({})
    })
  })
  describe('when setStoredUserConfig throws an error', () => {
    it('the response should be false', async () => {
      storageAdapter.upsert.mockResolvedValueOnce()
      const storedUserConfig = await Config.setStoredUserConfig({})
      expect(storedUserConfig).toBeTruthy()
    })
    it('the response should be false', async () => {
      storageAdapter.upsert.mockRejectedValueOnce()
      const storedUserConfig = await Config.setStoredUserConfig()
      expect(storedUserConfig).toBeFalsy()
    })
  })
  describe('when loadUserConfig throws an error', () => {
    it('the response should be true if user is not provided and there is no error', async () => {
      storageAdapter.read.mockResolvedValueOnce({
        data: {}
      })
      const loadUserConfig = await Config.loadUserConfig()
      expect(loadUserConfig).toBeTruthy()
    })
    it('the response should be true', async () => {
      const loadUserConfig = await Config.loadUserConfig({dfspId: 'test'})
      expect(loadUserConfig).toBeTruthy()
    })
    it('the response should be true', async () => {
      storageAdapter.read.mockRejectedValueOnce()
      const loadUserConfig = await Config.loadUserConfig()
      expect(loadUserConfig).toBeTruthy()
    })
    it('the response should be true if user is provided and there an error', async () => {
      storageAdapter.read.mockRejectedValueOnce(new Error('expected error'))
      const loadUserConfig = await Config.loadUserConfig()
      expect(loadUserConfig).toBeTruthy()
    })
  })
  describe('when loadSystemConfig', () => {
    it('should not throw an error', async () => {
      storageAdapter.read.mockResolvedValueOnce({
        data: {}
      })
      const loadUserConfig = await Config.loadSystemConfig()
      expect(loadUserConfig).toBeTruthy()
    })
    it('should return true if there is an error reading the file', async () => {
      storageAdapter.read.mockRejectedValueOnce()
      const loadUserConfig = await Config.loadSystemConfig()
      expect(loadUserConfig).toBeTruthy()
    })
  })
  describe('setSystemConfig', () => {
    it('should not throw error', async () => {
      storageAdapter.upsert.mockResolvedValueOnce()
      const res = await Config.setSystemConfig({})
      expect(res).toBe(true)
    })
    it('the response should be false', async () => {
      storageAdapter.upsert.mockRejectedValueOnce()
      const res = await Config.setSystemConfig()
      expect(res).toBe(false)
    })
  })
})
