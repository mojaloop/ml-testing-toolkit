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

const OpenApiRulesEngine = require('../../../../src/lib/mocking/openApiRulesEngine')

const rulesEngineModel = require('../../../../src/lib/rulesEngineModel')
jest.mock('../../../../src/lib/rulesEngineModel')

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
    if (facts.method === 'get') {
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
          Date: '{$request.headers.date}'
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
          id: '{$request.params.id}',
          reason: '{$request.body.reason}'
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
    it('Fixed Callback', async () => {
      sampleContext.request.method = 'post'
      const result = await OpenApiRulesEngine.callbackRules(sampleContext, sampleRequest)
      expect(result).toHaveProperty('path')
      expect(result).toHaveProperty('method')
      expect(result).toHaveProperty('body')
      expect(result).toHaveProperty('headers')
    })
  })
  describe('responseRules', () => {
    it('Fixed Response', async () => {
      sampleContext.request.method = 'post'
      const result = await OpenApiRulesEngine.responseRules(sampleContext, sampleRequest)
      expect(result).toHaveProperty('body')
      expect(result).toHaveProperty('status')
    })
  })
})
