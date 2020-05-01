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

const QuotesAssociation = require('../../../../../src/lib/mocking/middleware-functions/quotesAssociation')
const ObjectStore = require('../../../../../src/lib/objectStore')
jest.mock('../../../../../src/lib/objectStore')

describe('QuotesAssociation', () => {
  describe('handleQuotes', () => {
    it('It should call object store save transaction method', () => {
      const sampleContext = {}
      const request = {
        method: 'post',
        path: '/quotes',
        payload: {
          transactionId: '123'
        }
      }
      ObjectStore.saveTransaction.mockClear()
      QuotesAssociation.handleQuotes(sampleContext, request)
      expect(ObjectStore.saveTransaction).toHaveBeenCalledWith('123')
    })
    it('It should not call saveTransaction if its not post quotes', () => {
      const sampleContext = {}
      const request = {
        method: 'post',
        path: '/asdf',
        payload: {
          transactionId: '123'
        }
      }
      ObjectStore.saveTransaction.mockClear()
      QuotesAssociation.handleQuotes(sampleContext, request)
      expect(ObjectStore.saveTransaction).not.toHaveBeenCalledWith('123')
    })
  })
  describe('handleTransfers', () => {
    it('It should call object store save transaction method', () => {
      const sampleContext = {}
      const request = {
        method: 'post',
        path: '/transfers',
        payload: {
          transferId: '123'
        }
      }
      ObjectStore.searchTransaction.mockClear()
      ObjectStore.deleteTransaction.mockClear()
      ObjectStore.searchTransaction.mockImplementation(() => true)
      QuotesAssociation.handleTransfers(sampleContext, request)
      expect(ObjectStore.searchTransaction).toHaveBeenCalledWith('123')
      expect(ObjectStore.deleteTransaction).toHaveBeenCalledWith('123')
    })
    it('It should not call deleteTransaction if searchTransaction returns false', () => {
      const sampleContext = {}
      const request = {
        method: 'post',
        path: '/transfers',
        payload: {
          transferId: '123'
        }
      }
      ObjectStore.searchTransaction.mockClear()
      ObjectStore.deleteTransaction.mockClear()
      ObjectStore.searchTransaction.mockImplementation(() => false)
      QuotesAssociation.handleTransfers(sampleContext, request)
      expect(ObjectStore.deleteTransaction).not.toHaveBeenCalledWith('123')
    })
    it('It should not call searchTransaction if its not post transfers', () => {
      const sampleContext = {}
      const request = {
        method: 'post',
        path: '/asdf',
        payload: {
          transferId: '123'
        }
      }
      ObjectStore.searchTransaction.mockClear()
      ObjectStore.searchTransaction.mockImplementation(() => true)
      QuotesAssociation.handleTransfers(sampleContext, request)
      expect(ObjectStore.searchTransaction).not.toHaveBeenCalledWith('123')
    })

  })
})
