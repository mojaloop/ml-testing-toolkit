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

const APIManagement = require('../../../src/lib/api-management')
const Utils = require('../../../src/lib/utils')
const Config = require('../../../src/lib/config')
const OpenApiBackend = require('openapi-backend').default
const fs = require('fs')
const axios = require('axios')
const tmp = require('tmp')

jest.mock('../../../src/lib/utils')
jest.mock('../../../src/lib/config')
jest.mock('openapi-backend')

const specFilePrefix = 'test/'
const apiSpecSyncFile = fs.readFileSync(specFilePrefix + 'api_spec_sync.yaml')

fs.readFile = jest.fn((path, callback) => { return callback(null, apiSpecSyncFile); });

const SpyGetSystemConfig = jest.spyOn(Config, 'getSystemConfig')
const SpyGetUserConfig = jest.spyOn(Config, 'getUserConfig')


describe('API Management', () => {
  describe('validateDefinition', () => {
    it('should not throw an error', async () => {
      await expect(APIManagement.validateDefinition(specFilePrefix + 'api_spec_sync.yaml')).resolves.not.toThrowError()
      expect(OpenApiBackend).toHaveBeenCalledTimes(1);
    })
  })
  describe('addDefinition', () => {
    SpyGetSystemConfig.mockReturnValue({
      API_DEFINITIONS: []
    })
    SpyGetUserConfig.mockReturnValue({
      ILP_SECRET: 'sample'
    })
    it('should not throw an error', async () => {
      await expect(APIManagement.addDefinition(specFilePrefix + 'api_spec_sync.yaml', 'name', '1.0', 'false')).resolves.toBeUndefined()
    })
    it('should load definition from URL', async () => {
      await expect(APIManagement.addDefinition(specFilePrefix + 'api_spec_url.json', 'name', '1.0', 'false')).resolves.toBeUndefined()
    })
  })
  describe('deleteDefinition', () => {
    it('Happy path', async () => {
      SpyGetSystemConfig.mockReturnValue({
        API_DEFINITIONS: [
          {
            type: 'name',
            version: '1.0',
            folderPath: "name_1.0",
            additionalApi: true
          }
        ]
      })
      SpyGetUserConfig.mockReturnValue({
        ILP_SECRET: 'sample'
      })
      await expect(APIManagement.deleteDefinition('name', '1.0')).resolves.toBe(true)
    })
    it('should throw an error when API is inbuilt API', async () => {

      SpyGetSystemConfig.mockReturnValue({
        API_DEFINITIONS: [
          {
            type: 'name',
            version: '1.0',
            folderPath: "name_1.0",
            additionalApi: false
          }
        ]
      })
      SpyGetUserConfig.mockReturnValue({
        ILP_SECRET: 'sample'
      })
      await expect(APIManagement.deleteDefinition('name', '1.0')).rejects.toThrowError()
    })
    it('should throw an error when API not found', async () => {
      SpyGetSystemConfig.mockReturnValue({
        API_DEFINITIONS: []
      })
      SpyGetUserConfig.mockReturnValue({
        ILP_SECRET: 'sample'
      })
      await expect(APIManagement.deleteDefinition('name', '1.0')).rejects.toThrowError()
    })
  })
  describe('patchDefinitionParams', () => {
    it('should not throw an error when patching hostnames', async () => {
      SpyGetSystemConfig.mockReturnValue({
        API_DEFINITIONS: [
          {
            type: 'name',
            version: '1.0',
            folderPath: "name_1.0",
            additionalApi: true
          }
        ]
      })
      await expect(APIManagement.patchDefinitionParams('name', '1.0', { hostnames: ['hostname1', 'hostname2'] })).resolves.toBe(true)
    })
    it('should not throw an error when patching prefix', async () => {
      SpyGetSystemConfig.mockReturnValue({
        API_DEFINITIONS: [
          {
            type: 'name',
            version: '1.0',
            folderPath: "name_1.0",
          }
        ]
      })
    })
    it('should throw an error when patching non-existent API', async () => {
      SpyGetSystemConfig.mockReturnValue({
      API_DEFINITIONS: []
      })
      await expect(APIManagement.patchDefinitionParams('nonexistent', '1.0', { hostnames: ['host'] })).rejects.toThrowError('Requested API is not found')
    })

    it('should patch both hostnames and prefix', async () => {
      const apiDef = {
      type: 'name',
      version: '1.0',
      folderPath: "name_1.0",
      additionalApi: true
      }
      SpyGetSystemConfig.mockReturnValue({
      API_DEFINITIONS: [apiDef]
      })
      const patchParams = { hostnames: ['host1'], prefix: '/api' }
      await expect(APIManagement.patchDefinitionParams('name', '1.0', patchParams)).resolves.toBe(true)
      expect(apiDef.hostnames).toEqual(['host1'])
      expect(apiDef.prefix).toEqual('/api')
    })

    it('should patch only hostnames if prefix is undefined', async () => {
      const apiDef = {
      type: 'name',
      version: '1.0',
      folderPath: "name_1.0",
      additionalApi: true
      }
      SpyGetSystemConfig.mockReturnValue({
      API_DEFINITIONS: [apiDef]
      })
      const patchParams = { hostnames: ['host2'] }
      await expect(APIManagement.patchDefinitionParams('name', '1.0', patchParams)).resolves.toBe(true)
      expect(apiDef.hostnames).toEqual(['host2'])
      expect(apiDef.prefix).toBeUndefined()
    })

    it('should patch only prefix if hostnames is undefined', async () => {
      const apiDef = {
      type: 'name',
      version: '1.0',
      folderPath: "name_1.0",
      additionalApi: true
      }
      SpyGetSystemConfig.mockReturnValue({
      API_DEFINITIONS: [apiDef]
      })
      const patchParams = { prefix: '/newprefix' }
      await expect(APIManagement.patchDefinitionParams('name', '1.0', patchParams)).resolves.toBe(true)
      expect(apiDef.prefix).toEqual('/newprefix')
      expect(apiDef.hostnames).toBeUndefined()
    })
  })

  describe('validateDefinition with remote URL', () => {
    // Mock axios.get globally for tests that require remote URL loading
    const mockYamlContent = `
      openapi: 3.0.0
      info:
        title: Mojaloop API
        version: 2.0.0
      paths: {}
    `
    axios.get = jest.fn().mockResolvedValue({
      data: mockYamlContent,
      headers: { 'content-type': 'application/x-yaml' }
    })
    const remoteYamlUrl = 'https://raw.githubusercontent.com/mojaloop/api-snippets/refs/heads/main/docs/fspiop-rest-v2.0-openapi3-snippets.yaml'

    it('should load and validate definition from remote YAML URL', async () => {
      // Write the URL to a temp file as expected by checkUrl
      const tmpFile = tmp.fileSync()
      fs.writeFileSync(tmpFile.name, `"${remoteYamlUrl}"`)
      await expect(APIManagement.validateDefinition(tmpFile.name)).resolves.not.toThrowError()
      tmpFile.removeCallback()
    })
    it('should load and validate definition from remote JSON URL', async () => {
      const mockJsonContent = JSON.stringify({
      openapi: "3.0.0",
      info: { title: "Mojaloop API", version: "2.0.0" },
      paths: {}
      })
      axios.get.mockResolvedValueOnce({
      data: mockJsonContent,
      headers: { 'content-type': 'application/json' }
      })
      const remoteJsonUrl = 'https://example.com/openapi.json'
      const tmpFile = tmp.fileSync()
      fs.writeFileSync(tmpFile.name, `"${remoteJsonUrl}"`)
      await expect(APIManagement.validateDefinition(tmpFile.name)).resolves.not.toThrowError()
      tmpFile.removeCallback()
    })

    it('should fallback to YAML parsing if JSON parsing fails for remote URL', async () => {
      const invalidJsonContent = "openapi: 3.0.0\ninfo:\n  title: Mojaloop API\n  version: 2.0.0\npaths: {}"
      axios.get.mockResolvedValueOnce({
      data: invalidJsonContent,
      headers: { 'content-type': 'application/json' }
      })
      const remoteYamlUrl = 'https://example.com/openapi-fallback.yaml'
      const tmpFile = tmp.fileSync()
      fs.writeFileSync(tmpFile.name, `"${remoteYamlUrl}"`)
      await expect(APIManagement.validateDefinition(tmpFile.name)).resolves.not.toThrowError()
      tmpFile.removeCallback()
    })

    it('should handle remote URL with single quotes', async () => {
      axios.get.mockResolvedValueOnce({
      data: mockYamlContent,
      headers: { 'content-type': 'application/x-yaml' }
      })
      const tmpFile = tmp.fileSync()
      fs.writeFileSync(tmpFile.name, `'${remoteYamlUrl}'`)
      await expect(APIManagement.validateDefinition(tmpFile.name)).resolves.not.toThrowError()
      tmpFile.removeCallback()
    })

    it('should handle remote URL with BOM', async () => {
      axios.get.mockResolvedValueOnce({
      data: mockYamlContent,
      headers: { 'content-type': 'application/x-yaml' }
      })
      const tmpFile = tmp.fileSync()
      // Write BOM + quoted URL
      fs.writeFileSync(tmpFile.name, '\uFEFF"' + remoteYamlUrl + '"')
      await expect(APIManagement.validateDefinition(tmpFile.name)).resolves.not.toThrowError()
      tmpFile.removeCallback()
    })

    it('should throw error if remote URL cannot be fetched', async () => {
      axios.get.mockRejectedValueOnce(new Error('Network error'))
      const tmpFile = tmp.fileSync()
      fs.writeFileSync(tmpFile.name, `"https://invalid-url.example.com/openapi.yaml"`)
      await expect(APIManagement.validateDefinition(tmpFile.name)).rejects.toThrowError()
      tmpFile.removeCallback()
    })
  })
})
