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

const path = require('path')
const IlpModel = require('../../../../../src/lib/mocking/middleware-functions/ilpModel')

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

const quotePartResponseBody = {
  transferAmount: {
    currency: 'USD',
    amount: '100'
  },
  expiration: '4000-02-29T06:02:18.220Z',
  payeeReceiveAmount: {
    currency: 'USD',
    amount: '123'
  },
  payeeFspFee: {
    currency: 'USD',
    amount: '2'
  },
  payeeFspCommission: {
    currency: 'USD',
    amount: '3'
  }
}

const transferPartRequestBody = {
  transferId: '49618fcc-8b13-49b1-8126-2a0cda6472ce',
  payeeFsp: 'testingtoolkitdfsp',
  payerFsp: 'userdfsp',
  amount: {
    currency: 'USD',
    amount: '100'
  },
  expiration: '2020-05-14T13:06:20.567Z'
}

const transferPartResponseBody = {
  transferState: 'COMMITTED',
  completedTimestamp: '3600-02-29T00:01:09.251+13:35'
}

const quoteISORequestBody = {
  "CdtTrfTxInf": {
    "DbtrAgt": {
      "FinInstnId": {
        "Othr": {
          "Id": "pinkbankfsp",
          "SchmeNm": {
            "Cd": "BDID"
          }
        }
      }
    },
    "CdtrAgt": {
      "FinInstnId": {
        "Othr": {
          "Id": "greenbankfsp",
          "SchmeNm": {
            "Cd": "BDID"
          }
        }
      }
    },
    "Dbtr": {
      "Name": "Test Debitor",
      "Id": {
        "PrvtId": {
          "DtAndPlcOfBirth": {
            "BirthDt": "2024-10-02T17:11:12.437Z"
          }
        },
        "OrgId": {
          "Othr": {
            "Id": "12345",
            "SchmeNm": {
              "Prtry": "ACCOUNT_ID"
            }
          }
        }
      }
    },
    "Cdtr": {
      "Name": "Test Creditor",
      "Id": {
        "PrvtId": {
          "DtAndPlcOfBirth": {
            "BirthDt": "2024-10-02T17:11:12.437Z"
          }
        },
        "OrgId": {
          "Othr": {
            "Id": "54321",
            "SchmeNm": {
              "Prtry": "ACCOUNT_ID"
            }
          }
        }
      }
    },
    "PmtId": {
      "TxId": "01J973DR9NR8A13YGCNH95CMPN",
      "InstrId": "01J973DR9NR8A13YGCNH95CMPP",
      "EndToEndId": "01J973DR9NR8A13YGCNH95CMPQ"
    },
    "IntrBkSttlmAmt": {
      "Ccy": "XTS",
      "ActiveCurrencyAndAmount": "100"
    },
    "InstdAmt": {
      "Ccy": "XTS",
      "ActiveOrHistoricCurrencyAndAmount": "100"
    }
  }
}

const quoteISOResponseBody = {
  "CdtTrfTxInf": {
    "PmtId": {
      "TxId": "01J973DR9NR8A13YGCNH95CMPN",
      "InstrId": "01J973DR9NR8A13YGCNH95CMPP",
      "EndToEndId": "01J973DR9NR8A13YGCNH95CMPQ"
    },
    "IntrBkSttlmAmt": {
      "Ccy": "XTS",
      "ActiveCurrencyAndAmount": "100"
    },
    "Cdtr": {
      "Nm": "Cdtr",
      "Id": {
        "OrgId": {
          "Othr": {
            "Id": "54321",
            "SchmeNm": {
              "Prtry": "ACCOUNT_ID"
            }
          }
        }
      }
    },
    "Dbtr": {
      "Nm": "Dbtr",
      "Id": {
        "OrgId": {
          "Othr": {
            "Id": "12345",
            "SchmeNm": {
              "Prtry": "ACCOUNT_ID"
            }
          }
        }
      }
    },
    "DbtrAgt": {
      "FinInstnId": {
        "Othr": {
          "Id": "DbtrAgt",
          "SchmeNm": {
            "Cd": "BDID"
          }
        }
      }
    },
    "CdtrAgt": {
      "FinInstnId": {
        "Othr": {
          "Id": "CdtrAgt",
          "SchmeNm": {
            "Cd": "BDID"
          }
        }
      }
    }
  }
}

const transferISORequestBody = {
  "CdtTrfTxInf": {
    "DbtrAgt": {
      "FinInstnId": {
        "Othr": {
          "Id": "pinkbankfsp",
          "SchmeNm": {
            "Cd": "BDID"
          }
        }
      }
    },
    "CdtrAgt": {
      "FinInstnId": {
        "Othr": {
          "Id": "greenbankfsp",
          "SchmeNm": {
            "Cd": "BDID"
          }
        }
      }
    },
    "Dbtr": {
      "Name": "Test Debitor",
      "Id": {
        "PrvtId": {
          "DtAndPlcOfBirth": {
            "BirthDt": "2024-10-02T17:11:12.437Z"
          }
        },
        "OrgId": {
          "Othr": {
            "Id": "12345",
            "SchmeNm": {
              "Prtry": "ACCOUNT_ID"
            }
          }
        }
      }
    },
    "Cdtr": {
      "Name": "Test Creditor",
      "Id": {
        "PrvtId": {
          "DtAndPlcOfBirth": {
            "BirthDt": "2024-10-02T17:11:12.437Z"
          }
        },
        "OrgId": {
          "Othr": {
            "Id": "54321",
            "SchmeNm": {
              "Prtry": "ACCOUNT_ID"
            }
          }
        }
      }
    },
    "PmtId": {
      "TxId": "01J973DR9NR8A13YGCNH95CMPN",
      "InstrId": "01J973DR9NR8A13YGCNH95CMPP",
      "EndToEndId": "01J973DR9NR8A13YGCNH95CMPQ"
    },
    "IntrBkSttlmAmt": {
      "Ccy": "XTS",
      "ActiveCurrencyAndAmount": "100"
    },
    "InstdAmt": {
      "Ccy": "XTS",
      "ActiveOrHistoricCurrencyAndAmount": "100"
    }
  }
}

const transferISOResponseBody = {
  "TxInfAndSts": {
    "StsId": "01J973DRJ5PRNDPVNHHN3RE4ZT",
    "OrgnlInstrId": "01J8RG72ZT6DP73KKGMASRBF0F",
    "OrgnlEndToEndId": "01J8RG72ZT6DP73KKGMASRBF0F",
    "OrgnlTxId": "01J973DR9NR8A13YGCNH95CMPQ",
    "OrgnlUETR": "123e4567-e89b-12d3-a456-426614174000",
    "TxSts": "ACPT",
    "StsRsnInf": {
      "Rsn": {
        "Prtry": "ACPT"
      },
      "AddtlInf": "ADDITIONAL"
    },
    "AccptncDtTm": "2024-10-02T17:11:12.708Z",
    "AcctSvcrRef": "ACCTSVCRREF",
    "ClrSysRef": "CLRSYSREF",
    "SplmtryData": {
      "PlcAndNm": "PLACE",
      "Envlp": {}
    }
  }
}

const wrongIlpPacket = 'AYIDNQAAAAAAAE4gImcudGVzdGluZ3Rvb2xraXRkZnNwLm1zaXNkbi4wMDAxMTGCAwZleUowY21GdWMyRmpkR2x2Ymtsa0lqb2lOVGcyTjJJM09EVXRZMk14TnkwMFpUVTVMVGs1WWpVdE0yWTFNVFptTkRNNE9USmtJaXdpY1hWdmRHVkpaQ0k2SWpjMk1UWmhNbU14TFRBek1qQXROREpqT0MxaE9USXpMVFJrWTJFNU9XTTJOREF5TkNJc0luQmhlV1ZsSWpwN0luQmhjblI1U1dSSmJtWnZJanA3SW5CaGNuUjVTV1JVZVhCbElqb2lUVk5KVTBST0lpd2ljR0Z5ZEhsSlpHVnVkR2xtYVdWeUlqb2lNREF3TVRFeElpd2labk53U1dRaU9pSjBaWE4wYVc1bmRHOXZiR3RwZEdSbWMzQWlmU3dpY0dWeWMyOXVZV3hKYm1adklqcDdJbU52YlhCc1pYaE9ZVzFsSWpwN0ltWnBjbk4wVG1GdFpTSTZJa1JoYm1sbGJDSXNJbTFwWkdSc1pVNWhiV1VpT2lKVElpd2liR0Z6ZEU1aGJXVWlPaUpTYjJSeWFXZDFaWG9pZlN3aVpHRjBaVTltUW1seWRHZ2lPaUl4T1RneExURXdMVEU0SW4xOUxDSndZWGxsY2lJNmV5SndZWEowZVVsa1NXNW1ieUk2ZXlKd1lYSjBlVWxrVkhsd1pTSTZJazFUU1ZORVRpSXNJbkJoY25SNVNXUmxiblJwWm1sbGNpSTZJakV5TXpRMU5pSXNJbVp6Y0Vsa0lqb2lkWE5sY21SbWMzQWlmU3dpYm1GdFpTSTZJa3B2YUc0Z1NtOW9ibk52YmlKOUxDSmhiVzkxYm5RaU9uc2lZM1Z5Y21WdVkza2lPaUpWVTBRaUxDSmhiVzkxYm5RaU9pSXlNREFpZlN3aWRISmhibk5oWTNScGIyNVVlWEJsSWpwN0luTmpaVzVoY21sdklqb2lWRkpCVGxOR1JWSWlMQ0pwYm1sMGFXRjBiM0lpT2lKUVFWbEZVaUlzSW1sdWFYUnBZWFJ2Y2xSNWNHVWlPaUpEVDA1VFZVMUZVaUo5ZlEA'

describe('ILP Model', () => {
  IlpModel.init('secret')
  describe('handleQuoteIlp and handleTransferIlp', () => {
    let ilpPacket
    let condition
    let fulfilment
    let isoFulfilment
    let IlpV4PrepPacket
    it('handleQuoteIlp should append ip packet and condition', () => {
      const sampleContext = {
        request: {
          method: 'post',
          path: '/quotes',
          body: {...quoteRequestBody}
        }
      }
      let response = {
        method: 'put',
        path: '/quotes/f27456e9-fffb-47c0-9f28-5c727434873d',
        body: {...quotePartResponseBody}
      }
      fulfilment = IlpModel.handleQuoteIlp(sampleContext, response)
      ilpPacket = response.body.ilpPacket
      condition = response.body.condition
      expect(response.body).toHaveProperty('ilpPacket')
      expect(response.body).toHaveProperty('condition')
      expect(fulfilment.length).toBeGreaterThan(5)
    })
    it('handleQuoteIlp should append ip packet for ISO20022', () => {
      const sampleContext = {
        request: {
          method: 'post',
          path: '/quotes',
          body: {...quoteISORequestBody}
        }
      }
      let response = {
        method: 'put',
        path: '/quotes/f27456e9-fffb-47c0-9f28-5c727434873d',
        body: {...quoteISOResponseBody}
      }
      isoFulfilment = IlpModel.handleQuoteIlp(sampleContext, response)
      IlpV4PrepPacket = response.body.CdtTrfTxInf.VrfctnOfTerms.IlpV4PrepPacket
      expect(response.body.CdtTrfTxInf.VrfctnOfTerms).toHaveProperty('IlpV4PrepPacket')
      expect(isoFulfilment.length).toBeGreaterThan(5)
    })

    it('handleQuoteIlp should not append ilpPacket and condition when ilpPacket is provided in rule eventInfo', () => {
      const sampleContext = {
        request: {
          method: 'post',
          path: '/quotes',
          body: {...quoteRequestBody}
        }
      }
      const response = {
        method: 'put',
        path: '/quotes/f27456e9-fffb-47c0-9f28-5c727434873d',
        body: {...quotePartResponseBody},
        eventInfo: {
          params: {
            body: {
              ilpPacket: 'something'
            }
          }
        }
      }
      const fulfilment1 = IlpModel.handleQuoteIlp(sampleContext, response)
      expect(response.body).not.toHaveProperty('ilpPacket')
      expect(response.body).not.toHaveProperty('condition')
      expect(fulfilment1).toBe(null)
    })
    it('handleQuoteIlp should not append ilpPacket and condition when condition is provided in rule eventInfo', () => {
      const sampleContext = {
        request: {
          method: 'post',
          path: '/quotes',
          body: {...quoteRequestBody}
        }
      }
      const response = {
        method: 'put',
        path: '/quotes/f27456e9-fffb-47c0-9f28-5c727434873d',
        body: {...quotePartResponseBody},
        eventInfo: {
          params: {
            body: {
              condition: 'something'
            }
          }
        }
      }
      const fulfilment1 = IlpModel.handleQuoteIlp(sampleContext, response)
      expect(response.body).not.toHaveProperty('ilpPacket')
      expect(response.body).not.toHaveProperty('condition')
      expect(fulfilment1).toBe(null)
    })
    it('handleQuoteIlp should return null', () => {
      const sampleContext = {
        request: {
          method: 'put',
          path: '/quotes',
          body: {...quoteRequestBody}
        }
      }
      let response = {
        method: 'put',
        path: '/quotes/f27456e9-fffb-47c0-9f28-5c727434873d',
        body: {...quotePartResponseBody}
      }
      const fulfilment1 = IlpModel.handleQuoteIlp(sampleContext, response)
      expect(fulfilment1).toBe(null)
    })
    it('handleTransferIlp should append fulfilment', () => {
      const sampleContext = {
        request: {
          body: {
            ...transferPartRequestBody,
            ilpPacket: ilpPacket
          },
          method: 'post'
        }
      }
      const response = {
        method: 'put',
        path: '/transfers/asdfasdf',
        body: {...transferPartResponseBody}
      }
      IlpModel.handleTransferIlp(sampleContext, response)
      expect(response.body).toHaveProperty('fulfilment')
      expect(response.body.fulfilment).toEqual(fulfilment)
    })
    it('handleTransferIlp should appent fulfilment for ISO20022', () => {
      const sampleContext = {
        request: {
          body: {
            ...transferISORequestBody,
          },
          method: 'post'
        }
      }
      sampleContext.request.body.CdtTrfTxInf.VrfctnOfTerms = {
        IlpV4PrepPacket
      }
      const response = {
        method: 'put',
        path: '/transfers/asdfasdf',
        body: {...transferISOResponseBody}
      }
      IlpModel.handleTransferIlp(sampleContext, response)
      console.log(response.body)
      expect(response.body.TxInfAndSts.ExctnConf).toEqual(isoFulfilment)
    })

    it('handleTransferIlp should not append fulfilment for get requests', () => {
      const sampleContext = {
        request: {
          method: 'get'
        }
      }
      const response = {
        method: 'put',
        path: '/transfers/asdfasdf',
        body: {...transferPartResponseBody}
      }
      IlpModel.handleTransferIlp(sampleContext, response)
      expect(response.body).not.toHaveProperty('fulfilment')
    })
    it('handleTransferIlp should not append fulfilment when fulfilment is provided in rule eventInfo', () => {
      const sampleContext = {
        request: {
          body: {
            ...transferPartRequestBody,
            ilpPacket: ilpPacket
          },
          method: 'post'
        }
      }
      const response = {
        method: 'put',
        path: '/transfers/asdfasdf',
        body: {...transferPartResponseBody},
        eventInfo: {
          params: {
            body: {
              fulfilment: 'something'
            }
          }
        }
      }
      IlpModel.handleTransferIlp(sampleContext, response)
      expect(response.body).not.toHaveProperty('fulfilment')
    })
    it('validateTransferIlpPacket should validate the ilpPacket', () => {
      const sampleRequest = {
        payload: {
          ...transferPartRequestBody,
          ilpPacket: ilpPacket
        },
        method: 'post',
        path: '/transfers',
        customInfo: {
          sessionID: '123'
        }
      }
      const sampleContext = {
        request: sampleRequest
      }
      const result = IlpModel.validateTransferIlpPacket(sampleContext, sampleRequest)
      expect(result).toBe(true)
    })
    it('validateTransferIlpPacket should validate the ilpPacket for ISO20022', () => {
      const sampleRequest = {
        payload: {
          ...transferISORequestBody
        },
        method: 'post',
        path: '/transfers',
        customInfo: {
          sessionID: '123'
        }
      }
      sampleRequest.payload.CdtTrfTxInf.VrfctnOfTerms = {
        IlpV4PrepPacket
      }
      const sampleContext = {
        request: sampleRequest
      }
      const result = IlpModel.validateTransferIlpPacket(sampleContext, sampleRequest)
      expect(result).toBe(true)
    })

    it('validateTransferIlpPacket should fail with wrong ilpPacket', () => {
      const sampleRequest = {
        payload: {
          ...transferPartRequestBody,
          ilpPacket: wrongIlpPacket
        },
        method: 'post',
        path: '/transfers',
        customInfo: {
          sessionID: '123'
        }
      }
      const sampleContext = {
        request: sampleRequest
      }
      const result = IlpModel.validateTransferIlpPacket(sampleContext, sampleRequest)
      expect(result).toBe(false)
    })
    it('validateTransferIlpPacket should fail with improper ilpPacket', () => {
      const sampleRequest = {
        payload: {
          ...transferPartRequestBody,
          ilpPacket: 'asdf'
        },
        method: 'post',
        path: '/transfers',
        customInfo: {
          sessionID: '123'
        }
      }
      const sampleContext = {
        request: sampleRequest
      }
      const result = IlpModel.validateTransferIlpPacket(sampleContext, sampleRequest)
      expect(result).toBe(false)
    })
    it('validateTransferIlpPacket should return true', () => {
      const sampleRequest = {
        payload: {
          ...transferPartRequestBody,
          ilpPacket: 'asdf'
        },
        method: 'put',
        path: '/transfers',
        customInfo: {
          sessionID: '123'
        }
      }
      const sampleContext = {
        request: sampleRequest
      }
      const result = IlpModel.validateTransferIlpPacket(sampleContext, sampleRequest)
      expect(result).toBe(true)
    })
    it('validateTransferCondition should validate the ilpPacket', () => {
      const sampleRequest = {
        payload: {
          ...transferPartRequestBody,
          ilpPacket: ilpPacket,
          condition: condition
        },
        method: 'post',
        path: '/transfers',
        customInfo: {
          sessionID: '123'
        }
      }
      const sampleContext = {
        request: sampleRequest
      }
      const result = IlpModel.validateTransferCondition(sampleContext, sampleRequest)
      expect(result).toBe(true)
    })
    it('validateTransferCondition should validate the ilpPacket', () => {
      const sampleRequest = {
        payload: {
          ...transferISORequestBody,
        },
        method: 'post',
        path: '/transfers',
        customInfo: {
          sessionID: '123'
        }
      }
      sampleRequest.payload.CdtTrfTxInf.VrfctnOfTerms = {
        IlpV4PrepPacket
      }
      const sampleContext = {
        request: sampleRequest
      }
      const result = IlpModel.validateTransferCondition(sampleContext, sampleRequest)
      expect(result).toBe(true)
    })
    it('validateTransferCondition should validate the ilpPacket against stored fulfilment', () => {
      const sampleRequest = {
        payload: {
          ...transferPartRequestBody,
          ilpPacket: ilpPacket,
          condition: condition
        },
        method: 'post',
        path: '/transfers',
        customInfo: {
          sessionID: '123',
          storedTransaction: {
            fulfilment: fulfilment
          }
        }
      }
      const sampleContext = {
        request: sampleRequest
      }
      const result = IlpModel.validateTransferCondition(sampleContext, sampleRequest)
      expect(result).toBe(true)
    })
    it('validateTransferCondition should fail with wrong condition', () => {
      const sampleRequest = {
        payload: {
          ...transferPartRequestBody,
          ilpPacket: ilpPacket,
          condition: 'asdf'
        },
        method: 'post',
        path: '/transfers',
        customInfo: {
          sessionID: '123'
        }
      }
      const sampleContext = {
        request: sampleRequest
      }
      const result = IlpModel.validateTransferCondition(sampleContext, sampleRequest)
      expect(result).toBe(false)
    })
    it('validateTransferCondition should fail with wrong condition if calculateFulfil throws an error', () => {
      const sampleRequest = {
        method: 'post',
        path: '/transfers',
        customInfo: {
          sessionID: '123'
        }
      }
      const sampleContext = {
        request: sampleRequest
      }
      const result = IlpModel.validateTransferCondition(sampleContext, sampleRequest)
      expect(result).toBe(false)
    })
    it('validateTransferCondition should fail with wrong condition if calculateFulfil throws an error', () => {
      const sampleRequest = {
        method: 'post',
        path: '/transfers',
        customInfo: {
          sessionID: '123',
          storedTransaction: {
            fulfilment: {}
          }
        }
      }
      const sampleContext = {
        request: sampleRequest
      }
      const result = IlpModel.validateTransferCondition(sampleContext, sampleRequest)
      expect(result).toBe(false)
    })
    it('validateTransferCondition should return true if method is not post', () => {
      const sampleRequest = {
        method: 'put',
        path: '/transfers',
        customInfo: {
          sessionID: '123'
        }
      }
      const sampleContext = {
        request: sampleRequest
      }
      const result = IlpModel.validateTransferCondition(sampleContext, sampleRequest)
      expect(result).toBe(true)
    })
    it('getIlpTransactionObject should return transaction object', () => {

      const transactionObject = IlpModel.getIlpTransactionObject(ilpPacket)
      expect(transactionObject).toHaveProperty('transactionId')
      expect(transactionObject).toHaveProperty('payee')
      expect(transactionObject).toHaveProperty('payer')
      expect(transactionObject).toHaveProperty('amount')
      expect(transactionObject).toHaveProperty('quoteId')
    })
  })
})
