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

const Config = require('../../../../src/lib/config')
jest.mock('../../../../src/lib/config')
Config.getSystemConfig.mockReturnValue({
  OAUTH: {
    OAUTH2_ISSUER: ''
  }
})

const Wso2Client = require('../../../../src/lib/oauth/Wso2Client')
const rp = require('request-promise-native')
const customLogger = require('../../../../src/lib/requestLogger')

jest.mock('request-promise-native')
jest.mock('../../../../src/lib/requestLogger')

describe('Wso2Client tests', () => {
  beforeAll(() => {
    customLogger.logMessage.mockReturnValue()
  })

  describe('get token', () => {
    it('should not throw an error', async () => {
      rp.post.mockReturnValue({
        form: () => {
          return {
            auth: () => JSON.stringify({})
          }
        }
      })
      await Wso2Client.getToken()
    });
    it('should throw an error', async () => {
      rp.post.mockReturnValue({
        form: () => {
          return {
            auth: () => {throw {}}
          }
        }
      })
      try {
        await Wso2Client.getToken()
      } catch (err) {

      }
    });
    it('should throw an error', async () => {
      rp.post.mockReturnValue({
        form: () => {
          return {
            auth: () => {throw {
              statusCode: 400,
              message: 'Authentication failed'
            }}
          }
        }
      })
      try {
        await Wso2Client.getToken()
      } catch (err) {

      }
    });
  });
});

