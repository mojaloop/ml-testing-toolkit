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

const Config = require('../../../../src/lib/config')
jest.mock('../../../../src/lib/config')
jest.mock('../../../../src/lib/report-generator/generator')

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
const arrayStore = require('../../../../src/lib/arrayStore')

const SpyArrayStoreGet = jest.spyOn(arrayStore, 'get')
const SpyArrayStoreReset = jest.spyOn(arrayStore, 'reset')
jest.mock('../../../../src/lib/requestLogger')
jest.mock('../../../../src/lib/db/adapters/dbAdapter')

describe('API route /api/hisotry', () => {
  beforeAll(() => {
    jest.resetAllMocks()
    requestLogger.logMessage.mockReturnValue()
  })
  afterEach(() => {
    jest.resetAllMocks()
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

describe('API route /api/history for requests and callbacks', () => {
  beforeAll(() => {
    jest.resetAllMocks()
    requestLogger.logMessage.mockReturnValue()
  })
  afterEach(() => {
    jest.resetAllMocks()
  })
  describe('GET /api/history/requests', () => {
    it('Get requests history', async () => {
      SpyArrayStoreGet.mockReturnValue([{ data: {sample: 'SampleText'}}])
      const res = await request(app).get(`/api/history/requests`).send()
      expect(res.statusCode).toEqual(200)
      expect(Array.isArray(res.body)).toBe(true)
      expect(res.body.length).toEqual(1)
      expect(res.body[0]).toHaveProperty('sample')
      expect(res.body[0].sample).toEqual('SampleText')
    })
    it('Get requests history empty array', async () => {
      SpyArrayStoreGet.mockReturnValue([])
      const res = await request(app).get(`/api/history/requests`).send()
      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual([])
    })
    it('Get requests history null value', async () => {
      SpyArrayStoreGet.mockReturnValue(null)
      const res = await request(app).get(`/api/history/requests`).send()
      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual([])
    })
    it('Get requests history exception', async () => {
      SpyArrayStoreGet.mockImplementation(() => {
        throw new Error('Some error')
      })
      const res = await request(app).get(`/api/history/requests`).send()
      expect(res.statusCode).toEqual(500)
    })
  })
  describe('DELETE /api/history/requests', () => {
    it('Delete requests history', async () => {
      SpyArrayStoreReset.mockReturnValue()
      const res = await request(app).delete(`/api/history/requests`).send()
      expect(res.statusCode).toEqual(200)
    })
    it('Delete requests history exception', async () => {
      SpyArrayStoreReset.mockImplementation(() => {
        throw new Error('Some error')
      })
      const res = await request(app).delete(`/api/history/requests`).send()
      expect(res.statusCode).toEqual(500)
    })
  })
  describe('GET /api/history/callbacks', () => {
    it('Get callbacks history', async () => {
      SpyArrayStoreGet.mockReturnValue([{ data: {sample: 'SampleText'}}])
      const res = await request(app).get(`/api/history/callbacks`).send()
      expect(res.statusCode).toEqual(200)
      expect(Array.isArray(res.body)).toBe(true)
      expect(res.body.length).toEqual(1)
      expect(res.body[0]).toHaveProperty('sample')
      expect(res.body[0].sample).toEqual('SampleText')
    })
    it('Get callbacks history empty array', async () => {
      SpyArrayStoreGet.mockReturnValue([])
      const res = await request(app).get(`/api/history/callbacks`).send()
      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual([])
    })
    it('Get callbacks history null value', async () => {
      SpyArrayStoreGet.mockReturnValue(null)
      const res = await request(app).get(`/api/history/callbacks`).send()
      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual([])
    })
    it('Get callbacks history exception', async () => {
      SpyArrayStoreGet.mockImplementation(() => {
        throw new Error('Some error')
      })
      const res = await request(app).get(`/api/history/callbacks`).send()
      expect(res.statusCode).toEqual(500)
    })
  })
  describe('DELETE /api/history/callbacks', () => {
    it('Delete callbacks history', async () => {
      SpyArrayStoreReset.mockReturnValue()
      const res = await request(app).delete(`/api/history/callbacks`).send()
      expect(res.statusCode).toEqual(200)
    })
    it('Delete callbacks history exception', async () => {
      SpyArrayStoreReset.mockImplementation(() => {
        throw new Error('Some error')
      })
      const res = await request(app).delete(`/api/history/callbacks`).send()
      expect(res.statusCode).toEqual(500)
    })
  })
  describe('GET /api/history/test-reports', () => {
    it('Send a proper request', async () => {
      dbAdapter.listReports.mockResolvedValueOnce([])
      const res = await request(app).get(`/api/history/test-reports`).send()
      expect(res.statusCode).toEqual(200)
    })
    it('If dbAdapter throws error', async () => {
      dbAdapter.listReports.mockRejectedValueOnce({message: ''})
      const res = await request(app).get(`/api/history/test-reports`).send()
      expect(res.statusCode).toEqual(500)
    })
  })
  describe('GET /api/history/test-reports/reportId', () => {
    it('Send a proper request', async () => {
      dbAdapter.getReport.mockResolvedValueOnce({})
      const res = await request(app).get(`/api/history/test-reports/1`).send()
      expect(res.statusCode).toEqual(200)
    })
    it('Send a proper request with format html', async () => {
      dbAdapter.getReport.mockResolvedValueOnce({
        testCases: []
      })
      const res = await request(app).get(`/api/history/test-reports/1?format=html`).send()
      expect(res.statusCode).toEqual(200)
    })
    it('Send a proper request with format html and download enabled', async () => {
      dbAdapter.getReport.mockResolvedValueOnce({})
      const res = await request(app).get(`/api/history/test-reports/1?format=html&download=true`).send()
      expect(res.statusCode).toEqual(200)
    })
    it('If dbAdapter.getReport throws error', async () => {
      dbAdapter.getReport.mockRejectedValueOnce({message: ''})
      const res = await request(app).get(`/api/history/test-reports/1`).send()
      expect(res.statusCode).toEqual(500)
    })
    it('If dbAdapter.getReport returns null', async () => {
      dbAdapter.getReport.mockResolvedValueOnce(null)
      const res = await request(app).get(`/api/history/test-reports/1`).send()
      expect(res.statusCode).toEqual(404)
    })
    it('If download.query is true', async () => {
      dbAdapter.getReport.mockResolvedValueOnce({})
      const res = await request(app).get(`/api/history/test-reports/1?download=true`).send()
      console.log(res)
      expect(res.statusCode).toEqual(200)
      expect(res.headers['content-disposition']).toBeDefined()
      expect(res.headers['ttk-filename']).toEqual('TTK-Assertion-Report-1.json')
    })
  })
})
