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

const request = require('supertest')
const apiServer = require('../../../../src/lib/api-server')
const app = apiServer.getApp()
const Server = require('../../../../src/server')
const ImportExport = require('../../../../src/lib/importExport')
const Config = require('../../../../src/lib/config')
const RulesEngineModel = require('../../../../src/lib/rulesEngineModel')

const SpyServer = jest.spyOn(Server, 'restartServer')
const SpyImportSpecFiles = jest.spyOn(ImportExport, 'importSpecFiles')
const SpyExportSpecFiles = jest.spyOn(ImportExport, 'exportSpecFiles')
const SpyGetUserConfig = jest.spyOn(Config, 'getUserConfig')
const SpyGetStoredUserConfig = jest.spyOn(Config, 'getStoredUserConfig')
const SpyLoadUserConfig = jest.spyOn(Config, 'loadUserConfig')
const SpyReloadResponseRules = jest.spyOn(RulesEngineModel, 'reloadResponseRules')
const SpyReloadCallbackRules = jest.spyOn(RulesEngineModel, 'reloadCallbackRules')
const SpyReloadValidationRules = jest.spyOn(RulesEngineModel, 'reloadValidationRules')

describe('API route /api/settings', () => {
  describe('import', () => {
    describe('GET /api/settings/export', () => {
      it('Send a proper request', async () => {
        const options = ['rules_response','rules_callback']
        SpyExportSpecFiles.mockResolvedValueOnce()
        const exportResponse = await request(app)
          .get(`/api/settings/export`)
          .query({options})
          .send()
        expect(exportResponse.statusCode).toEqual(200)
      })
      it('Send a bad request - no options', async () => {
        SpyExportSpecFiles.mockResolvedValueOnce()
        const exportResponse = await request(app)
          .get(`/api/settings/export`)
          .send()
        expect(exportResponse.statusCode).toEqual(400)
      })
      it('Send a bad request - export spec files fails', async () => {
        const options = ['rules_response','rules_callback']
        SpyExportSpecFiles.mockRejectedValueOnce()
        const exportResponse = await request(app)
          .get(`/api/settings/export`)
          .query({options})
          .send()
        expect(exportResponse.statusCode).toEqual(404)
      })
    })
    describe('POST /api/settings/import', () => {
      it('Send a proper request with INBOUND_MUTUAL_TLS_ENABLED: false', async () => {
        SpyReloadResponseRules.mockResolvedValueOnce()
        SpyReloadCallbackRules.mockResolvedValueOnce()
        SpyReloadValidationRules.mockResolvedValueOnce()
        SpyGetUserConfig.mockResolvedValueOnce({INBOUND_MUTUAL_TLS_ENABLED: true})
        SpyGetStoredUserConfig.mockResolvedValueOnce({INBOUND_MUTUAL_TLS_ENABLED: false})
        SpyLoadUserConfig.mockResolvedValueOnce()
        SpyServer.mockResolvedValueOnce()
        const options = ['rules_response','rules_callback','rules_validation','user_config.json']
        SpyImportSpecFiles.mockResolvedValueOnce()
        const res = await request(app)
          .post(`/api/settings/import`)
          .query({options})
          .send({buffer: Buffer.from([])})
        expect(res.statusCode).toEqual(200)
      })
      it('Send a proper request with INBOUND_MUTUAL_TLS_ENABLED: true', async () => {
        SpyReloadResponseRules.mockResolvedValueOnce()
        SpyReloadCallbackRules.mockResolvedValueOnce()
        SpyReloadValidationRules.mockResolvedValueOnce()
        SpyGetUserConfig.mockResolvedValueOnce({INBOUND_MUTUAL_TLS_ENABLED: true})
        SpyGetStoredUserConfig.mockResolvedValueOnce({INBOUND_MUTUAL_TLS_ENABLED: true})
        SpyLoadUserConfig.mockResolvedValueOnce()
        const options = ['rules_response','rules_callback','rules_validation','user_config.json']
        SpyImportSpecFiles.mockResolvedValueOnce()
        const res = await request(app)
          .post(`/api/settings/import`)
          .query({options})
          .send({buffer: Buffer.from([])})
        expect(res.statusCode).toEqual(200)
      })
      it('Send a bad request - import spec files fails', async () => {
        const options = ['rules_response','rules_callback','rules_validation','user_config.json']
        SpyImportSpecFiles.mockRejectedValueOnce({message: ''})
        const res = await request(app)
          .post(`/api/settings/import`)
          .query({options})
          .send({buffer: Buffer.from([])})
        expect(res.statusCode).toEqual(400)
      })
    })
  })
})
