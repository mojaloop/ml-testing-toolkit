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
const IlpModel = require('../../../../../src/lib/mocking/middleware-functions/ilpModel')
jest.mock('../../../../../src/lib/objectStore')
jest.mock('../../../../../src/lib/mocking/middleware-functions/ilpModel')

const sampleTransactionId = '49618fcc-8b13-49b1-8126-2a0cda6472ce'
const sampleIlpPacket = 'AYIDMgAAAAAAACcQImcudGVzdGluZ3Rvb2xraXRkZnNwLm1zaXNkbi4wMDAxMTGCAwNleUowY21GdWMyRmpkR2x2Ymtsa0lqb2lORGsyTVRobVkyTXRPR0l4TXkwME9XSXhMVGd4TWpZdE1tRXdZMlJoTmpRM01tTmxJaXdpY1hWdmRHVkpaQ0k2SW1ZeU56UTFObVU1TFdabVptSXRORGRqTUMwNVpqSTRMVFZqTnpJM05ETTBPRGN6WkNJc0luQmhlV1ZsSWpwN0luQmhjblI1U1dSSmJtWnZJanA3SW5CaGNuUjVTV1JVZVhCbElqb2lUVk5KVTBST0lpd2ljR0Z5ZEhsSlpHVnVkR2xtYVdWeUlqb2lNREF3TVRFeElpd2labk53U1dRaU9pSjBaWE4wYVc1bmRHOXZiR3RwZEdSbWMzQWlmU3dpY0dWeWMyOXVZV3hKYm1adklqcDdJbU52YlhCc1pYaE9ZVzFsSWpwN0ltWnBjbk4wVG1GdFpTSTZJazFoY21saElpd2liV2xrWkd4bFRtRnRaU0k2SWs0aUxDSnNZWE4wVG1GdFpTSTZJbGRwYkd4cFlXMXpJbjBzSW1SaGRHVlBaa0pwY25Sb0lqb2lNVGt6TWkwd05DMHlOQ0o5ZlN3aWNHRjVaWElpT25zaWNHRnlkSGxKWkVsdVptOGlPbnNpY0dGeWRIbEpaRlI1Y0dVaU9pSk5VMGxUUkU0aUxDSndZWEowZVVsa1pXNTBhV1pwWlhJaU9pSXhNak0wTlRZaUxDSm1jM0JKWkNJNkluVnpaWEprWm5Od0luMHNJbTVoYldVaU9pSktiMmh1SUVwdmFHNXpiMjRpZlN3aVlXMXZkVzUwSWpwN0ltTjFjbkpsYm1ONUlqb2lWVk5FSWl3aVlXMXZkVzUwSWpvaU1UQXdJbjBzSW5SeVlXNXpZV04wYVc5dVZIbHdaU0k2ZXlKelkyVnVZWEpwYnlJNklsUlNRVTVUUmtWU0lpd2lhVzVwZEdsaGRHOXlJam9pVUVGWlJWSWlMQ0pwYm1sMGFXRjBiM0pVZVhCbElqb2lRMDlPVTFWTlJWSWlmWDAA'

describe('QuotesAssociation', () => {
  const fulfilment = 'asdf'
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('handleQuotes', () => {
    it('It should call object store save transaction method', () => {
      const sampleContext = {}
      const request = {
        method: 'post',
        path: '/quotes',
        payload: {
          transactionId: sampleTransactionId
        }
      }
      ObjectStore.push.mockReturnValueOnce()
      QuotesAssociation.handleQuotes(sampleContext, request, fulfilment)
      expect(ObjectStore.push).toHaveBeenCalledWith('transactions', sampleTransactionId, { fulfilment })
    })
    it('It should not call saveTransaction if its not post quotes', () => {
      const sampleContext = {}
      const request = {
        method: 'post',
        path: '/asdf',
        payload: {
          transactionId: sampleTransactionId
        }
      }
      QuotesAssociation.handleQuotes(sampleContext, request)
      expect(ObjectStore.push).not.toHaveBeenCalledWith(sampleTransactionId)
    })
  })
  describe('handleTransfers', () => {
    it('It should call object store save transaction method', () => {
      const sampleContext = {}
      const request = {
        method: 'post',
        path: '/transfers',
        payload: {
          transferId: sampleTransactionId,
          ilpPacket: sampleIlpPacket
        },
        customInfo: {}
      }
      IlpModel.getIlpTransactionObject.mockReturnValueOnce({
        transactionId: sampleTransactionId
      })
      ObjectStore.popObject.mockReturnValueOnce({
        fulfilment: ''
      })
      QuotesAssociation.handleTransfers(sampleContext, request)
      expect(ObjectStore.popObject).toHaveBeenCalledWith('transactions', sampleTransactionId)
      expect(request.customInfo).toHaveProperty('storedTransaction')
      expect(request.customInfo.storedTransaction).toHaveProperty('fulfilment')
    })
    it('It should not call deleteTransaction if searchTransaction returns false', () => {
      const sampleContext = {}
      const request = {
        method: 'post',
        path: '/transfers',
        payload: {
          transferId: sampleTransactionId
        }
      }
      IlpModel.getIlpTransactionObject.mockReturnValueOnce({
        transactionId: sampleTransactionId
      })
      ObjectStore.popObject.mockReturnValueOnce()
      const handleTransfers = QuotesAssociation.handleTransfers(sampleContext, request)
      expect(handleTransfers).toBeFalsy()
    })
    it('It should not call searchTransaction if its not post transfers', () => {
      const sampleContext = {}
      const request = {
        method: 'post',
        path: '/asdf',
        payload: {
          transferId: sampleTransactionId
        }
      }
      const handleTransfers = QuotesAssociation.handleTransfers(sampleContext, request)
      expect(handleTransfers).toBeTruthy()
    })
    it('It should not call searchTransaction if there is no payload', () => {
      const sampleContext = {}
      const request = {
        method: 'post',
        path: '/transfers'
      }
      IlpModel.getIlpTransactionObject.mockRejectedValueOnce()
      const handleTransfers = QuotesAssociation.handleTransfers(sampleContext, request)
      expect(handleTransfers).toBeFalsy()
    })
  })
})
