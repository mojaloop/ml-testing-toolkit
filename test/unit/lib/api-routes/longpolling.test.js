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

const Config = require('../../../../src/lib/config')
jest.mock('../../../../src/lib/config')
Config.getSystemConfig.mockReturnValue({
  OAUTH: {
    AUTH_ENABLED: false
  }
})

const request = require('supertest')
const apiServer = require('../../../../src/lib/api-server')
const app = apiServer.getApp()
const objectStore = require('../../../../src/lib/objectStore')
const requestLogger = require('../../../../src/lib/requestLogger')

jest.mock('../../../../src/lib/objectStore')
jest.mock('../../../../src/lib/requestLogger')
jest.setTimeout(10000);

describe('API route /longpolling/requests/*', () => {
  beforeAll(() => {
    requestLogger.logMessage.mockReturnValue()
  })
  describe('GET /longpolling/requests/123', () => {
    it('Getting stored requests', async () => {
      objectStore.popObject.mockReturnValueOnce({
        headers: {},
        body: {}
      })
      const res = await request(app).get(`/longpolling/requests/123`)
      expect(res.statusCode).toEqual(200)
      expect(res).toHaveProperty('headers')
      expect(res).toHaveProperty('body')
    })
    it('Getting empty stored requests should throw an error', async () => {
      objectStore.popObject.mockReturnValueOnce()
      let res
      try {
        res = await request(app).get(`/longpolling/requests/123`)
      } catch (error) {}
      expect(res.statusCode).toEqual(500)
    })
    it('Getting stored requests should throw an error', async () => {
      objectStore.popObject.mockImplementationOnce(() => {throw new Error()})
      const res = await request(app).get(`/longpolling/requests/123`)
      expect(res.statusCode).toEqual(500)
    })
  })
  describe('GET /longpolling/callbacks/123', () => {
    it('Getting stored callbacks', async () => {
      objectStore.popObject.mockReturnValueOnce({
        headers: {},
        body: {}
      })
      const res = await request(app).get(`/longpolling/callbacks/123`)
      expect(res.statusCode).toEqual(200)
      expect(res).toHaveProperty('headers')
      expect(res).toHaveProperty('body')
    })
    it('Getting empty stored callbacks should throw an error', async () => {
      objectStore.popObject.mockReturnValueOnce()
      let res
      try {
        res = await request(app).get(`/longpolling/callbacks/123`)
      } catch (error) {}
      expect(res.statusCode).toEqual(500)
    })
    it('Getting stored callbacks should throw an error', async () => {
      objectStore.popObject.mockImplementationOnce(() => {throw new Error()})
      const res = await request(app).get(`/longpolling/callbacks/123`)
      expect(res.statusCode).toEqual(500)
    })
  })
  describe('GET /longpolling/history/requests', () => {
    it('Gets request history', async () => {
      objectStore.getRequestsHistory.mockReturnValueOnce({
        "post /participants/MSISDN/123456789": {
          "insertedDate":1623097538472,
          "data":{
            "headers":{
              "accept":"application/vnd.interoperability.participants+json;version=1",
              "date":"Mon, 07 Jun 2021 20:17:38 GMT",
              "fspiop-source":"dfspa",
              "content-type":"application/json",
              "user-agent":"PostmanRuntime/7.26.8",
              "postman-token":"f7b6e478-1d11-48e1-ad1c-ae167a92fe3e",
              "host":"localhost:5000",
              "accept-encoding":"gzip, deflate, br",
              "connection":"keep-alive",
              "content-length":"47"},
            "body":{
              "fspId":"dfspa",
              "currency":"USD"
            }
          }
        }
      })
      const res = await request(app).get(`/longpolling/history/requests`)
      expect(res.statusCode).toEqual(200)
      expect(res).toHaveProperty('body')
    })
  })
  describe('GET /longpolling/history/callbacks', () => {
    it('Gets callback history', async () => {
      objectStore.getCallbacksHistory.mockReturnValueOnce({
        "put /participants/MSISDN/123456789":{
          "insertedDate":1623097538617,
          "data":{
            "headers":{
              "Content-Type":"application/vnd.interoperability.participants+json;version=1.1",
              "Date":"Mon, 07 Jun 2021 20:17:38 GMT",
              "X-Forwarded-For":"est velit irure",
              "FSPIOP-Source":"testingtoolkitdfsp",
              "FSPIOP-Destination":"dfspa",
              "FSPIOP-Encryption":"veniam velit cupidatat",
              "FSPIOP-Signature":"aliquip esse sint consequat",
              "FSPIOP-URI":"ex",
              "FSPIOP-HTTP-Method":"exercitation eiusmod incididunt",
              "Content-Length":"123",
              "traceparent":"00-ccdd4f128aaa3565919aa583d8d864-0123456789abcdef0-00"
            },
            "body":{
              "fspId":"voluptate au",
              "pariatur6cb":true
            }
          }
        }
      })
      const res = await request(app).get(`/longpolling/history/callbacks`)
      expect(res.statusCode).toEqual(200)
      expect(res).toHaveProperty('body')
    })
  })
})
