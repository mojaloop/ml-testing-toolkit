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

const LoginService = require('../../../src/lib/oauth/LoginService')
const wso2Client = require('../../../src/lib/oauth/Wso2Client')
const jwt = require('jsonwebtoken')
const requestLogger = require('../../../src/lib/requestLogger')

const Cookies = require('cookies')
const Config = require('../../../src/lib/config')
const SpyGetSystemConfig = jest.spyOn(Config, 'getSystemConfig')
const SpyWso2Client = jest.spyOn(wso2Client, 'getToken')
const SpyJWT = jest.spyOn(jwt, 'decode')

jest.mock('cookies')
jest.mock('../../../src/lib/requestLogger')

Cookies.mockImplementation()

describe('LoginService tests', () => {
  beforeAll(() => {
    requestLogger.logMessage.mockReturnValue()
  })
  describe('loginUser', () => {
    it('should return status false if oauth not enabled', async () => {
      SpyGetSystemConfig.mockReturnValueOnce({
        OAUTH: {
          AUTH_ENABLED: false
        }
      })
      const res = await LoginService.loginUser()
      expect(res.ok).toBeFalsy
    });
    it('should return status true if oauth enabled and groups provided', async () => {
      SpyGetSystemConfig.mockReturnValueOnce({
        OAUTH: {
          AUTH_ENABLED: true
        }
      })
      SpyWso2Client.mockResolvedValueOnce({
        id_token: '',
        access_token: ''
      })
      SpyJWT.mockReturnValueOnce({
        groups: [ 
          'Application/PTA',
          'Application/DFSP:userdfsp'
        ]
      })
      const res = await LoginService.loginUser('username','password')
      expect(res.ok).toBeTruthy()
    });
    it('should return status true if oauth enabled and dfspId provided', async () => {
      SpyGetSystemConfig.mockReturnValueOnce({
        OAUTH: {
          AUTH_ENABLED: true
        }
      })
      SpyWso2Client.mockResolvedValueOnce({
        id_token: '',
        access_token: ''
      })
      SpyJWT.mockReturnValueOnce({
        dfspId: 'userdfsp'
      })
      const res = await LoginService.loginUser('username','password')
      expect(res.ok).toBeTruthy()
    });
    it('should throw detailed error if token was not found and message include Authentication failed', async () => {
      SpyGetSystemConfig.mockReturnValueOnce({
        OAUTH: {
          AUTH_ENABLED: true
        }
      })
      SpyWso2Client.mockRejectedValueOnce({})
      await expect(LoginService.loginUser('username','password')).rejects.toStrictEqual({})
    });
    it('should rethrow the error if token was not found and message not include Authentication failed', async () => {
      SpyGetSystemConfig.mockReturnValueOnce({
        OAUTH: {
          AUTH_ENABLED: true
        }
      }).mockReturnValueOnce({
        OAUTH: {
        }
      })
      SpyWso2Client.mockRejectedValueOnce({
        statusCode: 400,
        message: 'Authentication failed'
      })
      await expect(LoginService.loginUser('username','password')).rejects.toBeDefined()
    });
  });
  describe('logoutUser', () => {
    it('should set TTK-API_ACCESS_TOKEN cookie to undefined', async () => {
      SpyGetSystemConfig.mockReturnValueOnce({
        OAUTH: {
        }
      })
      const res = await LoginService.logoutUser()
      expect(res).toBeUndefined()
    });
  });
});

