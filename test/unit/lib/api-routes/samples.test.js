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
 * Georgi Logodazhki <georgi.logodazhki@modusbox.com> (Original Author)
 --------------
 ******/

const Config = require('../../../../src/lib/config')
jest.mock('../../../../src/lib/config')
Config.getSystemConfig.mockReturnValue({
  OAUTH: {
    AUTH_ENABLED: false
  }
})

const request = require('supertest')
const apiServer = require('../../../../src/lib/api-server')
const app = apiServer.getApp()
const loadSamples = require('../../../../src/lib/loadSamples')
const requestLogger = require('../../../../src/lib/requestLogger')

jest.mock('../../../../src/lib/requestLogger')
const spyGetSample = jest.spyOn(loadSamples, 'getSample')
const spyGetSampleWithFolderWise = jest.spyOn(loadSamples, 'getSampleWithFolderWise')
const spyGetCollectionsOrEnvironments = jest.spyOn(loadSamples, 'getCollectionsOrEnvironments')
const spyGetCollectionsOrEnvironmentsWithFileSize = jest.spyOn(loadSamples, 'getCollectionsOrEnvironmentsWithFileSize')


describe('API route /api/samples', () => {
  beforeAll(() => {
    requestLogger.logMessage.mockReturnValue()
  })
  describe('GET /api/samples/load', () => {
    it('Send a proper request', async () => {
      spyGetSample.mockResolvedValue()
      const res = await request(app).get(`/api/samples/load`).send()
      expect(res.statusCode).toEqual(200)
    })
    it('Send a proper request with type: hub', async () => {
      spyGetSample.mockRejectedValue({message: ''})
      const res = await request(app).get(`/api/samples/load`).send()
      expect(res.statusCode).toEqual(500)
    })
  })
  describe('GET /api/samples/loadFolderWise', () => {
    it('Send a proper request', async () => {
      spyGetSampleWithFolderWise.mockResolvedValue()
      const res = await request(app).get(`/api/samples/loadFolderWise`).send()
      expect(res.statusCode).toEqual(200)
    })
    it('Send a proper request with type: hub', async () => {
      spyGetSampleWithFolderWise.mockRejectedValue({message: ''})
      const res = await request(app).get(`/api/samples/loadFolderWise`).send()
      expect(res.statusCode).toEqual(500)
    })
  })
  describe('GET /api/samples', () => {
    it('Send a proper request with missing collections query param', async () => {
      spyGetCollectionsOrEnvironments.mockResolvedValue()
      const res = await request(app).get(`/api/samples/load/collections`).send()
      expect(res.statusCode).toEqual(200)
    })
    it('Send a bad request with not existing environment', async () => {
      spyGetCollectionsOrEnvironments.mockRejectedValue({message: ''})
      const res = await request(app).get(`/api/samples/load/collections`).send()
      expect(res.statusCode).toEqual(500)
    })
  })
  describe('GET /api/samples with file sizes', () => {
    it('Send a proper request with missing collections query param', async () => {
      spyGetCollectionsOrEnvironmentsWithFileSize.mockResolvedValue()
      const res = await request(app).get(`/api/samples/list/collections`).send()
      expect(res.statusCode).toEqual(200)
    })
    it('Send a bad request with not existing environment', async () => {
      spyGetCollectionsOrEnvironmentsWithFileSize.mockRejectedValue({message: ''})
      const res = await request(app).get(`/api/samples/list/collections`).send()
      expect(res.statusCode).toEqual(500)
    })
    it('Send a proper request with Hosting mode enabled', async () => {
      Config.getSystemConfig.mockReturnValue({
        OAUTH: {
          AUTH_ENABLED: false
        },
        HOSTING_ENABLED: true
      })
      spyGetCollectionsOrEnvironmentsWithFileSize.mockResolvedValue([{name: 'examples/collections/dfsp'}])
      const res = await request(app).get(`/api/samples/list/collections`).send()
      expect(res.statusCode).toEqual(200)
    })
    it('Send a proper request with Hosting mode enabled', async () => {
      Config.getSystemConfig.mockReturnValue({
        OAUTH: {
          AUTH_ENABLED: false
        },
        HOSTING_ENABLED: true
      })
      spyGetCollectionsOrEnvironmentsWithFileSize.mockResolvedValue([{name: 'examples/environments/dfsp'}])
      const res = await request(app).get(`/api/samples/list/environments`).send()
      expect(res.statusCode).toEqual(200)
    })
  })
})
