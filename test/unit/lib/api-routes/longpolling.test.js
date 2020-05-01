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
const apiServer = require('../../../../src/lib/api-server')
const assertionStore = require('../../../../src/lib/assertionStore')
jest.mock('../../../../src/lib/assertionStore')

assertionStore.popRequest.mockImplementation(() => Promise.resolve({
  headers: {},
  body: {}
})) 
assertionStore.popCallback.mockImplementation(() => Promise.resolve({
  headers: {},
  body: {}
})) 

const app = apiServer.getApp()
jest.setTimeout(30000)

describe('API route /longpolling/requests/*', () => {
  describe('GET /longpolling/requests/123', () => {
    it('Getting stored requests', async () => {
      const res = await request(app).get(`/longpolling/requests/123`)
      expect(res.statusCode).toEqual(200)
      expect(res).toHaveProperty('headers')
      expect(res).toHaveProperty('body')
    })
  })
  describe('GET /longpolling/callbacks/123', () => {
    it('Getting stored callbacks', async () => {
      const res = await request(app).get(`/longpolling/callbacks/123`)
      expect(res.statusCode).toEqual(200)
      expect(res).toHaveProperty('headers')
      expect(res).toHaveProperty('body')
    })
  })
 
})
