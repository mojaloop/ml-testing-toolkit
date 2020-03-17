'use strict'

const OutboundInitiator = require('../../../../src/lib/test-outbound/outbound-initiator')



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
  
  // describe('replaceVariables', () => {
  //   // Positive Scenarios
  //   it('replaceVariables should replace input variables, request properly', async () => {
  //     const sampleRequest = {
  //       headers: {
  //         'FSPIOP-Source': 'payerfsp',
  //         Date: '2020-01-01 01:01:01',
  //         TimeStamp: '{$request.headers.Date}'
  //       },
  //       body: {
  //         transactionId: '123',
  //         amount: {
  //           amount: '100',
  //           currency: 'USD'
  //         },
  //         transactionAmount: {
  //           amount: '{$request.body.amount.amount}',
  //           currency: '{$request.body.amount.currency}'
  //         }
  //       }
  //     }
  //     const request = OutboundInitiator.replaceVariables(sampleRequest)
  //     expect(request.body.transactionAmount.amount).toEqual('100')
  //     expect(request.body.transactionAmount.currency).toEqual('USD')
  //     expect(request.headers.TimeStamp).toEqual('2020-01-01 01:01:01')
  //   })
  //   // Negative Scenarios
  //   it('replaceVariables should not replace request variables which does not exist', async () => {
  //     const sampleRequest = {
  //       body: {
  //         transactionId: '123',
  //         transactionAmount: {
  //           amount: '{$request.body.amount.amount}',
  //           currency: '{$request.body.amount.currency}'
  //         }
  //       }
  //     }
  //     const request = OutboundInitiator.replaceRequestVariables(sampleRequest)
  //     expect(request.body.transactionAmount.amount).toEqual('{$request.body.amount.amount}')
  //     expect(request.body.transactionAmount.currency).toEqual('{$request.body.amount.currency}')
  //   })
  // })

})
