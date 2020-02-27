'use strict'

const ObjectStore = require('../../../src/lib/objectStore')

describe('ObjectStore', () => {
  describe('Transaction Related Functions', () => {
    it('Save transaction should not throw error', async () => {
      expect(() => {
        const result = ObjectStore.saveTransaction('123')
      }).not.toThrowError();
    })
    it('Search for the transaction', async () => {
      const result = ObjectStore.searchTransaction('123')
      expect(result).toBe(true)
    })
    it('Delete the transaction', async () => {
      expect(() => {
        const result = ObjectStore.deleteTransaction('123')
      }).not.toThrowError();
    })
    it('Search again for the transaction', async () => {
      const result = ObjectStore.searchTransaction('123')
      expect(result).toBe(false)
    })
  })
  describe('Generic Functions', () => {
    it('Initialize Object Store', async () => {
      expect(() => {
        const result = ObjectStore.initObjectStore()
      }).not.toThrowError();
    })
    it('Set a value in object store', async () => {
      expect(() => {
        const result = ObjectStore.set('person', {name: 'test'})
      }).not.toThrowError();
    })
    it('Get the value', async () => {
      const result = ObjectStore.get('person')
      expect(result).toHaveProperty('name')
      expect(result['name']).toEqual('test')
    })
  })
})
