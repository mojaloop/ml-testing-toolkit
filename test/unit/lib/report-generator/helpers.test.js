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
              { exec: 'assertion1' },
              { exec: 'assertion2' },
              { exec: 'assertion3' },
              { exec: 'assertion4' },
              { exec: 'assertion5' }
            ]
          }
        }
      },
      {
        request: {
          tests: {
            passedAssertionsCount: 3,
            assertions: [
              { exec: 'assertion1' },
              { exec: 'assertion2' },
              { exec: 'assertion3' }
            ]
          }
        }
      },
      {
        request: {
          tests: {
            passedAssertionsCount: 0,
            assertions: [
              { exec: 'assertion1' },
              { exec: 'assertion2' }
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
              { exec: 'assertion1' }
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

})