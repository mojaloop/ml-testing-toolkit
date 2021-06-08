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

const ArrayStore = require('../../../src/lib/arrayStore')

describe('ArrayStore', () => {
  const user = {
    dfspId: 'test'
  }
  describe('when push object', () => {
    it('store the new object', async () => {
      const result = ArrayStore.push('requestsHistory', {})
      expect(result).toBeUndefined()
    })
    it('store the new object again should not set object store again', async () => {
      const result = ArrayStore.push('requestsHistory', {})
      expect(result).toBeUndefined()
    })
    it('store dfsp wise the new object', async () => {
      const result = ArrayStore.push('requestsHistory', {}, user)
      expect(result).toBeUndefined()
    })
  })
  describe('when get object', () => {
    it('get not existing object', async () => {
      const result = ArrayStore.get('transactions')
      expect(result).toBeDefined
    })
    it('get not existing dfsp wise object', async () => {
      const result = ArrayStore.get('transactions', user)
      expect(result).toStrictEqual([])
    })
    it('get dfsp wise object', async () => {
      ArrayStore.push('transactions', { sample: 'sampleText' }, user)
      const itemResult = ArrayStore.get('transactions', user)
      const item2Result = ArrayStore.get('transactions2', user)
      expect(Array.isArray(itemResult)).toBe(true)
      expect(itemResult.length).toStrictEqual(1)
      expect(itemResult[0]).toHaveProperty('data')
      expect(itemResult[0].data).toHaveProperty('sample')
      expect(itemResult[0].data.sample).toEqual('sampleText')
      expect(item2Result).toEqual([])
    })
  })
  describe('initArrayStore', () => {
    it('Initialize Array Store should not throw and error', async (done) => {
      const curDate = new Date()
      const expiredDate = new Date(curDate.setMinutes(curDate.getMinutes() - 10))
      jest.useFakeTimers()
      const result = ArrayStore.initArrayStore()
      setTimeout(() => {done()}, 2000);      
      jest.advanceTimersByTime(2000)
      jest.useRealTimers()
      expect(result).toBeUndefined()
    })
  })
  describe('clear', () => {
    it('clear Array Store should not throw and error', async () => {
      const result = ArrayStore.clear('transactions', 1)
      expect(result).toBeUndefined()
    })
  })
})
