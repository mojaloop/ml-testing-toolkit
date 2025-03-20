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
 * Vijaya Kumar Guthi <vijaya.guthi@modusbox.com> (Original Author)
 --------------
 ******/

const OAuthValidator = require('../../../../src/lib/oauth/OAuthValidator')

const Config = require('../../../../src/lib/config')
const SpyGetSystemConfig = jest.spyOn(Config, 'getSystemConfig')
const requestLogger = require('../../../../src/lib/requestLogger')
const jwt = require('jsonwebtoken')


jest.mock('../../../../src/lib/requestLogger')
jest.mock('../../../../src/lib/utils')
jest.mock('jsonwebtoken')
const SpyVerify = jest.spyOn(jwt, 'verify');
const token = 'asdf'

describe('OAuthValidator tests', () => {
  beforeAll(() => {
    requestLogger.logMessage.mockReturnValue()
  })
  describe('verifyToken', () => {
    beforeEach(() => {
      jest.resetAllMocks()
      SpyVerify.mockImplementation((token, secret, options, callback) => {
        callback(null, { iss: 'asdf', sub: 'asdf', clientId: 'asdf' });
      });
    })
    afterEach(() => {
      jest.resetAllMocks()
    })
    it('should not throw an error when EMBEDDED_CERTIFICATE and CERTIFICATE_FILE_NAME are empty', async () => {
      SpyGetSystemConfig.mockReturnValue({
        OAUTH: {}
      })
      await expect(OAuthValidator.verifyToken(token)).resolves.toBeTruthy()
    });
    it('should not throw an error when EMBEDDED_CERTIFICATE is not empty', async () => {
      SpyGetSystemConfig.mockReturnValue({
        OAUTH: {
          EMBEDDED_CERTIFICATE: 'EMBEDDED_CERTIFICATE'
        }
      })
      await expect(OAuthValidator.verifyToken(token)).resolves.toBeTruthy()
    });
    it('should not throw an error when EMBEDDED_CERTIFICATE is empty and CERTIFICATE_FILE_NAME is not empty and starts with "/"', async () => {
      SpyGetSystemConfig.mockReturnValue({
        OAUTH: {
          EMBEDDED_CERTIFICATE: null,
          CERTIFICATE_FILE_NAME: '/CERTIFICATE_FILE_NAME'
        }
      })
      await expect(OAuthValidator.verifyToken(token)).resolves.toBeTruthy()
    });
    it('should not throw an error when EMBEDDED_CERTIFICATE is empty and CERTIFICATE_FILE_NAME is not empty and not starts with "/"', async () => {
      SpyGetSystemConfig.mockReturnValue({
        OAUTH: {
          EMBEDDED_CERTIFICATE: null,
          CERTIFICATE_FILE_NAME: 'test/CERTIFICATE_FILE_NAME'
        }
      })
      await expect(OAuthValidator.verifyToken(token)).resolves.toBeTruthy()
    });
  });
  describe('additionalVerification', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })
    afterEach(() => {
      jest.resetAllMocks()
    })
    it('should not throw an error when jwtPayload has no sub and iss', async () => {
      SpyVerify.mockImplementation((token, secret, options, callback) => {
        callback(null, { iss: 'asdf', sub: 'asdf', clientId: 'asdf' });
      });
      SpyGetSystemConfig.mockReturnValue({
        OAUTH: {
          EMBEDDED_CERTIFICATE: 'asdf'
        }
      });
      await expect(OAuthValidator.verifyToken(token)).resolves.toBeTruthy()
    });
    it('should throw an error when jwtPayload has no sub', async () => {
      SpyVerify.mockImplementation((token, secret, options, callback) => {
        callback(null, { iss: 'asdf', clientId: 'asdf' });
      });
      SpyGetSystemConfig.mockReturnValue({
        OAUTH: {
          EMBEDDED_CERTIFICATE: 'asdf'
        }
      });
      await expect(OAuthValidator.verifyToken(token)).rejects.toThrowError()
    });
    it('should throw an error when jwtPayload has no iss', async () => {
      SpyVerify.mockImplementation((token, secret, options, callback) => {
        callback(null, { sub: 'asdf', clientId: 'asdf' });
      });
      SpyGetSystemConfig.mockReturnValue({
        OAUTH: {
          EMBEDDED_CERTIFICATE: 'asdf'
        }
      });
      await expect(OAuthValidator.verifyToken(token)).rejects.toThrowError()
    });
    it('should throw an error when jwtPayload has no clientId', async () => {
      SpyVerify.mockImplementation((token, secret, options, callback) => {
        callback(null, { iss: 'asdf', sub: 'asdf' });
      });
      SpyGetSystemConfig.mockReturnValue({
        OAUTH: {
          EMBEDDED_CERTIFICATE: 'asdf'
        }
      });
      await expect(OAuthValidator.verifyToken(token)).rejects.toThrowError()
    });
    it('should throw an error when jwtPayload is empty', async () => {
      SpyVerify.mockImplementation((token, secret, options, callback) => {
        callback(null, { });
      });
      SpyGetSystemConfig.mockReturnValue({
        OAUTH: {
          EMBEDDED_CERTIFICATE: 'asdf'
        }
      });
      await expect(OAuthValidator.verifyToken(token)).rejects.toThrowError()
    });

  });
});