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
const AssertionStore = require('../../src/lib/assertionStore')
const OpenApiMockHandler = require('../../src/lib/mocking/openApiMockHandler')
const { default: Axios } = require('axios')
const { setActiveResponseRulesFile } = require('../../src/lib/rulesEngineModel')


const SpyGetUserConfig = jest.spyOn(Config, 'getUserConfig')
const SpyGetSystemConfig = jest.spyOn(Config, 'getSystemConfig')

const SpyWaitForTlsHubCerts = jest.spyOn(ConnectionProvider, 'waitForTlsHubCerts')
const SpyGetTlsConfig = jest.spyOn(ConnectionProvider, 'getTlsConfig')
const SpyInitObjectStore = jest.spyOn(ObjectStore, 'initObjectStore')
const SpyInitAssertionStore = jest.spyOn(AssertionStore, 'initAssertionStore')
const SpyInitilizeMockHandler = jest.spyOn(OpenApiMockHandler, 'initilizeMockHandler')
const SpyHandleRequest = jest.spyOn(OpenApiMockHandler, 'handleRequest')


jest.setTimeout(30000)

describe('Server', () => {
  describe('restartServer', () => {
    it('restartServer should not throw an error', async () => {
      SpyGetSystemConfig.mockReturnValueOnce({
        API_PORT: 5051
      })
      SpyGetUserConfig.mockReturnValueOnce({
        INBOUND_MUTUAL_TLS_ENABLED: true
      })
      SpyWaitForTlsHubCerts.mockRejectedValue()
      const server = await Server.restartServer()
      expect(server).toBeUndefined()
    })
  })
  describe('initialize', () => {
    it('initialize should not throw an error', async () => {
      SpyInitilizeMockHandler.mockResolvedValueOnce()
      SpyGetSystemConfig.mockReturnValueOnce({
        API_PORT: 5051
      })
      SpyGetUserConfig.mockReturnValueOnce({
        INBOUND_MUTUAL_TLS_ENABLED: true
      })
      SpyWaitForTlsHubCerts.mockResolvedValueOnce()
      SpyGetTlsConfig.mockReturnValueOnce({
        hubServerCert: '',
        hubServerKey: '',
        hubCaCert: ''
      })
      SpyInitObjectStore.mockReturnValueOnce()
      SpyInitAssertionStore.mockReturnValueOnce()
      const server = await Server.initialize()
      await server.inject({
        method: 'POST',
        url: '/',
        payload: {
          customInfo: {
            negotiatedContentType: 'application/json'
          }
        },   
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
      server.stop()
    })
    it('initialize should not throw an error', async () => {
      SpyInitilizeMockHandler.mockResolvedValueOnce()
      SpyGetSystemConfig.mockReturnValueOnce({
        API_PORT: 5051
      })
      SpyGetUserConfig.mockReturnValueOnce({
        INBOUND_MUTUAL_TLS_ENABLED: true
      })
      SpyWaitForTlsHubCerts.mockRejectedValueOnce()
      const server = await Server.initialize()
      expect(server).toBeNull()
    })
    it('initialize should not throw an error', async () => {
      SpyInitilizeMockHandler.mockResolvedValueOnce()
      SpyGetSystemConfig.mockReturnValueOnce({
        API_PORT: 5051
      })
      SpyGetUserConfig.mockReturnValueOnce({
        INBOUND_MUTUAL_TLS_ENABLED: false
      })
      const server = await Server.initialize()
      expect(server).toBeDefined()
      server.stop()
    })
  })
  describe('restartServer', () => {
    it('restartServer should not throw an error', async () => {
      SpyGetSystemConfig.mockReturnValueOnce({
        API_PORT: 5051
      })
      SpyGetUserConfig.mockReturnValueOnce({
        INBOUND_MUTUAL_TLS_ENABLED: true
      })
      SpyWaitForTlsHubCerts.mockRejectedValue()
      const server = await Server.restartServer()
      expect(server).toBeUndefined()
    })
  })
})
