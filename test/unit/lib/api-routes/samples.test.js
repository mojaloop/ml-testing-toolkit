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
const loadSamples = require('../../../../src/lib/loadSamples')

const spyGetSample = jest.spyOn(loadSamples, 'getSample')
const spyGetCollectionsOrEnvironments = jest.spyOn(loadSamples, 'getCollectionsOrEnvironments')
const spyGetCollectionsOrEnvironmentsWithFileSize = jest.spyOn(loadSamples, 'getCollectionsOrEnvironmentsWithFileSize')


describe('API route /api/samples', () => {
  describe('GET /api/samples/load', () => {
    it('Send a proper request', async () => {
      spyGetSample.mockResolvedValueOnce()
      const res = await request(app).get(`/api/samples/load`).send()
      expect(res.statusCode).toEqual(200)
    })
    it('Send a proper request with type: hub', async () => {
      spyGetSample.mockRejectedValueOnce({message: ''})
      const res = await request(app).get(`/api/samples/load`).send()
      expect(res.statusCode).toEqual(500)
    })
  })
  describe('GET /api/samples', () => {
    it('Send a proper request with missing collections query param', async () => {
      spyGetCollectionsOrEnvironments.mockResolvedValueOnce()
      const res = await request(app).get(`/api/samples/load/collections`).send()
      expect(res.statusCode).toEqual(200)
    })
    it('Send a bad request with not existing environment', async () => {
      spyGetCollectionsOrEnvironments.mockRejectedValueOnce({message: ''})
      const res = await request(app).get(`/api/samples/load/collections`).send()
      expect(res.statusCode).toEqual(500)
    })
  })
  describe('GET /api/samples with file sizes', () => {
    it('Send a proper request with missing collections query param', async () => {
      spyGetCollectionsOrEnvironmentsWithFileSize.mockResolvedValueOnce()
      const res = await request(app).get(`/api/samples/list/collections`).send()
      expect(res.statusCode).toEqual(200)
    })
    it('Send a bad request with not existing environment', async () => {
      spyGetCollectionsOrEnvironmentsWithFileSize.mockRejectedValueOnce({message: ''})
      const res = await request(app).get(`/api/samples/list/collections`).send()
      expect(res.statusCode).toEqual(500)
    })
  })
})
