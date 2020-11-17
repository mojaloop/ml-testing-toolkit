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
  "API_PORT": 5000,
  "HOSTING_ENABLED": false,
  "CONFIG_VERSIONS": {
    "response": 1,
    "callback": 1,
    "validation": 1,
    "forward": 1,
    "userSettings": 1
  },
  "DB": {
    "URI": "mongodb://mongo:27017/dfsps"
  },
  "OAUTH": {
    "AUTH_ENABLED": false,
    "APP_OAUTH_CLIENT_KEY": "asdf",
    "APP_OAUTH_CLIENT_SECRET": "asdf",
    "MTA_ROLE": "Application/MTA",
    "PTA_ROLE": "Application/PTA",
    "EVERYONE_ROLE": "Internal/everyone",
    "OAUTH2_ISSUER": "http://172.17.0.1:5050/api/oauth2/token",
    "JWT_COOKIE_NAME": "TTK-API_ACCESS_TOKEN",
    "EMBEDDED_CERTIFICATE": "password"
  },
  "API_DEFINITIONS": [
    {
      "type": "fspiop",
      "version": "1.0",
      "folderPath": "fspiop_1.0",
      "asynchronous": true
    },
    {
      "type": "fspiop",
      "version": "1.1",
      "folderPath": "fspiop_1.1",
      "asynchronous": true
    },
    {
      "type": "settlements",
      "version": "1.0",
      "folderPath": "settlements_1.0"
    },
    {
      "type": "central_admin",
      "version": "9.3",
      "folderPath": "central_admin_9.3"
    }
  ]
})
Config.getUserConfig.mockReturnValue({
  CALLBACK_ENDPOINT: 'http://localhost:5000',
  CALLBACK_TIMEOUT: 5000
})
const request = require('supertest')
const apiServer = require('../../../../src/lib/api-server')
const app = apiServer.getApp()
const axios = require('axios').default
const OutboundInitiator = require('../../../../src/lib/test-outbound/outbound-initiator')

const SpyTerminateOutbound = jest.spyOn(OutboundInitiator, 'terminateOutbound')
const SpyOutboundSend = jest.spyOn(OutboundInitiator, 'OutboundSend')
const requestLogger = require('../../../../src/lib/requestLogger')

jest.mock('../../../../src/lib/requestLogger')
jest.mock('axios')

describe('API route /api/outbound', () => {
  const axiosMockedResponse = {
    status: 200,
    statusText: 'OK',
    data: {}
  }
  beforeAll(() => {
    requestLogger.logMessage.mockReturnValue()
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  describe('POST /api/outbound/request', () => {
    it('Send a proper request', async () => {
      axios.mockImplementationOnce(() => Promise.resolve(true))
      const res = await request(app).post(`/api/outbound/request`).send({
        method: 'get',
        path: '/parties/MSISDN/1234567890',
        headers: {},
        body: null
      })
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
    it('when the server reject the request, statusCode is 200', async () => {
      axios.mockImplementationOnce(() => Promise.reject(true))
      const res = await request(app).post(`/api/outbound/request`).send({
        method: 'get',
        path: '/parties/MSISDN/1234567890',
        headers: {},
        body: null
      })
      expect(res.statusCode).toEqual(200)
    })
    it('when there is an internal error, statusCode is 500', async () => {
      axios.mockImplementationOnce(() => {throw new Error()})
      try {
        const res = await request(app).post(`/api/outbound/request`).send({
          method: 'get',
          path: '/parties/MSISDN/1234567890'
        })
        expect(res.statusCode).toEqual(500)
      } catch (err) {
        console.log(err)
      }
    })
  })
  describe('POST /api/outbound/template/:outboundID', () => {
    axios.mockResolvedValue(axiosMockedResponse)
    const properTemplateAsync = {
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
              "delay": 1
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
    const properTemplateSync = {
      "name": "Test1",
      "inputValues": {
        "accept": "test"
      },
      "test_cases": [
        {
          "id": 1,
          "name": "Settlements",
          "requests": [
            {
              "id": 1,
              "description": "Get Settlements",
              "apiVersion": {
                "minorVersion": 3,
                "majorVersion": 9,
                "type": "settlements",
                "asynchronous": false
              },
              "operationPath": "/settlements",
              "method": "get",
              "headers": {
                "Accept": "{$inputs.accept}",
              },
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
            }
          ]
        }
      ]
    }
    it('Send a proper template with id 12', async () => {
      const res = await request(app).post(`/api/outbound/template/12`).send(properTemplateSync)
      expect(res.statusCode).toEqual(200)
    })
    it('Send a proper template with id 123', async () => {
      const res = await request(app).post(`/api/outbound/template/123`).send(properTemplateAsync)
      expect(res.statusCode).toEqual(200)
    })
    it('Send a proper template with id aabb123aabb', async () => {
      const res = await request(app).post(`/api/outbound/template/aabb123aabb`).send(properTemplateAsync)
      expect(res.statusCode).toEqual(200)
    })
    it('Send a duplicate template with id aabb123aabb', async () => {
      SpyOutboundSend.mockImplementationOnce(() => {throw new Error()})
      const res = await request(app).post(`/api/outbound/template/aabb123aabb`).send(properTemplateAsync)
      expect(res.statusCode).toEqual(500)
    })
    it('Send a template without name', async () => {
      const {name, ...wrongTemplate} = properTemplateAsync
      const res = await request(app).post(`/api/outbound/template/123`).send(wrongTemplate)
      expect(res.statusCode).toEqual(422)
    })
    it('Send a template without test_cases', async () => {
      const {test_cases, ...wrongTemplate} = properTemplateAsync
      const res = await request(app).post(`/api/outbound/template/123`).send(wrongTemplate)
      expect(res.statusCode).toEqual(422)
    })
    it('Send a proper template with id 123', async () => {
      const deleteResponse = await request(app).delete(`/api/outbound/template/123`).send()
      const postResponse = await request(app).post(`/api/outbound/template/123`).send(properTemplateAsync)
      expect(postResponse.statusCode).toEqual(200)
    })
    it('Send a proper template in loop without iteration count', async () => {
      const res = await request(app).post(`/api/outbound/template_iterations/12`).send(properTemplateAsync)
      expect(res.statusCode).toEqual(422)
    })
    it('Send a proper template in loop with iteration count zero', async () => {
      const res = await request(app).post(`/api/outbound/template_iterations/12`).query({iterationCount: 0}).send(properTemplateAsync)
      expect(res.statusCode).toEqual(500)
    })
    it('Send a proper template in loop with wrong template', async () => {
      const {test_cases, ...wrongTemplate} = properTemplateAsync
      const res = await request(app).post(`/api/outbound/template_iterations/12`).query({iterationCount: 1}).send(wrongTemplate)
      expect(res.statusCode).toEqual(422)
    })
    it('Send a proper template in loop', async () => {
      const res = await request(app).post(`/api/outbound/template_iterations/12`).query({iterationCount: 1}).send(properTemplateAsync)
      expect(res.statusCode).toEqual(200)
    })
  })
  describe('DELETE /api/outbound/template/:outboundID', () => {
    it('Send request to delete template with outboundID 12', async () => {
      SpyTerminateOutbound.mockReturnValueOnce()
      await new Promise(resolve => setTimeout(resolve, 2000))
      const res = await request(app).delete(`/api/outbound/template/123`).send()
      expect(res.statusCode).toEqual(200)
    })
    it('Send request to delete template with outboundID 123', async () => {
      SpyTerminateOutbound.mockReturnValueOnce()
      await new Promise(resolve => setTimeout(resolve, 2000))
      const res = await request(app).delete(`/api/outbound/template/123`).send()
      expect(res.statusCode).toEqual(200)
    })
    it('Send request to delete template with outboundID aabb123aabb', async () => {
      SpyTerminateOutbound.mockReturnValueOnce()
      await new Promise(resolve => setTimeout(resolve, 2000))
      const res = await request(app).delete(`/api/outbound/template/aabb123aabb`).send()
      expect(res.statusCode).toEqual(200)
    })
    it('Send request to delete template with outboundID 123', async () => {
      SpyTerminateOutbound.mockImplementationOnce(() => {throw new Error()})
      await new Promise(resolve => setTimeout(resolve, 2000))
      const res = await request(app).delete(`/api/outbound/template/123`).send()
      expect(res.statusCode).toEqual(500)
    })
  })
})
