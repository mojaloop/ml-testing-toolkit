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
const ObjectStore = require('../../../src/lib/objectStore')
const ArrayStore = require('../../../src/lib/arrayStore')
const RequestLogger = require('../../../src/lib/requestLogger')
const MyEventEmitter = require('../../../src/lib/MyEventEmitter')
const axios = require('axios').default
const https = require('https')
const ConnectionProvider = require('../../../src/lib/configuration-providers/mb-connection-manager')

const SpySign = jest.spyOn(JwsSigning, 'sign')
const SpyPush = jest.spyOn(ObjectStore, 'push')
const SpyArrayPush = jest.spyOn(ArrayStore, 'push')
const SpyRequestLogger = jest.spyOn(RequestLogger, 'logMessage')
const SpyMyEventEmitter = jest.spyOn(MyEventEmitter, 'getEmitter')
const SpyAgent = jest.spyOn(https, 'Agent')
const SpyGetTlsConfig = jest.spyOn(ConnectionProvider, 'getTlsConfig')
const SpyEndpointsConfig = jest.spyOn(ConnectionProvider, 'getEndpointsConfig')
jest.mock('axios')
jest.mock('../../../src/lib/config')

describe('callbackHandler', () => {
  beforeEach(() => {
    SpyArrayPush.mockReturnValue()
    jest.resetAllMocks()
  })
  afterAll(() => {
    jest.resetAllMocks()
  })
  describe('handleCallback should not throw an error', () => {
    it('when CALLBACK_RESOURCE_ENDPOINTS, OUTBOUND_MUTUAL_TLS_ENABLED and SEND_CALLBACK_ENABLE is enabled', async () => {
      const callbackObject = {
        delay: 100,
        method: 'post',
        callbackInfo: {
          fspid: 'userdfsp'
        },
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
        },
        customInfo: {}
      }
      Config.getUserConfig.mockReturnValue({
        CALLBACK_ENDPOINT: 'http://localhost:4040',
        SEND_CALLBACK_ENABLE: true
      })
      Config.getSystemConfig.mockImplementation(() => {
        return {
          HOSTING_ENABLED: true,
          OUTBOUND_MUTUAL_TLS_ENABLED: true
        }
      })
      SpySign.mockReturnValue()
      SpyPush.mockReturnValue()
      SpyMyEventEmitter.mockReturnValue({
        emit: () => {}
      })
      SpyRequestLogger.mockReturnValue()
      SpyGetTlsConfig.mockReturnValue({
        hubClientCert: 'cert',
        hubClientKey: 'key',
        dfspServerCaRootCert: 'ca',
        dfsps: {
          userdfsp: {}
        }
      })
      SpyEndpointsConfig.mockReturnValue({
        dfspEndpoints: {
          userdfsp: 'userdfspcallbackendpint'
        }
      })
      SpyAgent.mockImplementationOnce(() => {
        return {httpsAgent: {}}
      })
      axios.mockResolvedValue({
        status: '200',
        statusText: 'OK'
      })
      await expect(callbackHandler.handleCallback(callbackObject, context, req)).resolves.toBe(undefined)
    })
    it('when CALLBACK_RESOURCE_ENDPOINTS, CLIENT_MUTUAL_TLS_ENABLED and SEND_CALLBACK_ENABLE is enabled', async () => {
      const callbackObject = {
        delay: 100,
        method: 'post',
        callbackInfo: {
          fspid: 'userdfsp'
        },
        path: '/transfers/{ID}/error',
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
        },
        customInfo: {}
      }
      Config.getUserConfig.mockReturnValue({
        CALLBACK_ENDPOINT: 'http://localhost:4040',
        CLIENT_MUTUAL_TLS_ENABLED: true,
        SEND_CALLBACK_ENABLE: true,
        CLIENT_TLS_CREDS: [
          {
            HOST: 'localhost:4040',
            CERT: 'certificate',
            KEY: 'key'
          }
        ]
      })
      Config.getSystemConfig.mockImplementation(() => {
        return {
          HOSTING_ENABLED: true
        }
      })
      SpySign.mockReturnValue()
      SpyPush.mockReturnValue()
      SpyMyEventEmitter.mockReturnValue({
        emit: () => {}
      })
      SpyRequestLogger.mockReturnValue()
      SpyGetTlsConfig.mockReturnValue({
        hubClientCert: 'cert',
        hubClientKey: 'key',
        dfspServerCaRootCert: 'ca',
        dfsps: {
          userdfsp: {}
        }
      })
      SpyEndpointsConfig.mockReturnValue({
        dfspEndpoints: {
          userdfsp: 'userdfspcallbackendpint'
        }
      })
      SpyAgent.mockImplementationOnce(() => {
        return {httpsAgent: {}}
      })
      axios.mockResolvedValue({
        status: '200',
        statusText: 'OK'
      })
      await expect(callbackHandler.handleCallback(callbackObject, context, req)).resolves.toBe(undefined)
    })
    it('when CALLBACK_RESOURCE_ENDPOINTS, OUTBOUND_MUTUAL_TLS_ENABLED and SEND_CALLBACK_ENABLE is enabled', async () => {
      const callbackObject = {
        delay: 100,
        method: 'post',
        callbackInfo: {
          fspid: 'userdfsp'
        },
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
        },
        customInfo: {}
      }
      Config.getUserConfig.mockReturnValue({
        CALLBACK_ENDPOINT: 'http://localhost:4040',
        SEND_CALLBACK_ENABLE: true
      })
      Config.getSystemConfig.mockImplementation(() => {
        return {
          HOSTING_ENABLED: true,
          OUTBOUND_MUTUAL_TLS_ENABLED: true
        }
      })
      SpySign.mockReturnValue()
      SpyPush.mockReturnValue()
      SpyMyEventEmitter.mockReturnValue({
        emit: () => {}
      })
      SpyRequestLogger.mockReturnValue()
      SpyGetTlsConfig.mockReturnValue({
        hubClientCert: 'cert',
        hubClientKey: 'key',
        dfspServerCaRootCert: 'ca',
        dfsps: {}
      })
      SpyEndpointsConfig.mockReturnValue({
        dfspEndpoints: {}
      })
      await expect(callbackHandler.handleCallback(callbackObject, context, req)).rejects.toBe('Outbound TLS is enabled, but there is no TLS config found for DFSP ID: userdfsp')
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
        headers: {},
        customInfo: {}
      }
      Config.getUserConfig.mockReturnValue({
        CALLBACK_ENDPOINT: 'http://localhost:4040',
        CALLBACK_RESOURCE_ENDPOINTS: {
          enabled: true,
          endpoints: [
            {
              method: 'get',
              path: '/transfers/{ID}'
            },
            {
              method: 'post',
              path: '/transfers/{ID}',
              endpoint: 'http://localhost:3000'
            }
          ]
        },
        HUB_ONLY_MODE: false,
        ENDPOINTS_DFSP_WISE: {},
        SEND_CALLBACK_ENABLE: true
      })
      Config.getSystemConfig.mockImplementation(() => {
        return {
          HOSTING_ENABLED: false,
          OUTBOUND_MUTUAL_TLS_ENABLED: false
        }
      })
      SpySign.mockImplementationOnce(() => {
        throw new Error('log error if jws signign fails')
      })
      SpyPush.mockReturnValue()
      SpyMyEventEmitter.mockReturnValue({
        emit: () => {}
      })
      SpyRequestLogger.mockReturnValue()
      axios.mockRejectedValue({err: {}})
      await expect(callbackHandler.handleCallback(callbackObject, context, req)).resolves.toBe(undefined)
    })
    it('when CALLBACK_RESOURCE_ENDPOINTS and SEND_CALLBACK_ENABLE is enabled and OUTBOUND_MUTUAL_TLS_ENABLED disabled', async () => {
      const callbackObject = {
        method: 'post',
        path: '/transfers/{ID}',
        headers: {
          host: 'http://localhost:5050'
        },
        body: {},
        callbackInfo: {
          fspid: 'userdfsp'
        }
      }
      const context = {
        api: {
          validateRequest: async () => {
            return {valid: false}
          }
        }
      }
      const req = {
        headers: {},
        customInfo: {}
      }
      Config.getUserConfig.mockReturnValue({
        CALLBACK_ENDPOINT: 'http://localhost:4040',
        HUB_ONLY_MODE: true,
        ENDPOINTS_DFSP_WISE: {
          dfsps: {
            userdfsp: {
              defaultEndpoint: 'http://localhost:4040',
              endpoints: [{
                method: 'post',
                path: '/transfers',
                endpoint: 'http://localhost:4040'
              }]
            }
          }
        },
        SEND_CALLBACK_ENABLE: true
      })
      Config.getSystemConfig.mockImplementation(() => {
        return {
          HOSTING_ENABLED: false,
          OUTBOUND_MUTUAL_TLS_ENABLED: false
        }
      })
      SpySign.mockImplementationOnce(() => {
        throw new Error('log error if jws signign fails')
      })
      SpyPush.mockReturnValue()
      SpyMyEventEmitter.mockReturnValue({
        emit: () => {}
      })
      SpyRequestLogger.mockReturnValue()
      axios.mockRejectedValue({err: {}})
      await expect(callbackHandler.handleCallback(callbackObject, context, req)).resolves.toBe(undefined)
    })
    it('when CALLBACK_RESOURCE_ENDPOINTS and SEND_CALLBACK_ENABLE is enabled and OUTBOUND_MUTUAL_TLS_ENABLED disabled', async () => {
      const callbackObject = {
        method: 'post',
        path: '/transfers',
        headers: {},
        body: {},
        callbackInfo: {
          fspid: 'userdfsp'
        }
      }
      const context = {
        api: {
          validateRequest: async () => {
            return {valid: false}
          }
        }
      }
      const req = {
        headers: {},
        customInfo: {
          traceID: 'traceID'
        }
      }
      Config.getUserConfig.mockReturnValue({
        CALLBACK_ENDPOINT: 'http://localhost:4040',
        HUB_ONLY_MODE: true,
        ENDPOINTS_DFSP_WISE: {
          dfsps: {
            userdfsp: {
              defaultEndpoint: 'http://localhost:4040',
              endpoints: []
            }
          }
        },
        SEND_CALLBACK_ENABLE: true
      })
      Config.getSystemConfig.mockReturnValue({
        HOSTING_ENABLED: false,
        OUTBOUND_MUTUAL_TLS_ENABLED: false
      })
      SpySign.mockImplementationOnce(() => {
        throw new Error('log error if jws signign fails')
      })
      SpyPush.mockReturnValue()
      SpyMyEventEmitter.mockReturnValue({
        emit: () => {}
      })
      SpyRequestLogger.mockReturnValue()
      axios.mockRejectedValue({err: {}})
      await expect(callbackHandler.handleCallback(callbackObject, context, req)).resolves.toBe(undefined)
    })
    it('when CALLBACK_RESOURCE_ENDPOINTS and SEND_CALLBACK_ENABLE is enabled and OUTBOUND_MUTUAL_TLS_ENABLED disabled', async () => {
      const callbackObject = {
        method: 'put',
        path: '/transfers',
        headers: {},
        body: {},
        callbackInfo: {
          fspid: 'userdfsp'
        }
      }
      const context = {
        api: {
          validateRequest: async () => {
            return {valid: false}
          }
        }
      }
      const req = {
        headers: {},
        customInfo: {}
      }
      Config.getUserConfig.mockReturnValue({
        CALLBACK_ENDPOINT: 'http://localhost:4040',
        HUB_ONLY_MODE: true,
        ENDPOINTS_DFSP_WISE: {
          dfsps: {
            userdfsp: {
              defaultEndpoint: 'http://localhost:4040',
              endpoints: []
            }
          }
        },
        SEND_CALLBACK_ENABLE: true
      })
      Config.getSystemConfig.mockReturnValue({
        HOSTING_ENABLED: false,
        OUTBOUND_MUTUAL_TLS_ENABLED: false
      })
      SpySign.mockImplementationOnce(() => {
        throw new Error('log error if jws signign fails')
      })
      SpyPush.mockReturnValue()
      SpyMyEventEmitter.mockReturnValue({
        emit: () => {}
      })
      SpyRequestLogger.mockReturnValue()
      axios.mockRejectedValue({err: {}})
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
        headers: {},
        customInfo: {}
      }
      Config.getUserConfig.mockReturnValue({
        CALLBACK_ENDPOINT: 'http://localhost:4040',
        CALLBACK_RESOURCE_ENDPOINTS: {
          enabled: true,
          endpoints: [
            {
              method: 'get',
              path: '/transfers/{ID}'
            }
          ]
        },
        HUB_ONLY_MODE: false,
        ENDPOINTS_DFSP_WISE: {},
        SEND_CALLBACK_ENABLE: true
      })
      Config.getSystemConfig.mockReturnValue({
        HOSTING_ENABLED: false,
        OUTBOUND_MUTUAL_TLS_ENABLED: false
      })
      SpySign.mockImplementationOnce(() => {
        throw new Error('log error if jws signign fails')
      })
      SpyPush.mockReturnValue()
      SpyMyEventEmitter.mockReturnValue({
        emit: () => {}
      })
      SpyRequestLogger.mockReturnValue()
      axios.mockRejectedValue({err: {}})
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
        headers: {},
        customInfo: {
          user: {
            dfspId: 'test'
          }
        }
      }
      Config.getSystemConfig.mockReturnValue({
        HOSTING_ENABLED: false,
        OUTBOUND_MUTUAL_TLS_ENABLED: false
      })
      Config.getUserConfig.mockReturnValue({
        CALLBACK_ENDPOINT: 'http://localhost:4040',
        SEND_CALLBACK_ENABLE: false
      })
      SpySign.mockReturnValue()
      SpyPush.mockReturnValue()
      SpyMyEventEmitter.mockReturnValue({
        emit: () => {}
      })
      SpyRequestLogger.mockReturnValue()
      await expect(callbackHandler.handleCallback(callbackObject, context, req)).resolves.toBe(undefined)
    })
    it('when CALLBACK_RESOURCE_ENDPOINTS, SEND_CALLBACK_ENABLE and OUTBOUND_MUTUAL_TLS_ENABLED disabled and the url is https', async () => {
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
        headers: {},
        customInfo: {
          user: {
            dfspId: 'test'
          }
        }
      }
      Config.getSystemConfig.mockReturnValue({
        HOSTING_ENABLED: false,
        OUTBOUND_MUTUAL_TLS_ENABLED: false
      })
      Config.getUserConfig.mockReturnValue({
        CALLBACK_ENDPOINT: 'https://localhost:4040',
        SEND_CALLBACK_ENABLE: false
      })
      SpySign.mockReturnValue()
      SpyPush.mockReturnValue()
      SpyMyEventEmitter.mockReturnValue({
        emit: () => {}
      })
      SpyRequestLogger.mockReturnValue()
      await expect(callbackHandler.handleCallback(callbackObject, context, req)).resolves.toBe(undefined)
    })
    it('when CALLBACK_RESOURCE_ENDPOINTS, CLIENT_MUTUAL_TLS_ENABLED and SEND_CALLBACK_ENABLE is enabled, CLIENT_TLS_CREDS is missing', async () => {
      const callbackObject = {
        delay: 100,
        method: 'post',
        callbackInfo: {
          fspid: 'userdfsp'
        },
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
        },
        customInfo: {}
      }
      Config.getUserConfig.mockReturnValue({
        CALLBACK_ENDPOINT: 'http://localhost:4040',
        CLIENT_MUTUAL_TLS_ENABLED: true,
        SEND_CALLBACK_ENABLE: true,
        CLIENT_TLS_CREDS: [
          {
            HOST: 'unknownhost:4040',
            CERT: 'certificate',
            KEY: 'key'
          }
        ]
      })
      Config.getSystemConfig.mockImplementation(() => {
        return {
          HOSTING_ENABLED: true
        }
      })
      SpySign.mockReturnValue()
      SpyPush.mockReturnValue()
      SpyMyEventEmitter.mockReturnValue({
        emit: () => {}
      })
      SpyRequestLogger.mockReturnValue()
      SpyGetTlsConfig.mockReturnValue({
        hubClientCert: 'cert',
        hubClientKey: 'key',
        dfspServerCaRootCert: 'ca',
        dfsps: {
          userdfsp: {}
        }
      })
      SpyEndpointsConfig.mockReturnValue({
        dfspEndpoints: {
          userdfsp: 'userdfspcallbackendpint'
        }
      })
      SpyAgent.mockImplementationOnce(() => {
        return {httpsAgent: {}}
      })
      axios.mockResolvedValue({
        status: '200',
        statusText: 'OK'
      })
      await expect(callbackHandler.handleCallback(callbackObject, context, req)).resolves.toBe(undefined)
    })
  })
})
