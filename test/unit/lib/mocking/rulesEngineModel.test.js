'use strict'

const RulesEngineModel = require('../../../../src/lib/rulesEngineModel')

describe('RulesEngineModel', () => {
  describe('Validation Rules', () => {
    describe('getValidationRules', () => {
      it('Result must be array or null', async () => {
        const result = await RulesEngineModel.getValidationRules()
        expect(Array.isArray(result) || (typeof result) == null).toBe(true)
      })
    })
  })
  describe('Callback Rules', () => {
    describe('getCallbackRules', () => {
      it('Result must be array and minimum 3 default rules should be there', async () => {
        const result = await RulesEngineModel.getCallbackRules()
        expect(Array.isArray(result) || (typeof result) == null).toBe(true)
        expect(result.length).toBeGreaterThanOrEqual(3)
      })
    })
    describe('getCallbackRulesFiles', () => {
      it('Result must be an object and should have files and activeRulesFile properties', async () => {
        const result = await RulesEngineModel.getCallbackRulesFiles()
        expect((typeof result) === 'object').toBe(true)
        expect(result.hasOwnProperty('files')).toBe(true)
        expect(result.hasOwnProperty('activeRulesFile')).toBe(true)
      })
      it('Result must contain default.json', async () => {
        const result = await RulesEngineModel.getCallbackRulesFiles()
        expect(result['files']).toContain('default.json')
      })
      it('Default active rule file should be default.json', async () => {
        const result = await RulesEngineModel.getCallbackRulesFiles()
        expect(result['activeRulesFile']).toEqual('default.json')
      })
    })
    describe('setCallbackRulesFileContent', () => {
      it('Create a new rule file', async () => {
        const result = await RulesEngineModel.setCallbackRulesFileContent('123.json', [ 
          { ruleId: 1,
          priority: 1,
          description: 'post /quotes',
          apiVersion:
           { minorVersion: 0,
             majorVersion: 1,
             type: 'fspiop',
             asynchronous: true },
          conditions: {  },
          event:
           { method: null,
             path: null,
             params: {},
             delay: 0,
             type: 'MOCK_CALLBACK' } } ])
        expect(result).toBe(true)
      })
    })
    describe('getCallbackRulesFileContent', () => {
      it('123.json file should contain one rule ', async () => {
        const result = await RulesEngineModel.getCallbackRulesFileContent('123.json')
        expect(result.length).toEqual(1)
      })
    })
    describe('deleteCallbackRulesFile', () => {
      it('Delete 123.json file function shoould be resolved', async () => {
        await expect(RulesEngineModel.deleteCallbackRulesFile('123.json')).resolves.toEqual(true)
      })
      it('123.json file should not be present', async () => {
        const result = await RulesEngineModel.getCallbackRulesFileContent('123.json')
        expect(Array.isArray(result)).not.toBe(true)
      })
    })
  })

  describe('Response Rules', () => {
    describe('getResponseRules', () => {
      it('Result must be array and minimum 3 default rules should be there', async () => {
        const result = await RulesEngineModel.getResponseRules()
        expect(Array.isArray(result) || (typeof result) == null).toBe(true)
        expect(result.length).toBeGreaterThanOrEqual(3)
      })
    })
    describe('getResponseRulesFiles', () => {
      it('Result must be an object and should have files and activeRulesFile properties', async () => {
        const result = await RulesEngineModel.getResponseRulesFiles()
        expect((typeof result) === 'object').toBe(true)
        expect(result.hasOwnProperty('files')).toBe(true)
        expect(result.hasOwnProperty('activeRulesFile')).toBe(true)
      })
      it('Result must contain default.json', async () => {
        const result = await RulesEngineModel.getResponseRulesFiles()
        expect(result['files']).toContain('default.json')
      })
      it('Default active rule file should be default.json', async () => {
        const result = await RulesEngineModel.getResponseRulesFiles()
        expect(result['activeRulesFile']).toEqual('default.json')
      })
    })
    describe('setResponseRulesFileContent', () => {
      it('Create a new rule file', async () => {
        const result = await RulesEngineModel.setResponseRulesFileContent('123.json', [ 
          { ruleId: 1,
          priority: 1,
          description: 'post /quotes',
          apiVersion:
           { minorVersion: 0,
             majorVersion: 1,
             type: 'settlements',
             asynchronous: false },
          conditions: {  },
          event:
           { method: null,
             path: null,
             params: {},
             delay: 0,
             type: 'MOCK_RESPONSE' } } ])
        expect(result).toBe(true)
      })
    })
    describe('getResponseRulesFileContent', () => {
      it('123.json file should contain one rule ', async () => {
        const result = await RulesEngineModel.getResponseRulesFileContent('123.json')
        expect(result.length).toEqual(1)
      })
    })
    describe('deleteResponseRulesFile', () => {
      it('Delete 123.json file function shoould be resolved', async () => {
        await expect(RulesEngineModel.deleteResponseRulesFile('123.json')).resolves.toEqual(true)
      })
      it('123.json file should not be present', async () => {
        const result = await RulesEngineModel.getResponseRulesFileContent('123.json')
        expect(Array.isArray(result)).not.toBe(true)
      })
    })
  })

  describe('Validation Rules', () => {
    describe('getValidationRules', () => {
      it('Result must be array and minimum 0 default rules should be there', async () => {
        const result = await RulesEngineModel.getValidationRules()
        expect(Array.isArray(result) || (typeof result) == null).toBe(true)
        expect(result.length).toBeGreaterThanOrEqual(0)
      })
    })
    describe('getValidationRulesFiles', () => {
      it('Result must be an object and should have files and activeRulesFile properties', async () => {
        const result = await RulesEngineModel.getValidationRulesFiles()
        expect((typeof result) === 'object').toBe(true)
        expect(result.hasOwnProperty('files')).toBe(true)
        expect(result.hasOwnProperty('activeRulesFile')).toBe(true)
      })
      it('Result must contain default.json', async () => {
        const result = await RulesEngineModel.getValidationRulesFiles()
        expect(result['files']).toContain('default.json')
      })
      it('Default active rule file should be default.json', async () => {
        const result = await RulesEngineModel.getValidationRulesFiles()
        expect(result['activeRulesFile']).toEqual('default.json')
      })
    })
    describe('setValidationRulesFileContent', () => {
      it('Create a new rule file', async () => {
        const result = await RulesEngineModel.setValidationRulesFileContent('123.json', [ 
          { ruleId: 1,
          priority: 1,
          description: 'post /quotes',
          apiVersion:
           { minorVersion: 0,
             majorVersion: 1,
             type: 'fspiop',
             asynchronous: true },
          conditions: {  },
          event:
           { method: null,
             path: null,
             params: {},
             delay: 0,
             type: 'MOCK_ERROR_CALLBACK' } } ])
        expect(result).toBe(true)
      })
    })
    describe('getValidationRulesFileContent', () => {
      it('123.json file should contain one rule ', async () => {
        const result = await RulesEngineModel.getValidationRulesFileContent('123.json')
        expect(result.length).toEqual(1)
      })
    })
    describe('deleteValidationRulesFile', () => {
      it('Delete 123.json file function shoould be resolved', async () => {
        await expect(RulesEngineModel.deleteValidationRulesFile('123.json')).resolves.toEqual(true)
      })
      it('123.json file should not be present', async () => {
        const result = await RulesEngineModel.getValidationRulesFileContent('123.json')
        expect(Array.isArray(result)).not.toBe(true)
      })
    })
  })
})
