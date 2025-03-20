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
 * Georgi Logodazhki <georgi.logodazhki@modusbox.com>
 * Vijaya Kumar Guthi <vijaya.guthi@modusbox.com> (Original Author)
 --------------
 ******/

'use strict'

const Utils = require('../../../src/lib/utils')
const Config = require('../../../src/lib/config')
const requestLogger = require('../../../src/lib/requestLogger')
const dbAdapter = require('../../../src/lib/db/adapters/dbAdapter')

const SpyReadFileAsync = jest.spyOn(Utils, 'readFileAsync')
const SpyReadDirAsync = jest.spyOn(Utils, 'readDirAsync')
const SpyWriteFileAsync = jest.spyOn(Utils, 'writeFileAsync')
const SpyDeleteFileAsync = jest.spyOn(Utils, 'deleteFileAsync')

const SpyGetSystemConfig = jest.spyOn(Config, 'getSystemConfig')
jest.mock('../../../src/lib/requestLogger')
jest.mock('../../../src/lib/db/adapters/dbAdapter')

const RulesEngineModel = require('../../../src/lib/rulesEngineModel')

describe('RulesEngineModel', () => {
  beforeAll(() => {
    requestLogger.logMessage.mockReturnValue()
  })
  describe('model', () => {
    it('getModel should return the model', async () => {
      const result = await RulesEngineModel.getModel(undefined, 'response')
      expect(result).toBeDefined()      
    })
    it('getModel should return the model', async () => {
      dbAdapter.read.mockResolvedValue({
        data: {}
      })
      SpyReadFileAsync.mockResolvedValue(JSON.stringify([]))
      const result = await RulesEngineModel.getModel({dfspId: 'userdfsp'}, 'response')
      expect(result).toBeDefined()      
    })
    it('getModel should return the model', async () => {
      dbAdapter.read.mockResolvedValue({
        data: {
          key: 'value'
        }
      })
      const result = await RulesEngineModel.getModel({dfspId: 'userdfsp'}, 'response')
      expect(result).toBeDefined()      
    })
  })
  describe('response', () => {
    afterEach(() => {
      SpyReadFileAsync.mockReset()
    })
    it('getResponseRulesEngine with a parameter should not reload rules', async () => {
      const result = await RulesEngineModel.getResponseRulesEngine([])
      expect(result).not.toBeUndefined()      
    })
    it('reloadResponseRules when active rules file is found with no rule conditions', async () => {
      SpyReadFileAsync.mockResolvedValue(JSON.stringify({
        activeRulesFile: 'activeRulesFile'
      }))
      SpyReadFileAsync.mockResolvedValue(JSON.stringify([]))
      const result = await RulesEngineModel.reloadResponseRules()
      expect(result).toBeUndefined()      
    })
    it('reloadResponseRules when active rules file is found with rule conditions', async () => {
      SpyReadFileAsync.mockResolvedValue(JSON.stringify({
        activeRulesFile: 'activeRulesFile'
      }))
      SpyReadFileAsync.mockResolvedValue(JSON.stringify([{
        "conditions": {
          "all": [
            {
              "fact": "operationPath",
              "operator": "equal",
              "value": "/settlementWindows/{id}"
            },
            {
              "fact": "headers",
              "path": "FSPIOP-Source",
              "operator": "equal",
              "value": "userdfsp1"
            }
          ]
        },
        "event": {
          "method": null,
          "path": null,
          "params": {
            "body": {
              "state": "OPEN"
            },
            "statusCode": "200"
          },
          "delay": 0,
          "type": "MOCK_RESPONSE"
        }
      }]))
      
      const result = await RulesEngineModel.reloadResponseRules()
      expect(result).toBeUndefined()      
    })
    it('reloadResponseRules when active rules file is not found', async () => {
      SpyReadFileAsync.mockResolvedValue(JSON.stringify({
        activeRulesFile: 'activeRulesFile'
      }))
      try {
        await RulesEngineModel.reloadResponseRules()
      } catch (err) {}
    })
    it('setActiveResponseRulesFile should set activeRulesFile', async () => {
      SpyWriteFileAsync.mockResolvedValue()
      SpyReadFileAsync.mockResolvedValue(JSON.stringify({activeRulesFile: 'test.json'}))
      SpyReadFileAsync.mockResolvedValue(JSON.stringify([]))
      
      const result = await RulesEngineModel.setActiveResponseRulesFile('test.json')
      expect(result).toBeUndefined()      
    })
    it('getResponseRules should reload rules if not loaded', async () => {
      SpyReadFileAsync.mockResolvedValue(JSON.stringify([]))
      const result = await RulesEngineModel.getResponseRules()
      expect(result).not.toBeUndefined()      
    })
    it('getResponseRules should return stored rules', async () => {
      SpyReadFileAsync.mockResolvedValue(JSON.stringify([]))
      const result = await RulesEngineModel.getResponseRules()
      expect(result).not.toBeUndefined()      
    })
    it('getResponseRulesEngine should return rulesEngine', async () => {
      SpyReadFileAsync.mockResolvedValue(JSON.stringify({
        activeRulesFile: 'activeRulesFile'
      }))
      SpyReadFileAsync.mockResolvedValue(JSON.stringify([]))
      const result = await RulesEngineModel.getResponseRulesEngine()
      expect(result).not.toBeUndefined()      
    })
    it('getResponseRulesFiles should return activeRulesFile', async () => {
      SpyReadDirAsync.mockResolvedValue(['test.json', 'config.json'])
      const result = await RulesEngineModel.getResponseRulesFiles()
      expect(result).not.toBeNull()      
    })
    it('getResponseRulesFiles should return null', async () => {
      SpyReadDirAsync.mockRejectedValueOnce()
      const result = await RulesEngineModel.getResponseRulesFiles()
      expect(result).toBeNull()   
    })
    it('deleteResponseRulesFile should return true', async () => {
      SpyDeleteFileAsync.mockResolvedValue()
      SpyReadFileAsync.mockResolvedValue(JSON.stringify({
        activeRulesFile: 'activeRulesFile'
      }))
      SpyReadFileAsync.mockResolvedValue(JSON.stringify([]))
      
      const result = await RulesEngineModel.deleteResponseRulesFile('test.json')
      expect(result).toBeTruthy()  
    })
    it('deleteResponseRulesFile should return error', async () => {
      SpyDeleteFileAsync.mockRejectedValueOnce({message: 'error'})
      const result = await RulesEngineModel.deleteResponseRulesFile('test.json')
      expect(result).toStrictEqual({message: 'error'})  
    })
    it('setResponseRulesFileContent should return true', async () => {
      SpyGetSystemConfig.mockReturnValueOnce({
        CONFIG_VERSIONS: {
          response: '1.0'
        }
      })
      const fileContent = [{
        data: {}
      }]
      SpyWriteFileAsync.mockResolvedValue()
      SpyReadFileAsync.mockResolvedValue(JSON.stringify({
        activeRulesFile: 'activeRulesFile'
      }))
      SpyReadFileAsync.mockResolvedValue(JSON.stringify([]))
      
      const result = await RulesEngineModel.setResponseRulesFileContent('test.json', fileContent)
      expect(result).toBeTruthy() 
    })
    it('setResponseRulesFileContent should return true', async () => {
      SpyGetSystemConfig.mockReturnValueOnce({
        CONFIG_VERSIONS: {
          response: '1.0'
        }
      })
      const fileContent = [{
        type: 'response',
        version: '1.0'
      }]
      SpyWriteFileAsync.mockResolvedValue()
      SpyReadFileAsync.mockResolvedValue(JSON.stringify({
        activeRulesFile: 'activeRulesFile'
      }))
      SpyReadFileAsync.mockResolvedValue(JSON.stringify([]))
      
      const result = await RulesEngineModel.setResponseRulesFileContent('test.json', fileContent)
      expect(result).toBeTruthy() 
    })
    it('setResponseRulesFileContent should return error', async () => {
      SpyGetSystemConfig.mockReturnValueOnce({
        CONFIG_VERSIONS: {
          response: '1.0'
        }
      })
      const fileContent = [{
        data: {}
      }]
      SpyWriteFileAsync.mockRejectedValue({message: 'error'})
      const result = await RulesEngineModel.setResponseRulesFileContent('test.json', fileContent)
      expect(result).toStrictEqual({message: 'error'})
    })
    it('getResponseRulesFileContent should return data', async () => {
      SpyReadFileAsync.mockResolvedValue(JSON.stringify([]))
      const result = await RulesEngineModel.getResponseRulesFileContent('test.json')
      expect(result).toStrictEqual([])
    })
  })

  describe('callback', () => {
    it('reloadCallbackRules when active rules file is found', async () => {
      SpyReadFileAsync.mockResolvedValue(JSON.stringify({
        activeRulesFile: 'activeRulesFile'
      }))
      SpyReadFileAsync.mockResolvedValue(JSON.stringify([]))
      
      const result = await RulesEngineModel.reloadCallbackRules()
      expect(result).toBeUndefined()      
    })
    it('setActiveCallbackRulesFile should set activeRulesFile', async () => {
      SpyWriteFileAsync.mockResolvedValue()
      SpyReadFileAsync.mockResolvedValue(JSON.stringify({activeRulesFile: 'activeRulesFile'}))
      SpyReadFileAsync.mockResolvedValue(JSON.stringify([]))
      
      const result = await RulesEngineModel.setActiveCallbackRulesFile('test.json')
      expect(result).toBeUndefined()      
    })
    it('getCallbackRules should return stored rules', async () => {
      const result = await RulesEngineModel.getCallbackRules()
      expect(result).not.toBeUndefined()      
    })
    it('getCallbackRulesEngine should return rulesEngine', async () => {
      const result = await RulesEngineModel.getCallbackRulesEngine()
      expect(result).not.toBeUndefined()      
    })
    it('getCallbackRulesFiles should return activeRulesFile', async () => {
      SpyReadDirAsync.mockResolvedValue(['test.json', 'config.json'])
      const result = await RulesEngineModel.getCallbackRulesFiles()
      expect(result).not.toBeNull()      
    })
    it('getCallbackRulesFiles should return null', async () => {
      SpyReadDirAsync.mockRejectedValueOnce()
      const result = await RulesEngineModel.getCallbackRulesFiles()
      expect(result).toBeNull()   
    })
    it('deleteCallbackRulesFile should return true', async () => {
      SpyDeleteFileAsync.mockResolvedValue()
      SpyWriteFileAsync.mockResolvedValue(JSON.stringify({
        activeRulesFile: 'activeRulesFile'
      }))
      
      const result = await RulesEngineModel.deleteCallbackRulesFile('test.json')
      expect(result).toBeTruthy()  
    })
    it('deleteCallbackRulesFile should return error', async () => {
      SpyDeleteFileAsync.mockRejectedValueOnce({message: 'error'})
      const result = await RulesEngineModel.deleteCallbackRulesFile('test.json')
      expect(result).toStrictEqual({message: 'error'})  
    })
    it('setCallbackRulesFileContent should return true', async () => {
      SpyGetSystemConfig.mockReturnValueOnce({
        CONFIG_VERSIONS: {
          response: '1.0'
        }
      })
      const fileContent = [{
        data: {}
      }]
      SpyWriteFileAsync.mockResolvedValue()
      SpyReadFileAsync.mockResolvedValue(JSON.stringify([]))
      
      const result = await RulesEngineModel.setCallbackRulesFileContent('test.json', fileContent)
      expect(result).toBeTruthy() 
    })
    it('setCallbackRulesFileContent should return error', async () => {
      SpyGetSystemConfig.mockReturnValueOnce({
        CONFIG_VERSIONS: {
          response: '1.0'
        }
      })
      const fileContent = [{
        data: {}
      }]
      SpyWriteFileAsync.mockRejectedValue({message: 'error'})
      const result = await RulesEngineModel.setCallbackRulesFileContent('test.json', fileContent)
      expect(result).toStrictEqual({message: 'error'})
    })
    it('getCallbackRulesFileContent should return data', async () => {
      SpyReadFileAsync.mockResolvedValue(JSON.stringify([]))
      const result = await RulesEngineModel.getCallbackRulesFileContent('test.json')
      expect(result).toStrictEqual([])
    })
  })

  describe('validation', () => {
    it('reloadValidationRules when active rules file is found', async () => {
      SpyReadFileAsync.mockResolvedValue(JSON.stringify({
        activeRulesFile: 'activeRulesFile'
      }))
      SpyReadFileAsync.mockResolvedValue(JSON.stringify([]))
      
      const result = await RulesEngineModel.reloadValidationRules()
      expect(result).toBeUndefined()      
    })
    it('setActiveValidationRulesFile should set activeRulesFile', async () => {
      SpyWriteFileAsync.mockResolvedValue()
      SpyReadFileAsync.mockResolvedValue(JSON.stringify({activeRulesFile: 'activeRulesFile'}))
      SpyReadFileAsync.mockResolvedValue(JSON.stringify([]))
      
      const result = await RulesEngineModel.setActiveValidationRulesFile('test.json')
      expect(result).toBeUndefined()      
    })
    it('getValidationRules should return stored rules', async () => {
      const result = await RulesEngineModel.getValidationRules()
      expect(result).not.toBeUndefined()      
    })
    it('getValidationRulesEngine should return rulesEngine', async () => {
      const result = await RulesEngineModel.getValidationRulesEngine()
      expect(result).not.toBeUndefined()      
    })
    it('getValidationRulesFiles should return activeRulesFile', async () => {
      SpyReadDirAsync.mockResolvedValue(['test.json', 'config.json'])
      const result = await RulesEngineModel.getValidationRulesFiles()
      expect(result).not.toBeNull()      
    })
    it('getValidationRulesFiles should return null', async () => {
      SpyReadDirAsync.mockRejectedValueOnce()
      const result = await RulesEngineModel.getValidationRulesFiles()
      expect(result).toBeNull()   
    })
    it('deleteValidationRulesFile should return true', async () => {
      SpyDeleteFileAsync.mockResolvedValue()
      SpyReadFileAsync.mockResolvedValue(JSON.stringify({
        activeRulesFile: 'activeRulesFile'
      }))
      SpyReadFileAsync.mockResolvedValue(JSON.stringify([]))
      
      const result = await RulesEngineModel.deleteValidationRulesFile('test.json')
      expect(result).toBeTruthy()  
    })
    it('deleteValidationRulesFile should return error', async () => {
      SpyDeleteFileAsync.mockRejectedValueOnce({message: 'error'})
      const result = await RulesEngineModel.deleteValidationRulesFile('test.json')
      expect(result).toStrictEqual({message: 'error'})  
    })
    it('setValidationRulesFileContent should return true', async () => {
      SpyGetSystemConfig.mockReturnValueOnce({
        CONFIG_VERSIONS: {
          response: '1.0'
        }
      })
      const fileContent = [{
        data: {}
      }]
      SpyWriteFileAsync.mockResolvedValue()
      SpyReadFileAsync.mockResolvedValue(JSON.stringify({
        activeRulesFile: 'activeRulesFile'
      }))
      
      const result = await RulesEngineModel.setValidationRulesFileContent('test.json', fileContent)
      expect(result).toBeTruthy() 
    })
    it('setValidationRulesFileContent should return error', async () => {
      SpyGetSystemConfig.mockReturnValueOnce({
        CONFIG_VERSIONS: {
          response: '1.0'
        }
      })
      const fileContent = [{
        data: {}
      }]
      SpyWriteFileAsync.mockRejectedValue({message: 'error'})
      const result = await RulesEngineModel.setValidationRulesFileContent('test.json', fileContent)
      expect(result).toStrictEqual({message: 'error'})
    })
    it('getValidationRulesFileContent should return data', async () => {
      SpyReadFileAsync.mockResolvedValue(JSON.stringify([]))
      const result = await RulesEngineModel.getValidationRulesFileContent('test.json')
      expect(result).toStrictEqual([])
    })
  })

  describe('forward', () => {
    it('reloadForwardRules when active rules file is found', async () => {
      SpyReadFileAsync.mockResolvedValue(JSON.stringify({
        activeRulesFile: 'activeRulesFile'
      }))
      SpyReadFileAsync.mockResolvedValue(JSON.stringify([]))
      
      const result = await RulesEngineModel.reloadForwardRules()
      expect(result).toBeUndefined()      
    })
    it('setActiveForwardRulesFile should set activeRulesFile', async () => {
      SpyWriteFileAsync.mockResolvedValue()
      SpyReadFileAsync.mockResolvedValue(JSON.stringify({activeRulesFile: 'activeRulesFile'}))
      SpyReadFileAsync.mockResolvedValue(JSON.stringify([]))
      
      const result = await RulesEngineModel.setActiveForwardRulesFile('test.json')
      expect(result).toBeUndefined()      
    })
    it('getForwardRules should return stored rules', async () => {
      const result = await RulesEngineModel.getForwardRules()
      expect(result).not.toBeUndefined()      
    })
    it('getForwardRulesEngine should return rulesEngine', async () => {
      const result = await RulesEngineModel.getForwardRulesEngine()
      expect(result).not.toBeUndefined()      
    })
    it('getForwardRulesFiles should return activeRulesFile', async () => {
      SpyReadDirAsync.mockResolvedValue(['test.json', 'config.json'])
      const result = await RulesEngineModel.getForwardRulesFiles()
      expect(result).not.toBeNull()      
    })
    it('getForwardRulesFiles should return null', async () => {
      SpyReadDirAsync.mockRejectedValueOnce()
      const result = await RulesEngineModel.getForwardRulesFiles()
      expect(result).toBeNull()   
    })
    it('deleteForwardRulesFile should return true', async () => {
      SpyDeleteFileAsync.mockResolvedValue()
      SpyWriteFileAsync.mockResolvedValue(JSON.stringify({
        activeRulesFile: 'activeRulesFile'
      }))
      
      const result = await RulesEngineModel.deleteForwardRulesFile('test.json')
      expect(result).toBeTruthy()  
    })
    it('deleteForwardRulesFile should return error', async () => {
      SpyDeleteFileAsync.mockRejectedValueOnce({message: 'error'})
      const result = await RulesEngineModel.deleteForwardRulesFile('test.json')
      expect(result).toStrictEqual({message: 'error'})  
    })
    it('setForwardRulesFileContent should return true', async () => {
      SpyGetSystemConfig.mockReturnValueOnce({
        CONFIG_VERSIONS: {
          forward: '1.0'
        }
      })
      const fileContent = [{
        data: {}
      }]
      SpyWriteFileAsync.mockResolvedValue()
      SpyReadFileAsync.mockResolvedValue(JSON.stringify([]))
      
      const result = await RulesEngineModel.setForwardRulesFileContent('test.json', fileContent)
      expect(result).toBeTruthy() 
    })
    it('setForwardRulesFileContent should return error', async () => {
      SpyGetSystemConfig.mockReturnValueOnce({
        CONFIG_VERSIONS: {
          forward: '1.0'
        }
      })
      const fileContent = [{
        data: {}
      }]
      SpyWriteFileAsync.mockRejectedValue({message: 'error'})
      const result = await RulesEngineModel.setForwardRulesFileContent('test.json', fileContent)
      expect(result).toStrictEqual({message: 'error'})
    })
    it('getForwardRulesFileContent should return data', async () => {
      SpyReadFileAsync.mockResolvedValue(JSON.stringify([]))
      const result = await RulesEngineModel.getForwardRulesFileContent('test.json')
      expect(result).toStrictEqual([])
    })
  })
})
