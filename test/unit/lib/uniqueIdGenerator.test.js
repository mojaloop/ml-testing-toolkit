'use strict'

const UniqueIdGenerator = require('../../../src/lib/uniqueIdGenerator')

describe('UniqueIdGenerator', () => {
  describe('generateUniqueId', () => {
    it('Result must be a string with length greater than 0', async () => {
      const result = await UniqueIdGenerator.generateUniqueId()
      expect((typeof result) === 'string').toBe(true)
      expect(result.length).toBeGreaterThan(0)
    })
    it('Result must be unique', async () => {
      const result1 = await UniqueIdGenerator.generateUniqueId()
      const result2 = await UniqueIdGenerator.generateUniqueId()
      const result3 = await UniqueIdGenerator.generateUniqueId()
      expect(result1).not.toEqual(result2)
      expect(result2).not.toEqual(result3)
      expect(result1).not.toEqual(result3)
    })
  })
})
