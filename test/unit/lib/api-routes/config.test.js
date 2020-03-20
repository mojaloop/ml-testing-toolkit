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



describe('API route /config', () => {
  describe('GET /api/config/user', () => {
    it('Getting config', async () => {
      const res = await request(app).get(`/api/config/user`)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('runtime')
      expect(res.body).toHaveProperty('stored')
    })
  })
  describe('PUT /api/config/user', () => {
    let userConfig, newConfig
    it('Get Stored Config', async () => {
      const res = await request(app).get(`/api/config/user`)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('runtime')
      expect(res.body).toHaveProperty('stored')
      expect(res.body.stored).toHaveProperty('CALLBACK_ENDPOINT')
      userConfig = res.body.stored
    })
    it('Set new Config', async () => {
      newConfig = JSON.parse(JSON.stringify(userConfig))
      newConfig.CALLBACK_ENDPOINT = 'test'
      const res = await request(app).put(`/api/config/user`).send(newConfig)
      expect(res.statusCode).toEqual(200)
    })
    it('Set new Config without CALLBACK_ENDPOINT', async () => {
      const {CALLBACK_ENDPOINT, ...wrongConfig} = userConfig
      const res = await request(app).put(`/api/config/user`).send(wrongConfig)
      expect(res.statusCode).toEqual(422)
    })
    it('Get Stored Config again', async () => {
      const res = await request(app).get(`/api/config/user`)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('runtime')
      expect(res.body).toHaveProperty('stored')
      expect(res.body.stored).toHaveProperty('CALLBACK_ENDPOINT')
      expect(res.body.stored.CALLBACK_ENDPOINT).toEqual('test')
    })
    it('Set old Config', async () => {
      const res = await request(app).put(`/api/config/user`).send(userConfig)
      expect(res.statusCode).toEqual(200)
    })
  })
})
