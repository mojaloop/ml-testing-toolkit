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

const Config = require('../../../../src/lib/config')
jest.mock('../../../../src/lib/config')
Config.getSystemConfig.mockReturnValue({
  OAUTH: {
    AUTH_ENABLED: false
  }
})

const request = require('supertest')
const apiServer = require('../../../../src/lib/api-server')
const OpenApiMockHandler = require('../../../../src/lib/mocking/openApiMockHandler')

const app = apiServer.getApp()

const Utils = require('../../../../src/lib/utils')
const SpyReadFileAsync = jest.spyOn(Utils, 'readFileAsync')
const OpenApiDefinitionsModel = require('../../../../src/lib/mocking/openApiDefinitionsModel')
const SpyGetApiDefinitions = jest.spyOn(OpenApiDefinitionsModel, 'getApiDefinitions')
const SpyGetOpenApiObjects = jest.spyOn(OpenApiMockHandler, 'getOpenApiObjects')
const requestLogger = require('../../../../src/lib/requestLogger')

jest.mock('../../../../src/lib/requestLogger')
jest.mock('../../../../src/lib/config')

describe('API route /api/openapi', () => {
  beforeAll(() => {
    requestLogger.logMessage.mockReturnValue()
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  describe('GET /api/openapi/api_versions', () => {
    it('Getting all api versions', async () => {
      const mockGetApiDefinitionsResponse = [{
        minorVersion: '0',
        majorVersion: '1',
        type: 'fspiop',
        asynchronous: false
      }]
      SpyGetApiDefinitions.mockResolvedValueOnce(mockGetApiDefinitionsResponse)
      const res = await request(app).get(`/api/openapi/api_versions`)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toStrictEqual(mockGetApiDefinitionsResponse)
      expect(res.body.length).toBeGreaterThan(0)
    })
    it('Getting none api versions', async () => {
      mockGetApiDefinitionsResponse = null
      SpyGetApiDefinitions.mockResolvedValueOnce(mockGetApiDefinitionsResponse)
      const res = await request(app).get(`/api/openapi/api_versions`)
      expect(res.statusCode).toEqual(404)
    })
    it('Getting error', async () => {
      mockGetApiDefinitionsResponse = null
      SpyGetApiDefinitions.mockRejectedValueOnce()
      const res = await request(app).get(`/api/openapi/api_versions`)
      expect(res.statusCode).toEqual(404)
    })
  })
  describe('GET /api/openapi/definition/:type/:version', () => {
    it('Getting api definition', async () => {
      const mockGetApiDefinitionsResponse = [{
        minorVersion: 1,
        majorVersion: 1,
        type: 'fspiop',
        asynchronous: false,
        openApiBackendObject: {
          definition: {
            paths: []
          }
        }
      }]
      SpyGetOpenApiObjects.mockReturnValueOnce(mockGetApiDefinitionsResponse)
      const reqItem = mockGetApiDefinitionsResponse[0]
      const res = await request(app).get(`/api/openapi/definition/${reqItem.type}/${reqItem.majorVersion}.${reqItem.minorVersion}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('paths')
    })
    it('Getting api definition - not found', async () => {
      const mockGetApiDefinitionsResponse = [{
        minorVersion: 0,
        majorVersion: 1,
        type: 'fspiop',
        asynchronous: false
      }]
      SpyGetOpenApiObjects.mockReturnValueOnce(mockGetApiDefinitionsResponse)
      const reqItem = mockGetApiDefinitionsResponse[0]
      const res = await request(app).get(`/api/openapi/definition/settlements/${reqItem.majorVersion}.${reqItem.minorVersion}`)
      expect(res.statusCode).toEqual(404)
    })
    it('Getting api definition - error', async () => {
      const mockGetApiDefinitionsResponse = [{
        minorVersion: 0,
        majorVersion: 1,
        type: 'fspiop',
        asynchronous: false
      }]
      SpyGetOpenApiObjects.mockImplementationOnce(() => {throw new Error()})
      const reqItem = mockGetApiDefinitionsResponse[0]
      const res = await request(app).get(`/api/openapi/definition/${reqItem.type}/${reqItem.majorVersion}.${reqItem.minorVersion}`)
      expect(res.statusCode).toEqual(500)
    })
  })
  describe('GET /api/openapi/callback_map/:type/:version', () => {
    it('Getting api definition', async () => {
      const mockGetApiDefinitionsResponse = [{
        minorVersion: 0,
        majorVersion: 1,
        type: 'fspiop',
        asynchronous: true,
        callbackMapFile: 'callback_map.json'
      }]
      SpyGetApiDefinitions.mockReturnValueOnce(mockGetApiDefinitionsResponse)
      SpyReadFileAsync.mockReturnValueOnce(JSON.stringify({}))
      const reqItem = mockGetApiDefinitionsResponse[0]
      const res = await request(app).get(`/api/openapi/callback_map/${reqItem.type}/${reqItem.majorVersion}.${reqItem.minorVersion}`)
      expect(res.statusCode).toEqual(200)
    })
    
    it('Getting api definition - not found api definition', async () => {
      const mockGetApiDefinitionsResponse = [{
        minorVersion: 0,
        majorVersion: 1,
        type: 'fspiop',
        asynchronous: true,
        callbackMapFile: 'callback_map.json'
      }]
      SpyGetApiDefinitions.mockReturnValueOnce(mockGetApiDefinitionsResponse)
      const reqItem = mockGetApiDefinitionsResponse[0]
      const res = await request(app).get(`/api/openapi/callback_map/settlements/${reqItem.majorVersion}.${reqItem.minorVersion}`)
      expect(res.statusCode).toEqual(404)
    })

    it('Getting api definition - not found map file', async () => {
      const mockGetApiDefinitionsResponse = [{
        minorVersion: 0,
        majorVersion: 1,
        type: 'fspiop',
        asynchronous: true,
        callbackMapFile: 'callback_map.json'
      }]
      SpyGetApiDefinitions.mockReturnValueOnce(mockGetApiDefinitionsResponse)
      SpyReadFileAsync.mockImplementationOnce(() => {throw new Error()})
      const reqItem = mockGetApiDefinitionsResponse[0]
      const res = await request(app).get(`/api/openapi/callback_map/${reqItem.type}/${reqItem.majorVersion}.${reqItem.minorVersion}`)
      expect(res.statusCode).toEqual(404)
    })

    it('Getting api definition - error', async () => {
      const mockGetApiDefinitionsResponse = [{
        minorVersion: 0,
        majorVersion: 1,
        type: 'fspiop'
      }]
      SpyGetApiDefinitions.mockImplementationOnce(() => {throw new Error()})
      const reqItem = mockGetApiDefinitionsResponse[0]
      const res = await request(app).get(`/api/openapi/callback_map/${reqItem.type}/${reqItem.majorVersion}.${reqItem.minorVersion}`)
      expect(res.statusCode).toEqual(500)
    })
  })
  describe('GET /api/openapi/response_map/:type/:version', () => {
    it('Getting api definition', async () => {
      const mockGetApiDefinitionsResponse = [{
        minorVersion: 0,
        majorVersion: 1,
        type: 'fspiop',
        asynchronous: false,
        callbackMapFile: 'response_map.json'
      }]
      SpyGetApiDefinitions.mockReturnValueOnce(mockGetApiDefinitionsResponse)
      SpyReadFileAsync.mockReturnValueOnce(JSON.stringify({}))
      const reqItem = mockGetApiDefinitionsResponse[0]
      const res = await request(app).get(`/api/openapi/response_map/${reqItem.type}/${reqItem.majorVersion}.${reqItem.minorVersion}`)
      expect(res.statusCode).toEqual(200)
    })
    
    it('Getting api definition - not found api definition', async () => {
      const mockGetApiDefinitionsResponse = [{
        minorVersion: 0,
        majorVersion: 1,
        type: 'fspiop',
        asynchronous: false,
        callbackMapFile: 'response_map.json'
      }]
      SpyGetApiDefinitions.mockReturnValueOnce(mockGetApiDefinitionsResponse)
      const reqItem = mockGetApiDefinitionsResponse[0]
      const res = await request(app).get(`/api/openapi/response_map/settlements/${reqItem.majorVersion}.${reqItem.minorVersion}`)
      expect(res.statusCode).toEqual(404)
    })

    it('Getting api definition - not found map file', async () => {
      const mockGetApiDefinitionsResponse = [{
        minorVersion: 0,
        majorVersion: 1,
        type: 'fspiop',
        asynchronous: false,
        callbackMapFile: 'response_map.json'
      }]
      SpyGetApiDefinitions.mockReturnValueOnce(mockGetApiDefinitionsResponse)
      SpyReadFileAsync.mockImplementationOnce(() => {throw new Error()})
      const reqItem = mockGetApiDefinitionsResponse[0]
      const res = await request(app).get(`/api/openapi/response_map/${reqItem.type}/${reqItem.majorVersion}.${reqItem.minorVersion}`)
      expect(res.statusCode).toEqual(404)
    })

    it('Getting api definition - error', async () => {
      const mockGetApiDefinitionsResponse = [{
        minorVersion: 0,
        majorVersion: 1,
        type: 'fspiop'
      }]
      SpyGetApiDefinitions.mockImplementationOnce(() => {throw new Error()})
      const reqItem = mockGetApiDefinitionsResponse[0]
      const res = await request(app).get(`/api/openapi/response_map/${reqItem.type}/${reqItem.majorVersion}.${reqItem.minorVersion}`)
      expect(res.statusCode).toEqual(500)
    })
  })
})
