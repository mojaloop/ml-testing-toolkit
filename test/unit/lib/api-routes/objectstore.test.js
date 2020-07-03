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
const objectStore = require('../../../../src/lib/objectStore')

const SpyGet = jest.spyOn(objectStore, 'get')
const SpySet = jest.spyOn(objectStore, 'set')

describe('API route /api/objectstore', () => {
  describe('GET /api/objectstore/:object', () => {
    it('should not throw if the object is retrieved', async () => {
      SpyGet.mockReturnValueOnce({})
      const res = await request(app).get(`/api/objectstore/inboundEnvironment`)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toBeDefined()
    })
    it('should throw an error if there is an issue getting the inboundEnvironment', async () => {
      SpyGet.mockImplementationOnce(() => {throw new Error()})
      const res = await request(app).get(`/api/objectstore/inboundEnvironment`)
      expect(res.statusCode).toEqual(500)
    })
  })
  describe('DELETE /api/objectstore/:object', () => {
    it('should not throw if the object is deleted', async () => {
      SpySet.mockReturnValueOnce()
      const res = await request(app).delete(`/api/objectstore/inboundEnvironment`)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toStrictEqual({})
    })
    it('should throw an error if there is an issue deleting the inboundEnvironment', async () => {
      SpySet.mockImplementationOnce(() => {throw new Error()})
      const res = await request(app).delete(`/api/objectstore/inboundEnvironment`)
      expect(res.statusCode).toEqual(500)
    })
  })
})
