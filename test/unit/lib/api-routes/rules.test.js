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

const Config = require('../../../../src/lib/config')
jest.mock('../../../../src/lib/config')
Config.getSystemConfig.mockReturnValue({
  OAUTH: {
    AUTH_ENABLED: false
  }
})

const request = require('supertest')
const app = require('../../../../src/lib/api-server').getApp()
const RulesEngineModel = require('../../../../src/lib/rulesEngineModel')
const requestLogger = require('../../../../src/lib/requestLogger')
const ImportExport = require('../../../../src/lib/importExport')

jest.mock('../../../../src/lib/requestLogger')
jest.mock('../../../../src/lib/rulesEngineModel')
jest.mock('../../../../src/lib/importExport')


describe('API route /api/rules', () => {
  beforeAll(() => {
    jest.resetAllMocks()
    requestLogger.logMessage.mockReturnValue()
  })
  afterEach(() => {
    jest.resetAllMocks()
  })
  describe('Validation Rules', () => {
    describe('GET /api/rules/files/validation', () => {
      it('Getting all rules files', async () => {
        RulesEngineModel.getValidationRulesFiles.mockResolvedValueOnce([])
        const res = await request(app).get(`/api/rules/files/validation`)
        expect(res.statusCode).toEqual(200)
        expect(Array.isArray(res.body)).toBeTruthy()
      })
      it('Getting all rules files fails if there is an error', async () => {
        RulesEngineModel.getValidationRulesFiles.mockRejectedValueOnce({})
        const res = await request(app).get(`/api/rules/files/validation`)
        expect(res.statusCode).toEqual(500)
      })
    })
    describe('GET /api/rules/files/validation/:fileName', () => {
      it('Getting the activated rule file', async () => {
        RulesEngineModel.getValidationRulesFileContent.mockResolvedValueOnce([])
        const res = await request(app).get(`/api/rules/files/validation/test`)
        expect(res.statusCode).toEqual(200)
        expect(Array.isArray(res.body)).toBeTruthy()
      })
      it('Getting the activated rule file fails if there is an error', async () => {
        RulesEngineModel.getValidationRulesFileContent.mockRejectedValueOnce([])
        const res = await request(app).get(`/api/rules/files/validation/test`)
        expect(res.statusCode).toEqual(500)
        expect(Array.isArray(res.body)).not.toBeTruthy()
      })
    })
    describe('PUT /api/rules/files/validation', () => {
      it('set an active rules file', async () => {
        RulesEngineModel.setActiveValidationRulesFile.mockResolvedValueOnce()
        const res = await request(app).put('/api/rules/files/validation').send({
          type: 'activeRulesFile'
        })
        expect(res.statusCode).toEqual(200)
      })
      it('Create a test file with wrong content', async () => {
        const res = await request(app).put('/api/rules/files/validation').send({
          type: 'NotActiveRulesFile'
        })
        expect(res.statusCode).toEqual(500)
      })
      it('Create a test file', async () => {
        RulesEngineModel.setActiveValidationRulesFile.mockRejectedValueOnce({})
        const res = await request(app).put('/api/rules/files/validation').send({
          type: 'activeRulesFile'
        })
        expect(res.statusCode).toEqual(500)
      })
    })
    describe('PUT /api/rules/files/validation/:fileName', () => {
      it('Create a test file', async () => {
        RulesEngineModel.setValidationRulesFileContent.mockResolvedValueOnce()
        const res = await request(app).put(`/api/rules/files/validation/test1.json`).send([])
        expect(res.statusCode).toEqual(200)
      })
      it('Create a test file fails if there is an error', async () => {
        RulesEngineModel.setValidationRulesFileContent.mockRejectedValueOnce({})
        const res = await request(app).put(`/api/rules/files/validation/test1.json`).send([])
        expect(res.statusCode).toEqual(500)
      })
    })
    describe('DELETE /api/rules/files/validation/:fileName', () => {
      it('Delete the test file', async () => {
        RulesEngineModel.deleteValidationRulesFile.mockResolvedValueOnce()
        const res = await request(app).delete(`/api/rules/files/validation/test1.json`)
        expect(res.statusCode).toEqual(200)
      })
      it('Delete the test file fails if there is an error', async () => {
        RulesEngineModel.deleteValidationRulesFile.mockRejectedValueOnce({})
        const res = await request(app).delete(`/api/rules/files/validation/test1.json`)
        expect(res.statusCode).toEqual(500)
      })
    })
    describe('GET /export/rules_validation', () => {
      it('Retrieves file from rules validation storage ', async () => {
        ImportExport.exportSpecFile.mockResolvedValueOnce()
        const res = await request(app).get(`/api/rules/export/rules_validation?rulesFilename=test.json`)
        expect(res.statusCode).toEqual(200)
        expect(ImportExport.exportSpecFile).toBeCalledWith(
          'rules_validation/test.json', undefined
        )
      })
    })
    describe('POST /import/rules_validation', () => {
      it('Calls function to import file', async () => {
        ImportExport.importSpecFile.mockResolvedValueOnce()
        const rulesFilename = 'test.json'
        const res = await request(app)
          .post('/api/rules/import/rules_validation')
          .query({rulesFilename})
          .send({buffer: Buffer.from([])})
        expect(res.statusCode).toEqual(200)
        expect(ImportExport.importSpecFile).toBeCalledWith(
          expect.any(Object),
          'rules_validation/test.json',
          undefined
        )
      })
    })
  })

  describe('Forward Rules', () => {
    describe('GET /api/rules/files/forward', () => {
      it('Getting all rules files', async () => {
        RulesEngineModel.getForwardRulesFiles.mockResolvedValueOnce([])
        const res = await request(app).get(`/api/rules/files/forward`)
        expect(res.statusCode).toEqual(200)
        expect(Array.isArray(res.body)).toBeTruthy()
      })
      it('Getting all rules files fails if there is an error', async () => {
        RulesEngineModel.getForwardRulesFiles.mockRejectedValueOnce({})
        const res = await request(app).get(`/api/rules/files/forward`)
        expect(res.statusCode).toEqual(500)
      })
    })
    describe('GET /api/rules/files/forward/:fileName', () => {
      it('Getting the activated rule file', async () => {
        RulesEngineModel.getForwardRulesFileContent.mockResolvedValueOnce([])
        const res = await request(app).get(`/api/rules/files/forward/test`)
        expect(res.statusCode).toEqual(200)
        expect(Array.isArray(res.body)).toBeTruthy()
      })
      it('Getting the activated rule file fails if there is an error', async () => {
        RulesEngineModel.getForwardRulesFileContent.mockRejectedValueOnce([])
        const res = await request(app).get(`/api/rules/files/forward/test`)
        expect(res.statusCode).toEqual(500)
        expect(Array.isArray(res.body)).not.toBeTruthy()
      })
    })
    describe('PUT /api/rules/files/forward', () => {
      it('set an active rules file', async () => {
        RulesEngineModel.setActiveForwardRulesFile.mockResolvedValueOnce()
        const res = await request(app).put('/api/rules/files/forward').send({
          type: 'activeRulesFile'
        })
        expect(res.statusCode).toEqual(200)
      })
      it('Create a test file with wrong content', async () => {
        const res = await request(app).put('/api/rules/files/forward').send({
          type: 'NotActiveRulesFile'
        })
        expect(res.statusCode).toEqual(500)
      })
      it('Create a test file', async () => {
        RulesEngineModel.setActiveForwardRulesFile.mockRejectedValueOnce({})
        const res = await request(app).put('/api/rules/files/forward').send({
          type: 'activeRulesFile'
        })
        expect(res.statusCode).toEqual(500)
      })
    })
    describe('PUT /api/rules/files/callback/:fileName', () => {
      it('Create a test file', async () => {
        RulesEngineModel.setForwardRulesFileContent.mockResolvedValueOnce()
        const res = await request(app).put(`/api/rules/files/forward/test1.json`).send([])
        expect(res.statusCode).toEqual(200)
      })
      it('Create a test file fails if there is an error', async () => {
        RulesEngineModel.setForwardRulesFileContent.mockRejectedValueOnce({})
        const res = await request(app).put(`/api/rules/files/forward/test1.json`).send([])
        expect(res.statusCode).toEqual(500)
      })
    })
    describe('DELETE /api/rules/files/forward/:fileName', () => {
      it('Delete the test file', async () => {
        RulesEngineModel.deleteForwardRulesFile.mockResolvedValueOnce()
        const res = await request(app).delete(`/api/rules/files/forward/test1.json`)
        expect(res.statusCode).toEqual(200)
      })
      it('Delete the test file fails if there is an error', async () => {
        RulesEngineModel.deleteForwardRulesFile.mockRejectedValueOnce({})
        const res = await request(app).delete(`/api/rules/files/forward/test1.json`)
        expect(res.statusCode).toEqual(500)
      })
    })
  })

  describe('Callback Rules', () => {
    describe('GET /api/rules/files/callback', () => {
      it('Getting all rules files', async () => {
        RulesEngineModel.getCallbackRulesFiles.mockResolvedValueOnce([])
        const res = await request(app).get(`/api/rules/files/callback`)
        expect(res.statusCode).toEqual(200)
        expect(Array.isArray(res.body)).toBeTruthy()
      })
      it('Getting all rules files fails if there is an error', async () => {
        RulesEngineModel.getCallbackRulesFiles.mockRejectedValueOnce({})
        const res = await request(app).get(`/api/rules/files/callback`)
        expect(res.statusCode).toEqual(500)
      })
    })
    describe('GET /api/rules/files/callback/:fileName', () => {
      it('Getting the activated rule file', async () => {
        RulesEngineModel.getCallbackRulesFileContent.mockResolvedValueOnce([])
        const res = await request(app).get(`/api/rules/files/callback/test`)
        expect(res.statusCode).toEqual(200)
        expect(Array.isArray(res.body)).toBeTruthy()
      })
      it('Getting the activated rule file fails if there is an error', async () => {
        RulesEngineModel.getCallbackRulesFileContent.mockRejectedValueOnce([])
        const res = await request(app).get(`/api/rules/files/callback/test`)
        expect(res.statusCode).toEqual(500)
        expect(Array.isArray(res.body)).not.toBeTruthy()
      })
    })
    describe('PUT /api/rules/files/callback', () => {
      it('set an active rules file', async () => {
        RulesEngineModel.setActiveCallbackRulesFile.mockResolvedValueOnce()
        const res = await request(app).put('/api/rules/files/callback').send({
          type: 'activeRulesFile'
        })
        expect(res.statusCode).toEqual(200)
      })
      it('Create a test file with wrong content', async () => {
        const res = await request(app).put('/api/rules/files/callback').send({
          type: 'NotActiveRulesFile'
        })
        expect(res.statusCode).toEqual(500)
      })
      it('Create a test file', async () => {
        RulesEngineModel.setActiveCallbackRulesFile.mockRejectedValueOnce({})
        const res = await request(app).put('/api/rules/files/callback').send({
          type: 'activeRulesFile'
        })
        expect(res.statusCode).toEqual(500)
      })
    })
    describe('PUT /api/rules/files/callback/:fileName', () => {
      it('Create a test file', async () => {
        RulesEngineModel.setCallbackRulesFileContent.mockResolvedValueOnce()
        const res = await request(app).put(`/api/rules/files/callback/test1.json`).send([])
        expect(res.statusCode).toEqual(200)
      })
      it('Create a test file fails if there is an error', async () => {
        RulesEngineModel.setCallbackRulesFileContent.mockRejectedValueOnce({})
        const res = await request(app).put(`/api/rules/files/callback/test1.json`).send([])
        expect(res.statusCode).toEqual(500)
      })
    })
    describe('DELETE /api/rules/files/callback/:fileName', () => {
      it('Delete the test file', async () => {
        RulesEngineModel.deleteCallbackRulesFile.mockResolvedValueOnce()
        const res = await request(app).delete(`/api/rules/files/callback/test1.json`)
        expect(res.statusCode).toEqual(200)
      })
      it('Delete the test file fails if there is an error', async () => {
        RulesEngineModel.deleteCallbackRulesFile.mockRejectedValueOnce({})
        const res = await request(app).delete(`/api/rules/files/callback/test1.json`)
        expect(res.statusCode).toEqual(500)
      })
    })
    describe('GET /export/rules_callback', () => {
      it('Retrieves file from rules callback storage ', async () => {
        ImportExport.exportSpecFile.mockResolvedValueOnce()
        const res = await request(app).get(`/api/rules/export/rules_callback?rulesFilename=test.json`)
        expect(res.statusCode).toEqual(200)
        expect(ImportExport.exportSpecFile).toBeCalledWith(
          'rules_callback/test.json', undefined
        )
      })
    })
    describe('POST /import/rules_callback', () => {
      it('Calls function to import file', async () => {
        ImportExport.importSpecFile.mockResolvedValueOnce()
        const rulesFilename = 'test.json'
        const res = await request(app)
          .post('/api/rules/import/rules_callback')
          .query({rulesFilename})
          .send({buffer: Buffer.from([])})
        expect(res.statusCode).toEqual(200)
        expect(ImportExport.importSpecFile).toBeCalledWith(
          expect.any(Object),
          'rules_callback/test.json',
          undefined
        )
      })
    })
  })

  describe('Response Rules', () => {
    describe('GET /api/rules/files/response', () => {
      it('Getting all rules files', async () => {
        RulesEngineModel.getResponseRulesFiles.mockResolvedValueOnce([])
        const res = await request(app).get(`/api/rules/files/response`)
        expect(res.statusCode).toEqual(200)
        expect(Array.isArray(res.body)).toBeTruthy()
      })
      it('Getting all rules files fails if there is an error', async () => {
        RulesEngineModel.getResponseRulesFiles.mockRejectedValueOnce({})
        const res = await request(app).get(`/api/rules/files/response`)
        expect(res.statusCode).toEqual(500)
      })
    })
    describe('GET /api/rules/files/response/:fileName', () => {
      it('Getting the activated rule file', async () => {
        RulesEngineModel.getResponseRulesFileContent.mockResolvedValueOnce([])
        const res = await request(app).get(`/api/rules/files/response/test`)
        expect(res.statusCode).toEqual(200)
        expect(Array.isArray(res.body)).toBeTruthy()
      })
      it('Getting the activated rule file fails if there is an error', async () => {
        RulesEngineModel.getResponseRulesFileContent.mockRejectedValueOnce([])
        const res = await request(app).get(`/api/rules/files/response/test`)
        expect(res.statusCode).toEqual(500)
        expect(Array.isArray(res.body)).not.toBeTruthy()
      })
    })
    describe('PUT /api/rules/files/response', () => {
      it('set an active rules file', async () => {
        RulesEngineModel.setActiveResponseRulesFile.mockResolvedValueOnce()
        const res = await request(app).put('/api/rules/files/response').send({
          type: 'activeRulesFile'
        })
        expect(res.statusCode).toEqual(200)
      })
      it('Create a test file with wrong content', async () => {
        const res = await request(app).put('/api/rules/files/response').send({
          type: 'NotActiveRulesFile'
        })
        expect(res.statusCode).toEqual(500)
      })
      it('Create a test file', async () => {
        RulesEngineModel.setActiveResponseRulesFile.mockRejectedValueOnce({})
        const res = await request(app).put('/api/rules/files/response').send({
          type: 'activeRulesFile'
        })
        expect(res.statusCode).toEqual(500)
      })
    })
    describe('PUT /api/rules/files/response/:fileName', () => {
      it('Create a test file', async () => {
        RulesEngineModel.setResponseRulesFileContent.mockResolvedValueOnce()
        const res = await request(app).put(`/api/rules/files/response/test1.json`).send([])
        expect(res.statusCode).toEqual(200)
      })
      it('Create a test file fails if there is an error', async () => {
        RulesEngineModel.setResponseRulesFileContent.mockRejectedValueOnce({})
        const res = await request(app).put(`/api/rules/files/response/test1.json`).send([])
        expect(res.statusCode).toEqual(500)
      })
    })
    describe('DELETE /api/rules/files/response/:fileName', () => {
      it('Delete the test file', async () => {
        RulesEngineModel.deleteResponseRulesFile.mockResolvedValueOnce()
        const res = await request(app).delete(`/api/rules/files/response/test1.json`)
        expect(res.statusCode).toEqual(200)
      })
      it('Delete the test file fails if there is an error', async () => {
        RulesEngineModel.deleteResponseRulesFile.mockRejectedValueOnce({})
        const res = await request(app).delete(`/api/rules/files/response/test1.json`)
        expect(res.statusCode).toEqual(500)
      })
    })
    describe('GET /export/rules_response', () => {
      it('Retrieves file from rules response storage ', async () => {
        ImportExport.exportSpecFile.mockResolvedValueOnce()
        const res = await request(app).get(`/api/rules/export/rules_response?rulesFilename=test.json`)
        expect(res.statusCode).toEqual(200)
        expect(ImportExport.exportSpecFile).toBeCalledWith(
          'rules_response/test.json', undefined
        )
      })
    })
    describe('POST /import/rules_response', () => {
      it('Calls function to import file', async () => {
        ImportExport.importSpecFile.mockResolvedValueOnce()
        const rulesFilename = 'test.json'
        const res = await request(app)
          .post('/api/rules/import/rules_response')
          .query({rulesFilename})
          .send({buffer: Buffer.from([])})
        expect(res.statusCode).toEqual(200)
        expect(ImportExport.importSpecFile).toBeCalledWith(
          expect.any(Object),
          'rules_response/test.json',
          undefined
        )
      })
    })
  })
})
