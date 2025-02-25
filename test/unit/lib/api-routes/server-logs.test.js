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
 * Steven Oderayi <steven.oderayi@modusbox.com> (Original Author)
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
const app = require('../../../../src/lib/api-server').getApp()

const requestLogger = require('../../../../src/lib/requestLogger')
jest.mock('../../../../src/lib/requestLogger')

const ServerLogs = require('../../../../src/lib/server-logs')
jest.mock('../../../../src/lib/server-logs')


describe('API route /serverlogs', () => {
  beforeEach(() => {
    requestLogger.logMessage.mockReturnValue()
    ServerLogs.search.mockReturnValue({})
  })
  describe('GET /api/serverlogs/search', () => {
    it('Search logs by traceId', async () => {
      ServerLogs.search.mockReturnValueOnce({ hits: { total: 1 }})
      const res = await request(app).get(`/api/serverlogs/search`).query({ traceId: 'mockTraceId' }).send() 
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('hits')
    })
    it('Search logs by traceId, empty queryString', async () => {
        ServerLogs.search.mockReturnValueOnce({ hits: { total: 1 }})
        const res = await request(app).get(`/api/serverlogs/search`).send() 
        expect(res.statusCode).toEqual(200)
        expect(res.body).not.toHaveProperty('hits')
      })
  })
})
