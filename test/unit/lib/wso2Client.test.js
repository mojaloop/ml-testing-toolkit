/******************************************************************************
 *  Copyright 2019 ModusBox, Inc.                                             *
 *                                                                            *
 *  info@modusbox.com                                                         *
 *                                                                            *
 *  Licensed under the Apache License, Version 2.0 (the "License");           *
 *  you may not use this file except in compliance with the License.          *
 *  You may obtain a copy of the License at                                   *
 *  http://www.apache.org/licenses/LICENSE-2.0                                *
 *                                                                            *
 *  Unless required by applicable law or agreed to in writing, software       *
 *  distributed under the License is distributed on an "AS IS" BASIS,         *
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  *
 *  See the License for the specific language governing permissions and       *
 *  limitations under the License.                                            *
 ******************************************************************************/

const Config = require('../../../src/lib/config')
jest.mock('../../../src/lib/config')
Config.getSystemConfig.mockReturnValue({
  OAUTH: {
    OAUTH2_ISSUER: ''
  }
})

const Wso2Client = require('../../../src/lib/oauth/Wso2Client')
const rp = require('request-promise-native')
const customLogger = require('../../../src/lib/requestLogger')

jest.mock('request-promise-native')
jest.mock('../../../src/lib/requestLogger')

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

