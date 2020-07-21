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
const utils = require('../../../src/lib/utils')

const Cookies = require('cookies')
const Config = require('../../../src/lib/config')
const SpyGetSystemConfig = jest.spyOn(Config, 'getSystemConfig')

jest.mock('cookies')

Cookies.mockImplementation()
describe('OAuthHelper tests', () => {
  it('handleMiddleware', async () => {
    SpyGetSystemConfig
      .mockReturnValueOnce({})
      .mockReturnValueOnce({
        OAUTH: {
          AUTH_ENABLED: true
        }
      })
    OAuthHelper.handleMiddleware()
  });
  it('handleMiddleware', async () => {
    SpyGetSystemConfig
      .mockReturnValueOnce({
        OAUTH: {}
      })
      .mockReturnValueOnce({
        OAUTH: {
          AUTH_ENABLED: false
        }
      })
    OAuthHelper.handleMiddleware()
  });
  describe('cookieExtractor', () => {
    it('should not throw an error', async () => {
      OAuthHelper.cookieExtractor({})
    });
  });
  describe('createJwtStrategy', () => {
    const SYSTEM_CONFIG_FILE = 'spec_files/system_config.json'
    it('should not throw an error', async () => {
      OAuthHelper.createJwtStrategy([])
    });
    it('should not throw an error', async () => {
      OAuthHelper.createJwtStrategy({})
    });
    it('should not throw an error', async () => {
      const systemConfig = Config.getSystemConfig()
      const temp = systemConfig.OAUTH.EMBEDDED_CERTIFICATE
      systemConfig.OAUTH.EMBEDDED_CERTIFICATE = ''
      await utils.writeFileAsync(SYSTEM_CONFIG_FILE, JSON.stringify(systemConfig, null, 2))
      OAuthHelper.createJwtStrategy()
      systemConfig.OAUTH.EMBEDDED_CERTIFICATE = temp
      await utils.writeFileAsync(SYSTEM_CONFIG_FILE, JSON.stringify(systemConfig, null, 2))
    });
    it('should not throw an error', async () => {
      const systemConfig = Config.getSystemConfig()
      const EMBEDDED_CERTIFICATE = systemConfig.OAUTH.EMBEDDED_CERTIFICATE
      const CERTIFICATE_FILE_NAME = systemConfig.OAUTH.CERTIFICATE_FILE_NAME
      systemConfig.OAUTH.EMBEDDED_CERTIFICATE = ''
      systemConfig.OAUTH.CERTIFICATE_FILE_NAME = ''
      await utils.writeFileAsync(SYSTEM_CONFIG_FILE, JSON.stringify(systemConfig, null, 2))
      OAuthHelper.createJwtStrategy()
      systemConfig.OAUTH.EMBEDDED_CERTIFICATE = EMBEDDED_CERTIFICATE
      systemConfig.OAUTH.CERTIFICATE_FILE_NAME = CERTIFICATE_FILE_NAME
      await utils.writeFileAsync(SYSTEM_CONFIG_FILE, JSON.stringify(systemConfig, null, 2))
    });
    it('should not throw an error', async () => {
      const systemConfig = Config.getSystemConfig()
      const EMBEDDED_CERTIFICATE = systemConfig.OAUTH.EMBEDDED_CERTIFICATE
      const CERTIFICATE_FILE_NAME = systemConfig.OAUTH.CERTIFICATE_FILE_NAME
      systemConfig.OAUTH.EMBEDDED_CERTIFICATE = ''
      systemConfig.OAUTH.CERTIFICATE_FILE_NAME = '/' + CERTIFICATE_FILE_NAME
      await utils.writeFileAsync(SYSTEM_CONFIG_FILE, JSON.stringify(systemConfig, null, 2))
      try {
        OAuthHelper.createJwtStrategy()
      } catch (err) {}
      systemConfig.OAUTH.EMBEDDED_CERTIFICATE = EMBEDDED_CERTIFICATE
      systemConfig.OAUTH.CERTIFICATE_FILE_NAME = CERTIFICATE_FILE_NAME
      await utils.writeFileAsync(SYSTEM_CONFIG_FILE, JSON.stringify(systemConfig, null, 2))
    });
  });
  describe('verifyCallback', () => {
    it('should not throw an error', async () => {
      OAuthHelper.verifyCallback({},{}, jest.fn())
    });
    it('should not throw an error', async () => {
      OAuthHelper.verifyCallback({},{sub: 'sub'}, jest.fn())
    });
    it('should not throw an error', async () => {
      OAuthHelper.verifyCallback({},{sub: 'sub', iss: 'iss'}, jest.fn())
    });
    it('should not throw an error', async () => {
      const issuer = Config.getSystemConfig().OAUTH.OAUTH2_ISSUER
      OAuthHelper.verifyCallback({},{sub: 'sub', iss: issuer}, jest.fn())
    });
    it('should not throw an error', async () => {
      const issuer = Config.getSystemConfig().OAUTH.OAUTH2_ISSUER
      OAuthHelper.verifyCallback({},{sub: 'sub', iss: issuer, groups: ['openid']}, jest.fn())
    });
  });
  describe('getOAuth2Middleware', () => {
    it('should not throw an error', async () => {
      OAuthHelper.getOAuth2Middleware()
    });
  });
  // it('should fail because of an invalid algorithm', async () => {
  //   await Config.loadSystemConfig()
  //   let callbackCalled = false;
  //   let token = 'eyJ4NXQiOiJPRGMzTVRNeU1UaGxPRGc1WXpRM1pHTTVNek16TnpGaE5UVmtNVFEwWlRGaU5tVmlZMkk1WkEiLCJraWQiOiJPRGMzTVRNeU1UaGxPRGc1WXpRM1pHTTVNek16TnpGaE5UVmtNVFEwWlRGaU5tVmlZMkk1WkEiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJodWJfb3BlcmF0b3JAY2FyYm9uLnN1cGVyIiwiYXVkIjoiVE5TVnZFRUdPV1NwZ1VkSklwRThtUFVsS3dvYSIsIm5iZiI6MTU3ODU2NTc0NCwiYXpwIjoiVE5TVnZFRUdPV1NwZ1VkSklwRThtUFVsS3dvYSIsInNjb3BlIjoib3BlbmlkIiwiaXNzIjoiaHR0cHM6XC9cL2lza20ucHVibGljLnRpcHMtc2FuZGJveC5saXZlOjk0NDNcL29hdXRoMlwvdG9rZW4iLCJncm91cHMiOlsiSW50ZXJuYWxcL3N1YnNjcmliZXIiLCJBcHBsaWNhdGlvblwvTVRBIiwiQXBwbGljYXRpb25cL2h1Yl9vcGVyYXRvcl9yZXN0X2FwaV9zdG9yZSIsIkFwcGxpY2F0aW9uXC9QVEEiLCJJbnRlcm5hbFwvZXZlcnlvbmUiLCJBcHBsaWNhdGlvblwvTUNNX3BvcnRhbCIsIkFwcGxpY2F0aW9uXC9odWJfb3BlcmF0b3JfRGVmYXVsdEFwcGxpY2F0aW9uX1BST0RVQ1RJT04iXSwiZXhwIjoxNTc4NTY5MzQ0LCJpYXQiOjE1Nzg1NjU3NDQsImp0aSI6ImJlN2JiNDhkLWI1NTMtNGFmOS1hOTYyLWM5Yzk2NzM0Nzc1ZiJ9.wV6c-YdaGcdMmgfJ-w5XIyiHGNiipyPoX36nxRH7pY0dFwxM4Wz5zghgPgMrdiV2A4Q52_5XFojk0R8ZxGfqk5h-TEj-NpYw6mvyfimndFPk9kngSyZDhMsxRtS4UXWxQCMmiIUtAZfZkTGroFClBKeLE-hIBoxHhaFFiN6VLPXXfW3CzekSfRovVHIr1JxP-4fK2ixz5tcAdqVvGXYGUdHhagPtX7a4O4ohvRRF5NWfSZQEsABjaT26PfIwdBiiW8-FGzYCIJV6VavESuwlOv2N1eSPfl-l81yLK9tJiXbwh1Hs-yl9x-tP2Qb2iAP2vPUqYp4E4LoCbWPMm0i2Zg';

  //   let jwtStrategy = createJwtStrategy(tokenPropertyExtractor);
  //   passport.use(jwtStrategy);

  //   function failCallback (extra, success, challenge, status) {
  //     console.log(challenge)
  //     assert.isNull(extra);
  //     assert.isFalse(success);
  //     assert.deepEqual(challenge.name, 'JsonWebTokenError');
  //     assert.deepEqual(challenge.message, 'invalid algorithm');
  //     assert.isUndefined(status);

  //     callbackCalled = true;
  //   };
  //   let req = {};
  //   req.token = token;
  //   passport.authenticate('jwt', { session: false }, failCallback)(req, null, null);

  //   assert.isTrue(callbackCalled, 'Should have throw a JsonWebTokenError: invalid signature');
  // });
});


function tokenPropertyExtractor (req) {
  return req.token;
};

