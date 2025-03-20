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
 * Vijaya Kumar Guthi <vijaya.guthi@modusbox.com> (Original Author)
 --------------
 ******/

const ReportGenerator = require('../../../../src/lib/report-generator/generator')
const Utils = require('../../../../src/lib/utils')
const Handlebars = require('handlebars')
const SpyReadFileAsync = jest.spyOn(Utils, 'readFileAsync')
const HandlebarsCompile = jest.spyOn(Handlebars, 'compile')

const sampleJsonReport  = {

}

const properJsonTestTemplate = {
  name: 'sample',
  test_cases: [
    {
      id: 1,
      name: 'POST /quotes with wrong headers',
      meta: {
        info: 'POST /quotes with wrong headers'
      },
      requests: [
        {
          request: {
            id: 1,
            meta: {
              info: 'Get quote'
            },
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
          }
        }
      ]
    }
  ]
}

SpyReadFileAsync.mockResolvedValue(JSON.stringify({}))


describe('Report Generator', () => {
  describe('Initialize with Handlebars compile error', () => {
    it('initialize', async () => {
      HandlebarsCompile.mockReturnValue(null)
      await ReportGenerator.initialize()
    })
    it('generateReport should throw error', async () => {
      HandlebarsCompile.mockReturnValue(null)
      await expect(ReportGenerator.generateReport(sampleJsonReport, 'html')).rejects.toThrowError()
    })
  })

  describe('With erroneos templateHandle function', () => {
    it('initialize should not throw error on empty template file and should call HandlebarsCompile', async () => {
      HandlebarsCompile.mockReset()
      HandlebarsCompile.mockReturnValue((data, options) => {
        throw new Error('Some error')
      })
      await ReportGenerator.initialize()
      expect(HandlebarsCompile).toHaveBeenCalledTimes(3);
    })

    it('generateReport should not throw error for format html', async () => {
      await expect(ReportGenerator.generateReport(sampleJsonReport, 'html')).rejects.toThrowError()
    })
  })

  describe('Happy Path', () => {
    it('initialize should not throw error on empty template file and should call HandlebarsCompile', async () => {
      HandlebarsCompile.mockReset()
      HandlebarsCompile.mockReturnValue((data, options) => {
        // Some functions
      })
      await ReportGenerator.initialize()
      expect(HandlebarsCompile).toHaveBeenCalledTimes(3);
    })

    it('generateReport should not throw error for format html', async () => {
      await expect(ReportGenerator.generateReport(sampleJsonReport, 'html')).resolves.toBeUndefined()
    })
    it('generateReport should not throw error for format pdf', async () => {
      await expect(ReportGenerator.generateReport(sampleJsonReport, 'pdf')).resolves.toBeUndefined()
    })
    it('generateReport should not throw error for format printhtml', async () => {
      await expect(ReportGenerator.generateReport(sampleJsonReport, 'printhtml')).resolves.toBeUndefined()
    })
  })
})

describe('Testcase Definition Generator', () => {
  describe('Happy Path', () => {
    it('generateTestcaseDefinition should not throw error for format html', async () => {
      await expect(ReportGenerator.generateTestcaseDefinition(sampleJsonReport, 'html')).resolves.toBeUndefined()
    })
    it('generateTestcaseDefinition should not throw error for format pdf', async () => {
      await expect(ReportGenerator.generateTestcaseDefinition(sampleJsonReport, 'pdf')).resolves.toBeUndefined()
    })
    it('generateTestcaseDefinition should not throw error for format printhtml', async () => {
      await expect(ReportGenerator.generateTestcaseDefinition(sampleJsonReport, 'printhtml')).resolves.toBeUndefined()
    })
  })
})