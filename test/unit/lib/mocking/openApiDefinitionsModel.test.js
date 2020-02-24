'use strict'

const OpenApiDefinitionsModel = require('../../../../src/lib/mocking/openApiDefinitionsModel')

describe('OpenApiDefinitionsModel', () => {
  describe('getApiDefinitions', () => {
    it('Result must contain the required properties', async () => {
      const result = await OpenApiDefinitionsModel.getApiDefinitions()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      expect(result[0]).toHaveProperty('majorVersion')
      expect(result[0]).toHaveProperty('minorVersion')
      expect((typeof result[0]['majorVersion']) === 'number').toBe(true)
      expect((typeof result[0]['minorVersion']) === 'number').toBe(true)
      expect(result[0]).toHaveProperty('type')
      expect(result[0]).toHaveProperty('asynchronous')
      expect(result[0]).toHaveProperty('specFile')
      expect(result[0]).toHaveProperty('callbackMapFile')
      expect(result[0]).toHaveProperty('responseMapFile')
      expect(result[0]).toHaveProperty('jsfRefFile')
    })
  })
})
