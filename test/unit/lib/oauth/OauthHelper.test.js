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

const OAuthHelper = require('../../../../src/lib/oauth/OAuthHelper')

const Cookies = require('cookies')
const Config = require('../../../../src/lib/config')
const SpyGetSystemConfig = jest.spyOn(Config, 'getSystemConfig')
const requestLogger = require('../../../../src/lib/requestLogger')

jest.mock('cookies')
jest.mock('../../../../src/lib/requestLogger')

Cookies.mockImplementation()


describe('OAuthHelper tests', () => {
  beforeAll(() => {
    requestLogger.logMessage.mockReturnValue()
  })
  it('handleMiddleware when AUTH is enabled should not throw an error', async () => {
    SpyGetSystemConfig.mockReturnValue({
      OAUTH: {
        AUTH_ENABLED: true,
        EMBEDDED_CERTIFICATE: 'asdf'
      }
    })
    SpyGetSystemConfig.mockClear()
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
          AUTH_ENABLED: false
        }
      })
      OAuthHelper.cookieExtractor({})
    });
  });
  describe('createJwtStrategy', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })
    afterEach(() => {
      jest.resetAllMocks()
    })
    it('should not throw an error when extraExtractors is array', async () => {
      SpyGetSystemConfig.mockReturnValue({
        OAUTH: {
          AUTH_ENABLED: true,
          EMBEDDED_CERTIFICATE: 'cert'
        }
      })
      OAuthHelper.createJwtStrategy([])
    });
    it('should not throw an error when extraExtractors is object', async () => {
      SpyGetSystemConfig.mockReturnValue({
        OAUTH: {
          EMBEDDED_CERTIFICATE: 'cert'
        }
      })
      OAuthHelper.createJwtStrategy({})
    });
    it('should not throw an error when EMBEDDED_CERTIFICATE and CERTIFICATE_FILE_NAME are empty', async () => {
      SpyGetSystemConfig.mockReturnValue({
        OAUTH: {
          EMBEDDED_CERTIFICATE: 'cert'
        }
      })
      OAuthHelper.createJwtStrategy()
    });
    it('should not throw an error when EMBEDDED_CERTIFICATE is not empty', async () => {
      SpyGetSystemConfig.mockReturnValue({
        OAUTH: {
          EMBEDDED_CERTIFICATE: 'EMBEDDED_CERTIFICATE'
        }
      })
      OAuthHelper.createJwtStrategy()
    });
    it('should not throw an error when EMBEDDED_CERTIFICATE is empty and CERTIFICATE_FILE_NAME is not empty and starts with "/"', async () => {
      SpyGetSystemConfig.mockReturnValue({
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
      SpyGetSystemConfig.mockReturnValue({
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