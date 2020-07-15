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
 * Georgi Logodazhki <georgi.logodazhki@modusbox.com>
 * Vijaya Kumar Guthi <vijaya.guthi@modusbox.com> (Original Author)
 --------------
 ******/

const request = require('supertest')
const apiServer = require('../../../../src/lib/api-server')
const jwt = require('jsonwebtoken')
const Config = require('../../../../src/lib/config')
const LoginService = require('../../../../src/lib/oauth/LoginService')

const SpySign = jest.spyOn(jwt, 'sign')
const SpyGetSystemConfig = jest.spyOn(Config, 'getSystemConfig')
const SpyLogin = jest.spyOn(LoginService, 'loginUser')
const SpyLogout = jest.spyOn(LoginService, 'logoutUser')

const app = apiServer.getApp()
jest.setTimeout(30000)

describe('API route /api/oauth2', () => {
  describe('GET /api/oauth2/token', () => {
    it('Verify oauth credentials when HOSTING_ENABLED is enabled', async () => {
      SpySign.mockReturnValueOnce('idToken')
      SpyGetSystemConfig.mockReturnValueOnce({
        HOSTING_ENABLED: true,
        OAUTH: {
          EMBEDDED_CERTIFICATE: 'password'
        }
      })
      const res = await request(app).post(`/api/oauth2/token`).send({
        username: 'userdfsp'
      })
      console.log(res)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('access_token')
      expect(res.body).toHaveProperty('id_token')
    })
    it('Verify oauth credentials when HOSTING_ENABLED is not enabled', async () => {
      SpySign.mockReturnValueOnce('idToken')
      SpyGetSystemConfig.mockReturnValueOnce({
        HOSTING_ENABLED: false,
        OAUTH: {
          EMBEDDED_CERTIFICATE: 'password'
        }
      })
      const res = await request(app).post(`/api/oauth2/token`)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('access_token')
      expect(res.body).toHaveProperty('id_token')
    })
    it('Verify oauth credentials should throw an error if sign fails', async () => {
      SpySign.mockImplementationOnce(() => {throw new Error()})
      const res = await request(app).post(`/api/oauth2/token`)
      expect(res.statusCode).toEqual(500)
    })
  })
  describe('GET /api/oauth2/logout', () => {
    it('logout should return 200 if successful', async () => {
      SpyLogout.mockResolvedValueOnce()
      const res = await request(app).get(`/api/oauth2/logout`)
      console.log(res.body)
      expect(res.statusCode).toEqual(200)
    })
    it('logout should return an error if not successful', async () => {
      SpyLogout.mockImplementationOnce(() => {throw new Error()})
      const res = await request(app).get(`/api/oauth2/logout`)
      expect(res.statusCode).toEqual(500)
    })
  })
  describe('POST /api/oauth2/login', () => {
    it('login should return 200 if successful', async () => {
      SpyLogin.mockResolvedValueOnce({})
      const res = await request(app).post(`/api/oauth2/login`).send({
        username: 'username',
        passwrod: 'password'
      })
      expect(res.statusCode).toEqual(200)
      expect(res.body).toStrictEqual({})
    })
    it('login should return an error if not successful', async () => {
      SpyLogin.mockImplementationOnce(() => {throw new Error()})
      const res = await request(app).post(`/api/oauth2/login`)
      expect(res.statusCode).toEqual(500)
    })
  })
})
