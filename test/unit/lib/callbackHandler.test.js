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

const Config = require('../../../src/lib/config')
const callbackHandler = require('../../../src/lib/callbackHandler')
const JwsSigning = require('../../../src/lib/jws/JwsSigning')
const AssertionStore = require('../../../src/lib/assertionStore')
const RequestLogger = require('../../../src/lib/requestLogger')
const MyEventEmitter = require('../../../src/lib/MyEventEmitter')
const axios = require('axios').default
const https = require('https')
const ConnectionProvider = require('../../../src/lib/configuration-providers/mb-connection-manager')
const OpenApiMockHandler = require('../../../src/lib/mocking/openApiMockHandler')

const SpyGetUserConfig = jest.spyOn(Config, 'getUserConfig')
const SpySign = jest.spyOn(JwsSigning, 'sign')
const SpyPushCallback = jest.spyOn(AssertionStore, 'pushCallback')
const SpyRequestLogger = jest.spyOn(RequestLogger, 'logMessage')
const SpyMyEventEmitter = jest.spyOn(MyEventEmitter, 'getAssertionCallbackEmitter')
const SpyAgent = jest.spyOn(https, 'Agent')
const SpyConnectionProvider = jest.spyOn(ConnectionProvider, 'getTlsConfig')

jest.mock('axios')

describe('callbackHandler', () => {
  describe('handleCallback should not throw an error', () => {
    it('when CALLBACK_RESOURCE_ENDPOINTS, OUTBOUND_MUTUAL_TLS_ENABLED and SEND_CALLBACK_ENABLE is enabled', async () => {
      const callbackObject = {
        delay: 100,
        method: 'post',
        path: '/transfers/{ID}/error',
        headers: {},
        body: {}
      }
      const context = {
        api: {
          validateRequest: async () => {
            return {valid: true}
          }
        }
      }
      const req = {
        headers: {
          traceparent: 'traceparent'
        }
      }
      SpyGetUserConfig.mockReturnValueOnce({
        CALLBACK_ENDPOINT: 'http://localhost:5000',
        CALLBACK_RESOURCE_ENDPOINTS: {
          enabled: true,
          endpoints: [
            {
              method: 'put',
              path: '/',
              endpoint: 'http://localhost:3000'
            },
            {
              method: 'post',
              path: '/transfers/{ID}/error',
              endpoint: 'http://localhost:3001'
            }
          ]
        },
        OUTBOUND_MUTUAL_TLS_ENABLED: true,
        SEND_CALLBACK_ENABLE: true
      })
      SpySign.mockReturnValueOnce()
      SpyPushCallback.mockReturnValueOnce()
      SpyMyEventEmitter.mockReturnValueOnce({
        emit: () => {}
      })
      SpyRequestLogger.mockReturnValue()
      SpyConnectionProvider.mockReturnValueOnce({
        hubClientCert: 'cert',
        hubClientKey: 'key',
        dfspServerCaRootCert: 'ca'
      })
      SpyAgent.mockImplementationOnce(() => {
        return {httpsAgent: {}}
      })
      axios.mockResolvedValueOnce({
        status: '200',
        statusText: 'OK'
      })
      await expect(callbackHandler.handleCallback(callbackObject, context, req)).resolves.toBe(undefined)
    })
    it('when CALLBACK_RESOURCE_ENDPOINTS and SEND_CALLBACK_ENABLE is enabled and OUTBOUND_MUTUAL_TLS_ENABLED disabled', async () => {
      const callbackObject = {
        method: 'post',
        path: '/transfers/{ID}',
        headers: {},
        body: {}
      }
      const context = {
        api: {
          validateRequest: async () => {
            return {valid: false}
          }
        }
      }
      const req = {
        headers: {}
      }
      SpyGetUserConfig.mockReturnValueOnce({
        CALLBACK_ENDPOINT: 'http://localhost:5000',
        CALLBACK_RESOURCE_ENDPOINTS: {
          enabled: true,
          endpoints: [
            {
              method: 'post',
              path: '/transfers/{ID}'
            }
          ]
        },
        OUTBOUND_MUTUAL_TLS_ENABLED: false,
        SEND_CALLBACK_ENABLE: true
      })
      SpySign.mockImplementationOnce(() => {
        throw new Error('log error if jws signign fails')
      })
      SpyPushCallback.mockReturnValueOnce()
      SpyMyEventEmitter.mockReturnValueOnce({
        emit: () => {}
      })
      SpyRequestLogger.mockReturnValue()
      axios.mockRejectedValueOnce({err: {}})
      await expect(callbackHandler.handleCallback(callbackObject, context, req)).resolves.toBe(undefined)
    })
    it('when CALLBACK_RESOURCE_ENDPOINTS, SEND_CALLBACK_ENABLE and OUTBOUND_MUTUAL_TLS_ENABLED disabled', async () => {
      const callbackObject = {
        method: 'post',
        path: '/transfers/{ID}',
        headers: {},
        body: {}
      }
      const context = {
        api: {
          validateRequest:  async () => {
            return {valid: true}
          }
        }
      }
      const req = {
        headers: {}
      }
      SpyGetUserConfig.mockReturnValueOnce({
        CALLBACK_ENDPOINT: 'http://localhost:5000',
        OUTBOUND_MUTUAL_TLS_ENABLED: false,
        SEND_CALLBACK_ENABLE: false
      })
      SpySign.mockReturnValueOnce()
      SpyPushCallback.mockReturnValueOnce()
      SpyMyEventEmitter.mockReturnValueOnce({
        emit: () => {}
      })
      SpyRequestLogger.mockReturnValue()
      await expect(callbackHandler.handleCallback(callbackObject, context, req)).resolves.toBe(undefined)
    })
  })
})
