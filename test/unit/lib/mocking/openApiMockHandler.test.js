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

const OpenApiMockHandler = require('../../../../src/lib/mocking/openApiMockHandler')
const IlpModel = require('../../../../src/lib/mocking/middleware-functions/ilpModel')
const Config = require('../../../../src/lib/config')
const OpenApiDefinitionsModel = require('../../../../src/lib/mocking/openApiDefinitionsModel')
const RequestLogger = require('../../../../src/lib/requestLogger')
const Utils = require('../../../../src/lib/utils')
const OpenApiRulesEngine = require('../../../../src/lib/mocking/openApiRulesEngine')
const CallbackHandler = require('../../../../src/lib/callbackHandler')
const QuotesAssociation = require('../../../../src/lib/mocking/middleware-functions/quotesAssociation')
const TransactionRequestsService = require('../../../../src/lib/mocking/middleware-functions/transactionRequestsService')
const JwsSigning = require('../../../../src/lib/jws/JwsSigning')


const SpyGetUserConfig = jest.spyOn(Config, 'getUserConfig')
const SpyGetApiDefinitions = jest.spyOn(OpenApiDefinitionsModel, 'getApiDefinitions')
const SpyReadFileAsync = jest.spyOn(Utils, 'readFileAsync')
const SpyRequestLogger = jest.spyOn(RequestLogger, 'logMessage')

const SpyOpenApiRulesEngine = jest.spyOn(OpenApiRulesEngine, 'validateRules')
const SpyGenerateMockErrorCallback = jest.spyOn(OpenApiRulesEngine, 'generateMockErrorCallback')
const SpyCallbackRules = jest.spyOn(OpenApiRulesEngine, 'callbackRules')

const SpyHandleCallback = jest.spyOn(CallbackHandler, 'handleCallback')

const SpyHandleTransfers = jest.spyOn(QuotesAssociation, 'handleTransfers')
const SpyHandleQuotes = jest.spyOn(QuotesAssociation, 'handleQuotes')

const SpyValidateTransferIlpPacket = jest.spyOn(IlpModel, 'validateTransferIlpPacket')
const SpyHandleQuoteIlp = jest.spyOn(IlpModel, 'handleQuoteIlp')
const SpyHandleTransferIlp = jest.spyOn(IlpModel, 'handleTransferIlp')
const SpyValidateTransferCondition = jest.spyOn(IlpModel, 'validateTransferCondition')

const SpyHandleRequest = jest.spyOn(TransactionRequestsService, 'handleRequest')

const SpyValidate = jest.spyOn(JwsSigning, 'validate')

const OpenApiBackend = require('openapi-backend').default
jest.mock('openapi-backend')

OpenApiBackend.mockImplementation((argObj) => {
  const initFn = async () => {

  }
  const matchOperationFn = () => {
    return true
  }
  const handleRequestFn = () => {
    return true
  }
  return {
    init: initFn,
    handleRequest: handleRequestFn,
    matchOperation: matchOperationFn
  }
})

const quoteRequestBody = {
  quoteId: 'f27456e9-fffb-47c0-9f28-5c727434873d',
  transactionId: '49618fcc-8b13-49b1-8126-2a0cda6472ce',
  amountType: 'SEND',
  amount: {
    currency: 'USD',
    amount: '100'
  },
  expiration: '2020-05-14T13:06:20.442Z',
  payer: {
    partyIdInfo: {
      partyIdType: 'MSISDN',
      partyIdentifier: '123456',
      fspId: 'userdfsp'
    },
    name: 'John Johnson'
  },
  payee: {
    partyIdInfo: {
      partyIdType: 'MSISDN',
      partyIdentifier: '000111',
      fspId: 'testingtoolkitdfsp'
    },
    personalInfo: {
      complexName: {
        firstName: 'Maria',
        middleName: 'N',
        lastName: 'Williams'
      },
      dateOfBirth: '1932-04-24'
    }
  },
  transactionType: {
    scenario: 'TRANSFER',
    initiator: 'PAYER',
    initiatorType: 'CONSUMER'
  },
  note: 'this is a test'
}

const sampleContext = {
  operation: {
    path: '/quotes',
    method: 'post'
  },
  request: {
    path: '/quotes',
    method: 'post',
    body: {...quoteRequestBody}
  },
  api: {
    mockResponseForOperation: () => {
      return {
        status: 200,
        mock: {
          test: 'test'
        },
        delay: 500
      }
    }
  }
}

const sampleRequest = {
  method: 'post',
  path: '/quotes',
  headers: {
    'Accept': 'asdf'
  },
  payload: {...quoteRequestBody},
  customInfo: {
    sessionID: '123'
  }
}

const h = {
  response : () => {
    return {
      code: () => true
    }
  }
}

jest.setTimeout(30000)

describe('OpenApiMockHandler', () => {
  describe('initilizeMockHandler', () => {
    it('Should not throw errors', async () => {
      SpyGetUserConfig.mockResolvedValueOnce({
        ILP_SECRET: 'secret'
      })
      SpyGetApiDefinitions.mockResolvedValueOnce([{
        specFile: 'api_spec.yaml'
      }])

      await expect(OpenApiMockHandler.initilizeMockHandler()).resolves.toBeUndefined()
    })
    it('getOpenApiObjects should output apis', async () => {
      const result = OpenApiMockHandler.getOpenApiObjects()
      expect(Array.isArray(result)).toBeTruthy()
    })
  })
  describe('handleRequest', () => {
    it('Check for the returned value', () => {
      const result = OpenApiMockHandler.handleRequest(sampleRequest, h)
      expect(result).toBe(true)
    })
  })
  describe('openApiBackendNotImplementedHandler', () => {
    it('Check for the returned value', async () => {
      const apis = OpenApiMockHandler.getOpenApiObjects()
      const fnNotImplemented = OpenApiMockHandler.openApiBackendNotImplementedHandler(apis[0])
      const result = await fnNotImplemented(sampleContext, sampleRequest, h)
      expect(result).toBe(true)
    })
  })
  // describe('handleRequest', () => {
  //   it('to do', () => {
  //     const req = {
  //       method: 'put'
  //     }
  //     const h = {
  //       response: () => {
  //         code: () => {}
  //       }
  //     }
  //     SpyValidate.mockReturnValueOnce(() => {throw new Error()})
  //     SpyRequestLogger.mockReturnValue()
  //     const result = OpenApiMockHandler.handleRequest(req, headers)
  //     expect(Array.isArray(result)).toBeTruthy
  //   })
  //   it('to do', () => {
  //     const req = {
  //       method: 'put'
  //     }
  //     const h = {
  //       response: () => {
  //         code: () => {}
  //       }
  //     }
  //     SpyValidate.mockReturnValueOnce(true)
  //     SpyRequestLogger.mockReturnValue()
  //     const result = OpenApiMockHandler.handleRequest(req, headers)
  //     expect(Array.isArray(result)).toBeTruthy
  //   })
  // })
  describe('generateAsyncCallback', () => {
    it('Check for the returned value - not existing path', async () => {
      const item = {}
      const sampleContext = {
        operation: {
          path: '/transfers'
        }
      }
      const sampleRequest = {}
      SpyReadFileAsync.mockReturnValueOnce(JSON.stringify({}))
      SpyRequestLogger.mockReturnValue()
      const result = await OpenApiMockHandler.generateAsyncCallback(item, sampleContext, sampleRequest)
    })
    it('Check for the returned value - existing path', async () => {
      const item = {}
      const sampleContext = {
        operation: {
          path: '/transfers'
        },
        request: {
          method: 'post'
        }
      }
      const sampleRequest = {}
      SpyReadFileAsync.mockReturnValueOnce(JSON.stringify({
        '/transfers': {
          put: {}
        }
      }))
      SpyRequestLogger.mockReturnValue()
      const result = await OpenApiMockHandler.generateAsyncCallback(item, sampleContext, sampleRequest)
    })
    it('Check for the returned value - existing path', async () => {
      const item = {}
      const sampleContext = {}
      const sampleRequest = {}
      SpyReadFileAsync.mockImplementationOnce(() => {throw new Error()})
      SpyRequestLogger.mockReturnValue()
      const result = await OpenApiMockHandler.generateAsyncCallback(item, sampleContext, sampleRequest)
    })
    it('Check for the returned value - existing path', async () => {
      const item = {}
      const sampleContext = {
        operation: {
          path: '/transfers'
        },
        request: {
          method: 'post'
        }
      }
      const sampleRequest = {
        customInfo: {}
      }
      SpyReadFileAsync.mockReturnValueOnce(JSON.stringify({
        '/transfers': {
          'post': {}
        }
      }))
      SpyRequestLogger.mockReturnValue()
      SpyOpenApiRulesEngine.mockResolvedValueOnce({
        body: {}
      })
      SpyHandleCallback.mockResolvedValueOnce()
      const result = await OpenApiMockHandler.generateAsyncCallback(item, sampleContext, sampleRequest)
    })
    it('Check for the returned value - existing path', async () => {
      const item = {}
      const sampleContext = {
        operation: {
          path: '/transfers'
        },
        request: {
          method: 'post'
        }
      }
      const sampleRequest = {
        customInfo: {}
      }
      SpyReadFileAsync.mockReturnValueOnce(JSON.stringify({
        '/transfers': {
          'post': {}
        }
      }))
      SpyRequestLogger.mockReturnValue()
      SpyOpenApiRulesEngine.mockResolvedValueOnce({})
      SpyHandleCallback.mockResolvedValueOnce()
      SpyGetUserConfig.mockReturnValueOnce({
        TRANSFERS_VALIDATION_WITH_PREVIOUS_QUOTES: true
      })
      SpyHandleTransfers.mockReturnValueOnce(false)
      SpyGenerateMockErrorCallback.mockResolvedValueOnce({})
      SpyHandleCallback.mockResolvedValueOnce()
      const result = await OpenApiMockHandler.generateAsyncCallback(item, sampleContext, sampleRequest)
    })
    it('Check for the returned value - existing path', async () => {
      const item = {}
      const sampleContext = {
        operation: {
          path: '/transfers'
        },
        request: {
          method: 'post'
        }
      }
      const sampleRequest = {
        customInfo: {}
      }
      SpyReadFileAsync.mockReturnValueOnce(JSON.stringify({
        '/transfers': {
          'post': {}
        }
      }))
      SpyRequestLogger.mockReturnValue()
      SpyOpenApiRulesEngine.mockResolvedValueOnce({})
      SpyHandleCallback.mockResolvedValueOnce()
      SpyGetUserConfig.mockReturnValueOnce({
        TRANSFERS_VALIDATION_WITH_PREVIOUS_QUOTES: true,
        TRANSFERS_VALIDATION_ILP_PACKET: true
      })
      SpyHandleTransfers.mockReturnValueOnce(true)
      SpyValidateTransferIlpPacket.mockReturnValueOnce(false)
      SpyGenerateMockErrorCallback.mockResolvedValueOnce({})
      SpyHandleCallback.mockResolvedValueOnce()
      const result = await OpenApiMockHandler.generateAsyncCallback(item, sampleContext, sampleRequest)
    })
    it('Check for the returned value - existing path', async () => {
      const item = {}
      const sampleContext = {
        operation: {
          path: '/transfers'
        },
        request: {
          method: 'post'
        }
      }
      const sampleRequest = {
        customInfo: {}
      }
      SpyReadFileAsync.mockReturnValueOnce(JSON.stringify({
        '/transfers': {
          'post': {}
        }
      }))
      SpyRequestLogger.mockReturnValue()
      SpyOpenApiRulesEngine.mockResolvedValueOnce({})
      SpyHandleCallback.mockResolvedValueOnce()
      SpyGetUserConfig.mockReturnValueOnce({
        TRANSFERS_VALIDATION_WITH_PREVIOUS_QUOTES: true,
        TRANSFERS_VALIDATION_ILP_PACKET: true,
        TRANSFERS_VALIDATION_CONDITION: true
      })
      SpyHandleTransfers.mockReturnValueOnce(true)
      SpyValidateTransferIlpPacket.mockReturnValueOnce(true)
      SpyValidateTransferCondition.mockReturnValueOnce(false)
      SpyGenerateMockErrorCallback.mockResolvedValueOnce({})
      SpyHandleCallback.mockResolvedValueOnce()
      const result = await OpenApiMockHandler.generateAsyncCallback(item, sampleContext, sampleRequest)
    })
    it('Check for the returned value - existing path', async () => {
      const item = {}
      const sampleContext = {
        operation: {
          path: '/transfers'
        },
        request: {
          method: 'post'
        }
      }
      const sampleRequest = {
        customInfo: {}
      }
      SpyReadFileAsync.mockReturnValueOnce(JSON.stringify({
        '/transfers': {
          'post': {}
        }
      }))
      SpyRequestLogger.mockReturnValue()
      SpyOpenApiRulesEngine.mockResolvedValueOnce({})
      SpyHandleCallback.mockResolvedValueOnce()
      SpyGetUserConfig.mockReturnValueOnce({
        TRANSFERS_VALIDATION_WITH_PREVIOUS_QUOTES: true,
        TRANSFERS_VALIDATION_ILP_PACKET: true,
        TRANSFERS_VALIDATION_CONDITION: true
      })
      SpyHandleTransfers.mockReturnValueOnce(true)
      SpyValidateTransferIlpPacket.mockReturnValueOnce(true)
      SpyCallbackRules.mockResolvedValueOnce({body: {}})
      SpyHandleCallback.mockResolvedValueOnce()
      SpyHandleQuoteIlp.mockReturnValueOnce('')
      SpyHandleTransferIlp.mockReturnValueOnce()
      SpyHandleQuotes.mockReturnValueOnce()
      SpyHandleRequest.mockReturnValueOnce()
      const result = await OpenApiMockHandler.generateAsyncCallback(item, sampleContext, sampleRequest)
    })
  })
})
