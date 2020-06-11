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
const config = require('../../../../src/lib/config')

describe('API route /api/settings', () => {
  describe('import more options than exported', () => {
    let exportResponse
    describe('GET /api/settings/export', () => {
      it('Send a proper request', async () => {
        exportResponse = await request(app)
          .get(`/api/settings/export`)
          .query({options: ['rules_response','rules_callback']})
          .send()
        expect(exportResponse.statusCode).toEqual(200)
      })
    })
    describe('POST /api/settings/import', () => {
      it('Send a proper request', async () => {
        const config = require('../../../../src/lib/config')
        if (Object.keys(config.getSystemConfig() ).length === 0){
          await config.loadSystemConfig()
        }
        const res = await request(app)
          .post(`/api/settings/import`)
          .query({options: ['rules_response', 'rules_callback', 'rules_validation']})
          .send({buffer: Buffer.from(exportResponse.body.body.buffer.data)})
        expect(res.statusCode).toEqual(200)
      })
    })
  })
  describe('import less options than exported', () => {
    let exportResponse
    describe('GET /api/settings/export', () => {
      it('Send a proper request', async () => {
        exportResponse = await request(app)
          .get(`/api/settings/export`)
          .query({options: ['rules_response', 'rules_callback', 'rules_validation','user_config.json']})
          .send()
        expect(exportResponse.statusCode).toEqual(200)
      })
    })
    describe('POST /api/settings/import', () => {
      it('Send a proper request', async () => {
        if (Object.keys(config.getSystemConfig() ).length === 0){
          await config.loadSystemConfig()
        }
        const res = await request(app)
          .post(`/api/settings/import`)
          .query({options: ['rules_response', 'rules_callback']})
          .send({buffer: Buffer.from(exportResponse.body.body.buffer.data)})
        expect(res.statusCode).toEqual(200)
      })
    })
  })
  describe('import the same options as exported', () => {
    let exportResponse
    describe('GET /api/settings/export', () => {
      it('Send a proper request', async () => {
        exportResponse = await request(app)
          .get(`/api/settings/export`)
          .query({options: ['rules_response', 'rules_callback', 'rules_validation','user_config.json']})
          .send()
        expect(exportResponse.statusCode).toEqual(200)
      })
      it('Send a bad request', async () => {
        const res = await request(app).get(`/api/settings/export`).send()
        expect(res.statusCode).toEqual(400)
      })
    })
    describe('POST /api/settings/import', () => {
      it('Send a proper request', async () => {
        if (Object.keys(config.getSystemConfig() ).length === 0){
          await config.loadSystemConfig()
        }
        const res = await request(app)
          .post(`/api/settings/import`)
          .query({options: ['rules_response', 'rules_callback', 'rules_validation','user_config.json']})
          .send({buffer: Buffer.from(exportResponse.body.body.buffer.data)})
        expect(res.statusCode).toEqual(200)
      })
      it('Send a bad request', async () => {
        const res = await request(app).post(`/api/settings/import`).send({})
        expect(res.statusCode).toEqual(400)
      })
    })
  })
})
