'use strict'

const OutboundInitiator = require('../../../../src/lib/test-outbound/outbound-initiator')
const axios = require('axios').default
jest.mock('axios')


describe('Outbound Initiator Functions', () => {
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
    // it('replaceRequestVariables should replace request variables properly incase the headers are referred using a special syntax', async () => {
    //   const sampleRequest = {
    //     headers: {
    //       'FSPIOP-Source': 'payerfsp',
    //       'source': '${request.headers.FSPIOP-Source}'
    //     }
    //   }
    //   const request = OutboundInitiator.replaceRequestVariables(sampleRequest)
    //   expect(request.headers.source).toEqual('payerfsp')
    // })
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
    // Positive Scenarios
    it('sendRequest should call axios with appropriate params', async () => {
      axios.mockImplementation(() => Promise.resolve(true))
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
      OutboundInitiator.sendRequest(sampleRequest)
      expect(axios).toHaveBeenCalledTimes(1);
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
})
