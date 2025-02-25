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

const Config = require('../../../../src/lib/config')
jest.mock('../../../../src/lib/config')
Config.getSystemConfig.mockReturnValue({
  OAUTH: {
    AUTH_ENABLED: false
  }
})
const request = require('supertest')
const apiServer = require('../../../../src/lib/api-server')
const reportGenerator = require('../../../../src/lib/report-generator/generator')
const requestLogger = require('../../../../src/lib/requestLogger')

const app = apiServer.getApp()

jest.mock('../../../../src/lib/report-generator/generator')
jest.mock('../../../../src/lib/requestLogger')

const properJsonReport = {
  name: 'dfsp-p2p-tests',
  inputValues: {
    fromIdType: 'MSISDN',
    fromIdValue: '44123456789',
    fromFirstName: 'Firstname-Test',
    fromLastName: 'Lastname-Test',
    fromDOB: '1984-01-01',
    note: 'Test Payment',
    currency: 'USD',
    amount: '100',
    homeTransactionId: '123ABC',
    fromFspId: 'testingtoolkitdfsp',
    accept: 'application/vnd.interoperability.parties+json;version=1.0',
    contentType: 'application/vnd.interoperability.parties+json;version=1.0',
    toIdValue: '9876543210',
    toIdType: 'MSISDN',
    toFspId: 'userdfsp',
    acceptQuotes: 'application/vnd.interoperability.quotes+json;version=1.0',
    contentTypeQuotes: 'application/vnd.interoperability.quotes+json;version=1.0',
    acceptTransfers: 'application/vnd.interoperability.transfers+json;version=1.0',
    contentTransfers: 'application/vnd.interoperability.transfers+json;version=1.0'
  },
  test_cases: [
    {
      id: 6,
      name: 'POST /quotes with wrong headers',
      requests: [
        {
          request: {
            id: 2,
            description: 'Get quote',
            apiVersion: {
              minorVersion: 0,
              majorVersion: 1,
              type: 'fspiop',
              asynchronous: true
            },
            operationPath: '/quotes',
            method: 'post',
            headers: {
              Accept: 'application/vnd.interoperability.quotes+json;version=1.0',
              'Content-Type': 'application/vnd.interoperability.quotes+json;version=1.0',
              Date: 'Mon, 11 May 2020 13:39:54 GMT',
              'FSPIOP-Source': 'testingtoolkitdfsp'
            },
            body: {
              quoteId: '61084f91-d13d-4443-a7ed-a493e0f72eb0',
              transactionId: '32b5c0de-f02a-4e33-b3f9-5efe9a9cc225',
              payer: {
                partyIdInfo: {
                  partyIdType: 'MSISDN',
                  partyIdentifier: '44123456789',
                  fspId: 'testingtoolkitdfsp'
                },
                personalInfo: {
                  complexName: {
                    firstName: 'Firstname-Test',
                    lastName: 'Lastname-Test'
                  },
                  dateOfBirth: '1984-01-01'
                }
              },
              payee: {
                partyIdInfo: {
                  partyIdType: 'MSISDN',
                  partyIdentifier: '9876543210',
                  fspId: 'testingtoolkitdfsp'
                }
              },
              amountType: 'SEND',
              amount: {
                amount: '100',
                currency: 'USD'
              },
              transactionType: {
                scenario: 'TRANSFER',
                initiator: 'PAYER',
                initiatorType: 'CONSUMER'
              },
              note: 'Test Payment'
            },
            tests: {
              assertions: [
                {
                  id: 1,
                  description: 'Response status to be 202',
                  exec: [
                    'expect(response.status).to.equal(202)'
                  ],
                  resultStatus: {
                    status: 'SUCCESS'
                  }
                }
              ],
              passedAssertionsCount: 1
            },
            params: {
              Type: 'MSISDN',
              ID: '9876543210'
            },
            path: '/quotes'
          },
          status: 'SUCCESS',
          response: {
            status: 202,
            statusText: 'Accepted',
            data: ''
          },
          callback: {
            headers: {
              'content-type': 'application/vnd.interoperability.quotes+json;version=1.0',
              date: 'Mon, 11 May 2020 13:39:54 GMT',
              'x-forwarded-for': 'adipisicing sint do culpa consectetur',
              'fspiop-source': 'testingtoolkitdfsp',
              'fspiop-destination': 'testingtoolkitdfsp',
              'fspiop-encryption': 'culpa exercitation est voluptate',
              'fspiop-signature': 'voluptate',
              'fspiop-uri': 'ut',
              'fspiop-http-method': 'fugiat id',
              'content-length': '654',
              'user-agent': 'axios/0.19.2',
              host: 'localhost:4040',
              connection: 'close'
            },
            body: {
              transferAmount: {
                currency: 'USD',
                amount: '100'
              },
              expiration: '3211-05-24T20:21:01.112Z',
              ilpPacket: 'AYGBAAAAAAAAJxAmZy50ZXN0aW5ndG9vbGtpdGRmc3AubXNpc2RuLjk4NDg2MTM2MTNQZXlKdGIyTnJSR0YwWVNJNklsUm9hWE1nYVhNZ1lTQjBaWE4wSUdSaGRHRWdabkp2YlNCelpXeG1JSFJsYzNScGJtY2dkRzl2Ykd0cGRDSjkA',
              condition: 'S0m9AC8s1D0XOyiP9gI-oxZedhY8ifjoT0N4PoOqkYM',
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
              },
              geoCode: {
                latitude: '90',
                longitude: '180'
              },
              extensionList: {
                extension: [
                  {
                    key: 'irure nostrud',
                    value: 'ad'
                  },
                  {
                    key: 'aute voluptate esse',
                    value: 'est'
                  }
                ]
              }
            }
          },
          additionalInfo: {
            curlRequest: 'curl \'http://localhost:4040/quotes\' -H \'content-type: application/vnd.interoperability.quotes+json;version=1.0\' -H \'accept: application/vnd.interoperability.quotes+json;version=1.0\' -H \'date: Mon, 11 May 2020 13:39:54 GMT\' -H \'fspiop-source: testingtoolkitdfsp\' -H \'user-agent: axios/0.19.2\' --data-binary \'{"quoteId":"61084f91-d13d-4443-a7ed-a493e0f72eb0","transactionId":"32b5c0de-f02a-4e33-b3f9-5efe9a9cc225","payer":{"partyIdInfo":{"partyIdType":"MSISDN","partyIdentifier":"44123456789","fspId":"testingtoolkitdfsp"},"personalInfo":{"complexName":{"firstName":"Firstname-Test","lastName":"Lastname-Test"},"dateOfBirth":"1984-01-01"}},"payee":{"partyIdInfo":{"partyIdType":"MSISDN","partyIdentifier":"9876543210","fspId":"testingtoolkitdfsp"}},"amountType":"SEND","amount":{"amount":"100","currency":"USD"},"transactionType":{"scenario":"TRANSFER","initiator":"PAYER","initiatorType":"CONSUMER"},"note":"Test Payment"}\' --compressed'
          }
        }
      ]
    }
  ],
  runtimeInformation: {
    completedTimeISO: '2020-05-11T13:39:54.987Z',
    startedTime: 'Mon, 11 May 2020 13:39:54 GMT',
    completedTime: 'Mon, 11 May 2020 13:39:54 GMT',
    runDurationMs: 179,
    avgResponseTime: 'NA'
  }
}

describe('API route /api/reports', () => {
  beforeAll(() => {
    jest.resetAllMocks()
    requestLogger.logMessage.mockReturnValue()
  })
  afterEach(() => {
    jest.resetAllMocks()
  })
  describe('POST /api/reports/testcase/:format', () => {
    it('Send a proper html request', async () => {
      reportGenerator.generateReport.mockImplementationOnce( () => {
        return Promise.resolve('asdf')
      })
      const res = await request(app).post(`/api/reports/testcase/html`).send(properJsonReport)
      expect(res.statusCode).toEqual(200)
      expect(res.text).toEqual('asdf')
    })
    it('Send a proper pdf request', async () => {
      reportGenerator.generateReport.mockImplementationOnce( () => {
        return Promise.resolve('asdf')
      })
      const res = await request(app).post(`/api/reports/testcase/pdf`).send(properJsonReport)
      expect(res.statusCode).toEqual(200)
      expect(res.text).toEqual('asdf')
    })
    it('Send a proper printhtml request', async () => {
      reportGenerator.generateReport.mockImplementationOnce( () => {
        return Promise.resolve('asdf')
      })
      const res = await request(app).post(`/api/reports/testcase/printhtml`).send(properJsonReport)
      expect(res.statusCode).toEqual(200)
      expect(res.text).toEqual('asdf')
    })
    it('Send a bad request html request', async () => {
      reportGenerator.generateReport.mockImplementationOnce( () => {
        return Promise.reject('asdf')
      })
      const {runtimeInformation, ...data} = properJsonReport
      const res = await request(app).post(`/api/reports/testcase/printhtml`).send(data)
      expect(res.statusCode).toEqual(500)
    })
  })

  describe('POST /api/reports/testcase_definition/:format', () => {
    it('Send a proper html request', async () => {
      reportGenerator.generateTestcaseDefinition.mockImplementationOnce( () => {
        return Promise.resolve('asdf')
      })
      const res = await request(app).post(`/api/reports/testcase_definition/html`).send({})
      expect(res.statusCode).toEqual(200)
      expect(res.text).toEqual('asdf')
    })
    it('Send a bad request html request', async () => {
      reportGenerator.generateTestcaseDefinition.mockImplementationOnce( () => {
        return Promise.reject('asdf')
      })
      const res = await request(app).post(`/api/reports/testcase_definition/html`).send({})
      expect(res.statusCode).toEqual(500)
    })
  })

})
