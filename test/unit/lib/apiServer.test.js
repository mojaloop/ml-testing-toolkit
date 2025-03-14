/*****
 License
 --------------
 Copyright © 2020-2025 Mojaloop Foundation
 The Mojaloop files are made available by the Mojaloop Foundation under the Apache License, Version 2.0 (the "License") and you may not use these files except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, the Mojaloop files are distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

 Contributors
 --------------
 This is the official list of the Mojaloop project contributors for this file.
 Names of the original copyright holders (individuals or organizations)
 should be listed with a '*' in the first column. People who have
 contributed from an organization can be listed under the organization
 that actually holds the copyright for their contributions (see the
 Mojaloop Foundation for an example). Those individuals should have
 their names indented and be marked with a '-'. Email address can be added
 optionally within square brackets <email>.

 * Mojaloop Foundation
 - Name Surname <name.surname@mojaloop.io>

 * ModusBox
 * Georgi Logodazhki <georgi.logodazhki@modusbox.com> (Original Author)
 --------------
 ******/

const Config = require('../../../src/lib/config')
const requestLogger = require('../../../src/lib/requestLogger')

jest.mock('../../../src/lib/requestLogger')
jest.mock('../../../src/lib/config')
jest.mock('../../../src/lib/oauth/OAuthHelper')


const apiServer = require('../../../src/lib/api-server')

Config.getSystemConfig.mockReturnValue({
  OAUTH: {
    AUTH_ENABLED: false
  }
})

describe('api-server', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    requestLogger.logMessage.mockReturnValue()
    Config.getSystemConfig.mockReturnValue({
      OAUTH: {
        AUTH_ENABLED: false
      }
    })
  })
  afterEach(() => {
    jest.resetAllMocks()
  })
  describe('when getApp is called', () => {
    it('the server should be initialized if not already', async () => {
      expect(() => apiServer.getApp()).not.toThrowError()
      expect(() => apiServer.getApp()).not.toThrowError()
    })
  })
  describe('when verifyUser is called', () => {
    it('should authenticate the user if auth is enabled', async () => {
      Config.getSystemConfig.mockReturnValue({
        OAUTH: {
          AUTH_ENABLED: true
        }
      })
      expect(() => apiServer.verifyUser()).not.toThrowError()
    })
    it('should return a function which can be executed with 401 status code', async () => {
      Config.getSystemConfig.mockReturnValue({
        OAUTH: {
          AUTH_ENABLED: true
        }
      })
      const req = {}
      const res = {
        statusCode: 401
      }
      const retFn = apiServer.verifyUser()
      expect(() => retFn(req, res, () => {})).not.toThrowError()
    })
    it('should return a function which can be executed with 200 status code', async () => {
      Config.getSystemConfig.mockReturnValue({
        OAUTH: {
          AUTH_ENABLED: true
        }
      })
      const req = {}
      const res = {
        statusCode: 200
      }
      const retFn = apiServer.verifyUser()
      expect(() => retFn(req, res, () => {})).not.toThrowError()
    })
  })
  describe('when startServer is called', () => {
    it('the server should be initialized', async () => {
      // apiServer.startServer()
      await expect((async () => {
        await wait();
        apiServer.startServer()
        await wait();
        apiServer.stopServer()
        return 'OK'
      })()).resolves.toBeTruthy()
    })
  })
  describe('when getHttp is called', () => {
    it('should return a http server', async () => {
      const http = apiServer.getHttp()
      expect(http).toBeTruthy()
    })
  })
  const wait = async (ms = 0) => new Promise(resolve => setTimeout(resolve, ms))
})
