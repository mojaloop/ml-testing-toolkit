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
 * Georgi Logodazhki <georgi.logodazhki@modusbox.com>
 * Vijaya Kumar Guthi <vijaya.guthi@modusbox.com> (Original Author)
 --------------
 ******/

const request = require('supertest')
const apiServer = require('../../../../src/lib/api-server')
const app = apiServer.getApp()
const axios = require('axios').default
jest.mock('axios')
axios.mockImplementation(() => Promise.resolve(true))

describe('API route /api/samples', () => {
  describe('GET /api/samples', () => {
    it('Send a proper request', async () => {
      const res = await request(app).get(`/api/samples/load/collections`).send()
      expect(res.statusCode).toEqual(200)
    })
    it('Send a proper request with type: hub', async () => {
      const res = await request(app).get(`/api/samples/load/collections?type=hub`).send()
      expect(res.statusCode).toEqual(200)
    })
    it('Send a proper request with type: hub', async () => {
      const res = await request(app).get(`/api/samples/load/environments`).send()
      expect(res.statusCode).toEqual(200)
    })
    it('Send a bad request with type: huba', async () => {
      const res = await request(app).get(`/api/samples/load/collections?type=huba`).send()
      expect(res.statusCode).toEqual(500)
    })
  })
  describe('GET /api/samples', () => {
    it('Send a proper request with missing collections query param', async () => {
      const res = await request(app).get(`/api/samples/load`).query({
        collections: [
          'examples/collections/hub/hub_1_p2p_fundsinout_block_transfers.json',
          'examples/collections/hub/hub_2_settlements.json'
        ],
        environment: 'examples/environments/hub_local_environment.json'
      }).send()
      expect(res.statusCode).toEqual(200)
    })
    it('Send a bad request with not existing environment', async () => {
      const res = await request(app).get(`/api/samples/load`).query({
        environment: 'examples/environments/not-existing.json'
      }).send()
      expect(res.statusCode).toEqual(500)
    })
  })
})
