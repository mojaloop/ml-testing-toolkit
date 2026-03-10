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

const HandlebarHelpers = require('../../../../src/lib/report-generator/helpers')

const sampleTestCases  = [
  {
    requests: [
      {
        request: {
          tests: {
            passedAssertionsCount: 4,
            assertions: [
              { exec: 'assertion1', resultStatus: { status: 'SUCCESS' } },
              { exec: 'assertion2', resultStatus: { status: 'SUCCESS' } },
              { exec: 'assertion3', resultStatus: { status: 'SUCCESS' } },
              { exec: 'assertion4', resultStatus: { status: 'SUCCESS' } },
              { exec: 'assertion5', resultStatus: { status: 'FAILED' } }
            ]
          }
        }
      },
      {
        request: {
          tests: {
            passedAssertionsCount: 3,
            assertions: [
              { exec: 'assertion1', resultStatus: { status: 'SUCCESS' } },
              { exec: 'assertion2', resultStatus: { status: 'SUCCESS' } },
              { exec: 'assertion3', resultStatus: { status: 'SUCCESS' } }
            ]
          }
        }
      },
      {
        request: {
          tests: {
            passedAssertionsCount: 0,
            assertions: [
              { exec: 'assertion1', resultStatus: { status: 'FAILED' } },
              { exec: 'assertion2', resultStatus: { status: 'FAILED' } }
            ]
          }
        }
      }
    ]
  },
  {
    requests: [
      {
        request: {
          tests: {
            passedAssertionsCount: 1,
            assertions: [
              { exec: 'assertion1', resultStatus: { status: 'SUCCESS' } }
            ]
          }
        }
      },
      {
        request: {
          tests: {}
        }
      },
      {
        request: {}
      },
    ]
  }
]

describe('Handlebar Helper Functions', () => {
  describe('now', () => {
    it('should return a date', async () => {
      expect(HandlebarHelpers.now()).not.toBeNull()
    })
  })

  describe('totalAssertions', () => {
    it('should return total assertions', async () => {
      expect(HandlebarHelpers.totalAssertions(sampleTestCases)).toEqual(11)
    })
  })

  describe('totalPassedAssertions', () => {
    it('should return total passed assertions', async () => {
      expect(HandlebarHelpers.totalPassedAssertions(sampleTestCases)).toEqual(8)
    })

    it('should count only SUCCESS statuses', async () => {
      const input = [{
        requests: [{
          request: {
            tests: {
              assertions: [
                { resultStatus: { status: 'SUCCESS' } },
                { resultStatus: { status: 'FAILED' } },
                { resultStatus: { status: 'SKIPPED' } },
                { resultStatus: { status: 'UNKNOWN' } }
              ]
            }
          }
        }]
      }]
      expect(HandlebarHelpers.totalPassedAssertions(input)).toEqual(1)
    })

    it('should return 0 when tests/assertions are missing', async () => {
      const input = [{ requests: [{ request: { tests: {} } }, { request: {} }] }]
      expect(HandlebarHelpers.totalPassedAssertions(input)).toEqual(0)
    })
  })

  describe('totalSkippedAssertions', () => {
    it('should return total skipped assertions', async () => {
      const input = [{
        requests: [{
          request: {
            tests: {
              assertions: [
                { resultStatus: { status: 'SKIPPED' } },
                { resultStatus: { status: 'SUCCESS' } },
                { resultStatus: { status: 'SKIPPED' } }
              ]
            }
          }
        }]
      }]
      expect(HandlebarHelpers.totalSkippedAssertions(input)).toEqual(2)
    })

    it('should return 0 when tests/assertions are missing', async () => {
      const input = [{ requests: [{ request: { tests: {} } }, { request: {} }] }]
      expect(HandlebarHelpers.totalSkippedAssertions(input)).toEqual(0)
    })
  })

  describe('totalFailedAssertions', () => {
    it('should return total failed assertions', async () => {
      expect(HandlebarHelpers.totalFailedAssertions(sampleTestCases)).toEqual(3)
    })
  })

  describe('totalTestCases', () => {
    it('should return total testcases', async () => {
      expect(HandlebarHelpers.totalTestCases(sampleTestCases)).toEqual(2)
    })
  })

  describe('failedTestCases', () => {
    it('should return total failed test cases', async () => {
      expect(HandlebarHelpers.failedTestCases(sampleTestCases)).toEqual(1)
    })
  })

  describe('totalRequests', () => {
    it('should return total requests', async () => {
      expect(HandlebarHelpers.totalRequests(sampleTestCases)).toEqual(6)
    })
  })

  describe('failedRequests', () => {
    it('should return failed requests', async () => {
      expect(HandlebarHelpers.failedRequests(sampleTestCases)).toEqual(2)
    })
  })

  describe('testPassPercentage', () => {
    it('should return correct pass percentage', async () => {
      expect(HandlebarHelpers.testPassPercentage(sampleTestCases[0].requests[0].request.tests)).toEqual(80)
    })
    it('should return correct pass percentage', async () => {
      expect(HandlebarHelpers.testPassPercentage(sampleTestCases[0].requests[1].request.tests)).toEqual(100)
    })
    it('should return correct pass percentage', async () => {
      expect(HandlebarHelpers.testPassPercentage(sampleTestCases[0].requests[2].request.tests)).toEqual(0)
    })
    it('should return 100 pass percentage for empty tests', async () => {
      expect(HandlebarHelpers.testPassPercentage(null)).toEqual(100)
    })
  })

  describe('ifAllTestsPassedInRequest', () => {
    it('should return correct value', async () => {
      expect(HandlebarHelpers.ifAllTestsPassedInRequest(sampleTestCases[0].requests[0].request)).toEqual(false)
    })
    it('should return correct value', async () => {
      expect(HandlebarHelpers.ifAllTestsPassedInRequest(sampleTestCases[0].requests[1].request)).toEqual(true)
    })
    it('should return correct value', async () => {
      expect(HandlebarHelpers.ifAllTestsPassedInRequest(sampleTestCases[0].requests[2].request)).toEqual(false)
    })
    it('should return true if tests are null', async () => {
      expect(HandlebarHelpers.ifAllTestsPassedInRequest({})).toEqual(true)
    })
    it('should return true if assertions are null', async () => {
      expect(HandlebarHelpers.ifAllTestsPassedInRequest({tests:{}})).toEqual(true)
    })
  })

  describe('ifFailedTestCase', () => {
    it('should return true if test case is failed', async () => {
      expect(HandlebarHelpers.ifFailedTestCase(sampleTestCases[0])).toEqual(true)
    })
    it('should return false if test case is passed', async () => {
      expect(HandlebarHelpers.ifFailedTestCase(sampleTestCases[1])).toEqual(false)
    })
  })

  describe('ifSkippedRequest', () => {
    it('should return true if request is skipped', async () => {
      expect(HandlebarHelpers.ifSkippedRequest('SKIPPED')).toEqual(true)
    })
    it('should return false if request is executed', async () => {
      expect(HandlebarHelpers.ifSkippedRequest('ERROR')).toEqual(false)
    })
    it('should return false if status is null', async () => {
      expect(HandlebarHelpers.ifSkippedRequest(null)).toEqual(false)
    })
  })

  describe('requestSkippedAssertions', () => {
    it('should return skipped assertion count for request', async () => {
      const request = {
        tests: {
          assertions: [
            { resultStatus: { status: 'SKIPPED' } },
            { resultStatus: { status: 'SUCCESS' } },
            { resultStatus: { status: 'SKIPPED' } }
          ]
        }
      }

      expect(HandlebarHelpers.requestSkippedAssertions(request)).toEqual(2)
    })

    it('should return 0 for missing request/tests', async () => {
      expect(HandlebarHelpers.requestSkippedAssertions(null)).toEqual(0)
      expect(HandlebarHelpers.requestSkippedAssertions({})).toEqual(0)
    })
  })

  describe('testCaseMetaFields', () => {
    it('should flatten only fileInfo and meta fields', async () => {
      const testCase = {
        id: 1,
        name: 'Test Case',
        fileInfo: {
          path: 'collections/dfsp/p2p_failed_tests.json'
        },
        meta: {
          info: 'Party info with missing header',
          tags: ['negative', 'p2p']
        },
        options: {
          breakOnError: false
        }
      }

      expect(HandlebarHelpers.testCaseMetaFields(testCase)).toEqual([
        { key: 'fileInfo.path', value: 'collections/dfsp/p2p_failed_tests.json' },
        { key: 'meta.info', value: 'Party info with missing header' },
        { key: 'meta.tags', value: '["negative","p2p"]' }
      ])
    })

    it('should return empty for invalid input', async () => {
      expect(HandlebarHelpers.testCaseMetaFields(null)).toEqual([])
    })

    it('should ignore undefined nested metadata values', async () => {
      const testCase = {
        fileInfo: {
          path: 'collections/dfsp/p2p_failed_tests.json',
          optional: undefined
        },
        meta: {
          info: 'some info'
        }
      }

      expect(HandlebarHelpers.testCaseMetaFields(testCase)).toEqual([
        { key: 'fileInfo.path', value: 'collections/dfsp/p2p_failed_tests.json' },
        { key: 'meta.info', value: 'some info' }
      ])
    })
  })

  describe('jsonStringify', () => {
    it('should return strigified value of json', async () => {
      expect(HandlebarHelpers.jsonStringify({})).toEqual('{}')
    })
  })

  describe('isAssertionPassed', () => {
    it('should return strigified value of json', async () => {
      expect(HandlebarHelpers.isAssertionPassed('SUCCESS')).toEqual(true)
    })
  })

  describe('isAssertionSkipped', () => {
    it('should return strigified value of json', async () => {
      expect(HandlebarHelpers.isAssertionSkipped('SKIPPED')).toEqual(true)
    })
  })

  describe('sequenceNumber', () => {
    it('should return 1-based sequence number', async () => {
      expect(HandlebarHelpers.sequenceNumber(0)).toEqual(1)
      expect(HandlebarHelpers.sequenceNumber(4)).toEqual(5)
    })
  })

})