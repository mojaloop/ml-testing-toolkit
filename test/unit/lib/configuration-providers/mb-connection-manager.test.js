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
jest.mock('axios')
jest.mock('../../../../src/lib/config')

Config.getUserConfig.mockImplementation(() => {
  return {
    JWS_SIGN: true,
    VALIDATE_INBOUND_JWS: true,
    OUTBOUND_MUTUAL_TLS_ENABLED: true,
    INBOUND_MUTUAL_TLS_ENABLED: true,
    CONNECTION_MANAGER_API_URL: ''
  }
})

axios.post.mockImplementation((url) => {
  switch(url) {
    // Create Environment
    case '/api/environments':
      return Promise.resolve({
          status: 200,
          data: {
            id: 1
          }
      })
      break
    // Create DFSP
    case '/api/environments/1/dfsps':
      return Promise.resolve({
          status: 200,
          data: {
            id: 1
          }
      })
      break
    // Create Hub CA
    case '/api/environments/1/cas':
      return Promise.resolve({
          status: 200,
          data: {
            id: 1,
            certificate: 'asdf'
          }
      })
      break

      // Upload Hub CSR
    case '/api/environments/1/dfsps/userdfsp/enrollments/outbound':
      return Promise.resolve({
          status: 200,
          data: {
            id: 1,
            certificate: '',
            validationState: 'VALID'
          }
      })
      break

    case '/api/environments/1/dfsps/userdfsp/enrollments/inbound/1/sign':
      return Promise.resolve({
        status: 200,
        data: {
          id: 1,
          certificate: 'asdf',
          validationState: 'VALID'
        }
      })
      break
      // Upload Hub Server certs
    case '/api/environments/1/hub/servercerts':
      return Promise.resolve({
          status: 200,
          data: {
            id: 1,
            certificate: ''
          }
      })
      break

      // Upload Testing Toolkit JWS certs
    case '/api/environments/1/dfsps/testingtoolkitdfsp/jwscerts':
      return Promise.resolve({
          status: 200,
          data: {
            rootCertificate: 'asdf',
            intermediateChain: 'asdf',
            jwsCertificate: 'asdf'
          }
      })
      break

    default:
      return Promise.reject(new Error('not found'))
  }
})

axios.get.mockImplementation((url) => {
  switch(url) {
    case '/api/environments':
      return Promise.resolve({
        status: 200,
        data: [{
          name: 'NOT-TESTING-TOOLKIT'
        }]
      })
      break

      case '/api/environments/1/dfsps':
        return Promise.resolve({
          status: 200,
          data: [{
            id: 0
          }]
        })
        break
    // Get DFSP CA
    case '/api/environments/1/dfsps/userdfsp/ca':
      return Promise.resolve({
          status: 200,
          data: {
            rootCertificate: 'asdf',
            validationState: 'VALID'
          }
      })
      break

    case '/api/environments/1/dfsps/userdfsp/servercerts':
      return Promise.resolve({
          status: 200,
          data: {
            rootCertificate: 'asdf',
            validationState: 'VALID',
            intermediateChain: 'asdf',
            serverCertificate: 'asdf'
          }
      })
      break

      case '/api/environments/1/hub/servercerts':
        return Promise.resolve({
            status: 200,
            data: {
              rootCertificate: 'asdf',
              validationState: 'VALID',
              intermediateChain: 'asdf',
              serverCertificate: 'asdf'
            }
        })
        break

    // Get Hub CSR

    case '/api/environments/1/dfsps/userdfsp/enrollments/outbound':
      return Promise.resolve({
          status: 200,
          data: [
            {
              id: 1,
              state: 'CERT_SIGNED',
              validationState: 'VALID',
              certificate: 'asdf'
            }
          ]
      })
      break

    case '/api/environments/1/dfsps/userdfsp/enrollments/inbound':
      return Promise.resolve({
          status: 200,
          data: [
            {
              id: 1,
              state: 'CSR_LOADED',
              validationState: 'VALID',
              certificate: 'asdf'
            }
          ]
      })
      break

    // Get User DFSP JWS certs
    case '/api/environments/1/dfsps/userdfsp/jwscerts':
      return Promise.resolve({
          status: 200,
          data: {
            id: 1,
            rootCertificate: 'asdf',
            intermediateChain: 'asdf',
            jwsCertificate: 'asdf'
          }
      })
      break

    case '/api/environments/1/dfsps/testingtoolkitdfsp/jwscerts':
      return Promise.resolve({
          status: 200,
          data: {
            rootCertificate: 'asdf',
            intermediateChain: 'asdf',
            jwsCertificate: 'asdf'
          }
      })
      break

    case '/api/environments/1/dfsps/userdfsp/enrollments/inbound':
      return Promise.resolve({
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
      })
      break
    default:
      return Promise.reject(new Error('not found'))
  }
})

describe('mb-connection-manager', () => {
  describe('waitForTlsHubCerts', () => {
    it('should wait for tls certs', async () => {
      MBConnectionManagerProvider.waitForTlsHubCerts()
      await new Promise(resolve => setTimeout(resolve, 500))
    })
  })
  describe('initialize', () => {
    it('should not throw error', async () => {
      await expect(MBConnectionManagerProvider.initialize()).resolves.toBeUndefined()
    })
  })
  describe('getTlsConfig', () => {
    it('should have required properties', async () => {
      const tlsConfig = MBConnectionManagerProvider.getTlsConfig()
      expect(tlsConfig).toHaveProperty('hubCaCert')
      expect(tlsConfig).toHaveProperty('dfspCaRootCert')
      expect(tlsConfig).toHaveProperty('hubClientCert')
      expect(tlsConfig).toHaveProperty('hubServerCaRootCert')
      expect(tlsConfig).toHaveProperty('hubServerCert')
      expect(tlsConfig).toHaveProperty('hubServerKey')
      expect(tlsConfig).toHaveProperty('hubClientKey')
    })
  })
  describe('getTestingToolkitDfspJWSCerts', () => {
    it('should return certificate value', async () => {
      const dfspJwsCerts = MBConnectionManagerProvider.getTestingToolkitDfspJWSCerts()
      expect(dfspJwsCerts).toEqual('asdf')
    })
  })
  describe('getUserDfspJWSCerts', () => {
    it('should return certificate value', async () => {
      const dfspJwsCerts = MBConnectionManagerProvider.getUserDfspJWSCerts()
      expect(dfspJwsCerts).toEqual('asdf')
    })
  })
  describe('getTestingToolkitDfspJWSPrivateKey', () => {
    it('should return certificate value', async () => {
      const dfspJwsCerts = MBConnectionManagerProvider.getTestingToolkitDfspJWSPrivateKey()
      expect(dfspJwsCerts).toBeTruthy()
    })
  })
  describe('waitForTlsHubCerts', () => {
    it('should wait for tls certs', async () => {
      await expect(MBConnectionManagerProvider.waitForTlsHubCerts()).resolves.toBe(true)
    })
  })
})
