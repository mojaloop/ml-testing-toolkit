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
const MyEventEmitter = require('../../../../src/lib/MyEventEmitter')

const SpyAgent = jest.spyOn(https, 'Agent')
const SpyGetTlsConfig = jest.spyOn(ConnectionProvider, 'getTlsConfig')
const SpyGetEndpointsConfig= jest.spyOn(ConnectionProvider, 'getEndpointsConfig')
const SpyGetUserConfig = jest.spyOn(Config, 'getUserConfig')
const SpyGetSystemConfig = jest.spyOn(Config, 'getSystemConfig')
const SpySign = jest.spyOn(JwsSigning, 'sign')



jest.mock('axios')


describe('Outbound Initiator Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  describe('getFunctionResult', () => {
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

  describe('replaceVariables', () => {
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
    it('replaceVariables should not replace previous response variables properly if key not matched', async () => {
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
          'FSPIOP-Destination': '{$prev.2.response.body.party.fspId}'
        }
      }
      const request = OutboundInitiator.replaceVariables(sampleRequest, null, null, responsesObject)
      expect(request.headers['FSPIOP-Destination']).toEqual('{$prev.2.response.body.party.fspId}')
    })
  })

  describe('sendRequest', () => {
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
      SpySign.mockReturnValueOnce( Promise.resolve() )
      SpyAgent.mockImplementationOnce(() => {
        return {httpsAgent: {}}
      })
      SpyGetTlsConfig.mockReturnValueOnce(Promise.resolve({
        dfsps: {
          'userdfsp': {
            hubClientCert: 'cert',
            dfspServerCaRootCert: 'ca'
          }
        },
        hubClientKey: 'key'
      }))
      SpyGetUserConfig.mockResolvedValueOnce({
        CALLBACK_ENDPOINT: 'http://localhost:5000',
        OUTBOUND_MUTUAL_TLS_ENABLED: true
      })
      SpyGetSystemConfig.mockReturnValueOnce({
        HOSTING_ENABLED: false
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
    it('sendRequest should call axios with appropriate params', async () => {
      axios.mockImplementation(() => Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: {},
        request: {
          toCurl: () => ''
        }
      }))
      SpySign.mockReturnValueOnce(Promise.resolve())
      SpyAgent.mockImplementationOnce(() => {
        return {httpsAgent: {}}
      })
      SpyGetTlsConfig.mockReturnValueOnce(Promise.resolve({
        dfsps: {
          'userdfsp': {
            hubClientCert: 'cert',
            dfspServerCaRootCert: 'ca'
          }
        },
        hubClientKey: 'key'
      }))
      SpyGetSystemConfig.mockReturnValueOnce({
        HOSTING_ENABLED: false
      })
      SpyGetUserConfig.mockResolvedValueOnce({
        CALLBACK_ENDPOINT: 'http://localhost:5000',
        OUTBOUND_MUTUAL_TLS_ENABLED: true,
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
    it('sendRequest should call axios with appropriate params', async () => {
      axios.mockImplementation(() => Promise.resolve({
        status: 300,
        statusText: 'OK',
        data: {},
        request: {
          toCurl: () => ''
        }
      }))
      SpySign.mockImplementationOnce(async () => {throw new Error()})
      SpyAgent.mockImplementationOnce(async () => {
        return {httpsAgent: {}}
      })
      SpyGetTlsConfig.mockResolvedValueOnce({
        dfsps: {
          'userdfsp': {
            hubClientCert: 'cert',
            dfspServerCaRootCert: 'ca'
          }
        },
        hubClientKey: 'key'
      })
      SpyGetUserConfig.mockResolvedValueOnce({
        CALLBACK_ENDPOINT: 'http://localhost:5000',
        OUTBOUND_MUTUAL_TLS_ENABLED: true,
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
      axios.mockClear()
      OutboundInitiator.sendRequest('localhost/', 'post', '/quotes', null, sampleRequest.headers, sampleRequest.body, 'successCallback', 'errorCallback', null, 'userdfsp')
      await new Promise(resolve => setTimeout(resolve, 1000))
      const testOutboundEmitter = MyEventEmitter.getEmitter('testOutbound')
      testOutboundEmitter.emit('successCallback')
      expect(axios).toHaveBeenCalledTimes(1);
    })
    it('sendRequest should call axios with appropriate params', async () => {
      axios.mockImplementation(() => Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: {},
        request: {
          toCurl: () => ''
        }
      }))
      SpySign.mockResolvedValueOnce()
      SpyAgent.mockImplementationOnce(() => {
        return {httpsAgent: {}}
      })
      SpyGetTlsConfig.mockResolvedValueOnce({
        dfsps: {
          'userdfsp': {
            hubClientCert: 'cert',
            dfspServerCaRootCert: 'ca'
          }
        },
        hubClientKey: 'key'
      })
      SpyGetSystemConfig.mockReturnValueOnce({
        HOSTING_ENABLED: false
      })
      SpyGetUserConfig.mockResolvedValueOnce({
        CALLBACK_ENDPOINT: 'http://localhost:5000',
        OUTBOUND_MUTUAL_TLS_ENABLED: true,
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
    it('sendRequest should call axios with appropriate params', async () => {
      axios.mockImplementation(() => Promise.reject({
        status: 300,
        statusText: 'OK',
        data: {},
        request: {
          toCurl: () => ''
        }
      }))
      SpySign.mockImplementationOnce(async () => {throw new Error()})
      SpyAgent.mockImplementationOnce(async () => {
        return {httpsAgent: {}}
      })
      SpyGetTlsConfig.mockResolvedValueOnce({
        dfsps: {
          'userdfsp': {
            hubClientCert: 'cert',
            dfspServerCaRootCert: 'ca'
          }
        },
        hubClientKey: 'key'
      })
      SpyGetSystemConfig.mockReturnValueOnce({
        HOSTING_ENABLED: false
      })
      SpyGetUserConfig.mockResolvedValueOnce({
        CALLBACK_ENDPOINT: 'http://localhost:5000',
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
        await OutboundInitiator.sendRequest('localhost/', 'post', '/quotes', null, sampleRequest.headers, sampleRequest.body, {}, {}, null, 'userdfsp')
      } catch (err) {}
      expect(axios).toHaveBeenCalledTimes(1);
    })
    it('sendRequest should call axios with appropriate params', async () => {
      axios.mockImplementation(() => Promise.reject({
        status: 300,
        statusText: 'OK',
        data: {},
        request: {
          toCurl: () => ''
        }
      }))
      SpySign.mockImplementationOnce(async () => {throw new Error()})
      SpyAgent.mockImplementationOnce(async () => {
        return {httpsAgent: {}}
      })
      SpyGetTlsConfig.mockResolvedValueOnce({
        dfsps: {
          'userdfsp': {
            hubClientCert: 'cert',
            dfspServerCaRootCert: 'ca'
          }
        },
        hubClientKey: 'key'
      })
      SpyGetSystemConfig.mockReturnValueOnce({
        HOSTING_ENABLED: true
      })
      SpyGetUserConfig.mockResolvedValueOnce({
        CALLBACK_ENDPOINT: 'http://localhost:5000',
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
        await OutboundInitiator.sendRequest('localhost/', 'post', '/quotes', null, sampleRequest.headers, sampleRequest.body, {}, {}, null, 'userdfsp')
      } catch (err) {}
      expect(axios).toHaveBeenCalledTimes(1);
    })
    it('sendRequest should call axios with appropriate params', async () => {
      axios.mockImplementation(() => Promise.reject({
        status: 300,
        statusText: 'OK',
        data: {},
        request: {
          toCurl: () => ''
        }
      }))
      SpySign.mockImplementationOnce(async () => {throw new Error()})
      SpyAgent.mockImplementationOnce(async () => {
        return {httpsAgent: {}}
      })
      SpyGetTlsConfig.mockResolvedValueOnce({
        dfsps: {
          'userdfsp': {
            hubClientCert: 'cert',
            dfspServerCaRootCert: 'ca'
          }
        },
        hubClientKey: 'key'
      })
      SpyGetSystemConfig.mockReturnValueOnce({
        HOSTING_ENABLED: true
      })
      SpyGetEndpointsConfig.mockResolvedValueOnce({
        dfspEndpoints: {
          'userdfsp': 'http://localhost:5000'
        }
      })
      SpyGetUserConfig.mockResolvedValueOnce({
        CALLBACK_ENDPOINT: 'http://localhost:5000',
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
      axios.mockClear()
      try {
        await OutboundInitiator.sendRequest('localhost/', 'post', '/quotes', null, sampleRequest.headers, sampleRequest.body, {}, {}, null, 'userdfsp')
      } catch (err) {}
      expect(axios).toHaveBeenCalledTimes(1);
    })
    it('sendRequest should call axios with appropriate params 12', async () => {
      SpyGetTlsConfig.mockResolvedValueOnce({
        dfsps: {
          'userdfsp': {
            hubClientCert: 'cert',
            dfspServerCaRootCert: 'ca'
          }
        },
        hubClientKey: 'key'
      })
      SpyGetUserConfig.mockResolvedValueOnce({
        CALLBACK_ENDPOINT: 'http://localhost:5000',
        OUTBOUND_MUTUAL_TLS_ENABLED: true
      })
      SpyGetSystemConfig.mockReturnValueOnce({
        HOSTING_ENABLED: true
      })
      SpyGetEndpointsConfig.mockResolvedValueOnce({
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
        await OutboundInitiator.sendRequest('localhost/', 'post', '/quotes', null, sampleRequest.headers, sampleRequest.body, null, null, null, 'notExistingDfsp')
      } catch (err) {}
    })
  })

  describe('generateFinalReport', () => {
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
  
  describe('terminateOutbound', () => {
    // Positive Scenarios
    it('terminateOutbound should terminate outbound', async () => {
      const terminateOutbound = OutboundInitiator.terminateOutbound('traceId')
      expect(terminateOutbound).toBeUndefined()
    })
  })
})
