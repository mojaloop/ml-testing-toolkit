'use strict'

const Config = require('../../../src/lib/config')

describe('Config', () => {
  beforeAll(async (done) => {
    await Config.loadUserConfig()
    done()
  })
  describe('loadUserConfig', () => {
    it('Get USER_CONFIG', async () => {
      const userConfig = Config.getUserConfig()
      expect(userConfig).toHaveProperty('CALLBACK_ENDPOINT')
    })
  })
})
