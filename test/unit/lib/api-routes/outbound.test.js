const request = require('supertest')
const apiServer = require('../../../../src/lib/api-server')
const app = apiServer.getApp()


describe('API route /api/outbound', () => {
  describe('POST /api/outbound/request', () => {
    it('Send a proper request', async () => {
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
  })
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
              "id": 1,
              "description": "Get party information",
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
    it('Send a proper template', async () => {
      const res = await request(app).post(`/api/outbound/template/123`).send(properTemplate)
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
})
