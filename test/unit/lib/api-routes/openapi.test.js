const request = require('supertest')
const apiServer = require('../../../../src/lib/api-server')
const OpenApiMockHandler = require('../../../../src/lib/mocking/openApiMockHandler')

const app = apiServer.getApp()


describe('API route /api/openapi', () => {
  describe('GET /api/openapi/api_versions', () => {
    it('Getting all api versions', async () => {
      const res = await request(app).get(`/api/openapi/api_versions`)
      expect(res.statusCode).toEqual(200)
      expect(Array.isArray(res.body)).toBe(true)
      expect(res.body.length).toBeGreaterThan(0)
      const firstItem = res.body[0]
      expect(firstItem).toHaveProperty('minorVersion')
      expect(firstItem).toHaveProperty('majorVersion')
      expect(firstItem).toHaveProperty('type')
    })
  })
  describe('GET /api/openapi/definition/:type/:version', () => {
    let firstItem
    it('Getting all api versions', async () => {
      const res = await request(app).get(`/api/openapi/api_versions`)
      firstItem = res.body[0]
      await OpenApiMockHandler.initilizeMockHandler()
    })
    it('Getting api definition', async () => {
      const res = await request(app).get(`/api/openapi/definition/${firstItem.type}/${firstItem.majorVersion}.${firstItem.minorVersion}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('paths')
    })
    it('Getting callback map', async () => {
      const res = await request(app).get(`/api/openapi/callback_map/${firstItem.type}/${firstItem.majorVersion}.${firstItem.minorVersion}`)
      if (firstItem.asynchronous) {
        expect(res.statusCode).toEqual(200)
      } else {
        expect(res.statusCode).toEqual(404)
      }
    })
    it('Getting response map', async () => {
      const res = await request(app).get(`/api/openapi/response_map/${firstItem.type}/${firstItem.majorVersion}.${firstItem.minorVersion}`)
      if (!firstItem.asynchronous) {
        expect(res.statusCode).toEqual(200)
      }
    })
  })
})
