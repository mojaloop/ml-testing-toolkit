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
const app = require('../../../../src/lib/api-server').getApp()



describe('API route /api/rules', () => {
  describe('Validation Rules', () => {
    describe('GET /api/rules/files/validation', () => {
      it('Getting all rules files', async () => {
        const res = await request(app).get(`/api/rules/files/validation`)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('files')
        expect(res.body).toHaveProperty('activeRulesFile')
      })
    })
    describe('GET /api/rules/files/validation/:fileName', () => {
      let activeRulesFile
      it('Getting all rules files', async () => {
        const res = await request(app).get(`/api/rules/files/validation`)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('files')
        expect(res.body).toHaveProperty('activeRulesFile')
        activeRulesFile = res.body.activeRulesFile
      })
      it('Getting the activated rule file', async () => {
        const res = await request(app).get(`/api/rules/files/validation/${activeRulesFile}`)
        expect(res.statusCode).toEqual(200)
        expect(Array.isArray(res.body)).toBe(true)
      })
    })
    describe('PUT /api/rules/files/validation/:fileName', () => {
      it('Create a test file with wrong content', async () => {
        const res = await request(app).put(`/api/rules/files/validation/test1.json`).send({})
        expect(res.statusCode).toEqual(422)
      })
      it('Create a test file', async () => {
        const res = await request(app).put(`/api/rules/files/validation/test1.json`).send([])
        expect(res.statusCode).toEqual(200)
      })
      it('Getting the test rule file', async () => {
        const res = await request(app).get(`/api/rules/files/validation/test1.json`)
        expect(res.statusCode).toEqual(200)
        expect(Array.isArray(res.body)).toBe(true)
      })
      it('Getting the wrong rule file', async () => {
        const res = await request(app).get(`/api/rules/files/validation/test2.json`)
        expect(res.statusCode).toEqual(500)
      })
    })
    describe('UPDATE /api/rules/files/validation', () => {
      it('Update active rules file', async () => {
        const res = await request(app).put(`/api/rules/files/validation`)
          .send({
            type: 'activeRulesFile',
            fileName: 'test1.json'
          })
        expect(res.statusCode).toEqual(200)
      })
      it('Checking active rules file is test1.json', async () => {
        const res = await request(app).get(`/api/rules/files/validation`)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('files')
        expect(res.body).toHaveProperty('activeRulesFile')
        expect(res.body.activeRulesFile).toEqual('test1.json')
      })
      it('Restore active rules file to default', async () => {
        const res = await request(app).put(`/api/rules/files/validation`)
          .send({
            type: 'activeRulesFile',
            fileName: 'default.json'
          })
        expect(res.statusCode).toEqual(200)
      })
    })
    it('Update active rules file, wrong format', async () => {
      const res = await request(app).put(`/api/rules/files/validation`)
        .send({
          type: 'activeRulesWrong',
          fileName: 'test1.json'
        })
      expect(res.statusCode).toEqual(500)
    })
    describe('DELETE /api/rules/files/validation/:fileName', () => {
      it('Delete the test file', async () => {
        const res = await request(app).delete(`/api/rules/files/validation/test1.json`)
        expect(res.statusCode).toEqual(200)
      })
      it('Getting the test rule file which is deleted', async () => {
        const res = await request(app).get(`/api/rules/files/validation/test1.json`)
        expect(res.statusCode).toEqual(500)
      })
    })
  })

  describe('Callback Rules', () => {
    describe('GET /api/rules/files/callback', () => {
      it('Getting all rules files', async () => {
        const res = await request(app).get(`/api/rules/files/callback`)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('files')
        expect(res.body).toHaveProperty('activeRulesFile')
      })
    })
    describe('GET /api/rules/files/callback/:fileName', () => {
      let activeRulesFile
      it('Getting all rules files', async () => {
        const res = await request(app).get(`/api/rules/files/callback`)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('files')
        expect(res.body).toHaveProperty('activeRulesFile')
        activeRulesFile = res.body.activeRulesFile
      })
      it('Getting the activated rule file', async () => {
        const res = await request(app).get(`/api/rules/files/callback/${activeRulesFile}`)
        expect(res.statusCode).toEqual(200)
        expect(Array.isArray(res.body)).toBe(true)
      })
    })
    describe('PUT /api/rules/files/callback/:fileName', () => {
      it('Create a test file', async () => {
        const res = await request(app).put(`/api/rules/files/callback/test1.json`).send([])
        expect(res.statusCode).toEqual(200)
      })
      it('Getting the test rule file', async () => {
        const res = await request(app).get(`/api/rules/files/callback/test1.json`)
        expect(res.statusCode).toEqual(200)
        expect(Array.isArray(res.body)).toBe(true)
      })
      it('Getting the wrong rule file', async () => {
        const res = await request(app).get(`/api/rules/files/callback/test2.json`)
        expect(res.statusCode).toEqual(500)
      })
    })
    describe('UPDATE /api/rules/files/callback', () => {
      it('Update active rules file', async () => {
        const res = await request(app).put(`/api/rules/files/callback`)
          .send({
            type: 'activeRulesFile',
            fileName: 'test1.json'
          })
        expect(res.statusCode).toEqual(200)
      })
      it('Checking active rules file is test1.json', async () => {
        const res = await request(app).get(`/api/rules/files/callback`)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('files')
        expect(res.body).toHaveProperty('activeRulesFile')
        expect(res.body.activeRulesFile).toEqual('test1.json')
      })
      it('Restore active rules file to default', async () => {
        const res = await request(app).put(`/api/rules/files/callback`)
          .send({
            type: 'activeRulesFile',
            fileName: 'default.json'
          })
        expect(res.statusCode).toEqual(200)
      })
      it('Update active rules file, wrong format', async () => {
        const res = await request(app).put(`/api/rules/files/callback`)
          .send({
            type: 'activeRulesWrong',
            fileName: 'test1.json'
          })
        expect(res.statusCode).toEqual(500)
      })
    })
    describe('DELETE /api/rules/files/callback/:fileName', () => {
      it('Delete the test file', async () => {
        const res = await request(app).delete(`/api/rules/files/callback/test1.json`)
        expect(res.statusCode).toEqual(200)
      })
      it('Getting the test rule file which is deleted', async () => {
        const res = await request(app).get(`/api/rules/files/callback/test1.json`)
        expect(res.statusCode).toEqual(500)
      })
    })
  })

  describe('Response Rules', () => {
    describe('GET /api/rules/files/response', () => {
      it('Getting all rules files', async () => {
        const res = await request(app).get(`/api/rules/files/response`)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('files')
        expect(res.body).toHaveProperty('activeRulesFile')
      })
    })
    describe('GET /api/rules/files/response/:fileName', () => {
      let activeRulesFile
      it('Getting all rules files', async () => {
        const res = await request(app).get(`/api/rules/files/response`)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('files')
        expect(res.body).toHaveProperty('activeRulesFile')
        activeRulesFile = res.body.activeRulesFile
      })
      it('Getting the activated rule file', async () => {
        const res = await request(app).get(`/api/rules/files/response/${activeRulesFile}`)
        expect(res.statusCode).toEqual(200)
        expect(Array.isArray(res.body)).toBe(true)
      })
    })
    describe('PUT /api/rules/files/response/:fileName', () => {
      it('Create a test file', async () => {
        const res = await request(app).put(`/api/rules/files/response/test1.json`).send([])
        expect(res.statusCode).toEqual(200)
      })
      it('Getting the test rule file', async () => {
        const res = await request(app).get(`/api/rules/files/response/test1.json`)
        expect(res.statusCode).toEqual(200)
        expect(Array.isArray(res.body)).toBe(true)
      })
      it('Getting the wrong rule file', async () => {
        const res = await request(app).get(`/api/rules/files/response/test2.json`)
        expect(res.statusCode).toEqual(500)
      })
    })
    describe('UPDATE /api/rules/files/response', () => {
      it('Update active rules file', async () => {
        const res = await request(app).put(`/api/rules/files/response`)
          .send({
            type: 'activeRulesFile',
            fileName: 'test1.json'
          })
        expect(res.statusCode).toEqual(200)
      })
      it('Checking active rules file is test1.json', async () => {
        const res = await request(app).get(`/api/rules/files/response`)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('files')
        expect(res.body).toHaveProperty('activeRulesFile')
        expect(res.body.activeRulesFile).toEqual('test1.json')
      })
      it('Restore active rules file to default', async () => {
        const res = await request(app).put(`/api/rules/files/response`)
          .send({
            type: 'activeRulesFile',
            fileName: 'default.json'
          })
        expect(res.statusCode).toEqual(200)
      })
      it('Update active rules file, wrong format', async () => {
        const res = await request(app).put(`/api/rules/files/response`)
          .send({
            type: 'activeRulesWrong',
            fileName: 'test1.json'
          })
        expect(res.statusCode).toEqual(500)
      })
    })
    describe('DELETE /api/rules/files/response/:fileName', () => {
      it('Delete the test file', async () => {
        const res = await request(app).delete(`/api/rules/files/response/test1.json`)
        expect(res.statusCode).toEqual(200)
      })
      it('Getting the test rule file which is deleted', async () => {
        const res = await request(app).get(`/api/rules/files/response/test1.json`)
        expect(res.statusCode).toEqual(500)
      })
    })
  })
})
