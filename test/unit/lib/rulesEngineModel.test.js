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

'use strict'

const Utils = require('../../../src/lib/utils')
const Config = require('../../../src/lib/config')

const SpyReadFileAsync = jest.spyOn(Utils, 'readFileAsync')
const SpyReadDirAsync = jest.spyOn(Utils, 'readDirAsync')
const SpyWriteFileAsync = jest.spyOn(Utils, 'writeFileAsync')
const SpyDeleteFileAsync = jest.spyOn(Utils, 'deleteFileAsync')
const SpyAccessFileAsync = jest.spyOn(Utils, 'accessFileAsync')

const SpyGetSystemConfig = jest.spyOn(Config, 'getSystemConfig')


const RulesEngineModel = require('../../../src/lib/rulesEngineModel')

describe('RulesEngineModel', () => {
  describe('response', () => {
    it('getResponseRulesEngine should return rulesEngine', async () => {
      SpyReadFileAsync.mockResolvedValueOnce(JSON.stringify({
        activeRulesFile: 'activeRulesFile'
      }))
      SpyAccessFileAsync.mockResolvedValueOnce()
      SpyReadFileAsync.mockResolvedValueOnce(JSON.stringify([]))
      const result = await RulesEngineModel.getResponseRulesEngine()
      expect(result).not.toBeUndefined()      
    })
    it('getResponseRulesEngine with a parameter should not reload rules', async () => {
      const result = await RulesEngineModel.getResponseRulesEngine([])
      expect(result).not.toBeUndefined()      
    })
    it('reloadResponseRules when active rules file is found with no rule conditions', async () => {
      SpyReadFileAsync.mockResolvedValueOnce(JSON.stringify({
        activeRulesFile: 'activeRulesFile'
      }))
      SpyAccessFileAsync.mockResolvedValueOnce()
      SpyReadFileAsync.mockResolvedValueOnce(JSON.stringify([]))
      const result = await RulesEngineModel.reloadResponseRules()
      expect(result).toBeUndefined()      
    })
    it('reloadResponseRules when active rules file is found with rule conditions', async () => {
      SpyReadFileAsync.mockResolvedValueOnce(JSON.stringify({
        activeRulesFile: 'activeRulesFile'
      }))
      SpyAccessFileAsync.mockResolvedValueOnce()
      SpyReadFileAsync.mockResolvedValueOnce(JSON.stringify([{
        "conditions": {
          "all": [
            {
              "fact": "operationPath",
              "operator": "equal",
              "value": "/settlementWindows/{id}"
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
      SpyReadFileAsync.mockResolvedValueOnce(JSON.stringify({
        activeRulesFile: 'activeRulesFile'
      }))
      SpyAccessFileAsync.mockRejectedValueOnce()
      SpyWriteFileAsync.mockRejectedValueOnce()
      try {
        await RulesEngineModel.reloadResponseRules()
      } catch (err) {
        console.log(err)
      }
    })
    it('setActiveRulesFile should set activeRulesFile', async () => {
      SpyWriteFileAsync.mockResolvedValueOnce()
      SpyReadFileAsync.mockResolvedValueOnce(JSON.stringify({activeRulesFile: 'activeRulesFile'}))
      SpyAccessFileAsync.mockResolvedValueOnce()
      SpyReadFileAsync.mockResolvedValueOnce(JSON.stringify([]))
      
      const result = await RulesEngineModel.setActiveResponseRulesFile('test.json')
      expect(result).toBeUndefined()      
    })
    
    it('getResponseRulesFiles should return activeRulesFile', async () => {
      SpyReadDirAsync.mockResolvedValueOnce(['test.json', 'config.json'])
      const result = await RulesEngineModel.getResponseRulesFiles()
      expect(result).not.toBeNull()      
    })
    it('getResponseRulesFiles should return null', async () => {
      SpyReadDirAsync.mockRejectedValueOnce()
      const result = await RulesEngineModel.getResponseRulesFiles()
      expect(result).toBeNull()   
    })
    it('deleteResponseRulesFile should return true', async () => {
      SpyDeleteFileAsync.mockResolvedValueOnce()
      SpyReadFileAsync.mockResolvedValueOnce(JSON.stringify({
        activeRulesFile: 'activeRulesFile'
      }))
      SpyAccessFileAsync.mockResolvedValueOnce()
      SpyReadFileAsync.mockResolvedValueOnce(JSON.stringify([]))
      
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
      SpyWriteFileAsync.mockResolvedValueOnce()
      SpyReadFileAsync.mockResolvedValueOnce(JSON.stringify({
        activeRulesFile: 'activeRulesFile'
      }))
      SpyAccessFileAsync.mockResolvedValueOnce()
      SpyReadFileAsync.mockResolvedValueOnce(JSON.stringify([]))
      
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
      SpyWriteFileAsync.mockResolvedValueOnce()
      SpyReadFileAsync.mockResolvedValueOnce(JSON.stringify({
        activeRulesFile: 'activeRulesFile'
      }))
      SpyAccessFileAsync.mockResolvedValueOnce()
      SpyReadFileAsync.mockResolvedValueOnce(JSON.stringify([]))
      
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
    it('getRulesFileContent should return data', async () => {
      SpyReadFileAsync.mockResolvedValueOnce(JSON.stringify([]))
      const result = await RulesEngineModel.getResponseRulesFileContent('test.json')
      expect(result).toStrictEqual([])
    })
  })

  describe('callback', () => {
    it('reloadResponseRules when active rules file is found', async () => {
      SpyReadFileAsync.mockResolvedValueOnce(JSON.stringify({
        activeRulesFile: 'activeRulesFile'
      }))
      SpyAccessFileAsync.mockResolvedValueOnce()
      SpyReadFileAsync.mockResolvedValueOnce(JSON.stringify([]))
      
      const result = await RulesEngineModel.reloadCallbackRules()
      expect(result).toBeUndefined()      
    })
    it('setActiveRulesFile should set activeRulesFile', async () => {
      SpyWriteFileAsync.mockResolvedValueOnce()
      SpyReadFileAsync.mockResolvedValueOnce(JSON.stringify({activeRulesFile: 'activeRulesFile'}))
      SpyAccessFileAsync.mockResolvedValueOnce()
      SpyReadFileAsync.mockResolvedValueOnce(JSON.stringify([]))
      
      const result = await RulesEngineModel.setActiveCallbackRulesFile('test.json')
      expect(result).toBeUndefined()      
    })
    it('getResponseRules should return stored rules', async () => {
      const result = await RulesEngineModel.getCallbackRules()
      expect(result).not.toBeUndefined()      
    })
    it('getResponseRulesEngine should return rulesEngine', async () => {
      const result = await RulesEngineModel.getCallbackRulesEngine()
      expect(result).not.toBeUndefined()      
    })
    it('getResponseRulesFiles should return activeRulesFile', async () => {
      SpyReadDirAsync.mockResolvedValueOnce(['test.json', 'config.json'])
      const result = await RulesEngineModel.getCallbackRulesFiles()
      expect(result).not.toBeNull()      
    })
    it('getResponseRulesFiles should return null', async () => {
      SpyReadDirAsync.mockRejectedValueOnce()
      const result = await RulesEngineModel.getCallbackRulesFiles()
      expect(result).toBeNull()   
    })
    it('deleteResponseRulesFile should return true', async () => {
      SpyDeleteFileAsync.mockResolvedValueOnce()
      SpyReadFileAsync.mockResolvedValueOnce(JSON.stringify({
        activeRulesFile: 'activeRulesFile'
      }))
      SpyAccessFileAsync.mockResolvedValueOnce()
      SpyReadFileAsync.mockResolvedValueOnce(JSON.stringify([]))
      
      const result = await RulesEngineModel.deleteCallbackRulesFile('test.json')
      expect(result).toBeTruthy()  
    })
    it('deleteResponseRulesFile should return error', async () => {
      SpyDeleteFileAsync.mockRejectedValueOnce({message: 'error'})
      const result = await RulesEngineModel.deleteCallbackRulesFile('test.json')
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
      SpyWriteFileAsync.mockResolvedValueOnce()
      SpyReadFileAsync.mockResolvedValueOnce(JSON.stringify({
        activeRulesFile: 'activeRulesFile'
      }))
      SpyAccessFileAsync.mockResolvedValueOnce()
      SpyReadFileAsync.mockResolvedValueOnce(JSON.stringify([]))
      
      const result = await RulesEngineModel.setCallbackRulesFileContent('test.json', fileContent)
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
      const result = await RulesEngineModel.setCallbackRulesFileContent('test.json', fileContent)
      expect(result).toStrictEqual({message: 'error'})
    })
    it('getRulesFileContent should return data', async () => {
      SpyReadFileAsync.mockResolvedValueOnce(JSON.stringify([]))
      const result = await RulesEngineModel.getCallbackRulesFileContent('test.json')
      expect(result).toStrictEqual([])
    })
  })
  describe('validation', () => {
    it('reloadResponseRules when active rules file is found', async () => {
      SpyReadFileAsync.mockResolvedValueOnce(JSON.stringify({
        activeRulesFile: 'activeRulesFile'
      }))
      SpyAccessFileAsync.mockResolvedValueOnce()
      SpyReadFileAsync.mockResolvedValueOnce(JSON.stringify([]))
      
      const result = await RulesEngineModel.reloadValidationRules()
      expect(result).toBeUndefined()      
    })
    it('setActiveRulesFile should set activeRulesFile', async () => {
      SpyWriteFileAsync.mockResolvedValueOnce()
      SpyReadFileAsync.mockResolvedValueOnce(JSON.stringify({activeRulesFile: 'activeRulesFile'}))
      SpyAccessFileAsync.mockResolvedValueOnce()
      SpyReadFileAsync.mockResolvedValueOnce(JSON.stringify([]))
      
      const result = await RulesEngineModel.setActiveValidationRulesFile('test.json')
      expect(result).toBeUndefined()      
    })
    it('getResponseRules should return stored rules', async () => {
      const result = await RulesEngineModel.getValidationRules()
      expect(result).not.toBeUndefined()      
    })
    it('getResponseRulesEngine should return rulesEngine', async () => {
      const result = await RulesEngineModel.getValidationRulesEngine()
      expect(result).not.toBeUndefined()      
    })
    it('getResponseRulesFiles should return activeRulesFile', async () => {
      SpyReadDirAsync.mockResolvedValueOnce(['test.json', 'config.json'])
      const result = await RulesEngineModel.getValidationRulesFiles()
      expect(result).not.toBeNull()      
    })
    it('getResponseRulesFiles should return null', async () => {
      SpyReadDirAsync.mockRejectedValueOnce()
      const result = await RulesEngineModel.getValidationRulesFiles()
      expect(result).toBeNull()   
    })
    it('deleteResponseRulesFile should return true', async () => {
      SpyDeleteFileAsync.mockResolvedValueOnce()
      SpyReadFileAsync.mockResolvedValueOnce(JSON.stringify({
        activeRulesFile: 'activeRulesFile'
      }))
      SpyAccessFileAsync.mockResolvedValueOnce()
      SpyReadFileAsync.mockResolvedValueOnce(JSON.stringify([]))
      
      const result = await RulesEngineModel.deleteValidationRulesFile('test.json')
      expect(result).toBeTruthy()  
    })
    it('deleteResponseRulesFile should return error', async () => {
      SpyDeleteFileAsync.mockRejectedValueOnce({message: 'error'})
      const result = await RulesEngineModel.deleteValidationRulesFile('test.json')
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
      SpyWriteFileAsync.mockResolvedValueOnce()
      SpyReadFileAsync.mockResolvedValueOnce(JSON.stringify({
        activeRulesFile: 'activeRulesFile'
      }))
      SpyAccessFileAsync.mockResolvedValueOnce()
      SpyReadFileAsync.mockResolvedValueOnce(JSON.stringify([]))
      
      const result = await RulesEngineModel.setValidationRulesFileContent('test.json', fileContent)
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
      const result = await RulesEngineModel.setValidationRulesFileContent('test.json', fileContent)
      expect(result).toStrictEqual({message: 'error'})
    })
    it('getRulesFileContent should return data', async () => {
      SpyReadFileAsync.mockResolvedValueOnce(JSON.stringify([]))
      const result = await RulesEngineModel.getValidationRulesFileContent('test.json')
      expect(result).toStrictEqual([])
    })
  })
})
