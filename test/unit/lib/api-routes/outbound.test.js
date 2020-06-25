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
const Config = require('../../../../src/lib/config')
const OutboundInitiator = require('../../../../src/lib/test-outbound/outbound-initiator')

const SpyGetUserConfig = jest.spyOn(Config, 'getUserConfig')
const SpyTerminateOutbound = jest.spyOn(OutboundInitiator, 'terminateOutbound')
const SpyOutboundSend = jest.spyOn(OutboundInitiator, 'OutboundSend')

jest.mock('axios')


describe('API route /api/outbound', () => {
  describe('POST /api/outbound/request', () => {
    it('Send a proper request', async () => {
      axios.mockImplementationOnce(() => Promise.resolve(true))
      SpyGetUserConfig.mockReturnValueOnce({
        CALLBACK_ENDPOINT: 'http://localhost:5000'
      })
      const res = await request(app).post(`/api/outbound/request`).send({
        method: 'get',
        path: '/parties/MSISDN/1234567890',
        headers: {},
        body: null
      })
      SpyGetUserConfig.mockRestore()
      expect(res.statusCode).toEqual(200)
    })
    it('Send a request with missing method', async () => {
      const res = await request(app).post(`/api/outbound/request`).send({
        path: '/parties/MSISDN/1234567890',
        headers: {},
        body: null
      })
      expect(res.statusCode).toEqual(422)
    })
    it('Send a request with missing path', async () => {
      const res = await request(app).post(`/api/outbound/request`).send({
        method: 'get',
        headers: {},
        body: null
      })
      expect(res.statusCode).toEqual(422)
    })
    it('when the server throws an error, statusCode is 500', async () => {
      axios.mockImplementationOnce(() => {throw new Error()})
      const res = await request(app).post(`/api/outbound/request`).send({
        method: 'get',
        path: '/parties/MSISDN/1234567890'
      })
      expect(res.statusCode).toEqual(500)
    })
    it('when the server reject the request, statusCode is 500', async () => {
      axios.mockImplementationOnce(() => Promise.reject(true))
      const res = await request(app).post(`/api/outbound/request`).send({
        method: 'get',
        path: '/parties/MSISDN/1234567890',
        headers: {},
        body: null
      })
      expect(res.statusCode).toEqual(200)
    })
  })
  // SpyBroadcastOutboundProgress.mockRestore()
  describe('POST /api/outbound/template/:outboundID', () => {
    const properTemplate = {
      "name": "Test1",
      "inputValues": {
        "accept": "test"
      },
      "test_cases": [
        {
          "id": 1,
          "name": "P2P Transfer Happy Path",
          "requests": [
            {
              "id": 2,
              "description": "Get party information",
              "apiVersion": {
                "minorVersion": 0,
                "majorVersion": 1,
                "type": "fspiop",
                "asynchronous": true
              },
              "operationPath": "/parties/{Type}/{ID}",
              "method": "get",
              "headers": {
                "Accept": "{$inputs.accept}",
              },
              "params": {
                "Type": "MSISDN",
                "ID": "1234567890"
              },
              "delay": 1,
              "scripts": {
                "preRequest": {
                  "exec": [
                    "pm.environment.set('preRequest', 5000)"
                  ]
                },
                "postRequest": {
                  "exec": [
                    "pm.environment.set('postRequest', 5000)"
                  ]
                }
              }
            },
            {
              "id": 1,
              "description": "Get party information",
              "apiVersion": {
                "minorVersion": 0,
                "majorVersion": 1,
                "type": "fspiop",
                "asynchronous": true
              },
              "operationPath": "/parties/{Type}/{ID}",
              "method": "get",
              "headers": {
                "Accept": "{$inputs.accept}",
              },
              "params": {
                "Type": "MSISDN",
                "ID": "1234567890"
              }
            }
          ]
        }
      ]
    }
    it('Send a proper template with id 123', async () => {
      const res = await request(app).post(`/api/outbound/template/123`).send(properTemplate)
      expect(res.statusCode).toEqual(200)
    })
    it('Send a proper template with id aabb123aabb', async () => {
      const res = await request(app).post(`/api/outbound/template/aabb123aabb`).send(properTemplate)
      expect(res.statusCode).toEqual(200)
    })
    it('Send a template without name', async () => {
      const {name, ...wrongTemplate} = properTemplate
      const res = await request(app).post(`/api/outbound/template/123`).send(wrongTemplate)
      expect(res.statusCode).toEqual(422)
    })
    it('Send a template without test_cases', async () => {
      const {test_cases, ...wrongTemplate} = properTemplate
      const res = await request(app).post(`/api/outbound/template/123`).send(wrongTemplate)
      expect(res.statusCode).toEqual(422)
    })
  })
  describe('DELETE /api/outbound/template/:outboundID', () => {
    it('Send request to delete template with outboundID 123', async () => {
      SpyTerminateOutbound.mockResolvedValueOnce()
      await new Promise(resolve => setTimeout(resolve, 2000))
      const res = await request(app).delete(`/api/outbound/template/123`).send()
      expect(res.statusCode).toEqual(200)
    })
  })
})
