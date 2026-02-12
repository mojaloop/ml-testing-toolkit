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
 - Shashikant Hirugade <shashi.mojaloop@gmail.com>

 --------------
 ******/

'use strict'

const express = require('express')
const request = require('supertest')

jest.mock('../../../../src/lib/oauth/KeycloakHelper', () => ({
  getClientAuthInfo: jest.fn(),
  getTokenInfo: jest.fn()
}))

const KeycloakHelper = require('../../../../src/lib/oauth/KeycloakHelper')
const router = require('../../../../src/lib/api-routes/keycloak.js')

const makeApp = () => {
  const app = express()
  app.use(express.json())

  // Add a tiny middleware to populate req.user for /clientinfo
  app.use((req, res, next) => {
    req.user = { sub: 'user-123', name: 'Test User' }
    next()
  })

  app.use(router)
  return app
}

describe('Auth router', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /clientinfo', () => {
    it('should return 200 with client info', async () => {
      const app = makeApp()

      KeycloakHelper.getClientAuthInfo.mockResolvedValue({
        clientId: 'abc',
        roles: ['role1']
      })

      const res = await request(app).get('/clientinfo').expect(200)

      expect(res.body).toEqual({ clientId: 'abc', roles: ['role1'] })

      // verify req.user was passed through
      expect(KeycloakHelper.getClientAuthInfo).toHaveBeenCalledTimes(1)
      expect(KeycloakHelper.getClientAuthInfo).toHaveBeenCalledWith({
        sub: 'user-123',
        name: 'Test User'
      })
    })

    it('should return 500 when KeycloakHelper throws and include message', async () => {
      const app = makeApp()

      KeycloakHelper.getClientAuthInfo.mockRejectedValue(new Error('boom'))

      const res = await request(app).get('/clientinfo').expect(500)

      expect(res.body).toEqual({ error: 'boom' })
      expect(KeycloakHelper.getClientAuthInfo).toHaveBeenCalledTimes(1)
    })

    it('should return 500 with empty error if thrown value has no message', async () => {
      const app = makeApp()

      // e.g. someone throws a string or plain object
      KeycloakHelper.getClientAuthInfo.mockRejectedValue({})

      const res = await request(app).get('/clientinfo').expect(500)

      expect(res.body).toEqual({ error: undefined })
      expect(KeycloakHelper.getClientAuthInfo).toHaveBeenCalledTimes(1)
    })
  })

  describe('POST /tokeninfo', () => {
    it('should return 200 with token info', async () => {
      const app = makeApp()

      KeycloakHelper.getTokenInfo.mockResolvedValue({
        active: true,
        scope: 'read write'
      })

      const payload = { access_token: 'abc.def.ghi' }

      const res = await request(app)
        .post('/tokeninfo')
        .send(payload)
        .expect(200)

      expect(res.body).toEqual({ active: true, scope: 'read write' })

      // verify req.body passed through
      expect(KeycloakHelper.getTokenInfo).toHaveBeenCalledTimes(1)
      expect(KeycloakHelper.getTokenInfo).toHaveBeenCalledWith(payload)
    })

    it('should return 500 when KeycloakHelper throws and include message', async () => {
      const app = makeApp()

      KeycloakHelper.getTokenInfo.mockRejectedValue(new Error('invalid token'))

      const res = await request(app)
        .post('/tokeninfo')
        .send({ access_token: 'bad' })
        .expect(500)

      expect(res.body).toEqual({ error: 'invalid token' })
      expect(KeycloakHelper.getTokenInfo).toHaveBeenCalledTimes(1)
    })

    it('should return 500 with empty error if thrown value has no message', async () => {
      const app = makeApp()

      KeycloakHelper.getTokenInfo.mockRejectedValue(null)

      const res = await request(app)
        .post('/tokeninfo')
        .send({ access_token: 'x' })
        .expect(500)

      expect(res.body).toEqual({ error: null && null.message }) // -> { error: null }
      // simpler assertion:
      expect(res.body).toEqual({ error: null })
      expect(KeycloakHelper.getTokenInfo).toHaveBeenCalledTimes(1)
    })
  })
})