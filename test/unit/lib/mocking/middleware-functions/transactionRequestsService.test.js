/*****
 License
 --------------
 Copyright © 2020-2025 Mojaloop Foundation
 The Mojaloop files are made available by the Mojaloop Foundation under the Apache License, Version 2.0 (the "License") and you may not use these files except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, the Mojaloop files are distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

 Contributors
 --------------
 This is the official list of the Mojaloop project contributors for this file.
 Names of the original copyright holders (individuals or organizations)
 should be listed with a '*' in the first column. People who have
 contributed from an organization can be listed under the organization
 that actually holds the copyright for their contributions (see the
 Mojaloop Foundation for an example). Those individuals should have
 their names indented and be marked with a '-'. Email address can be added
 optionally within square brackets <email>.

 * Mojaloop Foundation
 - Name Surname <name.surname@mojaloop.io>

 * ModusBox
 * Vijaya Kumar Guthi <vijaya.guthi@modusbox.com> (Original Author)
 --------------
 ******/

'use strict'

const TransactionRequestsService = require('../../../../../src/lib/mocking/middleware-functions/transactionRequestsService')
const outbound = require('../../../../../src/lib/test-outbound/outbound-initiator')

jest.mock('../../../../../src/lib/test-outbound/outbound-initiator')

describe('transactionRequestsService', () => {
  describe('handleRequest', () => {
    const request = {
      method: 'post',
      path: '/transactionRequests',
      payload: {
        transactionRequestId: '57138ef8-17e9-4514-899b-279d805340ff',
        payee: {
          partyIdInfo: {
            partyIdType: 'MSISDN',
            partyIdentifier: '9876543210',
            fspId: 'userdfsp'
          },
          merchantClassificationCode: '98',
          name: 'nisi in',
          personalInfo: {
            complexName: {
              firstName: 'User',
              middleName: 'FSP',
              lastName: 'DFSP'
            },
            dateOfBirth: '1984-01-01'
          }
        },
        payer: {
          partyIdType: 'MSISDN',
          partyIdentifier: '44123456789',
          fspId: 'testingtoolkitdfsp'
        },
        amount: {
          currency: 'USD',
          amount: '100'
        },
        transactionType: {
          scenario: 'PAYMENT',
          initiator: 'PAYEE',
          initiatorType: 'BUSINESS',
          refundInfo: {
            originalTransactionId: '168e0f2c-58a3-496a-830a-940534238c81',
            refundReason: 'Reason'
          },
          balanceOfPayments: '968'
        },
        note: 'Test Payment'
      },
      customInfo: {
        sessionID: '123'
      }
    }
    it('It should not call outboundsend method if the method is not post', async () => {
      const sampleContext = {}
      const request = {
        method: 'put',
        path: '/transactionRequests'
      }
      outbound.OutboundSend.mockClear()
      await TransactionRequestsService.handleRequest(sampleContext, request, null, null)
      expect(outbound.OutboundSend).not.toHaveBeenCalled()
    })
    it('It should not call outboundsend method if the path is not is not /transactionRequests', async () => {
      const sampleContext = {}
      const request = {
        method: 'post',
        path: '/transactions'
      }
      outbound.OutboundSend.mockClear()
      await TransactionRequestsService.handleRequest(sampleContext, request, null, null)
      expect(outbound.OutboundSend).not.toHaveBeenCalled()
    })
    it('It should call outboundsend method', async () => {
      const sampleContext = {}
      const callback = {
        body: {
          transactionRequestState: 'RECEIVED'
        }
      }
      outbound.OutboundSend.mockClear()
      await TransactionRequestsService.handleRequest(sampleContext, request, callback, 'spec_files/api_definitions/fspiop_1.0/trigger_templates')
      await new Promise(resolve => setTimeout(resolve, 1000))
      expect(outbound.OutboundSend).toHaveBeenCalled()
    })
    it('It should not call outboundsend method if the callback request state is not RECEIVED', async () => {
      const request = {
        method: 'post',
        path: '/transactionRequests'
      }
      const sampleContext = {}
      const callback = {
        body: {
          transactionRequestState: 'UNKNOWN'
        }
      }
      outbound.OutboundSend.mockClear()
      await TransactionRequestsService.handleRequest(sampleContext, request, callback, null)
      expect(outbound.OutboundSend).not.toHaveBeenCalled()
    })
    it('It should call outboundsend method if there is no sessionId', async () => {
      const requestWithoutSessionId = {
        method: 'post',
        path: '/transactionRequests',
        payload: {
          transactionRequestId: '57138ef8-17e9-4514-899b-279d805340ff',
          payee: {
            partyIdInfo: {
              partyIdType: 'MSISDN',
              partyIdentifier: '9876543210',
              fspId: 'userdfsp'
            },
            merchantClassificationCode: '98',
            name: 'nisi in',
            personalInfo: {
              complexName: {
                firstName: 'User',
                middleName: 'FSP',
                lastName: 'DFSP'
              },
              dateOfBirth: '1984-01-01'
            }
          },
          payer: {
            partyIdType: 'MSISDN',
            partyIdentifier: '44123456789',
            fspId: 'testingtoolkitdfsp'
          },
          amount: {
            currency: 'USD',
            amount: '100'
          },
          transactionType: {
            scenario: 'PAYMENT',
            initiator: 'PAYEE',
            initiatorType: 'BUSINESS',
            refundInfo: {
              originalTransactionId: '168e0f2c-58a3-496a-830a-940534238c81',
              refundReason: 'Reason'
            },
            balanceOfPayments: '968'
          },
          note: 'Test Payment'
        },
        customInfo: {}
      }
      const sampleContext = {}
      const callback = {
        body: {
          transactionRequestState: 'RECEIVED'
        }
      }
      outbound.OutboundSend.mockClear()
      await TransactionRequestsService.handleRequest(sampleContext, requestWithoutSessionId, callback, 'spec_files/api_definitions/fspiop_1.0/trigger_templates')
      await new Promise(resolve => setTimeout(resolve, 1000))
      expect(outbound.OutboundSend).toHaveBeenCalled()
    })
    it('It should call outboundsend method if there is no sessionId', async () => {
      const requestWithoutCustomInfo = {
        method: 'post',
        path: '/transactionRequests',
        payload: {
          transactionRequestId: '57138ef8-17e9-4514-899b-279d805340ff',
          payee: {
            partyIdInfo: {
              partyIdType: 'MSISDN',
              partyIdentifier: '9876543210',
              fspId: 'userdfsp'
            },
            merchantClassificationCode: '98',
            name: 'nisi in',
            personalInfo: {
              complexName: {
                firstName: 'User',
                middleName: 'FSP',
                lastName: 'DFSP'
              },
              dateOfBirth: '1984-01-01'
            }
          },
          payer: {
            partyIdType: 'MSISDN',
            partyIdentifier: '44123456789',
            fspId: 'testingtoolkitdfsp'
          },
          amount: {
            currency: 'USD',
            amount: '100'
          },
          transactionType: {
            scenario: 'PAYMENT',
            initiator: 'PAYEE',
            initiatorType: 'BUSINESS',
            refundInfo: {
              originalTransactionId: '168e0f2c-58a3-496a-830a-940534238c81',
              refundReason: 'Reason'
            },
            balanceOfPayments: '968'
          },
          note: 'Test Payment'
        }
      }
      const sampleContext = {}
      const callback = {
        body: {
          transactionRequestState: 'RECEIVED'
        }
      }
      outbound.OutboundSend.mockClear()
      await TransactionRequestsService.handleRequest(sampleContext, requestWithoutCustomInfo, callback, 'spec_files/api_definitions/fspiop_1.0/trigger_templates')
      expect(outbound.OutboundSend).not.toHaveBeenCalled()
    })
  })

})
