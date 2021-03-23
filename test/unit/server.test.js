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

'use strict'

const Server = require('../../src/server')
const Config = require('../../src/lib/config')
const ConnectionProvider = require('../../src/lib/configuration-providers/mb-connection-manager')
const ObjectStore = require('../../src/lib/objectStore')
const OpenApiMockHandler = require('../../src/lib/mocking/openApiMockHandler')

const SpyWaitForTlsHubCerts = jest.spyOn(ConnectionProvider, 'waitForTlsHubCerts')
const SpyGetTlsConfig = jest.spyOn(ConnectionProvider, 'getTlsConfig')
const SpyInitObjectStore = jest.spyOn(ObjectStore, 'initObjectStore')
const SpyInitilizeMockHandler = jest.spyOn(OpenApiMockHandler, 'initilizeMockHandler')

const customLogger = require('../../src/lib/requestLogger')

jest.mock('../../src/lib/requestLogger')
jest.mock('../../src/lib/config')

jest.setTimeout(30000)

describe('Server', () => {
  beforeAll(() => {
    customLogger.logMessage.mockReturnValue()
  })
  afterEach(() => {
    jest.resetAllMocks()
  })
  describe('restartServer', () => {
    it('restartServer should not throw an error', async () => {
      Config.getSystemConfig.mockReturnValue({
        API_PORT: 5051
      })
      Config.getUserConfig.mockResolvedValue({
        INBOUND_MUTUAL_TLS_ENABLED: true
      })
      SpyWaitForTlsHubCerts.mockRejectedValue()
      const server = await Server.restartServer()
      expect(server).toBeUndefined()
    })
  })
  describe('initialize', () => {
    it('initialize should not throw an error', async () => {
      SpyInitilizeMockHandler.mockResolvedValue()
      Config.getSystemConfig.mockReturnValueOnce({
        API_PORT: 5051
      })
      Config.getUserConfig.mockResolvedValueOnce({
        INBOUND_MUTUAL_TLS_ENABLED: true
      })
      SpyWaitForTlsHubCerts.mockResolvedValueOnce()
      SpyGetTlsConfig.mockReturnValueOnce({
        hubServerCert: '',
        hubServerKey: '',
        hubCaCert: ''
      })
      SpyInitObjectStore.mockReturnValueOnce()
      const server = await Server.initialize()
      await server.inject({
        method: 'GET',
        url: '/',
        headers: {
          traceparent: 'aabb-aabb123213'
        }
      })
      await server.inject({
        method: 'GET',
        url: '/',
        headers: {
          traceparent: 'aabb-aa'
        }
      })
      await server.inject({
        method: 'GET',
        url: '/'
      })
      expect(server).toBeDefined()
      if (server) {
        server.stop()
      }
    })
    it('initialize should not throw an error', async () => {
      SpyInitilizeMockHandler.mockResolvedValueOnce()
      Config.getSystemConfig.mockReturnValue({
        API_PORT: 5051
      })
      Config.getUserConfig.mockResolvedValue({
        INBOUND_MUTUAL_TLS_ENABLED: true
      })
      SpyWaitForTlsHubCerts.mockRejectedValueOnce()
      const server = await Server.initialize()
      expect(server).toBeDefined()
      if (server) {
        server.stop()
      }
    })
    it('initialize should not throw an error', async () => {
      SpyInitilizeMockHandler.mockResolvedValueOnce()
      Config.getSystemConfig.mockReturnValue({
        API_PORT: 5051
      })
      Config.getUserConfig.mockResolvedValue({
        INBOUND_MUTUAL_TLS_ENABLED: false
      })
      const server = await Server.initialize()
      expect(server).toBeDefined()
      if (server) {
        server.stop()
      }
    })
  })
  describe('restartServer', () => {
    it('restartServer should not throw an error', async () => {
      Config.getSystemConfig.mockReturnValue({
        API_PORT: 5051
      })
      Config.getUserConfig.mockResolvedValue({
        INBOUND_MUTUAL_TLS_ENABLED: true
      })
      SpyWaitForTlsHubCerts.mockRejectedValueOnce()
      const server = await Server.restartServer()
      if (server) {
        server.stop()
      }
    })
  })
  describe('onPreHandler', () => {
    const h = {
      continue: () => {}
    }
    const req = {
      customInfo: {},
      headers: {
        'fspiop-source': 'data'
      }
    }
    it('onPreHandler should not throw an error', async () => {
      Config.getSystemConfig.mockReturnValue({
        HOSTING_ENABLED: true
      })
      Config.getUserConfig.mockResolvedValueOnce({
        FSPID: 'test'
      })
      await Server.onPreHandler(req, h)
    })
  })
  describe('onPreHandler', () => {
    const h = {
      continue: () => {}
    }
    const req = {
      customInfo: {},
      headers: {
        'fspiop-source': 'data'
      }
    }
    it('onPreHandler should not throw an error', async () => {
      Config.getSystemConfig.mockReturnValueOnce({
        HOSTING_ENABLED: true
      })
      await Server.onPreHandler(req, h)
    })
  })
  describe('onPreResponse', () => {
    const h = {
      continue: () => {}
    }
    const req = {
      customInfo: {
        negotiatedContentType: 'application/json'
      },
      response: {
        header: () => {},
        output: {
          headers: {
            'content-type': 'application/json'
          }
        }
      }
    }
    it('onPreResponse should not throw an error', async () => {
      req.response.isBoom = true
      await Server.onPreResponse(req, h)
    })
    it('onPreResponse should not throw an error', async () => {
      req.response.isBoom = false
      await Server.onPreResponse(req, h)
    })
  })
})
