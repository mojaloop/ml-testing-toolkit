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
 * Vijaya Kumar Guthi <vijaya.guthi@modusbox.com> (Original Author)
 --------------
 ******/

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
    it('Get existing transaction', async () => {
      const result = ObjectStore.getTransaction('123')
      expect(result).not.toBe(null)
    })
    it('Get not existing transaction', async () => {
      const result = ObjectStore.getTransaction('1234')
      expect(result).toBe(null)
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
    it('Initialize Object Store', async (done) => {
      const curDate = new Date()
      const expiredDate = new Date(curDate.setMinutes(curDate.getMinutes() - 10))
      ObjectStore.set('transactions', {
        '123': {transactionDate: expiredDate.getTime()},
        '124': {transactionDate: Date.now()}
      })
      setTimeout(() => {done()}, 2000);
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
