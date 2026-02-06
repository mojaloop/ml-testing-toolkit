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

'use strict'

const request = require('supertest')
const express = require('express')
const keycloakRoutes = require('../../../../src/lib/api-routes/keycloak')
const KeycloakHelper = require('../../../../src/lib/oauth/KeycloakHelper')

jest.mock('../../../../src/lib/oauth/KeycloakHelper')

describe('Keycloak API Routes', () => {
  let app

  beforeEach(() => {
    app = express()
    app.use(express.json())
    app.use((req, res, next) => {
      req.user = { dfspId: 'test-dfsp', groups: ['test-group'] }
      next()
    })
    app.use('/keycloak', keycloakRoutes)
    jest.clearAllMocks()
  })

  describe('GET /clientinfo', () => {
    it('should return client info successfully', async () => {
      const mockResponse = { clientId: 'test-client', clientSecret: 'secret' }
      KeycloakHelper.getClientAuthInfo.mockResolvedValue(mockResponse)

      const response = await request(app)
        .get('/keycloak/clientinfo')
        .expect(200)

      expect(response.body).toEqual(mockResponse)
      expect(KeycloakHelper.getClientAuthInfo).toHaveBeenCalledWith({ dfspId: 'test-dfsp', groups: ['test-group'] })
    })

    it('should handle errors and return 500', async () => {
      const mockError = new Error('Failed to get client info')
      KeycloakHelper.getClientAuthInfo.mockRejectedValue(mockError)

      const response = await request(app)
        .get('/keycloak/clientinfo')
        .expect(500)

      expect(response.body).toEqual({ error: 'Failed to get client info' })
    })

    it('should handle errors without message', async () => {
      KeycloakHelper.getClientAuthInfo.mockRejectedValue(null)

      const response = await request(app)
        .get('/keycloak/clientinfo')
        .expect(500)

      expect(response.body).toEqual({ error: null })
    })
  })

  describe('POST /tokeninfo', () => {
    it('should return token info successfully', async () => {
      const mockResponse = { access_token: 'token123', expires_in: 3600 }
      KeycloakHelper.getTokenInfo.mockResolvedValue(mockResponse)

      const response = await request(app)
        .post('/keycloak/tokeninfo')
        .send({ token: 'some-token' })
        .expect(200)

      expect(response.body).toEqual(mockResponse)
      expect(KeycloakHelper.getTokenInfo).toHaveBeenCalledWith({ token: 'some-token' })
    })

    it('should handle errors and return 500', async () => {
      const mockError = new Error('Failed to get token info')
      KeycloakHelper.getTokenInfo.mockRejectedValue(mockError)

      const response = await request(app)
        .post('/keycloak/tokeninfo')
        .send({ token: 'some-token' })
        .expect(500)

      expect(response.body).toEqual({ error: 'Failed to get token info' })
    })

    it('should handle errors without message', async () => {
      KeycloakHelper.getTokenInfo.mockRejectedValue(null)

      const response = await request(app)
        .post('/keycloak/tokeninfo')
        .send({ token: 'some-token' })
        .expect(500)

      expect(response.body).toEqual({ error: null })
    })
  })
})
