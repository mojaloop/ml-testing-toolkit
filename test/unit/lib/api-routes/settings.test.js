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
Config.getSystemConfig.mockReturnValue({
  OAUTH: {
    AUTH_ENABLED: false
  }
})
const request = require('supertest')
const apiServer = require('../../../../src/lib/api-server')
const Server = require('../../../../src/server')
const ImportExport = require('../../../../src/lib/importExport')
const RulesEngineModel = require('../../../../src/lib/rulesEngineModel')
const requestLogger = require('../../../../src/lib/requestLogger')
const app = apiServer.getApp()

jest.mock('../../../../src/server')
jest.mock('../../../../src/lib/requestLogger')
jest.mock('../../../../src/lib/config')
jest.mock('../../../../src/lib/importExport')
jest.mock('../../../../src/lib/rulesEngineModel')

describe('API route /api/settings', () => {
  beforeAll(() => {
    jest.resetAllMocks()
    requestLogger.logMessage.mockReturnValue()
  })
  afterEach(() => {
    jest.resetAllMocks()
  })
  describe('import', () => {
    describe('GET /api/settings/export', () => {
      it('Send a proper request', async () => {
        const options = ['rules_response','rules_callback']
        ImportExport.exportSpecFiles.mockResolvedValueOnce()
        const exportResponse = await request(app)
          .get(`/api/settings/export`)
          .query({options})
          .send()
        expect(exportResponse.statusCode).toEqual(200)
      })
      it('Send a bad request - no options', async () => {
        const exportResponse = await request(app)
          .get(`/api/settings/export`)
          .send()
        expect(exportResponse.statusCode).toEqual(400)
      })
      it('Send a bad request - export spec files fails', async () => {
        const options = ['rules_response','rules_callback']
        ImportExport.exportSpecFiles.mockRejectedValueOnce()
        const exportResponse = await request(app)
          .get(`/api/settings/export`)
          .query({options})
          .send()
        expect(exportResponse.statusCode).toEqual(404)
      })
    })
    describe('POST /api/settings/import', () => {
      it('Send a proper request with INBOUND_MUTUAL_TLS_ENABLED: false', async () => {
        RulesEngineModel.reloadResponseRules.mockResolvedValueOnce()
        RulesEngineModel.reloadCallbackRules.mockResolvedValueOnce()
        RulesEngineModel.reloadValidationRules.mockResolvedValueOnce()
        Config.getUserConfig.mockResolvedValueOnce({INBOUND_MUTUAL_TLS_ENABLED: true})
        Config.getStoredUserConfig.mockResolvedValueOnce({INBOUND_MUTUAL_TLS_ENABLED: false})
        Server.restartServer.mockResolvedValueOnce()
        const options = ['rules_response','rules_callback','rules_validation','user_config.json']
        ImportExport.importSpecFiles.mockResolvedValueOnce()
        const res = await request(app)
          .post(`/api/settings/import`)
          .query({options})
          .send({buffer: Buffer.from([])})
        expect(res.statusCode).toEqual(200)
      })
      it('Send a proper request with INBOUND_MUTUAL_TLS_ENABLED: true', async () => {
        RulesEngineModel.reloadResponseRules.mockResolvedValueOnce()
        RulesEngineModel.reloadCallbackRules.mockResolvedValueOnce()
        RulesEngineModel.reloadValidationRules.mockResolvedValueOnce()
        Config.getUserConfig.mockResolvedValueOnce({INBOUND_MUTUAL_TLS_ENABLED: true})
        Config.getStoredUserConfig.mockResolvedValueOnce({INBOUND_MUTUAL_TLS_ENABLED: true})
        const options = ['rules_response','rules_callback','rules_validation','user_config.json']
        ImportExport.importSpecFiles.mockResolvedValueOnce()
        const res = await request(app)
          .post(`/api/settings/import`)
          .query({options})
          .send({buffer: Buffer.from([])})
        expect(res.statusCode).toEqual(200)
      })
      it('Send a bad request - import spec files fails', async () => {
        const options = ['rules_response','rules_callback','rules_validation','user_config.json']
        ImportExport.importSpecFiles.mockRejectedValueOnce({message: ''})
        const res = await request(app)
          .post(`/api/settings/import`)
          .query({options})
          .send({buffer: Buffer.from([])})
        expect(res.statusCode).toEqual(400)
      })
    })
  })
})
