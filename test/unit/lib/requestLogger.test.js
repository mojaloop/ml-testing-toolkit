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
 * Georgi Logodazhki <georgi.logodazhki@modusbox.com> (Original Author)
 --------------
 ******/

const notificationEmitter = require('../../../src/lib/notificationEmitter')
const Config = require('../../../src/lib/config')

jest.mock('../../../src/lib/notificationEmitter')
jest.mock('../../../src/lib/config')
jest.mock('../../../src/lib/db/adapters/dbAdapter')

const requestLogger = require('../../../src/lib/requestLogger')

describe('requestLogger', () => {
  beforeAll(() => {
    jest.resetAllMocks()
    notificationEmitter.broadcastLog.mockReturnValue()
  })
  afterAll(() => {
    jest.resetAllMocks()
  })
  describe('when logRequest is called', () => {
    it('should take session id from customInfo.sessionId if HOSTING_ENABLED is true', async () => {
      const req = {
        method: 'post',
        path: '/',
        body: {},
        customInfo: {
          uniqueId: '',
          sessionID: '',
          user: {
            dfspId: 'test'
          }
        },
        headers: {},
        query: {},
        payload: {}
      }
      Config.getSystemConfig.mockReturnValueOnce({
        HOSTING_ENABLED: true
      })
      expect(() => requestLogger.logRequest(req)).not.toThrowError()
    })
    it('should take session id from fspiop-source header if HOSTING_ENABLED is true', async () => {
      const req = {
        method: 'post',
        path: '/',
        body: {},
        customInfo: {
          uniqueId: '',
          sessionID: '',
          user: {
            dfspId: 'test'
          }
        },
        headers: {
          'fspiop-source': 'userdfsp'
        },
        query: {},
        payload: {}
      }
      Config.getSystemConfig.mockReturnValueOnce({
        HOSTING_ENABLED: true
      })
      expect(() => requestLogger.logRequest(req)).not.toThrowError()
    })
    it('should not throw an error if body is missing', async () => {
      const req = {
        method: 'post',
        path: '/',
        customInfo: {
          uniqueId: '',
          sessionID: ''
        },
        headers: {},
        query: {},
        payload: {}
      }
      Config.getSystemConfig.mockReturnValueOnce({
        HOSTING_ENABLED: false
      })
      expect(() => requestLogger.logRequest(req)).not.toThrowError()
    })
    it('should not throw an error if customInfo is missing', async () => {
      const req = {
        method: 'post',
        path: '/',
        headers: {},
        query: {},
        payload: {}
      }
      Config.getSystemConfig.mockReturnValueOnce({
        HOSTING_ENABLED: false
      })
      expect(() => requestLogger.logRequest(req)).not.toThrowError()
    })
  })
  describe('when logResponse is called', () => {
    it('should not throw an error 1', async () => {
      const req = {
        response: {
          source: {},
          statusCode: 200
        },
        method: 'post',
        path: '/',
        customInfo: {
          uniqueId: '',
          sessionID: ''
        }
      }
      Config.getSystemConfig.mockReturnValueOnce({
        HOSTING_ENABLED: false
      })
      expect(() => requestLogger.logResponse(req)).not.toThrowError()
    })
    it('should not throw an error if response is missing', async () => {
      const req = {}
      expect(() => requestLogger.logResponse(req)).not.toThrowError()
    })
    it('should not throw an error if customInfo is missing', async () => {
      const req = {
        response: {
          source: {},
          statusCode: 200
        },
        customInfo: {},
        method: 'post',
        path: '/'
      }
      Config.getSystemConfig.mockReturnValueOnce({
        HOSTING_ENABLED: false
      })
      expect(() => requestLogger.logResponse(req)).not.toThrowError()
    })
  })
  describe('when logMessage is called', () => {
    it('with verbosity debug then should not throw an error', async () => {
      const verbosity = 'debug'
      const message = ''
      const externalData = {
        additionalData: {},
        notification: false
      }
      expect(() => requestLogger.logMessage(verbosity,message,externalData)).not.toThrowError()
    })
    it('with verbosity warn then should not throw an error', async () => {
      const verbosity = 'warn'
      const message = ''
      const externalData = {
        notification: false
      }
      expect(() => requestLogger.logMessage(verbosity,message,externalData)).not.toThrowError()
    })
    it('with verbosity error then should not throw an error', async () => {
      const verbosity = 'error'
      const message = ''
      const externalData = {
        notification: false
      }
      expect(() => requestLogger.logMessage(verbosity,message,externalData)).not.toThrowError()
    })
    it('with verbosity default then should not throw an error', async () => {
      const verbosity = 'default'
      const message = ''
      const externalData = {
        notification: false
      }
      expect(() => requestLogger.logMessage(verbosity,message,externalData)).not.toThrowError()
    })
    it('when request is empty should not throw an error', async () => {
      const verbosity = 'info'
      const message = ''
      Config.getSystemConfig.mockReturnValue({
        HOSTING_ENABLED: false
      })
      expect(() => requestLogger.logMessage(verbosity,message)).not.toThrowError()
    })
    it('when request is not empty should not throw an error', async () => {
      const verbosity = 'info'
      const message = ''
      const externalData = {
        request: {
          customInfo: {
            uniqueId: '',
            sessionID: '',
            user: {
              dfspId: 'test'
            }
          },
          method: 'put',
          path: '/'
        },
        user: {
          dfspId: 'test'
        }
      }
      Config.getSystemConfig.mockReturnValueOnce({
        HOSTING_ENABLED: true
      })
      expect(() => requestLogger.logMessage(verbosity,message,externalData)).not.toThrowError()
    })
    it('when request is not empty should not throw an error', async () => {
      const verbosity = 'info'
      const message = ''
      const externalData = {
        request: {
          customInfo: {
            uniqueId: '',
            sessionID: ''
          },
          method: 'put',
          path: '/'
        }
      }
      Config.getSystemConfig.mockReturnValueOnce({
        HOSTING_ENABLED: true
      })
      expect(() => requestLogger.logMessage(verbosity,message,externalData)).not.toThrowError()
    })
  })
})
