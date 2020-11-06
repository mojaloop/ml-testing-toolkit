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
'use strict'

const MBConnectionManagerProvider = require('../../../../src/lib/configuration-providers/mb-connection-manager')
const Config = require('../../../../src/lib/config')
const axios = require('axios').default
const { readFileAsync }  = require('../../../../src/lib/utils')
const requestLogger = require('../../../../src/lib/requestLogger')

jest.mock('axios')
jest.mock('../../../../src/lib/config')
jest.mock('../../../../src/lib/requestLogger')

const userConfig = {
  JWS_SIGN: true,
  VALIDATE_INBOUND_JWS: true,
  OUTBOUND_MUTUAL_TLS_ENABLED: true,
  INBOUND_MUTUAL_TLS_ENABLED: true,
  DEFAULT_USER_FSPID: 'userdfsp'
}

const systemConfig = {
  HOSTING_ENABLED: true,
  CONNECTION_MANAGER: {
    API_URL: '',
    AUTH_ENABLED: true,
    HUB_USERNAME: 'userdfsp',
    HUB_PASSWORD: 'hub'
  },
  KEYCLOAK: {
    ENABLED: false
  }
}
Config.getUserConfig.mockImplementation(() => {
  return userConfig
})
Config.getSystemConfig.mockImplementation(() => {
  return systemConfig
})
const reject = {
  post: {},
  get: {},
  put: {}
}
const mapping = {
  post: {
    '/api/login': {
      status: 200,
      headers: {
        'set-cookie': 'JWT'
      }
    },
    '/api/environments': {
      status: 200,
      data: {
        id: 1
      }
    },
    '/api/environments/1/dfsps': {
      status: 200,
      data: {
        id: 1
      }
    },
    '/api/environments/1/cas': {
      status: 200,
      data: {
        id: 1,
        certificate: 'asdf'
      }
    },
    '/api/environments/1/dfsps/userdfsp/enrollments/outbound': {
      status: 200,
      data: {
        id: 1,
        certificate: '',
        validationState: 'VALID'
      }
    },
    '/api/environments/1/dfsps/userdfsp/enrollments/inbound/1/sign': {
      status: 200,
      data: {
        id: 1,
        certificate: 'asdf',
        validationState: 'VALID'
      }
    },
    '/api/environments/1/dfsps/userdfsp/endpoints/1/confirmation': {
      status: 200,
      data: {
        id: 1
      }
    },
    '/api/environments/1/hub/servercerts': {
      status: 200,
      data: {
        id: 1,
        certificate: ''
      }
    },
    '/api/environments/1/dfsps/testingtoolkitdfsp/jwscerts': {
      status: 200,
      data: {
        rootCertificate: 'asdf',
        intermediateChain: 'asdf',
        jwsCertificate: 'asdf'
      }
    }
  },
  get: {
    '/api/environments': {
      status: 200,
      data: [{
        name: 'NOT-TESTING-TOOLKIT'
      }]
    },
    '/api/environments/1/dfsps': {
      status: 200,
      data: [{
        id: 'userdfsp'
      }]
    },
    '/api/environments/1/dfsps/userdfsp/ca': {
      status: 200,
      data: {
        rootCertificate: 'asdf',
        validationState: 'VALID'
      }
    },
    '/api/environments/1/dfsps/userdfsp/servercerts': {
      status: 200,
      data: {
        rootCertificate: 'asdf',
        validationState: 'VALID',
        intermediateChain: 'asdf',
        serverCertificate: 'asdf'
      }
    },
    '/api/environments/1/dfsps/userdfsp/endpoints': {
      status: 200,
      data: [
        {
          direction: 'INGRESS',
          type: 'URL',
          value: {
            url: 'http://localhost/'
          }
        },
        {
          state: 'NEW',
          id: '1'
        }
      ]
    },
    '/api/environments/1/hub/servercerts': {
      status: 200,
      data: {
        rootCertificate: 'asdf',
        validationState: 'VALID',
        intermediateChain: 'asdf',
        serverCertificate: 'asdf'
      }
    },
    '/api/environments/1/dfsps/userdfsp/enrollments/outbound': {
      status: 200,
      data: [
        {
          id: 1,
          state: 'CERT_SIGNED',
          validationState: 'VALID',
          certificate: 'asdf'
        }
      ]
    },
    '/api/environments/1/dfsps/userdfsp/enrollments/inbound': {
      status: 200,
      data: [
        {
          id: 1,
          state: 'CSR_LOADED',
          validationState: 'VALID',
          certificate: 'asdf'
        }
      ]
    },
    '/api/environments/1/dfsps/userdfsp/jwscerts': {
      status: 200,
      data: {
        id: 1,
        rootCertificate: 'asdf',
        intermediateChain: 'asdf',
        jwsCertificate: 'asdf'
      }
    },
    '/api/environments/1/dfsps/testingtoolkitdfsp/jwscerts': {
      status: 200,
      data: {
        rootCertificate: 'asdf',
        intermediateChain: 'asdf',
        jwsCertificate: 'asdf'
      }
    },
    '/api/environments/1/dfsps/userdfsp/enrollments/inbound': {
      status: 200,
      data: [{
        id: 1,
        state: 'CSR_LOADED',
        validationState: 'VALID'
      },{
        id: 2,
        state: 'CSR_LOADED',
        validationState: 'INVALID'
      }]
    }
  },
  put: {
    '/api/environments/1/dfsps/userdfsp/jwscerts': {
      status: 200,
      data: {
        rootCertificate: 'asdf',
        intermediateChain: 'asdf',
        jwsCertificate: 'asdf'
      }
    },
    '/api/environments/1/dfsps/testingtoolkitdfsp/jwscerts': {
      status: 200,
      data: {
        rootCertificate: 'asdf',
        intermediateChain: 'asdf',
        jwsCertificate: 'asdf'
      }
    },
    '/api/environments/1/hub/servercerts': {
      status: 200,
      data: {
        rootCertificate: 'asdf',
        validationState: 'VALID',
        intermediateChain: 'asdf',
        serverCertificate: 'asdf'
      }
    },
  }
}

axios.post.mockImplementation((url) => {
  return axiosHelper('post', url)
})

axios.get.mockImplementation((url) => {
  return axiosHelper('get', url)
})

axios.put.mockImplementation((url) => {
  return axiosHelper('put', url)
})

const axiosHelper = (type, url) => {
  if (mapping[type] && mapping[type][url]) {
    if (reject[type][url]) {
      return Promise.reject(reject[type][url])
    }
    return Promise.resolve(mapping[type][url])
  }
  return Promise.reject(new Error('not found'))
}

describe('mb-connection-manager', () => {
  beforeAll(() => {
    requestLogger.logMessage.mockReturnValue()
  })
  describe('getTestingToolkitDfspJWSCerts', () => {
    it('should return null', async () => {
      const getTestingToolkitDfspJWSCerts = await MBConnectionManagerProvider.getTestingToolkitDfspJWSCerts()
      expect(getTestingToolkitDfspJWSCerts).toBeNull()
    })
  })
  describe('waitForTlsHubCerts', () => {
    it('should throw an error', async () => {
      jest.useRealTimers()
      await expect(MBConnectionManagerProvider.waitForTlsHubCerts(0)).rejects.toThrowError()
    })
  })
  describe('initialize', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })
    it('should not throw error', async () => {
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
    })
    it('should not throw error', async () => {
      const newSystemConfig = {...systemConfig}
      newSystemConfig.HOSTING_ENABLED = false
      Config.getSystemConfig.mockImplementation(() => {
        return newSystemConfig
      })
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      Config.getSystemConfig.mockImplementation(() => {
        return systemConfig
      })
    })
    it('should not throw error', async () => {
      const newSystemConfig = {...systemConfig}
      newSystemConfig.CONNECTION_MANAGER.AUTH_ENABLED = false
      Config.getSystemConfig.mockImplementation(() => {
        return newSystemConfig
      })
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      Config.getUserConfig.mockImplementation(() => {
        return systemConfig
      })
    })
    it('should not throw error', async () => {
      const newUserConfig = {...userConfig}
      newUserConfig.JWS_SIGN = false
      newUserConfig.VALIDATE_INBOUND_JWS = false
      newUserConfig.OUTBOUND_MUTUAL_TLS_ENABLED = false
      newUserConfig.INBOUND_MUTUAL_TLS_ENABLED = false
      Config.getUserConfig.mockImplementation(() => {
        return newUserConfig
      })
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      Config.getUserConfig.mockImplementation(() => {
        return userConfig
      })
    })
    it('should not throw error', async () => {
      const original = mapping.post['/api/login'] 
      mapping.post['/api/login'] = {
        status: 200,
        headers: {}
      }
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      mapping.post['/api/login'] = original
    })
    it('should not throw error', async () => {
      const original = mapping.post['/api/login'] 
      mapping.post['/api/login'] = {
        status: 400
      }
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      mapping.post['/api/login'] = original
    })
    it('should not throw error', async () => {
      const original = mapping.get['/api/environments'] 
      mapping.get['/api/environments'] = {
        status: 200,
        data: []
      }
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      mapping.get['/api/environments'] = original
    })
    it('should not throw error', async () => {
      const original = mapping.get['/api/environments'] 
      mapping.get['/api/environments'] = {
        status: 400
      }
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      mapping.get['/api/environments'] = original
    })
    it('should not throw error', async () => {
      const original = mapping.post['/api/environments'] 
      mapping.post['/api/environments'] = {
        status: 400,
        data: []
      }
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      mapping.post['/api/environments'] = original
    })
    it('should not throw error', async () => {
      const original = mapping.get['/api/environments/1/dfsps'] 
      mapping.get['/api/environments/1/dfsps'] = {
        status: 200,
        data: [{
          id: 'userdfsp'
        }]
      }
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      mapping.get['/api/environments/1/dfsps'] = original
    })
    it('should not throw error', async () => {
      const original = mapping.get['/api/environments/1/dfsps'] 
      mapping.get['/api/environments/1/dfsps'] = {
        status: 400
      }
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      mapping.get['/api/environments/1/dfsps'] = original
    })
    it('should not throw error', async () => {
      const original = mapping.post['/api/environments/1/dfsps'] 
      mapping.post['/api/environments/1/dfsps'] = {
        status: 400
      }
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      mapping.post['/api/environments/1/dfsps'] = original
    })
    it('should not throw error', async () => {
      reject.post['/api/environments/1/dfsps'] = {}
      const original = mapping.post['/api/environments/1/dfsps'] 
      mapping.post['/api/environments/1/dfsps'] = {
        status: 400
      }
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      mapping.post['/api/environments/1/dfsps'] = original
      reject.post['/api/environments/1/dfsps'] = false
    })
    it('should not throw error', async () => {
      reject.post['/api/environments/1/dfsps'] = {response: {data: {}}}
      const original = mapping.post['/api/environments/1/dfsps'] 
      mapping.post['/api/environments/1/dfsps'] = {
        status: 400
      }
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      mapping.post['/api/environments/1/dfsps'] = original
      reject.post['/api/environments/1/dfsps'] = false
    })
    
    it('should not throw error', async () => {
      const original = mapping.get['/api/environments/1/dfsps/testingtoolkitdfsp/jwscerts'] 
      mapping.get['/api/environments/1/dfsps/testingtoolkitdfsp/jwscerts'] = {
        status: 200,
        data: {
          id: 1,
          rootCertificate: 'asdf',
          intermediateChain: 'asdf',
          jwsCertificate: 'asdf'
        }
      }
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      mapping.get['/api/environments/1/dfsps/testingtoolkitdfsp/jwscerts'] = original
    })
    it('should not throw error', async () => {
      const original = mapping.get['/api/environments/1/dfsps/testingtoolkitdfsp/jwscerts'] 
      mapping.get['/api/environments/1/dfsps/testingtoolkitdfsp/jwscerts'] = {
        status: 400
      }
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      mapping.get['/api/environments/1/dfsps/testingtoolkitdfsp/jwscerts'] = original
    })
    it('should not throw error', async () => {
      const original = mapping.get['/api/environments/1/dfsps/userdfsp/endpoints'] 
      mapping.get['/api/environments/1/dfsps/userdfsp/endpoints'] = {
        status: 400
      }
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      mapping.get['/api/environments/1/dfsps/userdfsp/endpoints'] = original
    })
    it('should not throw error', async () => {
      const original = mapping.get['/api/environments/1/dfsps/testingtoolkitdfsp/jwscerts'] 
      const mockData = {
        status: 200,
        data: {
          id: 1,
          rootCertificate: null,
          intermediateChain: null,
          jwsCertificate: (await readFileAsync('secrets/publickey.cer')).toString()
        }
      }
      mapping.get['/api/environments/1/dfsps/testingtoolkitdfsp/jwscerts'] = mockData
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      mapping.get['/api/environments/1/dfsps/testingtoolkitdfsp/jwscerts'] = original
    })
    
    it('should not throw error', async () => {
      const original = mapping.post['/api/environments/1/dfsps/testingtoolkitdfsp/jwscerts'] 
      mapping.post['/api/environments/1/dfsps/testingtoolkitdfsp/jwscerts'] = {
        status: 400
      }
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      mapping.post['/api/environments/1/dfsps/testingtoolkitdfsp/jwscerts'] = original
    })

    it('should not throw error', async () => {
      reject.post['/api/environments/1/dfsps/testingtoolkitdfsp/jwscerts']  = {}
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      reject.post['/api/environments/1/dfsps/testingtoolkitdfsp/jwscerts']  = false
    })
    it('should not throw error', async () => {
      reject.post['/api/environments/1/dfsps/testingtoolkitdfsp/jwscerts']  = {response: {data: {}}}
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      reject.post['/api/environments/1/dfsps/testingtoolkitdfsp/jwscerts']  = false
    })
    it('should not throw error', async () => {
      const original = mapping.get['/api/environments/1/dfsps/userdfsp/jwscerts'] 
      mapping.get['/api/environments/1/dfsps/userdfsp/jwscerts'] = {
        status: 400
      }
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      mapping.get['/api/environments/1/dfsps/userdfsp/jwscerts'] = original
    })
    it('should not throw error', async () => {
      const original = mapping.get['/api/environments/1/dfsps/userdfsp/ca'] 
      mapping.get['/api/environments/1/dfsps/userdfsp/ca'] = {
        status: 400
      }
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      mapping.get['/api/environments/1/dfsps/userdfsp/ca'] = original
    })
    it('should not throw error', async () => {
      const original = mapping.get['/api/environments/1/ca/rootCert'] 
      mapping.get['/api/environments/1/ca/rootCert'] = {
        status: 200,
        data: {
          certificate: 'asdf'
        }
      }
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      mapping.get['/api/environments/1/ca/rootCert'] = original
    })
    it('should not throw error', async () => {
      const original = mapping.get['/api/environments/1/ca/rootCert'] 
      mapping.get['/api/environments/1/ca/rootCert'] = {
        status: 400
      }
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      mapping.get['/api/environments/1/ca/rootCert'] = original
    })
    it('should not throw error', async () => {
      const original = mapping.post['/api/environments/1/cas'] 
      mapping.post['/api/environments/1/cas'] = {
        status: 400
      }
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      mapping.post['/api/environments/1/cas'] = original
    })
    it('should not throw error', async () => {
      reject.post['/api/environments/1/cas'] = {}
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      reject.post['/api/environments/1/cas'] = false
    })
    it('should not throw error', async () => {
      reject.post['/api/environments/1/cas'] = {response: {data: {}}}
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      reject.post['/api/environments/1/cas'] = false
    })
    it('should not throw error', async () => {
      const original = mapping.post['/api/environments/1/dfsps/userdfsp/enrollments/inbound/1/sign'] 
      mapping.post['/api/environments/1/dfsps/userdfsp/enrollments/inbound/1/sign'] = {
        status: 200,
        data: {
          id: 1,
          validationState: 'VALID'
        }
      }
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      mapping.post['/api/environments/1/dfsps/userdfsp/enrollments/inbound/1/sign'] = original
    })
    it('should not throw error', async () => {
      const original = mapping.post['/api/environments/1/dfsps/userdfsp/enrollments/inbound/1/sign'] 
      mapping.post['/api/environments/1/dfsps/userdfsp/enrollments/inbound/1/sign'] = {
        status: 400
      }
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      mapping.post['/api/environments/1/dfsps/userdfsp/enrollments/inbound/1/sign'] = original
    })
    it('should not throw error', async () => {
      const original = mapping.get['/api/environments/1/dfsps/userdfsp/enrollments/inbound'] 
      mapping.get['/api/environments/1/dfsps/userdfsp/enrollments/inbound'] = {
        status: 400
      }
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      mapping.get['/api/environments/1/dfsps/userdfsp/enrollments/inbound'] = original
    })
    it('should not throw error', async () => {
      const original = mapping.get['/api/environments/1/dfsps/userdfsp/enrollments/outbound'] 
      mapping.get['/api/environments/1/dfsps/userdfsp/enrollments/outbound'] = {
        status: 200,
        data: [
          {
            id: 1,
            state: 'CERT_NOT_SIGNED',
            validationState: 'VALID',
            certificate: 'asdf'
          }
        ]
      }
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      mapping.get['/api/environments/1/dfsps/userdfsp/enrollments/outbound'] = original
    })
    it('should not throw error', async () => {
      const original = mapping.get['/api/environments/1/dfsps/userdfsp/enrollments/outbound'] 
      mapping.get['/api/environments/1/dfsps/userdfsp/enrollments/outbound'] = {
        status: 400
      }
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      mapping.get['/api/environments/1/dfsps/userdfsp/enrollments/outbound'] = original
    })
    it('should not throw error', async () => {
      const original = mapping.get['/api/environments/1/hub/servercerts'] 
      mapping.get['/api/environments/1/hub/servercerts'] = {
        status: 400
      }
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      mapping.get['/api/environments/1/hub/servercerts'] = original
    })
    it('should not throw error', async () => {
      const original = mapping.get['/api/environments/1/hub/servercerts'] 
      mapping.get['/api/environments/1/hub/servercerts'] = {
        status: 400
      }
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      mapping.get['/api/environments/1/hub/servercerts'] = original
    })
    it('should not throw error', async () => {
      const original = mapping.get['/api/environments/1/dfsps/userdfsp/servercerts'] 
      mapping.get['/api/environments/1/dfsps/userdfsp/servercerts'] = {
        status: 400
      }
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      mapping.get['/api/environments/1/dfsps/userdfsp/servercerts'] = original
    })
    it('should not throw error', async () => {
      reject.post['/api/environments/1/dfsps'] = {}
      reject.post['/api/environments/1/dfsps/userdfsp/enrollments/inbound/1/sign'] = {}
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      reject.post['/api/environments/1/dfsps'] = false
      reject.post['/api/environments/1/dfsps/userdfsp/enrollments/inbound/1/sign'] = false
    })
    it('should not throw error', async () => {
      reject.post['/api/environments/1/dfsps'] = {response: {data: {}}}
      reject.post['/api/environments/1/dfsps/userdfsp/enrollments/inbound/1/sign'] = {response: {data: {}}}
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      reject.post['/api/environments/1/dfsps'] = false
      reject.post['/api/environments/1/dfsps/userdfsp/enrollments/inbound/1/sign'] = false
    })
    it('should not throw error', async () => {
      const original = mapping.get['/api/environments/1/dfsps/userdfsp/enrollments/outbound'] 
      mapping.get['/api/environments/1/dfsps/userdfsp/enrollments/outbound'] = {
        status: 400
      }
      reject.post['/api/environments/1/dfsps/userdfsp/enrollments/outbound'] = {}
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      mapping.get['/api/environments/1/dfsps/userdfsp/enrollments/outbound'] = original
      reject.post['/api/environments/1/dfsps/userdfsp/enrollments/outbound'] = false
    })
    it('should not throw error', async () => {
      const original = mapping.get['/api/environments/1/dfsps/userdfsp/enrollments/outbound'] 
      mapping.get['/api/environments/1/dfsps/userdfsp/enrollments/outbound'] = {
        status: 400
      }
      reject.post['/api/environments/1/dfsps/userdfsp/enrollments/outbound'] = {response: {data: {}}}
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      mapping.get['/api/environments/1/dfsps/userdfsp/enrollments/outbound'] = original
      reject.post['/api/environments/1/dfsps/userdfsp/enrollments/outbound'] = false
    })
    it('should not throw error', async () => {
      const originalGet = mapping.get['/api/environments/1/dfsps/userdfsp/enrollments/outbound'] 
      mapping.get['/api/environments/1/dfsps/userdfsp/enrollments/outbound'] = {
        status: 400
      }
      const originalPost = mapping.get['/api/environments/1/dfsps/userdfsp/enrollments/outbound'] 
      mapping.post['/api/environments/1/dfsps/userdfsp/enrollments/outbound'] = {
        status: 400
      }
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      mapping.get['/api/environments/1/dfsps/userdfsp/enrollments/outbound'] = originalGet
      mapping.post['/api/environments/1/dfsps/userdfsp/enrollments/outbound'] = originalPost
    })
    it('should not throw error', async () => {
      const original = mapping.put['/api/environments/1/hub/servercerts'] 
      mapping.put['/api/environments/1/hub/servercerts'] = {
        status: 400
      }
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      mapping.put['/api/environments/1/hub/servercerts'] = original
    })
    it('should not throw error', async () => {
      reject.put['/api/environments/1/hub/servercerts'] = {}
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      reject.put['/api/environments/1/hub/servercerts'] = false
    })
    it('should not throw error', async () => {
      reject.put['/api/environments/1/hub/servercerts'] = {response: {data: {}}}
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      reject.put['/api/environments/1/hub/servercerts'] = false
    })
    it('should not throw error', async () => {
      const originalGet = mapping.get['/api/environments/1/hub/servercerts'] 
      mapping.get['/api/environments/1/hub/servercerts'] = {
        status: 400
      }
      const originalPost = mapping.post['/api/environments/1/hub/servercerts'] 
      mapping.post['/api/environments/1/hub/servercerts'] = {
        status: 400
      }
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      mapping.get['/api/environments/1/hub/servercerts'] = originalGet
      mapping.post['/api/environments/1/hub/servercerts'] = originalPost
    })
    it('should not throw error', async () => {
      const original = mapping.get['/api/environments/1/hub/servercerts'] 
      mapping.get['/api/environments/1/hub/servercerts'] = {
        status: 400
      }
      reject.post['/api/environments/1/hub/servercerts'] = {}
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      reject.post['/api/environments/1/hub/servercerts'] = false
      mapping.get['/api/environments/1/hub/servercerts'] = original
    })
    it('should not throw error', async () => {
      const original = mapping.get['/api/environments/1/hub/servercerts'] 
      mapping.get['/api/environments/1/hub/servercerts'] = {
        status: 400
      }
      reject.post['/api/environments/1/hub/servercerts'] = {response: {data: {}}}
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
      reject.post['/api/environments/1/hub/servercerts'] = false
      mapping.get['/api/environments/1/hub/servercerts'] = original
    })
  })
  describe('getTlsConfig', () => {
    it('should have required properties', async () => {
      const tlsConfig = await MBConnectionManagerProvider.getTlsConfig()
      expect(tlsConfig).toHaveProperty('hubCaCert')
      expect(tlsConfig).toHaveProperty('hubServerCaRootCert')
      expect(tlsConfig).toHaveProperty('hubServerCert')
      expect(tlsConfig).toHaveProperty('hubServerKey')
      expect(tlsConfig).toHaveProperty('hubClientKey')
    })
  })
  describe('getTestingToolkitDfspJWSCerts', () => {
    it('should return certificate value', async () => {
      const dfspJwsCerts = await MBConnectionManagerProvider.getTestingToolkitDfspJWSCerts()
      expect(dfspJwsCerts).toEqual('asdf')
    })
  })
  describe('getTestingToolkitDfspJWSPrivateKey', () => {
    it('should return certificate value', async () => {
      const dfspJwsCerts = await MBConnectionManagerProvider.getTestingToolkitDfspJWSPrivateKey()
      expect(dfspJwsCerts).toBeTruthy()
    })
  })
  describe('waitForTlsHubCerts', () => {
    it('should wait for tls certs', async () => {
      await expect(MBConnectionManagerProvider.waitForTlsHubCerts()).resolves.toBe(true)
    })
  })
  describe('getUserDfspJWSCerts', () => {
    it('should get user dfsp jws certs', async () => {
      await expect(MBConnectionManagerProvider.getUserDfspJWSCerts()).resolves.toBeNull()
    })
    it('should get user dfsp jws certs', async () => {
      await expect(MBConnectionManagerProvider.getUserDfspJWSCerts('userdfsp')).resolves.toBe('asdf')
    })
  })
  describe('getEndpointsConfig', () => {
    it('get endpooints config', async () => {
      const response = await MBConnectionManagerProvider.getEndpointsConfig()
      expect(response).toBeDefined()
    })
  })
})
