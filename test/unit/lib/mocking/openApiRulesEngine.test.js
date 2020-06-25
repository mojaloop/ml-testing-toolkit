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
 * Georgi Logodazhki <georgi.logodazhki@modusbox.com>
 * Vijaya Kumar Guthi <vijaya.guthi@modusbox.com> (Original Author)
 --------------
 ******/

'use strict'

const OpenApiRulesEngine = require('../../../../src/lib/mocking/openApiRulesEngine')

const rulesEngineModel = require('../../../../src/lib/rulesEngineModel')
jest.mock('../../../../src/lib/rulesEngineModel')

jest.setTimeout(30000)

rulesEngineModel.getValidationRulesEngine.mockImplementation(() => {
  const evaluateFn = async (facts) => {
    if (facts.method === 'get') {
      return [
        {
          type: 'MOCK_ERROR_CALLBACK',
          params: {
            body: {
  
            },
            delay: 100
          }
        }
      ]
    } else {
      return [
        {
          type: 'FIXED_ERROR_CALLBACK',
          params: {
            method: 'put',
            path: '/quotes/{ID}',
            body: {
              quoteId: '123'
            },
            headers: {
              Date: '2020-01-01 00:00:00 GMT'
            },
            delay: 100
          }
        }
      ]      
    }
  }
  return Promise.resolve({
    evaluate: evaluateFn
  })
}) 
rulesEngineModel.getCallbackRulesEngine.mockImplementation(() => {
  const evaluateFn = async (facts) => {
    if (facts.method === 'get' && facts.path === 'not_supported') { 
      return null
    } else if (facts.method === 'get') {
      return [
        {
          type: 'MOCK_CALLBACK',
          params: {
            body: {
  
            },
            delay: 100
          }
        }
      ]
    } else {
      return [
        {
          type: 'FIXED_CALLBACK',
          params: {
            method: 'put',
            path: '/quotes/{ID}',
            body: {
              quoteId: '123'
            },
            headers: {
              Date: '2020-01-01 00:00:00 GMT'
            },
            delay: 100
          }
        }
      ]      
    }
  }
  return Promise.resolve({
    evaluate: evaluateFn
  })
}) 
rulesEngineModel.getResponseRulesEngine.mockImplementation(() => {
  const evaluateFn = async (facts) => {
    if (facts.method === '') {
      return null
    }
    if (facts.method === 'get') {
      return [
        {
          type: 'MOCK_RESPONSE',
          params: {
            statusCode: 200,
            method: 'put',
            path: '/quotes/{ID}',
            body: {
  
            },
            delay: 100
          }
        }
      ]
    } else {
      return [
        {
          type: 'FIXED_RESPONSE',
          params: {
            statusCode: 200,
            method: 'put',
            path: '/quotes/{ID}',
            body: {
              quoteId: '123'
            },
            headers: {
              Date: '2020-01-01 00:00:00 GMT'
            },
            delay: 100
          }
        }
      ]      
    }
  }
  return Promise.resolve({
    evaluate: evaluateFn
  })
}) 

const specFilePrefix = 'spec_files/api_definitions/'
const specFileAsync = specFilePrefix + 'fspiop_1.0/api_spec.yaml'
const jsfRefFile = specFilePrefix + 'fspiop_1.0/mockRef.json'

const sampleContext = {
  operation: {
    path: '/parties/{Type}/{ID}'
  },
  request: {
    path: '/parties/MSISDN/123',
    method: 'get',
    body: {
      payee: {
        partyIdInfo: {
          partyIdType: 'MSISDN',
          partyIdentifier: '000111',
          fspId: 'fspid'
        }
      },
      amount: {
        currency: 'USD',
        amount: '10'
      }
    }
  }
}

const sampleRequest ={
  customInfo: {
    uniqueId: '123',
    specFile: specFileAsync,
    jsfRefFile: jsfRefFile,
    callbackInfo: {
      successCallback: {
        method: 'put',
        path: '/quotes/{ID}',
        pathPattern: '/quotes/{$request.body.quoteId}',
        headerOverride: {
          'FSPIOP-Source': '{$config.FSPID}',
          'FSPIOP-Destination': '{$request.headers.fspiop-source}',
          'Content-Type': '{$session.negotiatedContentType}',
          Date: '{$function.curDate}'
        },
        bodyOverride: {
          transferAmount: {
            currency: '{$request.body.amount.currency}',
            amount: '{$request.body.amount.amount}'
          }
        }
      },
      errorCallback: {
        method: 'put',
        path: '/quotes/{ID}/error',
        pathPattern: '/quotes/{$request.body.quoteId}/error',
        headerOverride: {
          'FSPIOP-Source': '{$config.FSPID}',
          'FSPIOP-Destination': '{$request.headers.fspiop-source}',
          'Content-Type': '{$session.negotiatedContentType}',
          Date: '{$request.headers.date}'
        },
        bodyOverride: {

        }
      }
    },
    responseInfo: {
      response: {
        bodyOverride: {
          id: '{$function.generic.generateUUID}',
          reason: '{$request.body.reason}',
          quiteID: '{$function.generica.generateUUID}'
        }
      }
    }
  }
}

describe('OpenApiRulesEngine', () => {
  describe('validateRules', () => {
    it('Mock Error Callback', async () => {
      sampleContext.request.method = 'get'
      const result = await OpenApiRulesEngine.validateRules(sampleContext, sampleRequest)
      expect(result).toHaveProperty('path')
      expect(result).toHaveProperty('method')
      expect(result).toHaveProperty('body')
      expect(result).toHaveProperty('headers')
    })
    it('Mock Error Callback', async () => {
      sampleContext.request.method = 'get'
      const temp = sampleRequest.customInfo.specFile
      delete sampleRequest.customInfo.specFile
      const result = await OpenApiRulesEngine.validateRules(sampleContext, sampleRequest)
      sampleRequest.customInfo.specFile = temp
      expect(result).toStrictEqual({})
    })
    it('Mock Error Callback', async () => {
      sampleContext.request.method = 'get'
      const realPathPattern = sampleRequest.customInfo.callbackInfo.errorCallback.pathPattern
      delete sampleRequest.customInfo.callbackInfo.errorCallback.pathPattern
      const result = await OpenApiRulesEngine.validateRules(sampleContext, sampleRequest)
      sampleRequest.customInfo.callbackInfo.errorCallback.pathPattern = realPathPattern
      expect(result.path).toBe(sampleRequest.customInfo.callbackInfo.errorCallback.path)
    })
    it('Fixed Error Callback', async () => {
      sampleContext.request.method = 'post'
      const result = await OpenApiRulesEngine.validateRules(sampleContext, sampleRequest)
      expect(result).toHaveProperty('path')
      expect(result).toHaveProperty('method')
      expect(result).toHaveProperty('body')
      expect(result).toHaveProperty('headers')
    })
  })
  describe('callbackRules', () => {
    it('Mock Callback', async () => {
      sampleContext.request.method = 'get'
      const result = await OpenApiRulesEngine.callbackRules(sampleContext, sampleRequest)
      expect(result).toHaveProperty('path')
      expect(result).toHaveProperty('method')
      expect(result).toHaveProperty('body')
      expect(result).toHaveProperty('headers')
    })
    it('Mock Callback', async () => {
      sampleContext.request.method = 'get'
      const temp = sampleRequest.customInfo.callbackInfo.successCallback.pathPattern
      delete sampleRequest.customInfo.callbackInfo.successCallback.pathPattern
      const result = await OpenApiRulesEngine.callbackRules(sampleContext, sampleRequest)
      sampleRequest.customInfo.callbackInfo.successCallback.pathPattern = temp 
      expect(result).toHaveProperty('path')
      expect(result).toHaveProperty('method')
      expect(result).toHaveProperty('body')
      expect(result).toHaveProperty('headers')
    })
    it('Mock Callback', async () => {
      sampleContext.request.method = 'get'
      const temp = sampleRequest.customInfo.specFile
      delete sampleRequest.customInfo.specFile
      const result = await OpenApiRulesEngine.callbackRules(sampleContext, sampleRequest)
      sampleRequest.customInfo.specFile = temp 
      expect(result).toStrictEqual({})
    })
    it('Mock Callback', async () => {
      sampleContext.request.method = 'get'
      const temp = sampleContext.request.path
      sampleContext.request.path = 'not_supported'
      const result = await OpenApiRulesEngine.callbackRules(sampleContext, sampleRequest)
      sampleContext.request.path = temp 
      expect(result).toStrictEqual({})
    })
    it('Mock Callback', async () => {
      sampleContext.request.method = 'get'
      const result = await OpenApiRulesEngine.callbackRules(sampleContext, sampleRequest)
      expect(result).toHaveProperty('path')
      expect(result).toHaveProperty('method')
      expect(result).toHaveProperty('body')
      expect(result).toHaveProperty('headers')
    })
    it('Fixed Callback', async () => {
      sampleContext.request.method = 'post'
      const result = await OpenApiRulesEngine.callbackRules(sampleContext, sampleRequest)
      expect(result).toHaveProperty('path')
      expect(result).toHaveProperty('method')
      expect(result).toHaveProperty('body')
      expect(result).toHaveProperty('headers')
    })
    it('Fixed Callback', async () => {
      sampleContext.request.method = 'post'
      const temp = sampleRequest.customInfo.callbackInfo.successCallback.pathPattern
      delete sampleRequest.customInfo.callbackInfo.successCallback.pathPattern
      const result = await OpenApiRulesEngine.callbackRules(sampleContext, sampleRequest)
      sampleRequest.customInfo.callbackInfo.successCallback.pathPattern = temp 
      expect(result).toHaveProperty('path')
      expect(result).toHaveProperty('method')
      expect(result).toHaveProperty('body')
      expect(result).toHaveProperty('headers')
    })
  })
  describe('responseRules', () => {
    it('Mocked Response with no specFile', async () => {
      sampleContext.request.method = 'get'
      const original = sampleRequest.customInfo.specFile
      sampleRequest.customInfo.specFile = null
      const result = await OpenApiRulesEngine.responseRules(sampleContext, sampleRequest)
      sampleRequest.customInfo.specFile = original
    })
    it('Mocked Response with specFile', async () => {
      sampleContext.request.method = 'get'
      const result = await OpenApiRulesEngine.responseRules(sampleContext, sampleRequest)
    })
    it('Mocked Response', async () => {
      sampleContext.request.method = ''
      const result = await OpenApiRulesEngine.responseRules(sampleContext, sampleRequest)
    })
    it('Fixed Response', async () => {
      sampleContext.request.method = 'post'
      const result = await OpenApiRulesEngine.responseRules(sampleContext, sampleRequest)
      expect(result).toHaveProperty('body')
      expect(result).toHaveProperty('status')
    })
  })
})
