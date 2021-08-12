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

const OAuthHelper = require('../../../src/lib/oauth/OAuthHelper')

const Cookies = require('cookies')
const Config = require('../../../src/lib/config')
const SpyGetSystemConfig = jest.spyOn(Config, 'getSystemConfig')
const requestLogger = require('../../../src/lib/requestLogger')

jest.mock('cookies')
jest.mock('../../../src/lib/requestLogger')

Cookies.mockImplementation()


describe('OAuthHelper tests', () => {
  beforeAll(() => {
    requestLogger.logMessage.mockReturnValue()
  })
  it('handleMiddleware when AUTH is enabled should not throw an error', async () => {
    SpyGetSystemConfig.mockReturnValueOnce({
      OAUTH: {
        AUTH_ENABLED: true
      }
    }).mockReturnValueOnce({
      OAUTH: {}
    })
    OAuthHelper.handleMiddleware()
  });
  it('handleMiddleware when AUTH is disabled should not throw an error', async () => {
    SpyGetSystemConfig
      .mockReturnValueOnce({
        OAUTH: {
          AUTH_ENABLED: false
        }
      })
    OAuthHelper.handleMiddleware()
  });
  describe('cookieExtractor', () => {
    it('should not throw an error', async () => {
      SpyGetSystemConfig.mockReturnValueOnce({
        OAUTH: {
        }
      })
      OAuthHelper.cookieExtractor({})
    });
  });
  describe('createJwtStrategy', () => {
    it('should not throw an error when extraExtractors is array', async () => {
      SpyGetSystemConfig.mockReturnValueOnce({
        OAUTH: {
          EMBEDDED_CERTIFICATE: null,
          CERTIFICATE_FILE_NAME: null
        }
      })
      OAuthHelper.createJwtStrategy([])
    });
    it('should not throw an error when extraExtractors is object', async () => {
      SpyGetSystemConfig.mockReturnValueOnce({
        OAUTH: {
          EMBEDDED_CERTIFICATE: null,
          CERTIFICATE_FILE_NAME: null
        }
      })
      OAuthHelper.createJwtStrategy({})
    });
    it('should not throw an error when EMBEDDED_CERTIFICATE and CERTIFICATE_FILE_NAME are empty', async () => {
      SpyGetSystemConfig.mockReturnValueOnce({
        OAUTH: {
          EMBEDDED_CERTIFICATE: null,
          CERTIFICATE_FILE_NAME: null
        }
      })
      OAuthHelper.createJwtStrategy()
    });
    it('should not throw an error when EMBEDDED_CERTIFICATE is not empty', async () => {
      SpyGetSystemConfig.mockReturnValueOnce({
        OAUTH: {
          EMBEDDED_CERTIFICATE: 'EMBEDDED_CERTIFICATE'
        }
      })
      OAuthHelper.createJwtStrategy()
    });
    it('should not throw an error when EMBEDDED_CERTIFICATE is empty and CERTIFICATE_FILE_NAME is not empty and starts with "/"', async () => {
      SpyGetSystemConfig.mockReturnValueOnce({
        OAUTH: {
          EMBEDDED_CERTIFICATE: null,
          CERTIFICATE_FILE_NAME: '/CERTIFICATE_FILE_NAME'
        }
      })
      try {
        OAuthHelper.createJwtStrategy()
      } catch (err) {}
    });
    it('should not throw an error when EMBEDDED_CERTIFICATE is empty and CERTIFICATE_FILE_NAME is not empty and not starts with "/"', async () => {
      SpyGetSystemConfig.mockReturnValueOnce({
        OAUTH: {
          EMBEDDED_CERTIFICATE: null,
          CERTIFICATE_FILE_NAME: 'test/CERTIFICATE_FILE_NAME'
        }
      })
      try {
        OAuthHelper.createJwtStrategy()
      } catch (err) {}
    });
  });
  describe('verifyCallback', () => {
    it('should not throw an error', async () => {
      const req = {}
      const jwtPayload = {
        sub: null
      }
      const done = jest.fn()
      OAuthHelper.verifyCallback(req, jwtPayload, done)
    });
    it('should not throw an error', async () => {
      const req = {}
      const jwtPayload = {
        sub: 'sub',
        iss: null
      }
      const done = jest.fn()
      OAuthHelper.verifyCallback(req, jwtPayload, done)
    });
    it('should not throw an error', async () => {
      SpyGetSystemConfig.mockReturnValueOnce({
        OAUTH: {
          OAUTH2_ISSUER: 'OAUTH2_ISSUER',
          OAUTH2_TOKEN_ISS: 'OAUTH2_TOKEN_ISS'
        }
      })
      const req = {}
      const jwtPayload = {
        sub: 'sub',
        iss: 'iss'
      }
      const done = jest.fn()
      OAuthHelper.verifyCallback(req, jwtPayload, done)
    });
    it('should not throw an error', async () => {
      SpyGetSystemConfig.mockReturnValueOnce({
        OAUTH: {
          OAUTH2_ISSUER: 'OAUTH2_ISSUER',
          OAUTH2_TOKEN_ISS: 'OAUTH2_TOKEN_ISS'
        }
      })
      const req = {}
      const jwtPayload = {
        sub: 'sub',
        iss: 'OAUTH2_ISSUER',
        groups: null
      }
      const done = jest.fn()
      OAuthHelper.verifyCallback(req, jwtPayload, done)
    });
    it('should not throw an error', async () => {
      SpyGetSystemConfig.mockReturnValueOnce({
        OAUTH: {
          OAUTH2_ISSUER: 'OAUTH2_ISSUER',
          OAUTH2_TOKEN_ISS: 'OAUTH2_TOKEN_ISS'
        }
      })
      const req = {}
      const jwtPayload = {
        sub: 'sub',
        iss: 'OAUTH2_ISSUER',
        groups: ['openid']
      }
      const done = jest.fn()
      OAuthHelper.verifyCallback(req, jwtPayload, done)
    });
  });
});