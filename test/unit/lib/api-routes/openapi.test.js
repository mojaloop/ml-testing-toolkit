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

const request = require('supertest')
const apiServer = require('../../../../src/lib/api-server')
const OpenApiMockHandler = require('../../../../src/lib/mocking/openApiMockHandler')

const app = apiServer.getApp()
jest.setTimeout(30000)

describe('API route /api/openapi', () => {
  describe('GET /api/openapi/api_versions', () => {
    it('Getting all api versions', async () => {
      const res = await request(app).get(`/api/openapi/api_versions`)
      expect(res.statusCode).toEqual(200)
      expect(Array.isArray(res.body)).toBe(true)
      expect(res.body.length).toBeGreaterThan(0)
      const firstItem = res.body[0]
      expect(firstItem).toHaveProperty('minorVersion')
      expect(firstItem).toHaveProperty('majorVersion')
      expect(firstItem).toHaveProperty('type')
    })
  })
  describe('GET /api/openapi/definition/:type/:version', () => {
    let firstItem
    it('Getting all api versions', async () => {
      const res = await request(app).get(`/api/openapi/api_versions`)
      firstItem = res.body[0]
      await OpenApiMockHandler.initilizeMockHandler()
    })
    it('Getting api definition', async () => {
      const res = await request(app).get(`/api/openapi/definition/${firstItem.type}/${firstItem.majorVersion}.${firstItem.minorVersion}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('paths')
    })
    it('Getting callback map', async () => {
      const res = await request(app).get(`/api/openapi/callback_map/${firstItem.type}/${firstItem.majorVersion}.${firstItem.minorVersion}`)
      if (firstItem.asynchronous) {
        expect(res.statusCode).toEqual(200)
      } else {
        expect(res.statusCode).toEqual(404)
      }
    })
    it('Getting response map', async () => {
      const res = await request(app).get(`/api/openapi/response_map/${firstItem.type}/${firstItem.majorVersion}.${firstItem.minorVersion}`)
      if (!firstItem.asynchronous) {
        expect(res.statusCode).toEqual(200)
      }
    })
  })
})
