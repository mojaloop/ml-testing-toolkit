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

const mapping = {
  validation: {
    get: [
      {
        type: 'MOCK_ERROR_CALLBACK',
        params: {
          body: {
  
          },
          delay: 100,
          scripts: {
            enabled: true,
            exec: [
              "pm.environment.set('operationPath', '/quotes')"
            ]
          },
        }
      }
    ],
    put: [
      {
        type: 'MOCK_ERROR_CALLBACK',
        params: {
          body: {
            removeEmpty: null
          }
        }
      }
    ],
    patch: [
      {
        type: 'NOT_SUPPORTED',
        params: {}
      }
    ],
    delete: null,
    default: [
      {
        type: 'FIXED_ERROR_CALLBACK',
        params: {
          method: 'put',
          path: '/quotes/{ID}',
          body: {
            quoteId: '123',
            transferId: null
          },
          headers: {
            Date: '2020-01-01 00:00:00 GMT'
          },
          delay: 100
        }
      }
    ]  
  },
  callback: {
    get: [
      {
        type: 'MOCK_CALLBACK',
        params: {
          body: {

          },
          delay: 100,
          scripts: {
            enabled: true,
            exec: [
              "console.log('test')"
            ],
            scriptingEngine: 'javascript'
          },
        }
      }
    ],
    put: [
      {
        type: 'MOCK_CALLBACK',
        params: {
          body: {

          }
        }
      }
    ],
    patch: [
      {
        type: 'NOT_SUPPORTED',
        params: {}
      }
    ],
    delete: null,
    default: [
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
  },
  forward: {
    get: [
      {
        type: 'FORWARD',
        params: {
          dfspId: 'userdfsp'
        }
      }
    ],
    put: [
      {
        type: 'FORWARD',
        params: {
        }
      }
    ],
    patch: [
      {
        type: 'NOT_SUPPORTED',
        params: {}
      }
    ],
    delete: null
  },
  response: {
    get: [
      {
        type: 'MOCK_RESPONSE',
        params: {
          statusCode: 200,
          method: 'put',
          path: '/quotes/{ID}',
          body: {
            quouteId: null
          },
          delay: 100
        }
      }
    ],
    put: [
      {
        type: 'MOCK_RESPONSE',
        params: {
          statusCode: 200,
          method: 'put',
          path: '/quotes/{ID}',
          body: {
            quouteId: null
          }
        }
      }
    ],
    patch: [
      {
        type: 'NOT_SUPPORTED',
        params: {}
      }
    ],
    delete: null,
    default: [
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

const getRulesEngineHelper = (type) => {
  const evaluateFn = async (facts) => {
    if (mapping[type][facts.method] !== undefined) {
      return mapping[type][facts.method]
    }
    return mapping[type].default   
  }
  return Promise.resolve({
    evaluate: evaluateFn
  })
}

rulesEngineModel.getValidationRulesEngine.mockImplementation(() => {
  return getRulesEngineHelper('validation')
})

rulesEngineModel.getCallbackRulesEngine.mockImplementation(() => {
  return getRulesEngineHelper('callback')
}) 
rulesEngineModel.getResponseRulesEngine.mockImplementation(() => {
  return getRulesEngineHelper('response')
}) 

rulesEngineModel.getForwardRulesEngine.mockImplementation(() => {
  return getRulesEngineHelper('forward')
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
          'Content-Type': '{$environment.negotiatedContentType}',
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
    it('no facts', async () => {
      sampleContext.request.method = 'delete'
      const result = await OpenApiRulesEngine.validateRules(sampleContext, sampleRequest)
      expect(result).toStrictEqual({})
    })
    it('Mock Error Callback', async () => {
      sampleContext.request.method = 'get'
      rulesEngineModel.getValidationRules.mockResolvedValueOnce([{
        conditions: {
          all: [
            {
              "fact": "operationPath",
              "operator": "equal",
              "value": "/quotes"
            },
            {
              "fact": "operationPath",
              "operator": "equal",
              "value": "{$environment.operationPath}"
            }
          ]
        }
      }])
      const result = await OpenApiRulesEngine.validateRules(sampleContext, sampleRequest)
      expect(result).toHaveProperty('path')
      expect(result).toHaveProperty('method')
      expect(result).toHaveProperty('body')
      expect(result).toHaveProperty('headers')
    })
    it('Mock Error Callback', async () => {
      sampleContext.request.method = 'get'
      const bodyOverride = {...sampleRequest.customInfo.callbackInfo.errorCallback.bodyOverride}
      const headerOverride = {...sampleRequest.customInfo.callbackInfo.errorCallback.headerOverride}
      const jsfRefFile = sampleRequest.customInfo.jsfRefFile

      sampleRequest.customInfo.callbackInfo.errorCallback.bodyOverride = null
      sampleRequest.customInfo.callbackInfo.errorCallback.headerOverride = null
      sampleRequest.customInfo.jsfRefFile = null
      const result = await OpenApiRulesEngine.validateRules(sampleContext, sampleRequest)
      sampleRequest.customInfo.callbackInfo.errorCallback.bodyOverride = bodyOverride
      sampleRequest.customInfo.callbackInfo.errorCallback.headerOverride = headerOverride
      sampleRequest.customInfo.jsfRefFile = jsfRefFile
      expect(result).toHaveProperty('path')
      expect(result).toHaveProperty('method')
      expect(result).toHaveProperty('body')
      expect(result).toHaveProperty('headers')
    })
    it('Mock Error Callback', async () => {
      sampleContext.request.method = 'put'
      const result = await OpenApiRulesEngine.validateRules(sampleContext, sampleRequest)
      expect(result).toHaveProperty('path')
      expect(result).toHaveProperty('method')
      expect(result).toHaveProperty('body')
      expect(result).toHaveProperty('headers')
    })
    it('Mock Error Callback', async () => {
      sampleContext.request.method = 'patch'
      const result = await OpenApiRulesEngine.validateRules(sampleContext, sampleRequest)
      expect(result).toStrictEqual({})
    })
    it('Mock Error Callback', async () => {
      sampleContext.request.method = 'get'
      const temp = sampleRequest.customInfo.specFile
      delete sampleRequest.customInfo.specFile
      const result = await OpenApiRulesEngine.validateRules(sampleContext, sampleRequest)
      sampleRequest.customInfo.specFile = temp
      expect(result).toStrictEqual({delay: 100})
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
    it('no facts', async () => {
      sampleContext.request.method = 'delete'
      const result = await OpenApiRulesEngine.callbackRules(sampleContext, sampleRequest)
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
    it('Mock Callback', async () => {
      sampleContext.request.method = 'get'
      
      const bodyOverride = {...sampleRequest.customInfo.callbackInfo.successCallback.bodyOverride}
      const headerOverride = {...sampleRequest.customInfo.callbackInfo.successCallback.headerOverride}
      const jsfRefFile = sampleRequest.customInfo.jsfRefFile
      sampleRequest.customInfo.callbackInfo.successCallback.bodyOverride = null
      sampleRequest.customInfo.callbackInfo.successCallback.headerOverride = null
      sampleRequest.customInfo.jsfRefFile = null
      
      const body = {...sampleContext.request.body}
      const query = {...sampleContext.request.query}
      sampleContext.request.body = null
      sampleContext.request.query = null
      const result = await OpenApiRulesEngine.callbackRules(sampleContext, sampleRequest)
      sampleRequest.customInfo.callbackInfo.successCallback.bodyOverride = bodyOverride
      sampleRequest.customInfo.callbackInfo.successCallback.headerOverride = headerOverride
      sampleRequest.customInfo.jsfRefFile = jsfRefFile
      sampleContext.request.body = body
      sampleContext.request.query = query
      expect(result).toHaveProperty('path')
      expect(result).toHaveProperty('method')
      expect(result).toHaveProperty('body')
      expect(result).toHaveProperty('headers')
    })
    it('Mock Callback', async () => {
      sampleContext.request.method = 'put'
      const result = await OpenApiRulesEngine.callbackRules(sampleContext, sampleRequest)
      expect(result).toHaveProperty('path')
      expect(result).toHaveProperty('method')
      expect(result).toHaveProperty('body')
      expect(result).toHaveProperty('headers')
    })
    it('Mock Callback', async () => {
      sampleContext.request.method = 'patch'
      const result = await OpenApiRulesEngine.callbackRules(sampleContext, sampleRequest)
      expect(result).toStrictEqual({})
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
      expect(result).toStrictEqual({delay: 100})
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
    it('no facts', async () => {
      sampleContext.request.method = 'delete'
      const result = await OpenApiRulesEngine.responseRules(sampleContext, sampleRequest)
      expect(result).toStrictEqual({})
    })
    it('Mocked Response with no specFile', async () => {
      sampleContext.request.method = 'get'
      const original = sampleRequest.customInfo.specFile
      sampleRequest.customInfo.specFile = null
      const result = await OpenApiRulesEngine.responseRules(sampleContext, sampleRequest)
      sampleRequest.customInfo.specFile = original
    })
    it('Mock Response', async () => {
      sampleContext.request.method = 'get'
      const responseInfo = {...sampleRequest.customInfo.responseInfo}
      const jsfRefFile = sampleRequest.customInfo.jsfRefFile
      sampleRequest.customInfo.responseInfo = null
      sampleRequest.customInfo.jsfRefFile = null
      const result = await OpenApiRulesEngine.responseRules(sampleContext, sampleRequest)
      sampleRequest.customInfo.responseInfo = responseInfo
      sampleRequest.customInfo.jsfRefFile = jsfRefFile
    })
    it('Mocked Response with specFile', async () => {
      sampleContext.request.method = 'get'
      const result = await OpenApiRulesEngine.responseRules(sampleContext, sampleRequest)
    })
    it('Mocked Response with specFile', async () => {
      sampleContext.request.method = 'put'
      const result = await OpenApiRulesEngine.responseRules(sampleContext, sampleRequest)
    })
    it('Mocked Response with specFile', async () => {
      sampleContext.request.method = 'patch'
      const result = await OpenApiRulesEngine.responseRules(sampleContext, sampleRequest)
      expect(result).toStrictEqual({})
    })
    it('Fixed Response', async () => {
      sampleContext.request.method = 'post'
      const result = await OpenApiRulesEngine.responseRules(sampleContext, sampleRequest)
      expect(result).toHaveProperty('body')
      expect(result).toHaveProperty('status')
    })
  })
  describe('forwardRules', () => {
    it('no forward when delete parties', async () => {
      sampleContext.request.method = 'delete'
      const result = await OpenApiRulesEngine.forwardRules(sampleContext, sampleRequest)
      expect(result).toBeFalsy()
    })
    it('forward empty when type not supported', async () => {
      sampleContext.request.method = 'patch'
      sampleContext.request.headers = {
        'fspiop-source': 'userdfsp'
      }
      const result = await OpenApiRulesEngine.forwardRules(sampleContext, sampleRequest)
      expect(result).toStrictEqual({})
    })
    it('forward when get parties and callbackInfo provided', async () => {
      sampleContext.request.method = 'get'
      sampleContext.request.headers = {
        'fspiop-source': 'userdfsp'
      }
      const result = await OpenApiRulesEngine.forwardRules(sampleContext, sampleRequest)
      expect(result).toBeDefined()
    })
    it('forward when get parties and callbackInfo not provided', async () => {
      sampleContext.request.method = 'put'
      sampleContext.request.headers = {
        'fspiop-source': 'userdfsp'
      }
      const newRequest = {...sampleRequest}
      newRequest.customInfo = {}
      const result = await OpenApiRulesEngine.forwardRules(sampleContext, newRequest)
      expect(result).toBeDefined()
    })
  })
})
