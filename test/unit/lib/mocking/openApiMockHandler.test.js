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
const AssertionStore = require('../../../../src/lib/assertionStore')
const OpenApiVersionTools = require('../../../../src/lib/mocking/openApiVersionTools')

const SpyGetUserConfig = jest.spyOn(Config, 'getUserConfig')
const SpyGetApiDefinitions = jest.spyOn(OpenApiDefinitionsModel, 'getApiDefinitions')
const SpyReadFileAsync = jest.spyOn(Utils, 'readFileAsync')
const SpyRequestLogger = jest.spyOn(RequestLogger, 'logMessage')

const SpyOpenApiRulesEngine = jest.spyOn(OpenApiRulesEngine, 'validateRules')
const SpyGenerateMockErrorCallback = jest.spyOn(OpenApiRulesEngine, 'generateMockErrorCallback')
const SpyCallbackRules = jest.spyOn(OpenApiRulesEngine, 'callbackRules')
const SpyResponseRules = jest.spyOn(OpenApiRulesEngine, 'responseRules')

const SpyHandleCallback = jest.spyOn(CallbackHandler, 'handleCallback')

const SpyHandleTransfers = jest.spyOn(QuotesAssociation, 'handleTransfers')
const SpyHandleQuotes = jest.spyOn(QuotesAssociation, 'handleQuotes')

const SpyValidateTransferIlpPacket = jest.spyOn(IlpModel, 'validateTransferIlpPacket')
const SpyHandleQuoteIlp = jest.spyOn(IlpModel, 'handleQuoteIlp')
const SpyHandleTransferIlp = jest.spyOn(IlpModel, 'handleTransferIlp')
const SpyInit = jest.spyOn(IlpModel, 'init')
const SpyValidateTransferCondition = jest.spyOn(IlpModel, 'validateTransferCondition')

const SpyHandleRequest = jest.spyOn(TransactionRequestsService, 'handleRequest')

const SpyValidate = jest.spyOn(JwsSigning, 'validate')

const SpyValidateAcceptHeader = jest.spyOn(OpenApiVersionTools, 'validateAcceptHeader')
const SpyNegotiateVersion = jest.spyOn(OpenApiVersionTools, 'negotiateVersion')
const SpyValidateContentTypeHeader = jest.spyOn(OpenApiVersionTools, 'validateContentTypeHeader')

jest.mock('../../../../src/lib/assertionStore')

jest.setTimeout(10000)
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

const sampleRequest = {
  method: 'post',
  path: '/quotes',
  headers: {
    'Accept': 'asdf'
  },
  majorVersion: 1,
  minorVersion: 0,
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

describe('OpenApiMockHandler', () => {
  describe('initilizeMockHandler', () => {
    it('Should not throw errors', async () => {
      SpyInit.mockReturnValueOnce()
      SpyGetUserConfig.mockResolvedValueOnce({
        ILP_SECRET: 'secret'
      })
      SpyGetApiDefinitions.mockResolvedValueOnce([{
        specFile: 'spec_files/api_definitions/fspiop_1.0/api_spec.yaml',
        type: 'fspiop'
      }])

      await OpenApiMockHandler.initilizeMockHandler()
      const apis = OpenApiMockHandler.getOpenApiObjects()
      const openApiBackendObject = apis[0].openApiBackendObject
      const contextValidationFail = {
        validation: {
          errors: [{
            keyword: 'keyword',
            dataPath: 'dataPath',
            params: {
              'key1': 'value1'
            },
            message: 'error message'
          }]
        }
      }
      await openApiBackendObject.handlers.validationFail(contextValidationFail, {}, h)
      
      SpyRequestLogger.mockReturnValue()
      await openApiBackendObject.handlers.notFound(null, {}, h)

      const req = {
        type: 'fspiop',
        method: 'put',
        path: '/quotes',
        customInfo: {}
      }
      const context = {
        operation: {
          path: '/quotes'
        },
        request: {
          method: 'put'
        },
        api: {
          mockResponseForOperation: (operationId) => {
            switch (operationId) {
              case 0: return {
                status: 200,
                delay: 500
              }; break
              default: return {
                status: 200,
                mock: {
                  test: 'test'
                },
                delay: 500
              }
            }
          }
        } 
      }
      AssertionStore.pushRequest.mockReturnValueOnce()
      SpyReadFileAsync.mockResolvedValueOnce(JSON.stringify({
        '/quotes': {
          put: {}
        }
      }))
      SpyResponseRules.mockResolvedValueOnce({
        status: '200',
        delay: 100
      })
      await openApiBackendObject.handlers.notImplemented(context, req, h)
      
      req.path = '/quotes/{ID}/error'
      AssertionStore.pushRequest.mockReturnValueOnce()
      SpyReadFileAsync.mockResolvedValueOnce(JSON.stringify({
        '/quotes/{ID}/error': {
          put: {}
        }
      }))
      await openApiBackendObject.handlers.notImplemented(context, req, h)
      
      req.path = '/quotes'
      req.method = 'post'

      SpyReadFileAsync.mockRejectedValueOnce()
      SpyResponseRules.mockResolvedValueOnce({
        status: '200',
        body: {}
      })
      context.operation.operationId = 0
      await openApiBackendObject.handlers.notImplemented(context, req, h)
    })
  })
  describe('handleRequest', () => {
    it('Check for the returned value', () => {
      SpyValidate.mockImplementationOnce(() => {throw new Error('')})
      const result = OpenApiMockHandler.handleRequest(sampleRequest, h)
      expect(result).toBeDefined()
    })
    it('Check for the returned value', () => {
      SpyValidate.mockReturnValueOnce(true)
      sampleRequest.path = '/test'
      const result = OpenApiMockHandler.handleRequest(sampleRequest, h)
      sampleRequest.path = '/quotes'
      expect(result).toBeDefined()
    })
    it('Check for the returned value', () => {
      SpyValidate.mockReturnValueOnce(false)
      SpyValidateAcceptHeader.mockReturnValueOnce({
        validationFailed: false
      })
      SpyNegotiateVersion.mockReturnValueOnce({
        negotiationFailed: true,
        negotiatedIndex: 0
      })
      SpyGetUserConfig.mockReturnValueOnce({
        VERSIONING_SUPPORT_ENABLE: true
      })
      const result = OpenApiMockHandler.handleRequest(sampleRequest, h)
      expect(result).toBeDefined()
    })
    it('Check for the returned value', () => {
      SpyValidate.mockReturnValueOnce(true)
      SpyValidateAcceptHeader.mockReturnValueOnce({
        validationFailed: false
      })
      SpyNegotiateVersion.mockReturnValueOnce({
        negotiationFailed: false,
        negotiatedIndex: 0
      })
      SpyGetUserConfig.mockReturnValueOnce({
        VERSIONING_SUPPORT_ENABLE: true
      })
      const result = OpenApiMockHandler.handleRequest(sampleRequest, h)
      expect(result).toBeDefined()
    })
    it('Check for the returned value', () => {
      SpyValidate.mockReturnValueOnce(true)
      SpyValidateAcceptHeader.mockReturnValueOnce({
        validationFailed: true
      })
      SpyGetUserConfig.mockReturnValueOnce({
        VERSIONING_SUPPORT_ENABLE: true
      })
      const result = OpenApiMockHandler.handleRequest(sampleRequest, h)
      expect(result).toBeDefined()
    })
    it('Check for the returned value', () => {
      SpyValidate.mockReturnValueOnce(true)
      SpyValidateContentTypeHeader.mockReturnValueOnce({
        validationFailed: true
      })
      SpyGetUserConfig.mockReturnValueOnce({
        VERSIONING_SUPPORT_ENABLE: true
      })
      sampleRequest.method = 'put'
      sampleRequest.path = '/quotes/{ID}'
      const result = OpenApiMockHandler.handleRequest(sampleRequest, h)
      expect(result).toBeDefined()
      sampleRequest.method = 'post'
      sampleRequest.path = '/quotes'
    })
    it('Check for the returned value', () => {
      SpyValidate.mockReturnValueOnce(true)
      SpyValidateContentTypeHeader.mockReturnValueOnce({
        validationFailed: false
      })
      SpyGetUserConfig.mockReturnValueOnce({
        VERSIONING_SUPPORT_ENABLE: true
      })
      SpyNegotiateVersion.mockReturnValueOnce({
        negotiationFailed: true
      })
      sampleRequest.method = 'put'
      sampleRequest.path = '/quotes/{ID}'
      const result = OpenApiMockHandler.handleRequest(sampleRequest, h)
      expect(result).toBeDefined()
      sampleRequest.method = 'post'
      sampleRequest.path = '/quotes'
    })
    it('Check for the returned value', () => {
      SpyValidate.mockReturnValueOnce(false)
      SpyGetUserConfig.mockReturnValueOnce({
        VERSIONING_SUPPORT_ENABLE: false
      })
      const result = OpenApiMockHandler.handleRequest(sampleRequest, h)
      expect(result).toBeDefined()
    })
  })
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
        TRANSFERS_VALIDATION_WITH_PREVIOUS_QUOTES: true
      })
      SpyHandleTransfers.mockReturnValueOnce(true)
      SpyCallbackRules.mockResolvedValueOnce({})
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
        TRANSFERS_VALIDATION_ILP_PACKET: true
      })
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
        TRANSFERS_VALIDATION_ILP_PACKET: true
      })
      SpyValidateTransferIlpPacket.mockReturnValueOnce(true)
      SpyCallbackRules.mockResolvedValueOnce({})
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
        TRANSFERS_VALIDATION_CONDITION: true
      })
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
        TRANSFERS_VALIDATION_CONDITION: true
      })
      SpyValidateTransferCondition.mockReturnValueOnce(true)
      SpyCallbackRules.mockResolvedValueOnce({})
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
      SpyHandleTransfers.mockReturnValueOnce(true)
      SpyCallbackRules.mockResolvedValueOnce({body: {}})
      SpyHandleCallback.mockResolvedValueOnce()
      SpyHandleQuoteIlp.mockReturnValueOnce('')
      SpyHandleTransferIlp.mockReturnValueOnce()
      SpyHandleQuotes.mockReturnValueOnce()
      SpyHandleRequest.mockReturnValueOnce()
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
      SpyGetUserConfig.mockReturnValueOnce({})
      SpyCallbackRules.mockResolvedValueOnce({body: {}})
      SpyHandleCallback.mockResolvedValueOnce()
      SpyHandleQuoteIlp.mockReturnValueOnce('')
      SpyHandleTransferIlp.mockReturnValueOnce()
      SpyHandleQuotes.mockReturnValueOnce()
      SpyHandleRequest.mockReturnValueOnce()
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
