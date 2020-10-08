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

const Config = require('../../../../src/lib/config')
jest.mock('../../../../src/lib/config')
Config.getSystemConfig.mockReturnValue({
  OAUTH: {
    AUTH_ENABLED: false
  }
})

const request = require('supertest')
const apiServer = require('../../../../src/lib/api-server')
const app = apiServer.getApp()
const dbAdapter = require('../../../../src/lib/db/adapters/dbAdapter')
const requestLogger = require('../../../../src/lib/requestLogger')

jest.mock('../../../../src/lib/requestLogger')
jest.mock('../../../../src/lib/db/adapters/dbAdapter')

describe('API route /api/hisotry', () => {
  beforeAll(() => {
    requestLogger.logMessage.mockReturnValue()
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  describe('GET /api/history/reports', () => {
    it('Send a proper request', async () => {
      dbAdapter.read.mockResolvedValueOnce([])
      const res = await request(app).get(`/api/history/reports`).send()
      expect(res.statusCode).toEqual(200)
    })
    it('Send a proper request with type: hub', async () => {
      dbAdapter.read.mockRejectedValueOnce({message: ''})
      const res = await request(app).get(`/api/history/reports`).send()
      expect(res.statusCode).toEqual(500)
    })
  })
  describe('POST /api/history/reports', () => {
    it('Send a proper request with missing collections query param', async () => {
      dbAdapter.upsert.mockResolvedValueOnce()
      const res = await request(app).post(`/api/history/reports`).send({})
      expect(res.statusCode).toEqual(200)
    })
    it('Send a bad request with not existing environment', async () => {
      dbAdapter.upsert.mockRejectedValueOnce({message: ''})
      const res = await request(app).post(`/api/history/reports`).send({})
      expect(res.statusCode).toEqual(500)
    })
  })
  describe('GET /api/history/logs', () => {
    it('Send a proper request', async () => {
      dbAdapter.read.mockResolvedValueOnce()
      const res = await request(app).get(`/api/history/logs`).send()
      expect(res.statusCode).toEqual(200)
    })
    it('Send a bad request', async () => {
      dbAdapter.read.mockRejectedValueOnce({message: ''})
      const res = await request(app).get(`/api/history/logs`).send()
      expect(res.statusCode).toEqual(500)
    })
  })
})
