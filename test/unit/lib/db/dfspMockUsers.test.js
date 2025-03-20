/*****
 License
 --------------
 Copyright © 2020-2025 Mojaloop Foundation
 The Mojaloop files are made available by the Mojaloop Foundation under the Apache License, Version 2.0 (the "License") and you may not use these files except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, the Mojaloop files are distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

 Contributors
 --------------
 This is the official list of the Mojaloop project contributors for this file.
 Names of the original copyright holders (individuals or organizations)
 should be listed with a '*' in the first column. People who have
 contributed from an organization can be listed under the organization
 that actually holds the copyright for their contributions (see the
 Mojaloop Foundation for an example). Those individuals should have
 their names indented and be marked with a '-'. Email address can be added
 optionally within square brackets <email>.

 * Mojaloop Foundation
 - Name Surname <name.surname@mojaloop.io>

 * ModusBox
 * Georgi Logodazhki <georgi.logodazhki@modusbox.com>
 * Vijaya Kumar Guthi <vijaya.guthi@modusbox.com> (Original Author)
 --------------
 ******/

const dfspMockUsers = require('../../../../src/lib/db/dfspMockUsers')
const Config = require('../../../../src/lib/config')
const axios = require('axios').default

jest.mock('../../../../src/lib/config')
jest.mock('axios')

describe('dfspMockUsers', () => {
  describe('getDFSPList', () => {
    it('should return temp dfsp list if hosting enabled', async () => {
      Config.getSystemConfig.mockReturnValue({
        HOSTING_ENABLED: true,
        KEYCLOAK: {
          ENABLED: false
        }
      })
      const dfspList = await dfspMockUsers.getDFSPList()
      expect(Array.isArray(dfspList)).toBeTruthy()
    })
    it('should return temp dfsp list if hosting and keycloak enabled', async () => {
      Config.getSystemConfig.mockReturnValue({
        HOSTING_ENABLED: true,
        KEYCLOAK: {
          ENABLED: true
        },
        OAUTH: {
          OAUTH2_ISSUER: "http://mojaloop-testing-toolkit:5050/api/oauth2/token"
        }
      })
      axios.post.mockReturnValueOnce({
        status: 200,
        data: {
          access_token: 'asdf',
          expires_in: 10
        }
      })
      axios.get.mockReturnValueOnce({
        status: 200,
        data: [
          {
            username: 'sadf',
            firstName: '',
            lastName: '',
            attributes: {
              dfspId: 'asdf'
            }
          }
        ]
      })
      const dfspList = await dfspMockUsers.getDFSPList()
      expect(Array.isArray(dfspList)).toBeTruthy()
    })
    it('should throw an error if hosting and keycloak enabled and oauth requests fail', async () => {
      Config.getSystemConfig.mockReturnValue({
        HOSTING_ENABLED: true,
        KEYCLOAK: {
          ENABLED: true,
          USERNAME: 'asf'
        },
        OAUTH: {
          OAUTH2_ISSUER: "http://mojaloop-testing-toolkit:5050/api/oauth2/token"
        }
      })
      axios.post.mockReturnValueOnce({
        status: 500
      })
      axios.get.mockReturnValueOnce({
        status: 500
      })
      await expect(dfspMockUsers.getDFSPList()).rejects.toThrowError()
    })
    it('should throw an error if hosting and keycloak enabled and oauth requests fail', async () => {
      Config.getSystemConfig.mockReturnValue({
        HOSTING_ENABLED: true,
        KEYCLOAK: {
          ENABLED: true,
          USERNAME: 'asf'
        },
        OAUTH: {
          OAUTH2_ISSUER: "http://mojaloop-testing-toolkit:5050/api/oauth2/token"
        }
      })
      axios.post.mockReturnValueOnce({
        status: 200,
        data: {
          access_token: 'asdf',
          expires_in: 10
        }
      })
      axios.get.mockReturnValueOnce({
        status: 500
      })
      await expect(dfspMockUsers.getDFSPList()).rejects.toThrowError()
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
        HOSTING_ENABLED: false,
        KEYCLOAK: {
          ENABLED: false
        }
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
        HOSTING_ENABLED: true,
        KEYCLOAK: {
          ENABLED: false
        }
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
