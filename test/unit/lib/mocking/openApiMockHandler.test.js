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
 * Georgi Logodazhki <georgi.logodazhki@modusbox.com>
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
const ObjectStore = require('../../../../src/lib/objectStore')
const ArrayStore = require('../../../../src/lib/arrayStore')
const OpenApiVersionTools = require('../../../../src/lib/mocking/openApiVersionTools')

const SpyGetUserConfig = jest.spyOn(Config, 'getUserConfig')
const SpyGetApiDefinitions = jest.spyOn(OpenApiDefinitionsModel, 'getApiDefinitions')
const SpyReadFileAsync = jest.spyOn(Utils, 'readFileAsync')
const SpyRequestLogger = jest.spyOn(RequestLogger, 'logMessage')

const SpyOpenApiRulesEngine = jest.spyOn(OpenApiRulesEngine, 'validateRules')
const SpyGenerateMockErrorCallback = jest.spyOn(OpenApiRulesEngine, 'generateMockErrorCallback')
const SpyCallbackRules = jest.spyOn(OpenApiRulesEngine, 'callbackRules')
const SpyResponseRules = jest.spyOn(OpenApiRulesEngine, 'responseRules')
const SpyForwardRules = jest.spyOn(OpenApiRulesEngine, 'forwardRules')

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
const SpyParseAcceptHeader = jest.spyOn(OpenApiVersionTools, 'parseAcceptHeader')
const SpyResolveAndLoad = jest.spyOn(Utils, 'resolveAndLoad')

jest.mock('../../../../src/lib/objectStore')
jest.mock('../../../../src/lib/arrayStore')

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
    'Accept': 'asdf',
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
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('initilizeMockHandler', () => {
    it('Should not throw errors', async () => {
      SpyInit.mockReturnValueOnce()
      SpyGetUserConfig.mockResolvedValueOnce({
        ILP_SECRET: 'secret'
      })
      SpyGetApiDefinitions.mockResolvedValueOnce([
        {
          specFile: 'spec_files/api_definitions/mojaloop_sdk_outbound_scheme_adapter_1.0/api_spec.yaml',
          type: 'mojaloop_sdk_outbound_scheme_adapter',
          version: '1.0',
          hostnames: [],
          prefix: '/sdk-out'
        },
        {
          specFile: 'spec_files/api_definitions/fspiop_1.0/api_spec.yaml',
          type: 'fspiop'
        }
      ])
      await OpenApiMockHandler.initilizeMockHandler()
      const apis = OpenApiMockHandler.getOpenApiObjects()
      const openApiBackendObject = apis[0].openApiBackendObject
      const contextValidationFail = {
        validation: {
          errors: [{
            keyword: 'keyword',
            instancePath: 'instancePath',
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
      ObjectStore.push.mockReturnValueOnce()
      ArrayStore.push.mockReturnValueOnce()
      SpyResolveAndLoad.mockResolvedValueOnce(JSON.stringify({
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
      ObjectStore.push.mockReturnValueOnce()
      ArrayStore.push.mockReturnValueOnce()
      SpyResolveAndLoad.mockResolvedValueOnce(JSON.stringify({
        '/quotes/{ID}/error': {
          put: {}
        }
      }))
      await openApiBackendObject.handlers.notImplemented(context, req, h)

      req.path = '/quotes'
      req.method = 'post'

      SpyResponseRules.mockResolvedValueOnce({
        status: '200',
        body: {}
      })
      context.operation.operationId = 0
      await openApiBackendObject.handlers.notImplemented(context, req, h)
    })
  })
  describe('handleRequest', () => {
    beforeEach(async () => {
      SpyInit.mockReturnValue()
      SpyGetUserConfig.mockResolvedValue({ ILP_SECRET: 'secret', VERSIONING_SUPPORT_ENABLE: false })
      SpyGetApiDefinitions.mockResolvedValue([
        {
          specFile: 'spec_files/api_definitions/mojaloop_sdk_outbound_scheme_adapter_1.0/api_spec.yaml',
          type: 'mojaloop_sdk_outbound_scheme_adapter',
          version: '1.0',
          hostnames: [],
          prefix: '/sdk-out'
        },
        {
          specFile: 'spec_files/api_definitions/fspiop_1.0/api_spec.yaml',
          type: 'fspiop',
          hostnames: []
        }
      ])
      await OpenApiMockHandler.initilizeMockHandler()
    })    
    it('Check for the returned value when validation failed', async () => {
      SpyValidate.mockImplementationOnce(() => {throw new Error('')})
      const result = await OpenApiMockHandler.handleRequest(sampleRequest, h)
      expect(result).toBeDefined()
    })
    it('Check for the returned value when validation passed', async () => {
      SpyParseAcceptHeader.mockReturnValueOnce({
        apiType: 'fspiop',
      })
      SpyValidate.mockReturnValueOnce(true)
      sampleRequest.method = 'put'
      sampleRequest.path = '/test'
      const result = await OpenApiMockHandler.handleRequest(sampleRequest, h)
      sampleRequest.method = 'post'
      sampleRequest.path = '/quotes'
      expect(result).toBeDefined
    })
    it('Should pickup the right API when prefix is passed', async () => {
      // SpyValidate.mockReturnValueOnce(true)
      sampleRequest.path = '/sdk-out/quotes'
      const result = await OpenApiMockHandler.handleRequest(sampleRequest, h)
      sampleRequest.path = '/quotes'
      expect(result).toBeDefined
    })
    it('Should trim prefix from request path when selected API has prefix', async () => {
      // init with two apis, first has prefix so it becomes pickedApis[0]
      SpyInit.mockReturnValueOnce()
      SpyGetUserConfig.mockResolvedValueOnce({ ILP_SECRET: 'secret', VERSIONING_SUPPORT_ENABLE: false })
      SpyGetApiDefinitions.mockResolvedValueOnce([
        {
          specFile: 'spec_files/api_definitions/mojaloop_sdk_outbound_scheme_adapter_1.0/api_spec.yaml',
          type: 'customPrefix',
          hostnames: [],
          prefix: '/sdk-out'
        },
        {
          specFile: 'spec_files/api_definitions/fspiop_1.0/api_spec.yaml',
          type: 'fspiop',
          hostnames: []
        }
      ])
    
      await OpenApiMockHandler.initilizeMockHandler()
      const apis = OpenApiMockHandler.getOpenApiObjects()
    
      // Force prefix API to match
      apis[0].openApiBackendObject.matchOperation = jest.fn(() => true)
      apis[1].openApiBackendObject.matchOperation = jest.fn(() => false)
    
      const handleSpy = jest.fn(async () => true)
      apis[0].openApiBackendObject.handleRequest = handleSpy
    
      SpyValidate.mockReturnValueOnce(true)
    
      const req = {
        method: 'post',
        path: '/sdk-out/quotes',
        headers: { accept: 'application/json' },
        payload: {},
        query: {},
        info: { hostname: 'x' },
        customInfo: { user: 'u1' }
      }
    
      await OpenApiMockHandler.handleRequest(req, h)
    
      // openapi-backend receives trimmed path
      expect(handleSpy).toHaveBeenCalled()
      const firstArg = handleSpy.mock.calls[0][0]
      expect(firstArg.path).toBe('/quotes')
    })
    it('Should fall back when hostnames exist but req.info.hostname is missing', async () => {
      SpyInit.mockReturnValueOnce()
      SpyGetUserConfig.mockResolvedValueOnce({ ILP_SECRET: 'secret', VERSIONING_SUPPORT_ENABLE: false })
      SpyGetApiDefinitions.mockResolvedValueOnce([
        { specFile: 'spec_files/api_definitions/fspiop_1.0/api_spec.yaml', type: 'customA', hostnames: ['host-a'] },
        { specFile: 'spec_files/api_definitions/mojaloop_sdk_outbound_scheme_adapter_1.0/api_spec.yaml', type: 'customB', hostnames: [] }
      ])
    
      await OpenApiMockHandler.initilizeMockHandler()
      const apis = OpenApiMockHandler.getOpenApiObjects()
    
      apis[0].openApiBackendObject.matchOperation = jest.fn(() => true)
      apis[1].openApiBackendObject.matchOperation = jest.fn(() => true)
    
      apis[0].openApiBackendObject.handleRequest = jest.fn(async () => 'A')
      apis[1].openApiBackendObject.handleRequest = jest.fn(async () => 'B')
    
      SpyValidate.mockReturnValueOnce(true)
    
      const req = {
        method: 'post',
        path: '/whatever',
        headers: { accept: 'application/json' },
        payload: {},
        query: {},
        // info missing here
        customInfo: { user: 'u1' }
      }
    
      await OpenApiMockHandler.handleRequest(req, h)
      // We just want to hit the branch; assert at least one handler called:
      expect(apis[0].openApiBackendObject.handleRequest.mock.calls.length +
             apis[1].openApiBackendObject.handleRequest.mock.calls.length).toBe(1)
    })
    it('Should pick apis without hostnames when hostname does not match any', async () => {
      SpyInit.mockReturnValueOnce()
      SpyGetUserConfig.mockResolvedValueOnce({ ILP_SECRET: 'secret', VERSIONING_SUPPORT_ENABLE: false })
      SpyGetApiDefinitions.mockResolvedValueOnce([
        { specFile: 'spec_files/api_definitions/fspiop_1.0/api_spec.yaml', type: 'customA', hostnames: ['host-a'] },
        { specFile: 'spec_files/api_definitions/mojaloop_sdk_outbound_scheme_adapter_1.0/api_spec.yaml', type: 'customB', hostnames: [] }
      ])
    
      await OpenApiMockHandler.initilizeMockHandler()
      const apis = OpenApiMockHandler.getOpenApiObjects()
    
      apis[0].openApiBackendObject.matchOperation = jest.fn(() => true)
      apis[1].openApiBackendObject.matchOperation = jest.fn(() => true)
    
      apis[0].openApiBackendObject.handleRequest = jest.fn(async () => 'A')
      apis[1].openApiBackendObject.handleRequest = jest.fn(async () => 'B')
    
      SpyValidate.mockReturnValueOnce(true)
    
      const req = {
        method: 'post',
        path: '/whatever',
        headers: { accept: 'application/json' },
        payload: {},
        query: {},
        info: { hostname: 'no-match' },
        customInfo: { user: 'u1' }
      }
    
      await OpenApiMockHandler.handleRequest(req, h)
    
      // should pick the hostnames:[] API (customB)
      expect(apis[1].openApiBackendObject.handleRequest).toHaveBeenCalled()
      expect(apis[0].openApiBackendObject.handleRequest).not.toHaveBeenCalled()
    })
    it('Should trim prefix from request path before passing to openapi-backend', async () => {
      const apis = OpenApiMockHandler.getOpenApiObjects()
    
      // Make sure only prefix API matches
      apis[0].openApiBackendObject.matchOperation = jest.fn(() => true)
      apis[1].openApiBackendObject.matchOperation = jest.fn(() => false)
    
      const handleSpy = jest.fn(async () => true)
      apis[0].openApiBackendObject.handleRequest = handleSpy
    
      SpyValidate.mockReturnValueOnce(true)
    
      const req = {
        method: 'post',
        path: '/sdk-out/quotes',
        headers: { accept: 'application/json' },
        payload: {},
        query: {},
        info: { hostname: 'anything' },
        customInfo: { user: 'u1' }
      }
    
      await OpenApiMockHandler.handleRequest(req, h)
    
      expect(handleSpy).toHaveBeenCalled()
      expect(handleSpy.mock.calls[0][0].path).toBe('/quotes') // trimmed
    })
    it('Should not break hostname matching when req.info is missing (fallback branch)', async () => {
      const apis = OpenApiMockHandler.getOpenApiObjects()
    
      // Ensure no prefix API interferes
      apis[0].openApiBackendObject.matchOperation = jest.fn(() => false)
      apis[1].openApiBackendObject.matchOperation = jest.fn(() => true)
    
      apis[1].hostnames = ['host-a'] // make it require hostname match
    
      const handleSpy = jest.fn(async () => true)
      apis[1].openApiBackendObject.handleRequest = handleSpy
    
      SpyValidate.mockReturnValueOnce(true)
    
      const req = {
        method: 'post',
        path: '/quotes',
        headers: { accept: 'application/json' },
        payload: {},
        query: {},
        // info missing
        customInfo: { user: 'u1' }
      }
    
      const res = await OpenApiMockHandler.handleRequest(req, h)
      expect(res).toBeDefined()
    })                
    it('Check for the returned value when validation failed, negotiate version failed and versioning is supported', async () => {
      SpyValidate.mockReturnValueOnce(false)
      SpyParseAcceptHeader.mockReturnValueOnce({
        apiType: 'fspiop',
      })
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
      const result = await OpenApiMockHandler.handleRequest(sampleRequest, h)
      expect(result).toBeDefined()
    })
    it('Check for the returned value when validation failed, acceptHeader validation not failed, negotiate version not failed and versioning is supported', async () => {
      SpyValidate.mockReturnValueOnce(true)
      SpyParseAcceptHeader.mockReturnValueOnce({
        apiType: 'fspiop',
      })
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
      const result = await OpenApiMockHandler.handleRequest(sampleRequest, h)
      expect(result).toBeDefined()
    })
    it('Check for the returned value when validation failed, acceptHeader validation failed and versioning is supported', async () => {
      SpyValidate.mockReturnValueOnce(true)
      SpyParseAcceptHeader.mockReturnValueOnce({
        apiType: 'fspiop',
      })
      SpyValidateAcceptHeader.mockReturnValueOnce({
        validationFailed: true
      })
      SpyGetUserConfig.mockReturnValueOnce({
        VERSIONING_SUPPORT_ENABLE: true
      })
      const result = await OpenApiMockHandler.handleRequest(sampleRequest, h)
      expect(result).toBeDefined()
    })
    it('Check for the returned value when validation failed, acceptHeader validation failed and versioning is supported and method is put', async () => {
      SpyValidate.mockReturnValueOnce(true)
      SpyParseAcceptHeader.mockReturnValueOnce({
        apiType: 'fspiop',
      })
      SpyValidateContentTypeHeader.mockReturnValueOnce({
        validationFailed: true
      })
      SpyGetUserConfig.mockReturnValueOnce({
        VERSIONING_SUPPORT_ENABLE: true
      })
      sampleRequest.method = 'put'
      sampleRequest.path = '/quotes/{ID}'
      const result = await OpenApiMockHandler.handleRequest(sampleRequest, h)
      expect(result).toBeDefined()
      sampleRequest.method = 'post'
      sampleRequest.path = '/quotes'
    })
    it('Check for the returned value when validation failed, acceptHeader validation not failed and versioning is supported and method is put', async () => {
      SpyValidate.mockReturnValueOnce(true)
      SpyParseAcceptHeader.mockReturnValueOnce({
        apiType: 'fspiop',
      })
      SpyValidateContentTypeHeader.mockReturnValueOnce({
        validationFailed: false
      })
      SpyGetUserConfig.mockReturnValueOnce({
        VERSIONING_SUPPORT_ENABLE: true
      })
      sampleRequest.method = 'put'
      sampleRequest.path = '/quotes/{ID}'
      const result = await OpenApiMockHandler.handleRequest(sampleRequest, h)
      expect(result).toBeDefined()
      sampleRequest.method = 'post'
      sampleRequest.path = '/quotes'
    })
    it('Check for the returned value when validation failed and versioning is not supported', async () => {
      SpyValidate.mockReturnValueOnce(false)
      SpyGetUserConfig.mockReturnValueOnce({
        VERSIONING_SUPPORT_ENABLE: false
      })
      SpyParseAcceptHeader.mockReturnValueOnce({
        apiType: 'fspiop',
      })
      const result = await OpenApiMockHandler.handleRequest(sampleRequest, h)
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
      const sampleRequest = {
        customInfo: {}
      }
      SpyReadFileAsync.mockReturnValueOnce(JSON.stringify({}))
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
      const sampleRequest = {
        customInfo: {}
      }
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
      const sampleRequest = {
        customInfo: {}
      }
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
    it('Check for the returned value - existing path with previous quotes validation failed', async () => {
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
        HUB_ONLY_MODE: false,
        TRANSFERS_VALIDATION_WITH_PREVIOUS_QUOTES: true
      })
      SpyHandleTransfers.mockReturnValueOnce(false)
      SpyGenerateMockErrorCallback.mockResolvedValueOnce({})
      SpyHandleCallback.mockResolvedValueOnce()
      const result = await OpenApiMockHandler.generateAsyncCallback(item, sampleContext, sampleRequest)
    })
    it('Check for the returned value - existing path with previous quotes validation passed', async () => {
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
        customInfo: {

        }
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
        HUB_ONLY_MODE: false,
        TRANSFERS_VALIDATION_WITH_PREVIOUS_QUOTES: true
      })
      SpyHandleTransfers.mockReturnValueOnce(true)
      SpyCallbackRules.mockResolvedValueOnce({})
      const result = await OpenApiMockHandler.generateAsyncCallback(item, sampleContext, sampleRequest)
    })
    it('Check for the returned value - existing path with ilp packet validation failed', async () => {
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
        customInfo: {
          selectedApi: {
            type: 'fspiop'
          }
        }
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
        HUB_ONLY_MODE: false,
        TRANSFERS_VALIDATION_ILP_PACKET: true
      })
      SpyValidateTransferIlpPacket.mockReturnValueOnce(false)
      SpyGenerateMockErrorCallback.mockResolvedValueOnce({})
      SpyHandleCallback.mockResolvedValueOnce()
      const result = await OpenApiMockHandler.generateAsyncCallback(item, sampleContext, sampleRequest)
    })
    it('Check for the returned value - existing path with ilp packet validation passed', async () => {
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
        HUB_ONLY_MODE: false,
        TRANSFERS_VALIDATION_ILP_PACKET: true
      })
      SpyValidateTransferIlpPacket.mockReturnValueOnce(true)
      SpyCallbackRules.mockResolvedValueOnce({})
      const result = await OpenApiMockHandler.generateAsyncCallback(item, sampleContext, sampleRequest)
    })
    it('Check for the returned value - existing path with validating condition failed', async () => {
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
        HUB_ONLY_MODE: false,
        TRANSFERS_VALIDATION_CONDITION: true
      })
      SpyValidateTransferCondition.mockReturnValueOnce(false)
      SpyGenerateMockErrorCallback.mockResolvedValueOnce({})
      SpyHandleCallback.mockResolvedValueOnce()
      const result = await OpenApiMockHandler.generateAsyncCallback(item, sampleContext, sampleRequest)
    })
    it('Check for the returned value - existing path with validating condition passed', async () => {
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
        HUB_ONLY_MODE: false,
        TRANSFERS_VALIDATION_CONDITION: true
      })
      SpyValidateTransferCondition.mockReturnValueOnce(true)
      SpyCallbackRules.mockResolvedValueOnce({})
      const result = await OpenApiMockHandler.generateAsyncCallback(item, sampleContext, sampleRequest)
    })
    it('Check for the returned value - existing path with previous quites validation passed and empty ilp quote', async () => {
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
        HUB_ONLY_MODE: false,
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
    it('Check for the returned value - existing path with previous quotes validation failed and empty ilp quote', async () => {
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
        HUB_ONLY_MODE: false
      })
      SpyCallbackRules.mockResolvedValueOnce({body: {}})
      SpyHandleCallback.mockResolvedValueOnce()
      SpyHandleQuoteIlp.mockReturnValueOnce('')
      SpyHandleTransferIlp.mockReturnValueOnce()
      SpyHandleQuotes.mockReturnValueOnce()
      SpyHandleRequest.mockReturnValueOnce()
      const result = await OpenApiMockHandler.generateAsyncCallback(item, sampleContext, sampleRequest)
    })
    it('Check for the returned value - existing path with previous quotes validation passed', async () => {
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
        HUB_ONLY_MODE: false,
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
    it('Check for the returned value - existing path with previous quotes validation failed', async () => {
      const item = {}
      const sampleContext = {
        operation: {
          path: '/transfers/{ID}'
        },
        request: {
          method: 'put'
        }
      }
      const sampleRequest = {
        customInfo: {},
        method: 'put'
      }
      SpyReadFileAsync.mockReturnValueOnce(JSON.stringify({
        '/transfers/{ID}': {
          'put': {}
        }
      }))
      SpyGetUserConfig.mockReturnValueOnce({
        HUB_ONLY_MODE: false
      })
      const result = await OpenApiMockHandler.generateAsyncCallback(item, sampleContext, sampleRequest)
    })
    it('Check for the returned value - existing path with previous quotes validation failed', async () => {
      const item = {}
      const sampleContext = {
        operation: {
          path: '/transfers/{ID}'
        },
        request: {
          method: 'put'
        }
      }
      const sampleRequest = {
        customInfo: {},
        method: 'put'
      }
      SpyGetUserConfig.mockReturnValueOnce({
        HUB_ONLY_MODE: true,
        ENDPOINTS_DFSP_WISE: {},
      })
      SpyOpenApiRulesEngine.mockResolvedValueOnce({})
      SpyForwardRules.mockResolvedValueOnce({})
      SpyHandleCallback.mockResolvedValueOnce()
      const result = await OpenApiMockHandler.generateAsyncCallback(item, sampleContext, sampleRequest)
    })
    it('Check for the returned value - existing path with previous quotes validation failed', async () => {
      const item = {}
      const sampleContext = {
        operation: {
          path: '/transfers/{ID}'
        },
        request: {
          method: 'put'
        }
      }
      const sampleRequest = {
        customInfo: {},
        method: 'put'
      }
      SpyGetUserConfig.mockReturnValueOnce({
        HUB_ONLY_MODE: true,
        ENDPOINTS_DFSP_WISE: {},
      })
      SpyOpenApiRulesEngine.mockResolvedValueOnce({})
      SpyForwardRules.mockResolvedValueOnce()
      const result = await OpenApiMockHandler.generateAsyncCallback(item, sampleContext, sampleRequest)
    })
    it('Check for the returned value - existing path with previous quotes validation failed', async () => {
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
        customInfo: {},
        method: 'post'
      }
      SpyResolveAndLoad.mockResolvedValueOnce(JSON.stringify({
        '/transfers': {
          'post': {}
        }
      }))
      SpyRequestLogger.mockReturnValue()
      SpyResponseRules.mockResolvedValueOnce({
        status: 400,
        body: {}
      })
      const result = await OpenApiMockHandler.openApiBackendNotImplementedHandler(sampleContext, sampleRequest, h, item)
    })
    it('Check for the returned value - existing path with previous quotes validation failed', async () => {
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
        customInfo: {},
        method: 'post'
      }
      SpyResolveAndLoad.mockResolvedValueOnce(JSON.stringify({
        '/transfers': {
          'post': {}
        }
      }))
      SpyRequestLogger.mockReturnValue()
      SpyResponseRules.mockResolvedValueOnce({
        status: 400,
        body: {}
      })
      const result = await OpenApiMockHandler.openApiBackendNotImplementedHandler(sampleContext, sampleRequest, h, item)
    })
    describe('generateAsyncCallback iso20022', () => {
      it('Check for the returned value - existing path with iso20022 type and previous quotes validation passed', async () => {
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
          customInfo: {
            selectedApi: {
              type: 'iso20022'
            }
          }
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
          HUB_ONLY_MODE: false,
          TRANSFERS_VALIDATION_WITH_PREVIOUS_QUOTES: true
        })
        SpyHandleTransfers.mockReturnValueOnce(true)
        SpyCallbackRules.mockResolvedValueOnce({})
        const result = await OpenApiMockHandler.generateAsyncCallback(item, sampleContext, sampleRequest)

      })

      it('Check for the returned value - existing path with iso20022 type and ilp packet validation passed', async () => {
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
          customInfo: {
            selectedApi: {
              type: 'iso20022'
            }
          }
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
          HUB_ONLY_MODE: false,
          TRANSFERS_VALIDATION_ILP_PACKET: true
        })
        SpyValidateTransferIlpPacket.mockReturnValueOnce(true)
        SpyCallbackRules.mockResolvedValueOnce({})
        const result = await OpenApiMockHandler.generateAsyncCallback(item, sampleContext, sampleRequest)

      })

      it('Check for the returned value - existing path with iso20022 type and validating condition passed', async () => {
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
          customInfo: {
            selectedApi: {
              type: 'iso20022'
            }
          }
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
          HUB_ONLY_MODE: false,
          TRANSFERS_VALIDATION_CONDITION: true
        })
        SpyValidateTransferCondition.mockReturnValueOnce(true)
        SpyCallbackRules.mockResolvedValueOnce({})
        const result = await OpenApiMockHandler.generateAsyncCallback(item, sampleContext, sampleRequest)

      })

      it('Check for the returned value - existing path with iso20022 type and previous quotes validation failed', async () => {
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
          customInfo: {
            selectedApi: {
              type: 'iso20022'
            }
          }
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
          HUB_ONLY_MODE: false,
          TRANSFERS_VALIDATION_WITH_PREVIOUS_QUOTES: true
        })
        SpyHandleTransfers.mockReturnValueOnce(false)
        SpyGenerateMockErrorCallback.mockResolvedValueOnce({})
        SpyHandleCallback.mockResolvedValueOnce()
        const result = await OpenApiMockHandler.generateAsyncCallback(item, sampleContext, sampleRequest)

      })

      it('Check for the returned value - existing path with iso20022 type and ilp packet validation failed', async () => {
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
          customInfo: {
            selectedApi: {
              type: 'iso20022'
            }
          }
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
          HUB_ONLY_MODE: false,
          TRANSFERS_VALIDATION_ILP_PACKET: true
        })
        SpyValidateTransferIlpPacket.mockReturnValueOnce(false)
        SpyGenerateMockErrorCallback.mockResolvedValueOnce({})
        SpyHandleCallback.mockResolvedValueOnce()
        const result = await OpenApiMockHandler.generateAsyncCallback(item, sampleContext, sampleRequest)

      })

      it('Check for the returned value - existing path with iso20022 type and validating condition failed', async () => {
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
          customInfo: {
            selectedApi: {
              type: 'iso20022'
            }
          }
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
          HUB_ONLY_MODE: false,
          TRANSFERS_VALIDATION_CONDITION: true
        })
        SpyValidateTransferCondition.mockReturnValueOnce(false)
        SpyGenerateMockErrorCallback.mockResolvedValueOnce({})
        SpyHandleCallback.mockResolvedValueOnce()
        const result = await OpenApiMockHandler.generateAsyncCallback(item, sampleContext, sampleRequest)

      })

      it('Check for the returned value - existing path with iso20022 type and previous quotes validation passed and empty ilp quote', async () => {
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
          customInfo: {
            selectedApi: {
              type: 'iso20022'
            }
          }
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
          HUB_ONLY_MODE: false,
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

      it('Check for the returned value - existing path with iso20022 type and previous quotes validation failed and empty ilp quote', async () => {
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
          customInfo: {
            selectedApi: {
              type: 'iso20022'
            }
          }
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
          HUB_ONLY_MODE: false
        })
        SpyCallbackRules.mockResolvedValueOnce({body: {}})
        SpyHandleCallback.mockResolvedValueOnce()
        SpyHandleQuoteIlp.mockReturnValueOnce('')
        SpyHandleTransferIlp.mockReturnValueOnce()
        SpyHandleQuotes.mockReturnValueOnce()
        SpyHandleRequest.mockReturnValueOnce()
        const result = await OpenApiMockHandler.generateAsyncCallback(item, sampleContext, sampleRequest)
      })

      describe('Transfer storing logic', () => {
        beforeEach(() => {
          ObjectStore.push.mockClear()
        })

        it('Should call objectStore.push with correct params for POST /transfers', async () => {
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
        customInfo: {},
        method: 'post',
        path: '/transfers',
        payload: {
          transferId: '123',
          amount: { currency: 'USD', amount: '100' }
        }
          }
          SpyReadFileAsync.mockReturnValueOnce(JSON.stringify({
        '/transfers': {
          'post': {}
        }
          }))
          SpyRequestLogger.mockReturnValue()
          SpyOpenApiRulesEngine.mockResolvedValueOnce({})
          SpyGetUserConfig.mockReturnValueOnce({
        HUB_ONLY_MODE: false
          })
          SpyCallbackRules.mockResolvedValueOnce({})

          await OpenApiMockHandler.generateAsyncCallback(item, sampleContext, sampleRequest)

          expect(ObjectStore.push).toHaveBeenCalledWith(
        'storedTransfers',
        '123',
        {
          request: sampleRequest.payload,
          type: 'transfer'
        }
          )
        })

        it('Should call objectStore.push with correct params for POST /fxTransfers', async () => {
          const item = {}
          const sampleContext = {
        operation: {
          path: '/fxTransfers'
        },
        request: {
          method: 'post'
        }
          }
          const sampleRequest = {
        customInfo: {},
        method: 'post',
        path: '/fxTransfers',
        payload: {
          commitRequestId: '456',
          sourceAmount: { currency: 'USD', amount: '100' }
        }
          }
          SpyReadFileAsync.mockReturnValueOnce(JSON.stringify({
        '/fxTransfers': {
          'post': {}
        }
          }))
          SpyRequestLogger.mockReturnValue()
          SpyOpenApiRulesEngine.mockResolvedValueOnce({})
          SpyGetUserConfig.mockReturnValueOnce({
        HUB_ONLY_MODE: false
          })
          SpyCallbackRules.mockResolvedValueOnce({})

          await OpenApiMockHandler.generateAsyncCallback(item, sampleContext, sampleRequest)

          expect(ObjectStore.push).toHaveBeenCalledWith(
        'storedTransfers',
        '456',
        {
          request: sampleRequest.payload,
          type: 'fxTransfer'
        }
          )
        })

        it('Should not call objectStore.push when method is PUT', async () => {
          const item = {}
          const sampleContext = {
        operation: {
          path: '/transfers/{ID}'
        },
        request: {
          method: 'put'
        }
          }
          const sampleRequest = {
        customInfo: {},
        method: 'put',
        path: '/transfers/789',
        payload: {}
          }
          SpyGetUserConfig.mockReturnValueOnce({
        HUB_ONLY_MODE: true
          })
          SpyOpenApiRulesEngine.mockResolvedValueOnce({})
          SpyForwardRules.mockResolvedValueOnce()

          await OpenApiMockHandler.generateAsyncCallback(item, sampleContext, sampleRequest)

          expect(ObjectStore.push).not.toHaveBeenCalled()
        })

        it('Should not call objectStore.push when path does not match transfer pattern', async () => {
          const item = {}
          const sampleContext = {
        operation: {
          path: '/quotes'
        },
        request: {
          method: 'post'
        }
          }
          const sampleRequest = {
        customInfo: {},
        method: 'post',
        path: '/quotes',
        payload: {}
          }
          SpyReadFileAsync.mockReturnValueOnce(JSON.stringify({
        '/quotes': {
          'post': {}
        }
          }))
          SpyRequestLogger.mockReturnValue()
          SpyOpenApiRulesEngine.mockResolvedValueOnce({})
          SpyGetUserConfig.mockReturnValueOnce({
        HUB_ONLY_MODE: false
          })
          SpyCallbackRules.mockResolvedValueOnce({})

          await OpenApiMockHandler.generateAsyncCallback(item, sampleContext, sampleRequest)

          expect(ObjectStore.push).not.toHaveBeenCalled()
        })

        it('Should call objectStore.push for multiple transfers', async () => {
          const item = {}
          const sampleContext = {
        operation: {
          path: '/transfers'
        },
        request: {
          method: 'post'
        }
          }
          const sampleRequest1 = {
        customInfo: {},
        method: 'post',
        path: '/transfers',
        payload: {
          transferId: '111',
          amount: { currency: 'USD', amount: '100' }
        }
          }
          const sampleRequest2 = {
        customInfo: {},
        method: 'post',
        path: '/transfers',
        payload: {
          transferId: '222',
          amount: { currency: 'USD', amount: '200' }
        }
          }
          SpyReadFileAsync.mockReturnValue(JSON.stringify({
        '/transfers': {
          'post': {}
        }
          }))
          SpyRequestLogger.mockReturnValue()
          SpyOpenApiRulesEngine.mockResolvedValue({})
          SpyGetUserConfig.mockReturnValue({
        HUB_ONLY_MODE: false
          })
          SpyCallbackRules.mockResolvedValue({})

          await OpenApiMockHandler.generateAsyncCallback(item, sampleContext, sampleRequest1)
          await OpenApiMockHandler.generateAsyncCallback(item, sampleContext, sampleRequest2)

          expect(ObjectStore.push).toHaveBeenCalledWith(
        'storedTransfers',
        '111',
        {
          request: sampleRequest1.payload,
          type: 'transfer'
        }
          )
          expect(ObjectStore.push).toHaveBeenCalledWith(
        'storedTransfers',
        '222',
        {
          request: sampleRequest2.payload,
          type: 'transfer'
        }
          )
        })

        it('Should call objectStore.push with transferId from CdtTrfTxInf.PmtId.TxId if transferId and commitRequestId are missing', async () => {
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
        customInfo: {},
        method: 'post',
        path: '/transfers',
        payload: {
          CdtTrfTxInf: {
            PmtId: {
          TxId: 'cdt-txid-999'
            }
          }
        }
          }
          SpyReadFileAsync.mockReturnValueOnce(JSON.stringify({
        '/transfers': {
          'post': {}
        }
          }))
          SpyRequestLogger.mockReturnValue()
          SpyOpenApiRulesEngine.mockResolvedValueOnce({})
          SpyGetUserConfig.mockReturnValueOnce({
        HUB_ONLY_MODE: false
          })
          SpyCallbackRules.mockResolvedValueOnce({})

          await OpenApiMockHandler.generateAsyncCallback(item, sampleContext, sampleRequest)

          expect(ObjectStore.push).toHaveBeenCalledWith(
        'storedTransfers',
        'cdt-txid-999',
        {
          request: sampleRequest.payload,
          type: 'transfer'
        }
          )
        })
      })
    })
    it('Should return when callbackRules sets skipCallback=true', async () => {
      SpyOpenApiRulesEngine.mockReset()
      SpyCallbackRules.mockReset()
      SpyHandleCallback.mockReset()
      SpyResolveAndLoad.mockReset()
      SpyGetUserConfig.mockReset()
    
      SpyGetUserConfig.mockResolvedValueOnce({ HUB_ONLY_MODE: false })
      SpyResolveAndLoad.mockResolvedValueOnce({ '/transfers': { post: {} } })
      SpyOpenApiRulesEngine.mockImplementationOnce(async () => ({})) // validateRules ok
    
      SpyCallbackRules.mockResolvedValueOnce({ skipCallback: true })
    
      const item = { callbackMapFile: 'cb.json' }
      const ctx = { operation: { path: '/transfers' }, request: { method: 'post' } }
      const req = { method: 'post', path: '/transfers', payload: { transferId: '1' }, headers: {}, customInfo: { user: 'u1' } }
    
      await OpenApiMockHandler.generateAsyncCallback(item, ctx, req)
    
      expect(SpyHandleCallback).not.toHaveBeenCalled()
    })
    it('Should NOT store transfer when transferId cannot be resolved from payload', async () => {
      SpyOpenApiRulesEngine.mockReset()
      SpyCallbackRules.mockReset()
      SpyHandleCallback.mockReset()
      SpyResolveAndLoad.mockReset()
      SpyGetUserConfig.mockReset()
    
      ObjectStore.push.mockClear()
    
      SpyGetUserConfig.mockResolvedValueOnce({ HUB_ONLY_MODE: false })
      SpyResolveAndLoad.mockResolvedValueOnce({ '/transfers': { post: {} } })
      SpyOpenApiRulesEngine.mockImplementationOnce(async () => ({})) // validateRules ok
      SpyCallbackRules.mockResolvedValueOnce({ skipCallback: true }) // stop early after storing logic
    
      const item = { callbackMapFile: 'cb.json' }
      const ctx = { operation: { path: '/transfers' }, request: { method: 'post' } }
      const req = {
        method: 'post',
        path: '/transfers',
        payload: { /* no transferId, no commitRequestId, no CdtTrfTxInf... */ },
        headers: {},
        customInfo: { user: 'u1' }
      }
    
      await OpenApiMockHandler.generateAsyncCallback(item, ctx, req)
    
      expect(ObjectStore.push).not.toHaveBeenCalled()
    })
    it('Should store fxTransfer when path is /fxTransfers/{id} as well', async () => {
      SpyOpenApiRulesEngine.mockReset()
      SpyCallbackRules.mockReset()
      SpyHandleCallback.mockReset()
      SpyResolveAndLoad.mockReset()
      SpyGetUserConfig.mockReset()
    
      ObjectStore.push.mockClear()
    
      SpyGetUserConfig.mockResolvedValueOnce({ HUB_ONLY_MODE: false })
      SpyResolveAndLoad.mockResolvedValueOnce({ '/fxTransfers': { post: {} } })
      SpyOpenApiRulesEngine.mockImplementationOnce(async () => ({}))
      SpyCallbackRules.mockResolvedValueOnce({ skipCallback: true })
    
      const item = { callbackMapFile: 'cb.json' }
      const ctx = { operation: { path: '/fxTransfers' }, request: { method: 'post' } }
      const req = {
        method: 'post',
        path: '/fxTransfers/abc-123',
        payload: { commitRequestId: '456' },
        headers: {},
        customInfo: { user: 'u1' }
      }
    
      await OpenApiMockHandler.generateAsyncCallback(item, ctx, req)
    
      expect(ObjectStore.push).toHaveBeenCalledWith('storedTransfers', '456', {
        request: req.payload,
        type: 'fxTransfer'
      })
    })     
  })
  describe('handleRequest - extra branches', () => {
    it('Should return 404 when no API matches the request path', async () => {
      SpyInit.mockReturnValueOnce()
      SpyGetUserConfig.mockResolvedValueOnce({ ILP_SECRET: 'secret', VERSIONING_SUPPORT_ENABLE: false })
      SpyGetApiDefinitions.mockResolvedValueOnce([
        { specFile: 'spec_files/api_definitions/fspiop_1.0/api_spec.yaml', type: 'fspiop' }
      ])

      await OpenApiMockHandler.initilizeMockHandler()
      const apis = OpenApiMockHandler.getOpenApiObjects()
      expect(apis.length).toBeGreaterThan(0)

      apis[0].openApiBackendObject.matchOperation = jest.fn(() => false)

      const req = {
        method: 'post',
        path: '/does-not-exist',
        headers: { accept: 'application/json' },
        payload: {},
        query: {},
        info: { hostname: 'whatever' },
        customInfo: { user: 'u1' }
      }

      SpyValidate.mockReturnValueOnce(true)

      const res = await OpenApiMockHandler.handleRequest(req, h)
      expect(res).toBeDefined()
    })
    it('Should prefer hostname-matched API when multiple APIs match', async () => {
      SpyInit.mockReturnValueOnce()
      SpyGetUserConfig.mockResolvedValueOnce({ ILP_SECRET: 'secret', VERSIONING_SUPPORT_ENABLE: false })
      SpyGetApiDefinitions.mockResolvedValueOnce([
        {
          specFile: 'spec_files/api_definitions/mojaloop_sdk_outbound_scheme_adapter_1.0/api_spec.yaml',
          type: 'customA',
          hostnames: []
        },
        {
          specFile: 'spec_files/api_definitions/fspiop_1.0/api_spec.yaml',
          type: 'customB',
          hostnames: ['host-a']
        }
      ])

      await OpenApiMockHandler.initilizeMockHandler()

      const apis = OpenApiMockHandler.getOpenApiObjects()
      // Make both "match", but only one has matching hostname
      apis[0].openApiBackendObject.matchOperation = jest.fn(() => true)
      apis[1].openApiBackendObject.matchOperation = jest.fn(() => true)

      // Stub handleRequest result on BOTH to ensure we can detect which one was called
      apis[0].openApiBackendObject.handleRequest = jest.fn(async () => 'from-A')
      apis[1].openApiBackendObject.handleRequest = jest.fn(async () => 'from-B')

      SpyValidate.mockReturnValueOnce(true)

      const req = {
        method: 'post',
        path: '/anything',
        headers: { accept: 'application/json' },
        payload: {},
        query: {},
        info: { hostname: 'host-a' },
        customInfo: { user: 'u1' }
      }

      const res = await OpenApiMockHandler.handleRequest(req, h)
      expect(res).toBeDefined()

      // Should have selected hostname-matched API (customB)
      expect(apis[1].openApiBackendObject.handleRequest).toHaveBeenCalled()
      expect(apis[0].openApiBackendObject.handleRequest).not.toHaveBeenCalled()
    })
    it('Should hit try/catch around openApiBackendObject.handleRequest and return 404 on throw', async () => {
      SpyInit.mockReturnValueOnce()
      SpyGetUserConfig.mockResolvedValueOnce({ ILP_SECRET: 'secret', VERSIONING_SUPPORT_ENABLE: false })
      SpyGetApiDefinitions.mockResolvedValueOnce([
        { specFile: 'spec_files/api_definitions/fspiop_1.0/api_spec.yaml', type: 'fspiop' }
      ])

      await OpenApiMockHandler.initilizeMockHandler()
      const apis = OpenApiMockHandler.getOpenApiObjects()

      apis[0].openApiBackendObject.matchOperation = jest.fn(() => true)
      apis[0].openApiBackendObject.handleRequest = jest.fn(async () => { throw new Error('boom') })

      SpyValidate.mockReturnValueOnce(true)

      const req = {
        method: 'post',
        path: '/quotes',
        headers: { accept: 'application/json' },
        payload: {},
        query: {},
        info: { hostname: 'x' },
        customInfo: { user: 'u1' }
      }

      const res = await OpenApiMockHandler.handleRequest(req, h)
      expect(res).toBeDefined()
    })
  })
  describe('openApiBackendNotImplementedHandler - extra branches', () => {
    afterEach(async () => {
      await Promise.resolve()
      await Promise.resolve()
    })    
    it('Should early-return when response info is missing in response map', async () => {
      SpyInit.mockReturnValueOnce()
      SpyGetUserConfig.mockResolvedValueOnce({ ILP_SECRET: 'secret', VERSIONING_SUPPORT_ENABLE: false })
      SpyGetApiDefinitions.mockResolvedValueOnce([
        { specFile: 'spec_files/api_definitions/fspiop_1.0/api_spec.yaml', type: 'fspiop' }
      ])

      await OpenApiMockHandler.initilizeMockHandler()
      const apis = OpenApiMockHandler.getOpenApiObjects()
      const openApiBackendObject = apis[0].openApiBackendObject

      const item = { responseMapFile: 'x.json' }
      const req = { method: 'post', path: '/quotes', headers: {}, payload: {}, customInfo: { user: 'u1' } }
      const context = {
        operation: { path: '/quotes' },
        request: { method: 'post' },
        api: { mockResponseForOperation: () => ({ status: 200, mock: { ok: true } }) }
      }

      // response map doesn't include method/path -> should return undefined
      SpyResolveAndLoad.mockResolvedValueOnce({ '/quotes': { put: {} } })

      const res = await OpenApiMockHandler.openApiBackendNotImplementedHandler(context, req, h, item)
      expect(res).toBeUndefined()
    })

    it('Should return empty response (no body) when generated response body is empty object', async () => {
      const item = { responseMapFile: 'x.json' }
    
      const req = {
        method: 'post',
        path: '/quotes',
        headers: {},
        payload: {},
        customInfo: { user: 'u1' }
      }
    
      const context = {
        operation: { path: '/quotes', operationId: 999 },
        request: { method: 'post' },
        api: { mockResponseForOperation: () => ({ status: 200, mock: { shouldNotBeUsed: true } }) }
      }
      const codeSpy = jest.fn(() => true)
      const responseSpy = jest.fn(() => ({ code: codeSpy }))
      const h2 = { response: responseSpy }
    
      SpyResolveAndLoad.mockResolvedValueOnce({
        '/quotes': { post: {} }
      })
    
      SpyResponseRules.mockResolvedValueOnce({
        status: '200',
        body: {} // _.isEmpty({}) is true => should do h.response().code(200)
      })
    
      const res = await OpenApiMockHandler.openApiBackendNotImplementedHandler(context, req, h2, item)
    
      expect(res).toBeDefined()
      expect(responseSpy).toHaveBeenCalledWith()
      expect(codeSpy).toHaveBeenCalledWith(200)
    })

    it('Should schedule async callback via setImmediate when asynchronous=true and success status', async () => {
      const item = { responseMapFile: 'x.json', asynchronous: true }
    
      const req = {
        method: 'post',
        path: '/quotes',
        headers: {},
        payload: {},
        customInfo: { user: 'u1' }
      }
    
      const context = {
        operation: { path: '/quotes', operationId: 999 },
        request: { method: 'post' },
        api: { mockResponseForOperation: () => ({ status: 200, mock: { ok: true } }) }
      }
    
      SpyResolveAndLoad.mockResolvedValueOnce({ '/quotes': { post: {} } })
      SpyResponseRules.mockResolvedValueOnce({ status: '200', body: { ok: true } })
    
      const immediateSpy = jest.spyOn(global, 'setImmediate').mockImplementation(() => {
        // IMPORTANT: do not execute callback
      })
    
      await OpenApiMockHandler.openApiBackendNotImplementedHandler(context, req, h, item)
    
      expect(immediateSpy).toHaveBeenCalled()
    
      immediateSpy.mockRestore()
    })
  })

  describe('generateAsyncCallback - extra branches', () => {
    beforeEach(() => {
      SpyOpenApiRulesEngine.mockReset()
      SpyCallbackRules.mockReset()
      SpyHandleCallback.mockReset()
      SpyResolveAndLoad.mockReset()
      SpyGetUserConfig.mockReset()
      SpyForwardRules.mockReset()
    })    
    it('Should early-return for PUT when HUB_ONLY_MODE=false', async () => {
      SpyGetUserConfig.mockResolvedValueOnce({ HUB_ONLY_MODE: false })

      const item = {}
      const ctx = { operation: { path: '/transfers/{ID}' }, request: { method: 'put' } }
      const req = { method: 'put', path: '/transfers/123', payload: {}, headers: {}, customInfo: { user: 'u1' } }

      await OpenApiMockHandler.generateAsyncCallback(item, ctx, req)

      expect(SpyOpenApiRulesEngine).not.toHaveBeenCalled()
      expect(SpyCallbackRules).not.toHaveBeenCalled()
      expect(SpyHandleCallback).not.toHaveBeenCalled()
    })

    it('Should return when validateRules says skipCallback=true', async () => {
      SpyOpenApiRulesEngine.mockReset()
      SpyCallbackRules.mockReset()
      SpyHandleCallback.mockReset()
      SpyResolveAndLoad.mockReset()
      SpyGetUserConfig.mockReset()
    
      SpyGetUserConfig.mockResolvedValueOnce({ HUB_ONLY_MODE: false })
      SpyResolveAndLoad.mockResolvedValueOnce({ '/transfers': { post: {} } })
    
      // validateRules -> skipCallback
      SpyOpenApiRulesEngine.mockImplementationOnce(async () => ({ skipCallback: true }))
    
      const item = { callbackMapFile: 'cb.json' }
      const ctx = { operation: { path: '/transfers' }, request: { method: 'post' } }
      const req = {
        method: 'post',
        path: '/transfers',
        payload: { transferId: '1' },
        headers: {},
        customInfo: { user: 'u1' }
      }
    
      await OpenApiMockHandler.generateAsyncCallback(item, ctx, req)
    
      expect(SpyCallbackRules).not.toHaveBeenCalled()
      expect(SpyHandleCallback).not.toHaveBeenCalled()
    })

    it('Should send error callback when validateRules returns body', async () => {
      SpyOpenApiRulesEngine.mockReset()
      SpyCallbackRules.mockReset()
      SpyHandleCallback.mockReset()
      SpyResolveAndLoad.mockReset()
      SpyGetUserConfig.mockReset()
    
      SpyGetUserConfig.mockResolvedValueOnce({ HUB_ONLY_MODE: false })
      SpyResolveAndLoad.mockResolvedValueOnce({ '/transfers': { post: {} } })
    
      // validateRules -> returns body => handleCallback and return
      SpyOpenApiRulesEngine.mockImplementationOnce(async () => ({
        body: { errorInformation: { errorCode: '9999', errorDescription: 'fail' } }
      }))
    
      const item = { callbackMapFile: 'cb.json' }
      const ctx = { operation: { path: '/transfers' }, request: { method: 'post' } }
      const req = {
        method: 'post',
        path: '/transfers',
        payload: { transferId: '1' },
        headers: {},
        customInfo: { user: 'u1' }
      }
    
      await OpenApiMockHandler.generateAsyncCallback(item, ctx, req)
    
      expect(SpyHandleCallback).toHaveBeenCalled()
      expect(SpyCallbackRules).not.toHaveBeenCalled()
    })

    it('Should forward request and return when HUB_ONLY_MODE=true and forwardRules returns object', async () => {
      SpyOpenApiRulesEngine.mockReset()
      SpyCallbackRules.mockReset()
      SpyHandleCallback.mockReset()
      SpyForwardRules.mockReset()
      SpyGetUserConfig.mockReset()
    
      SpyGetUserConfig.mockResolvedValueOnce({ HUB_ONLY_MODE: true })
    
      // validateRules: allow it to continue
      SpyOpenApiRulesEngine.mockImplementationOnce(async () => ({}))
    
      // callbackRules WILL run, but its result is irrelevant in HUB_ONLY_MODE
      SpyCallbackRules.mockResolvedValueOnce({ body: { ignored: true } })
    
      SpyForwardRules.mockResolvedValueOnce({ headers: { a: 'b' }, body: { ok: true } })
    
      const item = {}
      const ctx = { operation: { path: '/transfers/{ID}' }, request: { method: 'put' } }
      const req = {
        method: 'put',
        path: '/transfers/123',
        payload: {},
        headers: {},
        customInfo: { user: 'u1' }
      }
    
      await OpenApiMockHandler.generateAsyncCallback(item, ctx, req)
    
      expect(SpyCallbackRules).toHaveBeenCalled()   // ✅ important change
      expect(SpyForwardRules).toHaveBeenCalled()
      expect(SpyHandleCallback).toHaveBeenCalled()
    })
    it('Should build ISO20022 error callback body when previous-quote association fails', async () => {
      SpyOpenApiRulesEngine.mockReset()
      SpyCallbackRules.mockReset()
      SpyHandleCallback.mockReset()
      SpyResolveAndLoad.mockReset()
      SpyGetUserConfig.mockReset()
      SpyHandleTransfers.mockReset()
      SpyGenerateMockErrorCallback.mockReset()
    
      SpyGetUserConfig.mockResolvedValueOnce({
        HUB_ONLY_MODE: false,
        TRANSFERS_VALIDATION_WITH_PREVIOUS_QUOTES: true
      })
    
      SpyResolveAndLoad.mockResolvedValueOnce({ '/transfers': { post: {} } })
      SpyOpenApiRulesEngine.mockImplementationOnce(async () => ({}))
      SpyCallbackRules.mockResolvedValueOnce({ skipCallback: false, body: { any: 'thing' } })
      SpyHandleTransfers.mockReturnValueOnce(false)    
      SpyGenerateMockErrorCallback.mockResolvedValueOnce({ headers: {} })
      const item = { callbackMapFile: 'cb.json' }
      const ctx = { operation: { path: '/transfers' }, request: { method: 'post' } }
      const req = {
        method: 'post',
        path: '/transfers',
        payload: { transferId: 't1' },
        headers: {},
        customInfo: { user: 'u1', selectedApi: { type: 'iso20022' } }
      }
    
      await OpenApiMockHandler.generateAsyncCallback(item, ctx, req)
    
      expect(SpyHandleCallback).toHaveBeenCalled()
    
      const calledWith = SpyHandleCallback.mock.calls[0][0]
      expect(calledWith.headers['content-type']).toContain('application/vnd.interoperability.iso20022.transfers+json')
      expect(calledWith.body).toHaveProperty('GrpHdr')
      expect(calledWith.body).toHaveProperty('TxInfAndSts')
    })
  })
})
