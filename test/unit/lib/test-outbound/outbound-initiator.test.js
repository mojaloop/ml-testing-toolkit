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

const OutboundInitiator = require('../../../../src/lib/test-outbound/outbound-initiator')
const axios = require('axios').default
const https = require('https')
const ConnectionProvider = require('../../../../src/lib/configuration-providers/mb-connection-manager')
const Config = require('../../../../src/lib/config')
const JwsSigning = require('../../../../src/lib/jws/JwsSigning')
const notificationEmitter = require('../../../../src/lib/notificationEmitter.js')
const OpenApiDefinitionsModel = require('../../../../src/lib/mocking/openApiDefinitionsModel')
const Utils = require('../../../../src/lib/utils')
jest.mock('../../../../src/lib/webSocketClient/WebSocketClientManager')

const SpyReadFileAsync = jest.spyOn(Utils, 'readFileAsync')
const SpyAgent = jest.spyOn(https, 'Agent')
const SpyGetTlsConfig = jest.spyOn(ConnectionProvider, 'getTlsConfig')
const SpyGetEndpointsConfig= jest.spyOn(ConnectionProvider, 'getEndpointsConfig')
const SpyGetUserConfig = jest.spyOn(Config, 'getUserConfig')
const SpyGetSystemConfig = jest.spyOn(Config, 'getSystemConfig')
const SpySign = jest.spyOn(JwsSigning, 'sign')
const SpyJwsSignWithKey = jest.spyOn(JwsSigning, 'signWithKey')
const SpyGetApiDefinitions = jest.spyOn(OpenApiDefinitionsModel, 'getApiDefinitions')

jest.mock('../../../../src/lib/notificationEmitter.js')
jest.mock('axios')
jest.mock('../../../../src/lib/db/adapters/dbAdapter')


describe('Outbound Initiator Functions', () => {
  describe('getFunctionResult', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })
    // Positive Scenarios
    it('getFunctionResult should return uuid with length greater than 5', async () => {
      const uuid = OutboundInitiator.getFunctionResult('{$function.generic.generateUUID}', null, null)
      expect(uuid.length).toBeGreaterThan(5)
    })
    it('getFunctionResult should return unique uuid', async () => {
      const uuid1 = OutboundInitiator.getFunctionResult('{$function.generic.generateUUID}', null, null)
      const uuid2 = OutboundInitiator.getFunctionResult('{$function.generic.generateUUID}', null, null)
      expect(uuid1.length).toBeGreaterThan(5)
      expect(uuid1).not.toEqual(uuid2)
    })
    //Negative Scenarios
    it('getFunctionResult should return same string if the syntax is incorrect', async () => {
      const fnWrongSyntax = '{$function.generic}'
      const uuid = OutboundInitiator.getFunctionResult(fnWrongSyntax, null, null)
      expect(uuid).toEqual(fnWrongSyntax)
    })
    it('getFunctionResult should return same string for incorrect function folder', async () => {
      const fnWrongSyntax = '{$function.incorrect.generateUUID}'
      const uuid = OutboundInitiator.getFunctionResult(fnWrongSyntax, null, null)
      expect(uuid).toEqual(fnWrongSyntax)
    })
    it('getFunctionResult should return same string for incorrect function name', async () => {
      const fnWrongSyntax = '{$function.generic.incorrect}'
      const uuid = OutboundInitiator.getFunctionResult(fnWrongSyntax, null, null)
      expect(uuid).toEqual(fnWrongSyntax)
    })
  })
  describe('replacePathVariables', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })
    // Positive Scenarios
    it('replacePathVariables should replace path params properly', async () => {
      const pathParams = {
        Type: 'MSISDN',
        ID: '123456789'
      }
      const path = OutboundInitiator.replacePathVariables('/parties/{Type}/{ID}', pathParams)
      expect(path).toEqual('/parties/MSISDN/123456789')
    })
    it('replacePathVariables should return the same path if no params exist', async () => {
      const pathParams = {
        Type: 'MSISDN',
        ID: '123456789'
      }
      const path = OutboundInitiator.replacePathVariables('/parties/sometype/someid', pathParams)
      expect(path).toEqual('/parties/sometype/someid')
    })
    // Negative Scenarios
    it('replacePathVariables should return the same path if there are no params supplied', async () => {
      const pathParams = {
      }
      const path = OutboundInitiator.replacePathVariables('/parties/{Type}/{ID}', pathParams)
      expect(path).toEqual('/parties/{Type}/{ID}')
    })
    it('replacePathVariables should return the same path if null params supplied', async () => {
      const path = OutboundInitiator.replacePathVariables('/parties/{Type}/{ID}', null)
      expect(path).toEqual('/parties/{Type}/{ID}')
    })
    it('replacePathVariables should return the partial path if partial params supplied', async () => {
      const pathParams = {
        Type: 'MSISDN'
      }
      const path = OutboundInitiator.replacePathVariables('/parties/{Type}/{ID}', pathParams)
      expect(path).toEqual('/parties/MSISDN/{ID}')
    })
  })
  describe('replaceRequestVariables', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })
    // Positive Scenarios
    it('replaceRequestVariables should replace request variables properly', async () => {
      const sampleRequest = {
        headers: {
          'FSPIOP-Source': 'payerfsp',
          Date: '2020-01-01 01:01:01',
          TimeStamp: '{$request.headers.Date}'
        },
        body: {
          transactionId: '123',
          amount: {
            amount: '100',
            currency: 'USD'
          },
          transactionAmount: {
            amount: '{$request.body.amount.amount}',
            currency: '{$request.body.amount.currency}'
          }
        }
      }
      const request = OutboundInitiator.replaceRequestVariables(sampleRequest)
      expect(request.body.transactionAmount.amount).toEqual('100')
      expect(request.body.transactionAmount.currency).toEqual('USD')
      expect(request.headers.TimeStamp).toEqual('2020-01-01 01:01:01')
    })
    // Negative Scenarios
    it('replaceRequestVariables should not replace request variables which does not exist', async () => {
      const sampleRequest = {
        body: {
          transactionId: '123',
          transactionAmount: {
            amount: '{$request.body.amount.amount}',
            currency: '{$request.body.amount.currency}'
          }
        }
      }
      const request = OutboundInitiator.replaceRequestVariables(sampleRequest)
      expect(request.body.transactionAmount.amount).toEqual('{$request.body.amount.amount}')
      expect(request.body.transactionAmount.currency).toEqual('{$request.body.amount.currency}')
    })
    it('replaceRequestVariables should not replace request variables which does not exist', async () => {
      const sampleRequest = {
        body: {
          transactionId: '123',
          transactionAmount: {
            amount: '{$environment.body.amount.amount}',
            currency: '{$environment.body.amount.currency}'
          }
        }
      }
      const request = OutboundInitiator.replaceRequestVariables(JSON.stringify(sampleRequest))
      expect(JSON.parse(request)).toStrictEqual(sampleRequest)
    })
    it('replaceRequestVariables should not replace request variables which does not exist', async () => {
      const sampleRequest = true
      const request = OutboundInitiator.replaceRequestVariables(sampleRequest)
      expect(request).toStrictEqual(sampleRequest)
    })
  })

  describe('replaceEnvironmentVariables', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })
    // Positive Scenarios
    it('replaceEnvironmentVariables should replace environment variables properly', async () => {
      const environment = {
        transactionId: '123'
      }
      const sampleRequest = {
        headers: {
          'FSPIOP-Source': 'payerfsp',
          Date: '2020-01-01 01:01:01'
        },
        body: {
          transactionId: '{$environment.transactionId}'
        }
      }
      const request = OutboundInitiator.replaceEnvironmentVariables(sampleRequest,environment)
      expect(request.body.transactionId).toEqual('123')
    })
    it('replaceEnvironmentVariables should not replace request variables which does not exist', async () => {
      const environment = {
        quoteId: '123'
      }
      const sampleRequest = {
        headers: {
          'FSPIOP-Source': 'payerfsp',
          Date: '2020-01-01 01:01:01'
        },
        body: {
          transactionId: '{$environment.transactionId}'
        }
      }
      const request = OutboundInitiator.replaceEnvironmentVariables(sampleRequest,environment)
      expect(request.body.transactionId).toEqual('{$environment.transactionId}')
    })
    it('replaceEnvironmentVariables should not replace request variables which does not exist', async () => {
      const environment = {
        quoteId: '123'
      }
      const sampleRequest = {
        headers: {
          'FSPIOP-Source': 'payerfsp',
          Date: '2020-01-01 01:01:01'
        },
        body: {
          transactionId: '{$request.transactionId}'
        }
      }
      const request = OutboundInitiator.replaceEnvironmentVariables(JSON.stringify(sampleRequest),environment)
      expect(JSON.parse(request)).toStrictEqual(sampleRequest)
    })
    it('replaceEnvironmentVariables should not replace request variables which does not exist', async () => {
      const environment = {
        quoteId: '123'
      }
      const sampleRequest = true
      const request = OutboundInitiator.replaceEnvironmentVariables(sampleRequest,environment)
      expect(request).toStrictEqual(sampleRequest)
    })
  })

  describe('replaceRequestLevelEnvironmentVariables', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })
    // Positive Scenarios
    it('replaceRequestLevelEnvironmentVariables should replace request level environment variables properly', async () => {
      const requestVariables = {
        transactionId: '123'
      }
      const sampleRequest = {
        headers: {
          'FSPIOP-Source': 'payerfsp',
          Date: '2020-01-01 01:01:01'
        },
        body: {
          transactionId: '{$requestVariables.transactionId}'
        }
      }
      const request = OutboundInitiator.replaceRequestLevelEnvironmentVariables(sampleRequest,requestVariables)
      expect(request.body.transactionId).toEqual('123')
    })
    it('replaceRequestLevelEnvironmentVariables should replace request level variables with zero value', async () => {
      const requestVariables = {
        transactionId: 0
      }
      const sampleRequest = {
        headers: {
          'FSPIOP-Source': 'payerfsp',
          Date: '2020-01-01 01:01:01'
        },
        body: {
          transactionId: '{$requestVariables.transactionId}'
        }
      }
      const request = OutboundInitiator.replaceRequestLevelEnvironmentVariables(sampleRequest,requestVariables)
      expect(request.body.transactionId).toEqual('0')
    })
    it('replaceRequestLevelEnvironmentVariables should replace request level variables with empty string', async () => {
      const requestVariables = {
        transactionId: ''
      }
      const sampleRequest = {
        headers: {
          'FSPIOP-Source': 'payerfsp',
          Date: '2020-01-01 01:01:01'
        },
        body: {
          transactionId: '{$requestVariables.transactionId}'
        }
      }
      const request = OutboundInitiator.replaceRequestLevelEnvironmentVariables(sampleRequest,requestVariables)
      expect(request.body.transactionId).toEqual('')
    })
    it('replaceRequestLevelEnvironmentVariables should replace request level variables with false value', async () => {
      const requestVariables = {
        isActive: false
      }
      const sampleRequest = {
        headers: {
          'FSPIOP-Source': 'payerfsp',
          Date: '2020-01-01 01:01:01'
        },
        body: {
          isActive: '{$requestVariables.isActive}'
        }
      }
      const request = OutboundInitiator.replaceRequestLevelEnvironmentVariables(sampleRequest,requestVariables)
      expect(request.body.isActive).toEqual('false')
    })
    // Negative Scenarios
    it('replaceRequestLevelEnvironmentVariables should not replace request level variables which does not exist', async () => {
      const requestVariables = {
        quoteId: '123'
      }
      const sampleRequest = {
        headers: {
          'FSPIOP-Source': 'payerfsp',
          Date: '2020-01-01 01:01:01'
        },
        body: {
          transactionId: '{$requestVariables.transactionId}'
        }
      }
      const request = OutboundInitiator.replaceRequestLevelEnvironmentVariables(sampleRequest,requestVariables)
      expect(request.body.transactionId).toEqual('{$requestVariables.transactionId}')
    })

  })

  describe('replaceVariables', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })
    // Positive Scenarios
    it('replaceVariables should replace input variables properly', async () => {
      const inputValues = {
        amount: '100',
        currency: 'USD',
        dateHeader: '2020-01-01 01:01:01'
      }
      const sampleRequest = {
        headers: {
          Date: '{$inputs.dateHeader}'
        },
        body: {
          transactionId: '123',
          transactionAmount: {
            amount: '{$inputs.amount}',
            currency: '{$inputs.currency}'
          }
        }
      }
      const request = OutboundInitiator.replaceVariables(sampleRequest, inputValues, null, null)
      expect(request.body.transactionAmount.amount).toEqual('100')
      expect(request.body.transactionAmount.currency).toEqual('USD')
      expect(request.headers.Date).toEqual('2020-01-01 01:01:01')
    })
    it('replaceVariables should replace function properly', async () => {
      const sampleRequest = {
        headers: {
          Date: '{$function.curDate}'
        }
      }
      const request = OutboundInitiator.replaceVariables(JSON.stringify(sampleRequest), null, null, null)
      expect(JSON.parse(request)).toStrictEqual(sampleRequest)
    })
    it('replaceVariables should return the value if its not an object or a string', async () => {
      const sampleRequest = true
      const request = OutboundInitiator.replaceVariables(sampleRequest, null, null, null)
      expect(request).toStrictEqual(sampleRequest)
    })
    it('replaceVariables should replace request variables properly', async () => {
      const sampleRequest = {
        body: {
          transactionId: '123',
          amount: {
            amount: '100',
            currency: 'USD'
          },
          transactionAmount: {
            amount: '{$request.body.amount.amount}',
            currency: '{$request.body.amount.currency}'
          }
        }
      }
      const request = OutboundInitiator.replaceVariables(sampleRequest, null, sampleRequest, null)
      expect(request.body.transactionAmount.amount).toEqual('100')
      expect(request.body.transactionAmount.currency).toEqual('USD')
    })
    it('replaceVariables should replace previous request variables properly', async () => {
      const responsesObject = {
        1: {
          appended: {
            request: {
              body: {
                transactionId: '123'
              }
            }
          }
        }
      }
      const sampleRequest = {
        body: {
          transferId: '{$prev.1.request.body.transactionId}'
        }
      }
      const request = OutboundInitiator.replaceVariables(sampleRequest, null, null, responsesObject)
      expect(request.body.transferId).toEqual('123')
    })
    it('replaceVariables should replace previous response variables properly', async () => {
      const responsesObject = {
        1: {
          appended: {
            response: {
              body: {
                party:{
                  fspId: '123'
                }
              }
            }
          }
        }
      }
      const sampleRequest = {
        headers: {
          'FSPIOP-Destination': '{$prev.1.response.body.party.fspId}'
        }
      }
      const request = OutboundInitiator.replaceVariables(sampleRequest, null, null, responsesObject)
      expect(request.headers['FSPIOP-Destination']).toEqual('123')
    })
    // Negative Scenarios
    it('replaceVariables should not replace a variable if it does not exist', async () => {
      const inputValues = {
        amount: '100',
        currency: 'USD',
        dateHeader: '2020-01-01 01:01:01'
      }
      const sampleRequest = {
        headers: {
          Date: '{$inputs.wrongDateHeaderReference}'
        }
      }
      const request = OutboundInitiator.replaceVariables(sampleRequest, inputValues, null, null)
      expect(request.headers.Date).toEqual('{$inputs.wrongDateHeaderReference}')
    })
    it('replaceVariables should not replace the request variables if those contain another variable', async () => {
      const sampleRequest = {
        body: {
          transactionId: '123',
          amount: {
            amount: '{$some.amount}',
            currency: '{$some.currency}'
          },
          transactionAmount: {
            amount: '{$request.body.amount.amount}',
            currency: '{$request.body.amount.currency}'
          }
        }
      }
      const request = OutboundInitiator.replaceVariables(sampleRequest, null, sampleRequest, null)
      expect(request.body.transactionAmount.amount).toEqual('{$request.body.amount.amount}')
      expect(request.body.transactionAmount.currency).toEqual('{$request.body.amount.currency}')
    })
  })

  describe('sendRequest', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })
    // Positive Scenarios
    it('sendRequest should call axios with appropriate params 1', async () => {
      axios.mockImplementation(() => Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: {},
        request: {
          toCurl: () => ''
        }
      }))
      SpySign.mockReturnValue( Promise.resolve() )
      SpyAgent.mockImplementation(() => {
        return {httpsAgent: {}}
      })
      SpyGetTlsConfig.mockReturnValue(Promise.resolve({
        dfsps: {
          'userdfsp': {
            hubClientCert: 'cert',
            dfspServerCaRootCert: 'ca'
          }
        },
        hubClientKey: 'key'
      }))
      SpyGetUserConfig.mockResolvedValue({
        CALLBACK_ENDPOINT: 'http://localhost:4040'
      })
      SpyGetSystemConfig.mockReturnValue({
        HOSTING_ENABLED: false,
        OUTBOUND_MUTUAL_TLS_ENABLED: true
      })
      const sampleRequest = {
        headers: {
          'FSPIOP-Source': 'userdfsp',
          Date: '2020-01-01 01:01:01',
          TimeStamp: '{$request.headers.Date}'
        },
        body: {
          transactionId: '123',
          amount: {
            amount: '100',
            currency: 'USD'
          },
          transactionAmount: {
            amount: '{$request.body.amount.amount}',
            currency: '{$request.body.amount.currency}'
          }
        }
      }
      
      try {
        await OutboundInitiator.sendRequest('localhost/', 'post', '/quotes', null, sampleRequest.headers, sampleRequest.body, null, null, null, 'userdfsp')
      } catch (err) {}
      expect(axios).toHaveBeenCalledTimes(1);
    })
    it('sendRequest should call axios with appropriate params 2', async () => {
      axios.mockImplementation(() => Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: {},
        request: {
          toCurl: () => ''
        }
      }))
      SpySign.mockReturnValue(Promise.resolve())
      SpyAgent.mockImplementation(() => {
        return {httpsAgent: {}}
      })
      SpyGetTlsConfig.mockReturnValue(Promise.resolve({
        dfsps: {
          'userdfsp': {
            hubClientCert: 'cert',
            dfspServerCaRootCert: 'ca'
          }
        },
        hubClientKey: 'key'
      }))
      SpyGetSystemConfig.mockReturnValue({
        HOSTING_ENABLED: false,
        OUTBOUND_MUTUAL_TLS_ENABLED: true
      })
      SpyGetUserConfig.mockResolvedValue({
        CALLBACK_ENDPOINT: 'http://localhost:4040',
        CALLBACK_TIMEOUT: 5
      })
      const sampleRequest = {
        headers: {
          'FSPIOP-Source': 'userdfsp',
          Date: '2020-01-01 01:01:01',
          TimeStamp: '{$request.headers.Date}'
        },
        body: {
          transactionId: '123',
          amount: {
            amount: '100',
            currency: 'USD'
          },
          transactionAmount: {
            amount: '{$request.body.amount.amount}',
            currency: '{$request.body.amount.currency}'
          }
        }
      }
      
      try{
        await OutboundInitiator.sendRequest('localhost/', 'post', '/quotes', null, sampleRequest.headers, sampleRequest.body, {}, {}, null, 'userdfsp')

      } catch (err) {}
      expect(axios).toHaveBeenCalledTimes(1);
    })
    it('sendRequest should call axios with appropriate params 4', async () => {
      axios.mockImplementation(() => Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: {},
        request: {
          toCurl: () => ''
        }
      }))
      SpySign.mockResolvedValue()
      SpyAgent.mockImplementation(() => {
        return {httpsAgent: {}}
      })
      SpyGetTlsConfig.mockResolvedValue({
        dfsps: {
          'userdfsp': {
            hubClientCert: 'cert',
            dfspServerCaRootCert: 'ca'
          }
        },
        hubClientKey: 'key'
      })
      SpyGetSystemConfig.mockReturnValue({
        HOSTING_ENABLED: false,
        OUTBOUND_MUTUAL_TLS_ENABLED: true
      })
      SpyGetUserConfig.mockResolvedValue({
        CALLBACK_ENDPOINT: 'http://localhost:4040',
        CALLBACK_TIMEOUT: 5000
      })
      const sampleRequest = {
        headers: {
          'FSPIOP-Source': 'userdfsp',
          Date: '2020-01-01 01:01:01',
          TimeStamp: '{$request.headers.Date}'
        },
        body: {
          transactionId: '123',
          amount: {
            amount: '100',
            currency: 'USD'
          },
          transactionAmount: {
            amount: '{$request.body.amount.amount}',
            currency: '{$request.body.amount.currency}'
          }
        }
      }
      
      try {
        await OutboundInitiator.sendRequest('localhost/', 'post', '/quotes', null, sampleRequest.headers, sampleRequest.body, null, null, null, 'userdfsp')
      } catch (err) {}
      expect(axios).toHaveBeenCalledTimes(1);
    })
    it('sendRequest should call axios with appropriate params 5', async () => {
      axios.mockImplementation(() => Promise.reject({
        status: 300,
        statusText: 'OK',
        data: {},
        request: {
          toCurl: () => ''
        }
      }))
      SpySign.mockImplementation(async () => {throw new Error()})
      SpyAgent.mockImplementation(async () => {
        return {httpsAgent: {}}
      })
      SpyGetTlsConfig.mockResolvedValue({
        dfsps: {
          'userdfsp': {
            hubClientCert: 'cert',
            dfspServerCaRootCert: 'ca'
          }
        },
        hubClientKey: 'key'
      })
      SpyGetSystemConfig.mockReturnValue({
        HOSTING_ENABLED: false,
        OUTBOUND_MUTUAL_TLS_ENABLED: true
      })
      SpyGetUserConfig.mockResolvedValue({
        CALLBACK_ENDPOINT: 'http://localhost:4040'
      })
      const sampleRequest = {
        headers: {
          'FSPIOP-Source': 'userdfsp',
          Date: '2020-01-01 01:01:01',
          TimeStamp: '{$request.headers.Date}'
        },
        body: {
          transactionId: '123',
          amount: {
            amount: '100',
            currency: 'USD'
          },
          transactionAmount: {
            amount: '{$request.body.amount.amount}',
            currency: '{$request.body.amount.currency}'
          }
        }
      }
      
      try {
        await OutboundInitiator.sendRequest('localhost/', 'post', '/quotes', null, sampleRequest.headers, sampleRequest.body, {}, {}, null, 'userdfsp')
      } catch (err) {}
      expect(axios).toHaveBeenCalledTimes(1);
    })
    it('sendRequest should call axios with appropriate params 6', async () => {
      axios.mockImplementation(() => Promise.reject({
        status: 300,
        statusText: 'OK',
        data: {},
        request: {
          toCurl: () => ''
        }
      }))
      SpySign.mockImplementation(async () => {throw new Error()})
      SpyAgent.mockImplementation(async () => {
        return {httpsAgent: {}}
      })
      SpyGetTlsConfig.mockResolvedValue({
        dfsps: {
          'userdfsp': {
            hubClientCert: 'cert',
            dfspServerCaRootCert: 'ca'
          }
        },
        hubClientKey: 'key'
      })
      SpyGetSystemConfig.mockReturnValue({
        HOSTING_ENABLED: true,
        OUTBOUND_MUTUAL_TLS_ENABLED: true
      })
      SpyGetUserConfig.mockResolvedValue({
        CALLBACK_ENDPOINT: 'http://localhost:4040'
      })
      SpyGetEndpointsConfig.mockResolvedValue({
        dfspEndpoints: {
          'userdfsp': 'http://localhost:4040'
        }
      })
      const sampleRequest = {
        headers: {
          'FSPIOP-Source': 'userdfsp',
          Date: '2020-01-01 01:01:01',
          TimeStamp: '{$request.headers.Date}'
        },
        body: {
          transactionId: '123',
          amount: {
            amount: '100',
            currency: 'USD'
          },
          transactionAmount: {
            amount: '{$request.body.amount.amount}',
            currency: '{$request.body.amount.currency}'
          }
        }
      }
      
      try {
        await OutboundInitiator.sendRequest('localhost/', 'post', '/quotes', null, sampleRequest.headers, sampleRequest.body, {}, {}, null, 'userdfsp')
      } catch (err) {}
      expect(axios).toHaveBeenCalledTimes(1);
    })
    it('sendRequest should call axios with appropriate params 7', async () => {
      axios.mockImplementation(() => Promise.reject({
        status: 300,
        statusText: 'OK',
        data: {},
        request: {
          toCurl: () => ''
        }
      }))
      SpySign.mockImplementation(async () => {throw new Error()})
      SpyAgent.mockImplementation(async () => {
        return {httpsAgent: {}}
      })
      SpyGetTlsConfig.mockResolvedValue({
        dfsps: {
          'userdfsp': {
            hubClientCert: 'cert',
            dfspServerCaRootCert: 'ca'
          }
        },
        hubClientKey: 'key'
      })
      SpyGetSystemConfig.mockReturnValue({
        HOSTING_ENABLED: true,
        OUTBOUND_MUTUAL_TLS_ENABLED: true
      })
      SpyGetEndpointsConfig.mockResolvedValue({
        dfspEndpoints: {
          'userdfsp': 'http://localhost:4040'
        }
      })
      SpyGetUserConfig.mockResolvedValue({
        CALLBACK_ENDPOINT: 'http://localhost:4040'
      })
      const sampleRequest = {
        headers: {
          'FSPIOP-Source': 'userdfsp',
          Date: '2020-01-01 01:01:01',
          TimeStamp: '{$request.headers.Date}'
        },
        body: {
          transactionId: '123',
          amount: {
            amount: '100',
            currency: 'USD'
          },
          transactionAmount: {
            amount: '{$request.body.amount.amount}',
            currency: '{$request.body.amount.currency}'
          }
        }
      }
      axios.mockClear()
      try {
        await OutboundInitiator.sendRequest('localhost/', 'post', '/quotes', null, sampleRequest.headers, sampleRequest.body, {}, {}, null, 'userdfsp')
      } catch (err) {}
      expect(axios).toHaveBeenCalledTimes(1);
    })
    it('sendRequest should call axios with appropriate params 8', async () => {
      SpySign.mockImplementation(async () => {throw new Error()})
      SpyAgent.mockImplementation(async () => {
        return {httpsAgent: {}}
      })
      SpyGetTlsConfig.mockResolvedValue({
        dfsps: {
          'userdfsp': {
            hubClientCert: 'cert',
            dfspServerCaRootCert: 'ca'
          }
        },
        hubClientKey: 'key'
      })
      SpyGetUserConfig.mockResolvedValue({
        CALLBACK_ENDPOINT: 'http://localhost:4040'
      })
      SpyGetSystemConfig.mockReturnValue({
        HOSTING_ENABLED: true,
        OUTBOUND_MUTUAL_TLS_ENABLED: true
      })
      SpyGetEndpointsConfig.mockResolvedValue({
        dfspEndpoints: {}
      })
      const sampleRequest = {
        headers: {
          'FSPIOP-Source': 'userdfsp',
          Date: '2020-01-01 01:01:01',
          TimeStamp: '{$request.headers.Date}'
        },
        body: {
          transactionId: '123',
          amount: {
            amount: '100',
            currency: 'USD'
          },
          transactionAmount: {
            amount: '{$request.body.amount.amount}',
            currency: '{$request.body.amount.currency}'
          }
        }
      }
      // try {
      //   await OutboundInitiator.sendRequest('localhost/', 'post', '/quotes', null, sampleRequest.headers, sampleRequest.body, null, null, null, 'notExistingDfsp')
      // } catch (err) {}
      await expect(OutboundInitiator.sendRequest('localhost/', 'post', '/quotes', null, sampleRequest.headers, sampleRequest.body, null, null, null, 'notExistingDfsp')).rejects.toThrowError()
    })
    it('sendRequest should call axios with appropriate params 9 and with CLIENT_MUTUAL_TLS_ENABLED', async () => {
      axios.mockImplementation(() => Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: {},
        request: {
          toCurl: () => ''
        },
      }))
      SpySign.mockImplementation(async () => {throw new Error()})
      SpyAgent.mockImplementation(async () => {
        return {httpsAgent: {}}
      })
      SpyGetUserConfig.mockResolvedValue({
        CALLBACK_ENDPOINT: 'https://localhost:4040',
        CLIENT_MUTUAL_TLS_ENABLED: true,
        CLIENT_TLS_CREDS: [
          {
            "HOST": "localhost:4040",
            "CERT": "-----BEGIN CERTIFICATE-----\nMIIFATCCAumgAwIBAgIUUJwMg2LBzd3FZBz75YVuk2s0q3gwDQYJKoZIhvcNAQEL\nBQAwfzERMA8GA1UEChMITW9kdXNCb3gxHDAaBgNVBAsTE0luZnJhc3RydWN0dXJl\nIFRlYW0xTDBKBgNVBAMTQ3BheWVyZnNwLnFhLnByZS5teWFubWFycGF5LXByZS5p\nby5pbnRlcm5hbCBwYXllcmZzcCBJbnRlcm1lZGlhdGUgQ0EwHhcNMjEwMjIyMTkw\nMTE2WhcNMjMwMjIzMDY0MDA5WjBdMREwDwYDVQQKEwhNb2R1c0JveDEcMBoGA1UE\nCxMTSW5mcmFzdHJ1Y3R1cmUgVGVhbTEqMCgGA1UEAxMhcGF5ZXJmc3AucWEucHJl\nLm15YW5tYXJwYXktcHJlLmlvMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKC\nAQEAsCJqQwV2i8Asi349qUUbcYtx07IQ8Gp6ZbsXPbGmOSeQ/LN/uofGs5LDs13M\nLDUNhFrSb6et5Y/Dj85j0qMvzhW1cgcxMXNYLhwWCAX99sqBGhnLfF6rSSi7ZkbE\nAtTDwHqBLk/Es0ts512k1H6ReejLbsgGYDwiuZULXpfd4Iw9t6V22lQw6B1n9CLm\nNueTKkUM7jAN5LnF4fBCof3jpTB821taDog0Dla7DUGV1AdIyyJyLqk+8obDqXuC\niooGwUTrBUOTrWRNlP/Tw7W0Lv76duoqLQs2INUeKRfUJYei/+cy2fFkZZ8GKaHG\nZ2eoOQ0L9VumbeCzW8MOsO4QawIDAQABo4GWMIGTMA4GA1UdDwEB/wQEAwIDqDAT\nBgNVHSUEDDAKBggrBgEFBQcDAjAdBgNVHQ4EFgQUr+lCpfITlgJJoxuW6NBFoT1t\nqAcwHwYDVR0jBBgwFoAU4UukJy4iiDZUSB5DrcfOAr6spT8wLAYDVR0RBCUwI4Ih\ncGF5ZXJmc3AucWEucHJlLm15YW5tYXJwYXktcHJlLmlvMA0GCSqGSIb3DQEBCwUA\nA4ICAQCHEus15MfR1svIOgalbtmwJPDwBURaryWf2D9BkKV2Csdlzp0miRxkhgn9\nWZ+Cym0GiMfmo6FZv+OCXbakBYFycs2lfgZXt6r3Vt6zwZcW0l5/iYUHn8g+BKYO\n9CBJpBwRpn4rDXwUCbHWXF1tHCWMg3eooLN9I2Ly2DZvSPmgH8c08W2SE72nfVyi\nqa/zdD7u8g+XxXXJd7A1AZDTE+cQ29goTpIDQQVpw+a/a9yT9BEbiKtScUTounX0\nmu0uPpBSLgQ3lkXJEy46O7etWjXpSUW8HnKiEDloDmkmKGxFj9m5wtsIZVmu+kYP\nZQWBLgN6goyuxB/cIiAC8mqLgv8/+AcZ91jpCy3dZ6a/Nla3Xq+L046AnpOYHLJp\nizV/O0UQdV/pdPtn0D7Jci++rsKBMWovX1bHPxqxHsnxMYHaUap1DFU2LWKKYBl2\nZcOfNb2My2IXK/tqEegkJoEQx+gFGGjWeV4iw/cZZosIoM4ibubS1BF3I3er+0Fo\nT3uqZJuqBePdu6II6Vbg+i6v3P0KRUYRRs3yNm9VuuNHfcc+KQaHH4iYsPi5fk95\n+EIDBWtGUu9pxx8trc33v51t7dKyQqNH4qLrKywM9OybG/FZT2aCRRXtjuMgmaN+\nXfV5OYksS9Mj+JFtCNWmhWC8BLAtfdyLejLpofUDwrdfwFwZ0g==\n-----END CERTIFICATE-----",
            "KEY": "-----BEGIN RSA PRIVATE KEY-----\nMIIEpQIBAAKCAQEAsCJqQwV2i8Asi349qUUbcYtx07IQ8Gp6ZbsXPbGmOSeQ/LN/\nuofGs5LDs13MLDUNhFrSb6et5Y/Dj85j0qMvzhW1cgcxMXNYLhwWCAX99sqBGhnL\nfF6rSSi7ZkbEAtTDwHqBLk/Es0ts512k1H6ReejLbsgGYDwiuZULXpfd4Iw9t6V2\n2lQw6B1n9CLmNueTKkUM7jAN5LnF4fBCof3jpTB821taDog0Dla7DUGV1AdIyyJy\nLqk+8obDqXuCiooGwUTrBUOTrWRNlP/Tw7W0Lv76duoqLQs2INUeKRfUJYei/+cy\n2fFkZZ8GKaHGZ2eoOQ0L9VumbeCzW8MOsO4QawIDAQABAoIBAQCfRy/y1cDjFfDy\nYEHgjccIggJ4XuGkl5WB45Nbzge0Tcx2SNhr1RbiEwl4bY0SORO1KfB82hSOsNg3\ndnuc4sd7RPRlXo2k21rVr75YmRqVj4D6GnOCT5XzvariDYJ50PAIYn/pYmdNgBrG\ni09gfeiOZu94idgCNL9uNZMngow53vddASgFH+fN4W3xWxXgexXRIxzhObvJGzux\nS2gCvePJ6n//lNIFcB1DR0ewpeLSwvmX6lZDg9IBoWbSCE/jlnAO7owzHphg8+IV\naONKIqeI0JAR1Fnmnh2t06ovVLYdx2eRo29Oqb6W//smHFfMBF22YF6Uq6HGuPQr\nSzHo6+hRAoGBAOTQf8V1qSW19WOMyDFCvvsUweGYlHJsU4dlZV7NaJAUh5n39W3x\nnJi7jZSDW/OUY/7wfGEI+k6WS7ICkZYD+an6Q7l6c4aKq6YkOCQmh2J/b+ZkAkzy\n7b3AyNG1r81fxnq1DMZC4htIDmtt2ru1fElPk8vxAgjagdtxk+v68gezAoGBAMUP\noMvtXa4qgEIk+aYv3S55P1xD4cdjYDtq1PKnkcKuzgj5QqRF3FnsWDKsNHfrD7IM\nFREFx0/iyLBVk1IrjrxHA0m3T0GrAvjpMVtyZDLa2oiKgSVLiBbTigmLebsBQSda\n2COs1IZ2mhgKM6Luyk42r5COL96BjsUHS+lpP3hpAoGBANFreuXw0IUxSox4d2mO\nm1kWIHUnvwYS20hapzLjcUYdZBapeTnNHvQzBFve9jOzpunYlR4Cp4VxzYn5C+Jv\ndPv7kCycREvpczy2faOol9SwqmwFMI3Y8XrwjVxSm7quY+w+9Jgo8uThSEFO5BlU\n+5HlgXHw/Vm5E40TIL2kigw9AoGAffd4fQMVoDCw3hdOsmnkREHjO7J00AT5TeID\nj72IEl+1es0DSYkSyzSmSHYF8CYFWXYZvVDpUGqSiQ2a56rKShZGxsdz1XFgrAY8\ns80SueNmUGPhHBsFOjotAd7ziJPLt0F96ogfLnkAFZ/n1B46mfahEZGijeRZhB8e\n6myJ0wkCgYEA1fMa/pwU2JdNvoAoCh18FWAKk/j7nmF8NPb3a9g7Eyo7Kd5CywdG\nIqDOla0gX1ZvidSj8ujJU/6NVRfjXsaOAWb/shMvFnQF5EZHt/0Om0AUufkqxXly\nJ4rTmFSt4UqDlcm6B1avenWIRVIhDZIH+q07L1OudmX+PDmWVJ0PnSw=\n-----END RSA PRIVATE KEY-----"
          }
        ]
      })
      SpyGetSystemConfig.mockReturnValue({
        HOSTING_ENABLED: false
      })
      SpyGetEndpointsConfig.mockResolvedValue({
        dfspEndpoints: {}
      })
      const sampleRequest = {
        headers: {
          'FSPIOP-Source': 'userdfsp',
          Date: '2020-01-01 01:01:01',
          TimeStamp: '{$request.headers.Date}'
        },
        body: {
          transactionId: '123',
          amount: {
            amount: '100',
            currency: 'USD'
          },
          transactionAmount: {
            amount: '{$request.body.amount.amount}',
            currency: '{$request.body.amount.currency}'
          }
        }
      }
      try {
        await OutboundInitiator.sendRequest('localhost:4040/', 'post', '/quotes', null, sampleRequest.headers, sampleRequest.body, null, null, null, 'notExistingDfsp')
      } catch (err) {}
    })
    it('sendRequest should call axios with appropriate params 10 and with http and https urls', async () => {
      axios.mockImplementation(() => Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: {},
        request: {
          toCurl: () => ''
        },
      }))
      SpySign.mockImplementation(async () => {throw new Error()})
      SpyAgent.mockImplementation(async () => {
        return {httpsAgent: {}}
      })
      SpyGetUserConfig.mockResolvedValue({
        CALLBACK_ENDPOINT: 'https://localhost:4040',
        CLIENT_MUTUAL_TLS_ENABLED: false
      })
      SpyGetSystemConfig.mockReturnValue({
        HOSTING_ENABLED: false
      })
      SpyGetEndpointsConfig.mockResolvedValue({
        dfspEndpoints: {}
      })
      const sampleRequest = {
        headers: {
          'FSPIOP-Source': 'userdfsp',
          Date: '2020-01-01 01:01:01',
          TimeStamp: '{$request.headers.Date}'
        },
        body: {
          transactionId: '123',
          amount: {
            amount: '100',
            currency: 'USD'
          },
          transactionAmount: {
            amount: '{$request.body.amount.amount}',
            currency: '{$request.body.amount.currency}'
          }
        }
      }
      try {
        await OutboundInitiator.sendRequest('http://localhost:4040/', 'post', '/quotes', null, sampleRequest.headers, sampleRequest.body, null, null, null, 'notExistingDfsp')
        await OutboundInitiator.sendRequest('https://localhost:4040/', 'post', '/quotes', null, sampleRequest.headers, sampleRequest.body, null, null, null, 'notExistingDfsp')
      } catch (err) {}
    })
    it('sendRequest should call JwsSigning.signWithKey', async () => {
      axios.mockImplementation(() => Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: {},
        request: {
          toCurl: () => ''
        }
      }))
      SpySign.mockReturnValue( Promise.resolve() )
      SpyJwsSignWithKey.mockReturnValue( Promise.resolve() )
      SpyAgent.mockImplementation(() => {
        return {httpsAgent: {}}
      })
      SpyGetTlsConfig.mockReturnValue(Promise.resolve({
        dfsps: {
          'userdfsp': {
            hubClientCert: 'cert',
            dfspServerCaRootCert: 'ca'
          }
        },
        hubClientKey: 'key'
      }))
      SpyGetEndpointsConfig.mockResolvedValue({
        dfspEndpoints: {}
      })
      SpyGetUserConfig.mockResolvedValue({
        CALLBACK_ENDPOINT: 'http://localhost:4040'
      })
      SpyGetSystemConfig.mockReturnValue({
        HOSTING_ENABLED: false,
        OUTBOUND_MUTUAL_TLS_ENABLED: true
      })
      const sampleRequest = {
        headers: {
          'FSPIOP-Source': 'userdfsp',
          Date: '2020-01-01 01:01:01',
          TimeStamp: '{$request.headers.Date}'
        },
        body: {
          transactionId: '123',
          amount: {
            amount: '100',
            currency: 'USD'
          },
          transactionAmount: {
            amount: '{$request.body.amount.amount}',
            currency: '{$request.body.amount.currency}'
          }
        }
      }
      
      try {
        await OutboundInitiator.sendRequest('localhost/', 'post', '/quotes', null, sampleRequest.headers, sampleRequest.body, null, null, null, 'userdfsp', {requestVariables: {TTK_JWS_SIGN_KEY: 'SOME_KEY'}})
      } catch (err) {}
      expect(axios).toHaveBeenCalledTimes(1);
      expect(SpyJwsSignWithKey).toHaveBeenCalledTimes(1);
    })
    it('sendRequest should call JwsSigning.signWithKey and throw an error', async () => {
      axios.mockImplementation(() => Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: {},
        request: {
          toCurl: () => ''
        }
      }))
      SpySign.mockReturnValue( Promise.resolve() )
      SpyJwsSignWithKey.mockReturnValue( Promise.reject('SOME_ERROR') )
      SpyAgent.mockImplementation(() => {
        return {httpsAgent: {}}
      })
      SpyGetTlsConfig.mockReturnValue(Promise.resolve({
        dfsps: {
          'userdfsp': {
            hubClientCert: 'cert',
            dfspServerCaRootCert: 'ca'
          }
        },
        hubClientKey: 'key'
      }))
      SpyGetEndpointsConfig.mockResolvedValue({
        dfspEndpoints: {}
      })
      SpyGetUserConfig.mockResolvedValue({
        CALLBACK_ENDPOINT: 'http://localhost:4040'
      })
      SpyGetSystemConfig.mockReturnValue({
        HOSTING_ENABLED: false,
        OUTBOUND_MUTUAL_TLS_ENABLED: true
      })
      const sampleRequest = {
        headers: {
          'FSPIOP-Source': 'userdfsp',
          Date: '2020-01-01 01:01:01',
          TimeStamp: '{$request.headers.Date}'
        },
        body: {
          transactionId: '123',
          amount: {
            amount: '100',
            currency: 'USD'
          },
          transactionAmount: {
            amount: '{$request.body.amount.amount}',
            currency: '{$request.body.amount.currency}'
          }
        }
      }
      
      try {
        await OutboundInitiator.sendRequest('localhost/', 'post', '/quotes', null, sampleRequest.headers, sampleRequest.body, null, null, null, 'userdfsp', {requestVariables: {TTK_JWS_SIGN_KEY: 'SOME_KEY'}})
      } catch (err) {}
      expect(axios).toHaveBeenCalledTimes(1);
      expect(SpyJwsSignWithKey).toHaveBeenCalledTimes(1);
    })
  })

  describe('generateFinalReport', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })
    // Positive Scenarios
    it('generateFinalReport should stream line the input template', async () => {
      const runtimeInformation = {
        runDurationMs: 123
      }
      const inputTemplate = {
        test_cases: [
          {
            requests: [{
              name: 'request1',
              appended: {
                name: 'request1',
                request: {
                  tests: {
                    assertions: [
                      {
                        id: 1
                      }
                    ]
                  }
                },
                testResult: {
                  results: {
                    '1': {
                      status: 'SUCCESS'
                    }
                  },
                  passedCount: 5
                }
              }
            }]
          }
        ],
        name: 'report1'
      }
      const result = OutboundInitiator.generateFinalReport(inputTemplate, runtimeInformation)
      expect(result).toHaveProperty('name')
      expect(result).toHaveProperty('test_cases')
      expect(result).toHaveProperty('runtimeInformation')

      expect(result.name).toEqual('report1')
      expect(result.runtimeInformation).toHaveProperty('runDurationMs')
      expect(result.runtimeInformation.runDurationMs).toEqual(123)
      expect(result.test_cases.length).toBeGreaterThan(0)
      expect(result.test_cases[0]).toHaveProperty('requests')
      expect(result.test_cases[0].requests.length).toBeGreaterThan(0)

      expect(result.test_cases[0].requests[0]).toHaveProperty('name')
      expect(result.test_cases[0].requests[0]).toHaveProperty('request')
      expect(result.test_cases[0].requests[0].name).toEqual('request1') 

      expect(result.test_cases[0].requests[0].request).toHaveProperty('tests')
      expect(result.test_cases[0].requests[0].request.tests).toHaveProperty('assertions')
      expect(result.test_cases[0].requests[0].request.tests).toHaveProperty('passedAssertionsCount')
      expect(result.test_cases[0].requests[0].request.tests.assertions.length).toBeGreaterThan(0)
      expect(result.test_cases[0].requests[0].request.tests.assertions[0]).toHaveProperty('id')
      expect(result.test_cases[0].requests[0].request.tests.assertions[0]).toHaveProperty('resultStatus')
      expect(result.test_cases[0].requests[0].request.tests.assertions[0].resultStatus).toHaveProperty('status')
      expect(result.test_cases[0].requests[0].request.tests.assertions[0].resultStatus.status).toEqual('SUCCESS')


    })
  })

  describe('handleTests', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })
    // Positive Scenarios
    it('handleTests should execute test cases about request and return results', async () => {
      const sampleRequest = {
        body: {
          transactionId: '123'
        },
        tests: {
          assertions: [
            {
              id: 1,
              exec: [
                "expect(request.body.transactionId).to.equal('123')"
              ]
            }
          ]
        }
      }
      const testResult = await OutboundInitiator.handleTests(sampleRequest)
      expect(testResult.passedCount).toEqual(1)
    })
    it('handleTests should execute test cases about request and return results', async () => {
      const sampleRequest = {
        body: {
          transactionId: '123'
        },
        tests: {
          assertions: [
            {
              id: 1,
              exec: [
                "expect(request.body.transactionId).to.equal('123')"
              ]
            }
          ]
        }
      }
      const testResult = await OutboundInitiator.handleTests(sampleRequest)
      expect(testResult.passedCount).toEqual(1)
    })
    it('handleTests should return null if there is an error', async () => {
      const sampleRequest = {
        body: {
          transactionId: '123'
        },
        tests: {
          assertions: null
        }
      }
      const testResult = await OutboundInitiator.handleTests(sampleRequest)
      expect(testResult).toBeNull()
    })
    it('handleTests should execute test cases about response and return results', async () => {
      const sampleResponse = {
        body: {
          transactionId: '123'
        }
      }
      const sampleRequest = {
        tests: {
          assertions: [
            {
              id: 1,
              exec: [
                "expect(response.body.transactionId).to.equal('123')"
              ]
            }
          ]
        }
      }
      const testResult = await OutboundInitiator.handleTests(sampleRequest, sampleResponse)
      expect(testResult.passedCount).toEqual(1)
    })
    it('handleTests should execute test cases about callback and return results', async () => {
      const sampleCallback = {
        body: {
          transactionId: '123'
        }
      }
      const sampleRequest = {
        tests: {
          assertions: [
            {
              id: 1,
              exec: [
                "expect(callback.body.transactionId).to.equal('123')"
              ]
            }
          ]
        }
      }
      const testResult = await OutboundInitiator.handleTests(sampleRequest, null, sampleCallback)
      expect(testResult.passedCount).toEqual(1)
    })
    
    // Negative Scenarios
    it('handleTests test cases should be failed about request and return status as FAILED', async () => {
      const sampleRequest = {
        body: {
          transactionId: '123'
        },
        tests: {
          assertions: [
            {
              id: 1,
              exec: [
                "expect(request.body.transactionId).to.equal('3212')"
              ]
            }
          ]
        }
      }
      const testResult = await OutboundInitiator.handleTests(sampleRequest)
      expect(testResult.results['1'].status).toEqual('FAILED')
      expect(testResult.passedCount).toEqual(0)
    })
    it('handleTests test cases should be passed or failed about request and return appropriate passed count', async () => {
      const sampleRequest = {
        body: {
          transactionId: '123'
        },
        tests: {
          assertions: [
            {
              id: 1,
              exec: [
                "expect(request.body.transactionId).to.equal('123')",
                "expect(request.body.someProp).to.equal('321')"
              ]
            },
            {
              id: 2,
              exec: [
                "expect(request.body.transactionId).to.equal('123')"              ]
            },
            {
              id: 3,
              exec: [
                "expect(request.body.transactionId).to.equal('321')"              ]
            }
          ]
        }
      }
      const testResult = await OutboundInitiator.handleTests(sampleRequest)
      expect(testResult.results['1'].status).toEqual('FAILED')
      expect(testResult.results['2'].status).toEqual('SUCCESS')
      expect(testResult.results['3'].status).toEqual('FAILED')
      expect(testResult.passedCount).toEqual(1)
    })
  })
  describe('OutboundSend & OutboundSendLoop', () => {
    const sampleTemplate = {
      "inputValues": {
        "fromIdType": "MSISDN",
        "fromIdValue": "44123456789",
        "fromFirstName": "Firstname-Test",
        "fromLastName": "Lastname-Test",
        "fromDOB": "1984-01-01",
        "note": "test",
        "currency": "USD",
        "amount": "100",
        "homeTransactionId": "123ABC",
        "fromFspId": "testingtoolkitdfsp",
        "accept": "application/vnd.interoperability.parties+json;version=1.0",
        "contentType": "application/vnd.interoperability.parties+json;version=1.0",
        "toIdValue": "27713803912",
        "toIdType": "MSISDN",
        "toFspId": "payeefsp",
        "acceptQuotes": "application/vnd.interoperability.quotes+json;version=1.0",
        "contentTypeQuotes": "application/vnd.interoperability.quotes+json;version=1.0",
        "acceptTransfers": "application/vnd.interoperability.transfers+json;version=1.0",
        "contentTransfers": "application/vnd.interoperability.transfers+json;version=1.0",
        "hub_operator": "NOT_APPLICABLE",
        "payerfsp": "testingtoolkitdfsp",
        "accountId": "6",
        "payeefsp": "payeefsp",
        "HUB_OPERATOR_BEARER_TOKEN": "NOT_APPLICABLE",
        "BASE_CENTRAL_LEDGER_ADMIN": "",
        "payerIdType": "MSISDN",
        "payerIdentifier": "22507008181",
        "payeeIdType": "MSISDN",
        "payeeIdentifier": "22556999125"
      },
      "name": "multi",
      "test_cases": [
        {
          "id": 1,
          "name": "P2P Transfer Happy Path",
          "requests": [
            {
              "id": 1,
              "description": "Get party information",
              "apiVersion": {
                "minorVersion": 0,
                "majorVersion": 1,
                "type": "fspiop",
                "asynchronous": false
              },
              "operationPath": "/parties/{Type}/{ID}",
              "method": "get",
              "headers": {
                "Accept": "{$inputs.accept}",
                "Content-Type": "{$inputs.contentType}",
                "Date": "{$function.generic.curDate}",
                "FSPIOP-Source": "{$inputs.fromFspId}"
              },
              "params": {
                "Type": "{$inputs.toIdType}",
                "ID": "{$inputs.toIdValue}"
              },
              "tests": {
                "assertions": []
              },
              "scriptingEngine": "javascript",
              "ignoreCallbacks": true,
              "scripts": {
                "preRequest": {
                  "exec": [
                    "console.log('sample')"
                  ]
                },
                "postRequest": {
                  "exec": [
                    "console.log('sample')"
                  ]
                }
              }
            }
          ]
        }
      ]
    }
    beforeEach(() => {
      jest.resetAllMocks()
      SpySign.mockImplementation(async () => {throw new Error()})
      SpyAgent.mockImplementation(async () => {
        return {httpsAgent: {}}
      })
      SpyJwsSignWithKey.mockReturnValue( Promise.resolve() )
      SpyGetTlsConfig.mockResolvedValue({
        dfsps: {
          'userdfsp': {
            hubClientCert: 'cert',
            dfspServerCaRootCert: 'ca'
          }
        },
        hubClientKey: 'key'
      })
      SpyGetSystemConfig.mockReturnValue({
        "API_PORT": 4040,
        "HOSTING_ENABLED": false,
        "OUTBOUND_MUTUAL_TLS_ENABLED": true,
        "CONFIG_VERSIONS": {
          "response": 1,
          "callback": 1,
          "validation": 1,
          "forward": 1,
          "userSettings": 1
        },
        "DB": {
          "URI": "mongodb://mongo:27017/dfsps"
        },
        "OAUTH": {
          "AUTH_ENABLED": false,
          "APP_OAUTH_CLIENT_KEY": "asdf",
          "APP_OAUTH_CLIENT_SECRET": "asdf",
          "MTA_ROLE": "Application/MTA",
          "PTA_ROLE": "Application/PTA",
          "EVERYONE_ROLE": "Internal/everyone",
          "OAUTH2_ISSUER": "http://172.17.0.1:5050/api/oauth2/token",
          "EMBEDDED_CERTIFICATE": "password"
        },
        "API_DEFINITIONS": [
          {
            "type": "fspiop",
            "version": "1.0",
            "folderPath": "fspiop_1.0",
            "asynchronous": true
          },
          {
            "type": "fspiop",
            "version": "1.1",
            "folderPath": "fspiop_1.1",
            "asynchronous": true
          },
          {
            "type": "settlements",
            "version": "1.0",
            "folderPath": "settlements_1.0"
          },
          {
            "type": "central_admin",
            "version": "9.3",
            "folderPath": "central_admin_9.3"
          }
        ]
      })
      SpyGetUserConfig.mockResolvedValue({
        CALLBACK_ENDPOINT: 'http://localhost:4040',
        CALLBACK_TIMEOUT: 5000
      })
    })

    it('OutboundSend with javascript should not throw any error', async () => {
      axios.mockImplementation(() => Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: {},
        request: {
          toCurl: () => ''
        }
      }))
      SpyGetApiDefinitions.mockResolvedValue([{
        specFile: 'spec_files/api_definitions/fspiop_1.0/api_spec.yaml',
        type: 'fspiop'
      }])
      await expect(OutboundInitiator.OutboundSend(sampleTemplate)).resolves.not.toBeNull
    })
    it('OutboundSend with postman script should not throw any error', async () => {
      axios.mockImplementation(() => Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: {},
        request: {
          toCurl: () => ''
        }
      }))
      SpyGetApiDefinitions.mockResolvedValue([{
        specFile: 'spec_files/api_definitions/fspiop_1.0/api_spec.yaml',
        type: 'fspiop'
      }])
      sampleTemplate.test_cases[0].requests[0].scriptingEngine = 'postmanscript'
      await expect(OutboundInitiator.OutboundSend(sampleTemplate, '123')).resolves.not.toBeNull
    })
    it('OutboundSend with traceID 123', async () => {
      axios.mockImplementation(() => Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: {},
        request: {
          toCurl: () => ''
        }
      }))
      SpyGetApiDefinitions.mockResolvedValue([{
        specFile: 'spec_files/api_definitions/fspiop_1.0/api_spec.yaml',
        type: 'fspiop'
      }])
      await expect(OutboundInitiator.OutboundSend(sampleTemplate, '123')).resolves.not.toBeNull
    })
    it('OutboundSend with traceID aabb123aabb', async () => {
      axios.mockImplementation(() => Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: {},
        request: {
          toCurl: () => ''
        }
      }))
      SpyGetApiDefinitions.mockResolvedValue([{
        specFile: 'spec_files/api_definitions/fspiop_1.0/api_spec.yaml',
        type: 'fspiop'
      }])
      await expect(OutboundInitiator.OutboundSend(sampleTemplate, 'aabb123aabb')).resolves.not.toBeNull
    })
    it('OutboundSendLoop should not throw any error', async () => {
      axios.mockImplementation(() => Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: {},
        request: {
          toCurl: () => ''
        }
      }))
      SpyGetApiDefinitions.mockResolvedValue([{
        specFile: 'spec_files/api_definitions/fspiop_1.0/api_spec.yaml',
        type: 'fspiop'
      }])
      await expect(OutboundInitiator.OutboundSendLoop(sampleTemplate, '123', null, 2)).resolves.not.toBeNull
    })
    it('OutboundSend with disabled request', async () => {
      axios.mockImplementation(() => Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: {},
        request: {
          toCurl: () => ''
        }
      }))
      SpyGetApiDefinitions.mockResolvedValue([{
        specFile: 'spec_files/api_definitions/fspiop_1.0/api_spec.yaml',
        type: 'fspiop'
      }])
      const sampleTemplateModified1 = JSON.parse(JSON.stringify(sampleTemplate))
      sampleTemplateModified1.test_cases[0].requests[0].disabled = true
      await expect(OutboundInitiator.OutboundSend(sampleTemplateModified1, '123')).resolves.not.toBeNull
    })
    it('OutboundSend with delayed request', async () => {
      axios.mockImplementation(() => Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: {},
        request: {
          toCurl: () => ''
        }
      }))
      SpyGetApiDefinitions.mockResolvedValue([{
        specFile: 'spec_files/api_definitions/fspiop_1.0/api_spec.yaml',
        type: 'fspiop'
      }])
      const sampleTemplateModified2 = JSON.parse(JSON.stringify(sampleTemplate))
      sampleTemplateModified2.test_cases[0].requests[0].delay = 100
      await OutboundInitiator.OutboundSend(sampleTemplateModified2, '123')
    })
    it('OutboundSend with async requests', async () => {
      axios.mockImplementation(() => Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: {},
        request: {
          toCurl: () => ''
        }
      }))
      SpyReadFileAsync.mockResolvedValueOnce(JSON.stringify({
        "/parties/{Type}/{ID}": {
          "get": {
            "fspid": "{$request.headers.fspiop-source}",
            "successCallback": {
              "method": "put",
              "path": "/parties/{Type}/{ID}",
              "pathPattern": "/parties/{$request.params.Type}/{$request.params.ID}",
              "headerOverride": {
                "FSPIOP-Source": "asdf"
              },
              "bodyOverride": {
                "party": {
                  "partyIdInfo": {
                    "partyIdType": "asdf"
                  }
                }
              }
            },
            "errorCallback": {
              "method": "put",
              "path": "/parties/{Type}/{ID}/error",
              "pathPattern": "/parties/{$request.params.Type}/{$request.params.ID}/error",
              "headerOverride": {
                "FSPIOP-Source": "asdf"
              }
            }
          }
        }
      }))
      SpyGetApiDefinitions.mockResolvedValue([{
        specFile: 'spec_files/api_definitions/fspiop_1.0/api_spec.yaml',
        type: 'fspiop'
      }])
      const sampleTemplateModified3 = JSON.parse(JSON.stringify(sampleTemplate))
      sampleTemplateModified3.test_cases[0].requests[0].apiVersion.asynchronous = true      
      await expect(OutboundInitiator.OutboundSend(sampleTemplateModified3, '123')).resolves.not.toBeNull
    })

  })
  
  describe('terminateOutbound', () => {
    // Positive Scenarios
    it('terminateOutbound should terminate outbound', async () => {
      const terminateOutbound = OutboundInitiator.terminateOutbound('traceId')
      expect(terminateOutbound).toBeUndefined()
    })
  })
})
