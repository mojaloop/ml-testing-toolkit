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

const dfspMockUsers = require('../../../../src/lib/db/dfspMockUsers')
const Config = require('../../../../src/lib/config')
jest.mock('../../../../src/lib/config')

describe('dfspMockUsers', () => {
  describe('getDFSPList', () => {
    it('should return temp dfsp list if hosting enabled', async () => {
      Config.getSystemConfig.mockReturnValue({
        HOSTING_ENABLED: true
      })
      Config.getUserConfig.mockReturnValue({
        JWS_SIGN: true,
        VALIDATE_INBOUND_JWS: true,
        DEFAULT_USER_FSPID: 'userdfsp'
      })
      const dfspList = await dfspMockUsers.getDFSPList()
      expect(Array.isArray(dfspList)).toBeTruthy()
    })
    it('should return dfsp wise list if hosting disabled and hub only mode enabled', async () => {
      Config.getSystemConfig.mockReturnValue({
        HOSTING_ENABLED: false
      })
      Config.getUserConfig.mockReturnValue({
        HUB_ONLY_MODE: true,
        ENDPOINTS_DFSP_WISE: {
          dfsps: {
            userdfsp: {}
          }
        }
      })
      const dfspList = await dfspMockUsers.getDFSPList()
      expect(dfspList[0].id).toBe('userdfsp')
    })
    it('should return dfsp wise list if hosting disabled and hub only mode enabled', async () => {
      Config.getSystemConfig.mockReturnValue({
        HOSTING_ENABLED: false
      })
      Config.getUserConfig.mockReturnValue({
        HUB_ONLY_MODE: true,
        ENDPOINTS_DFSP_WISE: {},
        DEFAULT_USER_FSPID: 'userdfsp'
      })
      const dfspList = await dfspMockUsers.getDFSPList()
      expect(dfspList[0].id).toBe('userdfsp')
    })
    it('should return userdfsp if hosting disabled and hub only mode disabled', async () => {
      Config.getSystemConfig.mockReturnValue({
        HOSTING_ENABLED: false
      })
      Config.getUserConfig.mockReturnValue({
        HUB_ONLY_MODE: false,
        DEFAULT_USER_FSPID: 'userdfsp'
      })
      const dfspList = await dfspMockUsers.getDFSPList()
      expect(dfspList[0].id).toBe('userdfsp')
    })
  })
  describe('checkDFSP', () => {
    it('should return true if dfsp exists', async () => {
      Config.getSystemConfig.mockReturnValue({
        HOSTING_ENABLED: true
      })
      const dfspList = await dfspMockUsers.getDFSPList()
      const check = await dfspMockUsers.checkDFSP(dfspList[0].id)
      expect(check).toBeTruthy()
    })
    it('should return false if dfsp not exists', async () => {
      const check = await dfspMockUsers.checkDFSP('notexistingdfsp')
      expect(check).toBeFalsy()
    })
  })
})
