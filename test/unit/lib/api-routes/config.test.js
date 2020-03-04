const request = require('supertest')
const app = require('../../../../src/lib/api-server').getApp()



describe('API route /config', () => {
  describe('GET /api/config/user', () => {
    it('Getting config', async () => {
      const res = await request(app).get(`/api/config/user`)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('runtime')
      expect(res.body).toHaveProperty('stored')
    })
  })
  describe('PUT /api/config/user', () => {
    let userConfig, newConfig
    it('Get Stored Config', async () => {
      const res = await request(app).get(`/api/config/user`)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('runtime')
      expect(res.body).toHaveProperty('stored')
      expect(res.body.stored).toHaveProperty('CALLBACK_ENDPOINT')
      userConfig = res.body.stored
    })
    it('Set new Config', async () => {
      newConfig = JSON.parse(JSON.stringify(userConfig))
      newConfig.CALLBACK_ENDPOINT = 'test'
      const res = await request(app).put(`/api/config/user`).send(newConfig)
      expect(res.statusCode).toEqual(200)
    })
    it('Set new Config without CALLBACK_ENDPOINT', async () => {
      const {CALLBACK_ENDPOINT, ...wrongConfig} = userConfig
      const res = await request(app).put(`/api/config/user`).send(wrongConfig)
      expect(res.statusCode).toEqual(422)
    })
    it('Get Stored Config again', async () => {
      const res = await request(app).get(`/api/config/user`)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('runtime')
      expect(res.body).toHaveProperty('stored')
      expect(res.body.stored).toHaveProperty('CALLBACK_ENDPOINT')
      expect(res.body.stored.CALLBACK_ENDPOINT).toEqual('test')
    })
    it('Set old Config', async () => {
      const res = await request(app).put(`/api/config/user`).send(userConfig)
      expect(res.statusCode).toEqual(200)
    })
  })
})
