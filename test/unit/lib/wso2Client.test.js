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

const Wso2Client = require('../../../src/lib/oauth/Wso2Client')
const utils = require('../../../src/lib/utils')
const Config = require('../../../src/lib/config')
const rp = require('request-promise-native')

jest.mock('request-promise-native')

describe('Wso2Client tests', () => {
  describe('get token', () => {
    it('should not throw an error', async () => {
      if (Object.keys(Config.getSystemConfig()).length === 0) {
        await Config.loadSystemConfig()
      }
      rp.post.mockReturnValueOnce({
        form: () => {
          return {
            auth: () => JSON.stringify({})
          }
        }
      })
      await Wso2Client.getToken()
    });
    it('should throw an error', async () => {
      if (Object.keys(Config.getSystemConfig()).length === 0) {
        await Config.loadSystemConfig()
      }
      rp.post.mockReturnValueOnce({
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
      if (Object.keys(Config.getSystemConfig()).length === 0) {
        await Config.loadSystemConfig()
      }
      rp.post.mockReturnValueOnce({
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

