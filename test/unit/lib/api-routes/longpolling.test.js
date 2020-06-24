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
const MyEventEmitter = require('../../../../src/lib/MyEventEmitter')
const assertionStore = require('../../../../src/lib/assertionStore')
const SpyPopRequest = jest.spyOn(assertionStore, 'popRequest')
const SpyPopCallback = jest.spyOn(assertionStore, 'popCallback')

const SpyGetAssertionRequestEmitter = jest.spyOn(MyEventEmitter, 'getAssertionRequestEmitter')
jest.setTimeout(10000);

describe('API route /longpolling/requests/*', () => {
  describe('GET /longpolling/requests/123', () => {
    it('Getting stored requests', async () => {
      SpyPopRequest.mockResolvedValueOnce({
        headers: {},
        body: {}
      })
      const res = await request(app).get(`/longpolling/requests/123`)
      expect(res.statusCode).toEqual(200)
      expect(res).toHaveProperty('headers')
      expect(res).toHaveProperty('body')
    })
    it('Getting empty stored requests should throw an error', async () => {
      SpyPopRequest.mockResolvedValueOnce()
      let res
      try {
        res = await request(app).get(`/longpolling/requests/123`)
      } catch (error) {}
      expect(res.statusCode).toEqual(500)
    })
    it('Getting stored requests should throw an error', async () => {
      SpyPopRequest.mockRejectedValueOnce()
      const res = await request(app).get(`/longpolling/requests/123`)
      expect(res.statusCode).toEqual(404)
    })
  })
  describe('GET /longpolling/callbacks/123', () => {
    it('Getting stored callbacks', async () => {
      SpyPopCallback.mockResolvedValueOnce({
        headers: {},
        body: {}
      })
      const res = await request(app).get(`/longpolling/callbacks/123`)
      expect(res.statusCode).toEqual(200)
      expect(res).toHaveProperty('headers')
      expect(res).toHaveProperty('body')
    })
    it('Getting empty stored callbacks should throw an error', async () => {
      SpyPopCallback.mockResolvedValueOnce()
      let res
      try {
        res = await request(app).get(`/longpolling/callbacks/123`)
      } catch (error) {}
      expect(res.statusCode).toEqual(500)
    })
    it('Getting stored callbacks should throw an error', async () => {
      SpyPopCallback.mockRejectedValueOnce()
      const res = await request(app).get(`/longpolling/callbacks/123`)
      expect(res.statusCode).toEqual(404)
    })
  })
 
})
