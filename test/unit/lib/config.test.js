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
 * Vijaya Kumar Guthi <vijaya.guthi@modusbox.com> (Original Author)
 --------------
 ******/

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
