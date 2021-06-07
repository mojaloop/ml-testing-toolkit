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
  const user = {
    dfspId: 'test'
  }
  describe('when push object', () => {
    it('store the new object', async () => {
      const result = ObjectStore.push('transactions', 'item', {})
      expect(result).toBeUndefined()
    })
    it('store the new object again should not set object store again', async () => {
      const result = ObjectStore.push('transactions', 'item', {})
      expect(result).toBeUndefined()
    })
    it('store dfsp wise the new object', async () => {
      const result = ObjectStore.push('transactions', 'item', {}, user)
      expect(result).toBeUndefined()
    })
  })
  describe('when pop object', () => {
    it('pop existing object', async () => {
      const result = ObjectStore.popObject('transactions', 'item')
      expect(result).toStrictEqual({})
    })
    it('pop existing dfsp wise object', async () => {
      const result = ObjectStore.popObject('transactions', 'item', user)
      expect(result).toStrictEqual({})
    })
    it('pop again will return null', async () => {
      const result = ObjectStore.popObject('transactions', 'item')
      expect(result).toBeNull()
    })
  })
  describe('when set object', () => {
    it('set new object', async () => {
      const result = ObjectStore.set('transactions', {})
      expect(result).toBeUndefined()
    })
    it('set new dfsp wise object', async () => {
      const result = ObjectStore.set('transactions', {}, user)
      expect(result).toBeUndefined()
    })
  })
  describe('when get object', () => {
    it('get not existing object', async () => {
      const result = ObjectStore.get('transactions', undefined)
      expect(result).toBeDefined
    })
    it('get not existing dfsp wise object', async () => {
      const result = ObjectStore.get('transactions', undefined, user)
      expect(result).toStrictEqual({})
    })
    it('get dfsp wise object', async () => {
      ObjectStore.push('transactions', 'item', {}, user)
      const itemResult = ObjectStore.get('transactions', 'item', user)
      const item2Result = ObjectStore.get('transactions', 'item2', user)
      expect(itemResult.data).toStrictEqual({})
      expect(item2Result).toBeNull()
    })
  })
  describe('initObjectStore', () => {
    it('Initialize Object Store should not throw and error', async (done) => {
      const curDate = new Date()
      const expiredDate = new Date(curDate.setMinutes(curDate.getMinutes() - 10))
      ObjectStore.set('transactions', {
        '123': {transactionDate: expiredDate.getTime()},
        '124': {transactionDate: Date.now()}
      })
      const result = ObjectStore.initObjectStore()
      setTimeout(() => {done()}, 2000);
      expect(result).toBeUndefined()
    })
  })
  describe('clear', () => {
    it('clear Object Store should not throw and error', async () => {
      const result = ObjectStore.clear('transactions', 1)
      expect(result).toBeUndefined()
    })
  })
  describe('getRequestHistory', () => {
    it('should return objectStore requestsHistory object', async () => {
      ObjectStore.set('requestsHistory', {
        'post /participants/MSISDN/123456789': {}
      })
      const requestHistory = ObjectStore.getRequestsHistory()
      expect(requestHistory).toStrictEqual({
        'post /participants/MSISDN/123456789': {}
      })
    })
  })
  describe('getCallbacksHistory', () => {
    it('should return objectStore callbacksHistory object', async () => {
      ObjectStore.set('callbacksHistory', {
        'put /participants/MSISDN/123456789': {}
      })
      const callbackHistory = ObjectStore.getCallbacksHistory()
      expect(callbackHistory).toStrictEqual({
        'put /participants/MSISDN/123456789': {}
      })
    })
  })
})
