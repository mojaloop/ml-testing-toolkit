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

const KeycloakHelper = require('../../../../src/lib/oauth/KeycloakHelper')
const axios = require('axios').default

const Config = require('../../../../src/lib/config')
const SpyGetSystemConfig = jest.spyOn(Config, 'getSystemConfig')
const requestLogger = require('../../../../src/lib/requestLogger')
const objectStore = require('../../../../src/lib/objectStore/objectStoreInterface')

jest.mock('../../../../src/lib/requestLogger')
jest.mock('../../../../src/lib/objectStore/objectStoreInterface')
jest.mock('axios')

describe('KeycloakHelper tests', () => {
  beforeAll(() => {
    requestLogger.logMessage.mockReturnValue()
  })
  describe('getKeyCloakUsers', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })
    afterEach(() => {
      jest.resetAllMocks()
    })
    it('should not throw an error if users retruned', async () => {
      SpyGetSystemConfig.mockReturnValue({
        KEYCLOAK: {
          API_URL: 'http://localhost/api',
          REALM: 'ttk',
          USERNAME: 'user1'
        }
      })
      const keyCloakToken = {
        accessToken: 'asdf'
      }
      axios.get.mockImplementation(() => Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: [
          {
            username: 'test1',
            firstName: 'fn',
            lastName: 'ln',
            attributes: {
              dfspId: ['dfsp1']
            }
          }
        ],
        request: {
          toCurl: () => ''
        }
      }))
      await expect(KeycloakHelper.getKeyCloakUsers(keyCloakToken)).resolves.toBeTruthy()
    });
    it('should throw an error if response is not 200', async () => {
      SpyGetSystemConfig.mockReturnValue({
        KEYCLOAK: {
          API_URL: 'http://localhost/api',
          REALM: 'ttk',
          USERNAME: 'user1'
        }
      })
      const keyCloakToken = {
        accessToken: 'asdf'
      }
      axios.get.mockImplementation(() => Promise.resolve({
        status: 404,
        statusText: 'Not found',
        data: null,
        request: {
          toCurl: () => ''
        }
      }))
      await expect(KeycloakHelper.getKeyCloakUsers(keyCloakToken)).rejects.toThrowError()
    });
  });
  describe('getTokenInfo', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })
    afterEach(() => {
      jest.resetAllMocks()
    })
    it('should not throw an error if users retruned', async () => {
      SpyGetSystemConfig.mockReturnValue({
        KEYCLOAK: {
          API_URL: 'http://localhost/api',
          REALM: 'ttk',
          USERNAME: 'user1'
        }
      })
      const authInfo = {
        clientId: 'client1',
        clientSecret: 'secret',
        tokenEndpoint: 'http://localhost/token'
      }
      axios.post.mockImplementation(() => Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: {},
        request: {
          toCurl: () => ''
        }
      }))
      await expect(KeycloakHelper.getTokenInfo(authInfo)).resolves.toBeTruthy()
    });
    it('should throw an error if response code is not 200', async () => {
      SpyGetSystemConfig.mockReturnValue({
        KEYCLOAK: {
          API_URL: 'http://localhost/api',
          REALM: 'ttk',
          USERNAME: 'user1'
        }
      })
      const authInfo = {
        clientId: 'client1',
        clientSecret: 'secret',
        tokenEndpoint: 'http://localhost/token'
      }
      axios.post.mockImplementation(() => Promise.resolve({
        status: 404,
        statusText: 'Not found',
        data: {},
        request: {
          toCurl: () => ''
        }
      }))
      await expect(KeycloakHelper.getTokenInfo(authInfo)).rejects.toThrowError()
    });
    it('should throw an error if there is an error sending http request', async () => {
      SpyGetSystemConfig.mockReturnValue({
        KEYCLOAK: {
          API_URL: 'http://localhost/api',
          REALM: 'ttk',
          USERNAME: 'user1'
        }
      })
      const authInfo = {
        clientId: 'client1',
        clientSecret: 'secret',
        tokenEndpoint: 'http://localhost/token'
      }
      axios.post.mockImplementation(() => Promise.reject(new Error('Some Error')))
      await expect(KeycloakHelper.getTokenInfo(authInfo)).rejects.toThrowError()
    });
  });

  describe('keycloakAuth', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })
    afterEach(() => {
      jest.resetAllMocks()
    })
    it('should return the token if exists in object store', async () => {
      objectStore.get.mockImplementation(() => Promise.resolve('some_token'))
      await expect(KeycloakHelper.keycloakAuth()).resolves.toEqual('some_token')
    });
    it('should return the token from object store if it has enoungh expiration time', async () => {
      objectStore.get.mockImplementation(() => Promise.resolve({ token: 'some_token_not_expired', expiresAt: Date.now() + (90 * 1000) }))
      await expect(KeycloakHelper.keycloakAuth()).resolves.toBeTruthy()
      const kToken = await KeycloakHelper.keycloakAuth()
      expect(kToken).toHaveProperty('token')
      expect(kToken.token).toEqual('some_token_not_expired')
      expect(objectStore.set).not.toHaveBeenCalled()
    });
    it('should get the token if token from object store is expired', async () => {
      SpyGetSystemConfig.mockReturnValue({
        KEYCLOAK: {
          API_URL: 'http://localhost/api',
          REALM: 'ttk',
          USERNAME: 'user1',
          ADMIN_CLIENT_ID: 'admin',
          ADMIN_USERNAME: 'admin',
          ADMIN_PASSWORD: 'admin'
        },
        OAUTH: {
          OAUTH2_ISSUER: ''
        }
      })
      objectStore.get.mockImplementation(() => Promise.resolve({ token: 'some_token', expiresAt: Date.now() + (10 * 1000) }))

      axios.post.mockImplementation(() => Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: {
          access_token: '',
          expires_in: 60
        },
        request: {
          toCurl: () => ''
        }
      }))
      await expect(KeycloakHelper.keycloakAuth()).resolves.toBeTruthy()
      expect(objectStore.set).toHaveBeenCalled()
    });
    it('should get the token if not exists in object store', async () => {
      SpyGetSystemConfig.mockReturnValue({
        KEYCLOAK: {
          API_URL: 'http://localhost/api',
          REALM: 'ttk',
          USERNAME: 'user1',
          ADMIN_CLIENT_ID: 'admin',
          ADMIN_USERNAME: 'admin',
          ADMIN_PASSWORD: 'admin'
        },
        OAUTH: {
          OAUTH2_ISSUER: ''
        }
      })
      objectStore.get.mockImplementation(() => Promise.resolve({}))

      axios.post.mockImplementation(() => Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: {
          access_token: '',
          expires_in: 60
        },
        request: {
          toCurl: () => ''
        }
      }))
      await expect(KeycloakHelper.keycloakAuth()).resolves.toBeTruthy()
      expect(objectStore.set).toHaveBeenCalled()
    });
    it('should throw and error if it can not login', async () => {
      SpyGetSystemConfig.mockReturnValue({
        KEYCLOAK: {
          API_URL: 'http://localhost/api',
          REALM: 'ttk',
          USERNAME: 'user1',
          ADMIN_CLIENT_ID: 'admin',
          ADMIN_USERNAME: 'admin',
          ADMIN_PASSWORD: 'admin'
        },
        OAUTH: {
          OAUTH2_ISSUER: ''
        }
      })
      objectStore.get.mockImplementation(() => Promise.resolve({}))

      axios.post.mockImplementation(() => Promise.resolve({
        status: 401,
        statusText: 'Unauthorized',
        data: {
          access_token: '',
          expires_in: 60
        },
        request: {
          toCurl: () => ''
        }
      }))
      await expect(KeycloakHelper.keycloakAuth()).rejects.toThrowError()
    });


  });

  describe('getClientAuthInfo', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })
    afterEach(() => {
      jest.resetAllMocks()
    })
    it('should not throw an error if users retruned', async () => {
      SpyGetSystemConfig.mockReturnValue({
        KEYCLOAK: {
          API_URL: 'http://localhost/api',
          REALM: 'ttk',
          USERNAME: 'user1'
        },
        OAUTH: {
          OAUTH2_ISSUER: ''
        }
      })
      const user = {
        dfspId: 'dfsp1'
      }
      objectStore.get.mockImplementation(() => Promise.resolve('token'))
      axios.get.mockImplementationOnce(() => Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: {
          value: 'secret'
        },
        request: {
          toCurl: () => ''
        }
      }))
      .mockImplementationOnce(() => Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: ['asdf'],
        request: {
          toCurl: () => ''
        }
      }))
      .mockImplementationOnce(() => Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: {
          type: 'secret'
        },
        request: {
          toCurl: () => ''
        }
      }))

      axios.post.mockImplementation(() => Promise.resolve({
        status: 201,
        statusText: 'OK',
        data: {},
        request: {
          toCurl: () => ''
        }
      }))
      await expect(KeycloakHelper.getClientAuthInfo(user)).resolves.toBeTruthy()
    });
    it('should throw error if client secret not found', async () => {
      SpyGetSystemConfig.mockReturnValue({
        KEYCLOAK: {
          API_URL: 'http://localhost/api',
          REALM: 'ttk',
          USERNAME: 'user1'
        },
        OAUTH: {
          OAUTH2_ISSUER: ''
        }
      })
      const user = {
        dfspId: 'dfsp1'
      }
      objectStore.get.mockImplementation(() => Promise.resolve('token'))
      axios.get.mockImplementationOnce(() => Promise.resolve({
        status: 404,
        statusText: 'Not Found',
        data: {},
        request: {
          toCurl: () => ''
        }
      }))
      .mockImplementationOnce(() => Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: ['asdf'],
        request: {
          toCurl: () => ''
        }
      }))
      .mockImplementationOnce(() => Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: {
          type: 'secret'
        },
        request: {
          toCurl: () => ''
        }
      }))

      axios.post.mockImplementation(() => Promise.resolve({
        status: 201,
        statusText: 'OK',
        data: {},
        request: {
          toCurl: () => ''
        }
      }))
      await expect(KeycloakHelper.getClientAuthInfo(user)).rejects.toThrowError()
    });
    it('should throw error if client not found', async () => {
      SpyGetSystemConfig.mockReturnValue({
        KEYCLOAK: {
          API_URL: 'http://localhost/api',
          REALM: 'ttk',
          USERNAME: 'user1'
        },
        OAUTH: {
          OAUTH2_ISSUER: ''
        }
      })
      const user = {
        dfspId: 'dfsp1'
      }
      objectStore.get.mockImplementation(() => Promise.resolve('token'))
      axios.get.mockImplementationOnce(() => Promise.resolve({
        status: 404,
        statusText: 'Not Found',
        data: {},
        request: {
          toCurl: () => ''
        }
      }))
      .mockImplementationOnce(() => Promise.reject(new Error('Client not found')))
      .mockImplementationOnce(() => Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: {
          type: 'secret'
        },
        request: {
          toCurl: () => ''
        }
      }))

      axios.post.mockImplementation(() => Promise.resolve({
        status: 201,
        statusText: 'OK',
        data: {},
        request: {
          toCurl: () => ''
        }
      }))
      await expect(KeycloakHelper.getClientAuthInfo(user)).rejects.toThrowError()
    });
    it('should throw error if some error during client creation', async () => {
      SpyGetSystemConfig.mockReturnValue({
        KEYCLOAK: {
          API_URL: 'http://localhost/api',
          REALM: 'ttk',
          USERNAME: 'user1'
        },
        OAUTH: {
          OAUTH2_ISSUER: ''
        }
      })
      const user = {
        dfspId: 'dfsp1'
      }
      objectStore.get.mockImplementation(() => Promise.resolve('token'))
      axios.get.mockImplementationOnce(() => Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: {
          value: 'secret'
        },
        request: {
          toCurl: () => ''
        }
      }))
      .mockImplementationOnce(() => Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: [],
        request: {
          toCurl: () => ''
        }
      }))
      .mockImplementationOnce(() => Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: {
          type: 'secret'
        },
        request: {
          toCurl: () => ''
        }
      }))

      axios.post.mockImplementation(() => Promise.reject(new Error('Some Error')))

      await expect(KeycloakHelper.getClientAuthInfo(user)).rejects.toThrowError()
    });
    it('should throw error if authentication failed during client creation', async () => {
      SpyGetSystemConfig.mockReturnValue({
        KEYCLOAK: {
          API_URL: 'http://localhost/api',
          REALM: 'ttk',
          USERNAME: 'user1'
        },
        OAUTH: {
          OAUTH2_ISSUER: ''
        }
      })
      const user = {
        dfspId: 'dfsp1'
      }
      objectStore.get.mockImplementation(() => Promise.resolve('token'))
      axios.get.mockImplementationOnce(() => Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: {
          value: 'secret'
        },
        request: {
          toCurl: () => ''
        }
      }))
      .mockImplementationOnce(() => Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: [],
        request: {
          toCurl: () => ''
        }
      }))
      .mockImplementationOnce(() => Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: {
          type: 'secret'
        },
        request: {
          toCurl: () => ''
        }
      }))

      axios.post.mockImplementation(() => Promise.reject(new Error('Authentication failed', { statusCode: 400 })))

      await expect(KeycloakHelper.getClientAuthInfo(user)).rejects.toThrowError()
    });
    it('should throw error if authentication failed to get secret', async () => {
      SpyGetSystemConfig.mockReturnValue({
        KEYCLOAK: {
          API_URL: 'http://localhost/api',
          REALM: 'ttk',
          USERNAME: 'user1'
        },
        OAUTH: {
          OAUTH2_ISSUER: ''
        }
      })
      const user = {
        dfspId: 'dfsp1'
      }
      objectStore.get.mockImplementation(() => Promise.resolve('token'))
      axios.get.mockImplementationOnce(() => Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: {
          value: 'secret'
        },
        request: {
          toCurl: () => ''
        }
      }))
      .mockImplementationOnce(() => Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: ['asdf'],
        request: {
          toCurl: () => ''
        }
      }))
      .mockImplementationOnce(() => Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: {
          type: 'not_secret'
        },
        request: {
          toCurl: () => ''
        }
      }))
      axios.post.mockImplementation(() => Promise.resolve({
        status: 201,
        statusText: 'OK',
        data: {},
        request: {
          toCurl: () => ''
        }
      }))

      await expect(KeycloakHelper.getClientAuthInfo(user)).rejects.toThrowError()
    });

  });
});