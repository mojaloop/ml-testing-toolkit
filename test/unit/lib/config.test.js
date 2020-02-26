'use strict'

const Config = require('../../../src/lib/config')

describe('Config', () => {
  describe('loadUserConfig', () => {
    it('Get getUserConfig', async () => {
      await Config.loadUserConfig()
      const userConfig = Config.getUserConfig()
      expect(userConfig).toHaveProperty('CALLBACK_ENDPOINT')
    })
  })
  describe('Get and set user config', () => {
    let userConfig, newConfig
    it('Get getStoredUserConfig', async () => {
      userConfig = await Config.getStoredUserConfig()
      expect(userConfig).toHaveProperty('CALLBACK_ENDPOINT')
    })
    it('Get setStoredUserConfig', async () => {
      newConfig = JSON.parse(JSON.stringify(userConfig))
      newConfig.CALLBACK_ENDPOINT = 'test'
      await Config.setStoredUserConfig(newConfig)
      expect(newConfig).toHaveProperty('CALLBACK_ENDPOINT')
      expect(newConfig.CALLBACK_ENDPOINT).toEqual('test')
      await Config.setStoredUserConfig(userConfig)
    })
  })
})
