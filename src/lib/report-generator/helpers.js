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

const now = () => {
  return new Date().toLocaleDateString()
}

const totalAssertions = (testCases) => {
  return testCases.reduce((total, curTestCase) => {
    const assertionsInRequest = curTestCase.requests.reduce((assertionCountRequest, curRequest) => {
      return assertionCountRequest + ((curRequest.request.tests && curRequest.request.tests.assertions) ? curRequest.request.tests.assertions.length : 0)
    }, 0)
    return total + assertionsInRequest
  }, 0)
}

const totalPassedAssertions = (testCases) => {
  return testCases.reduce((total, curTestCase) => {
    const passedAssertionsInRequest = curTestCase.requests.reduce((passedAssertionCountRequest, curRequest) => {
      return passedAssertionCountRequest + ((curRequest.request.tests && curRequest.request.tests.passedAssertionsCount) ? curRequest.request.tests.passedAssertionsCount : 0)
    }, 0)
    return total + passedAssertionsInRequest
  }, 0)
}

const skippedAssertionsInTests = (tests) => {
  if (!tests || !Array.isArray(tests.assertions)) {
    return 0
  }

  return tests.assertions.reduce((count, assertion) => {
    return count + ((assertion.resultStatus && assertion.resultStatus.status === 'SKIPPED') ? 1 : 0)
  }, 0)
}

const totalSkippedAssertions = (testCases) => {
  return testCases.reduce((total, curTestCase) => {
    const skippedAssertionsInRequest = curTestCase.requests.reduce((skippedAssertionCountRequest, curRequest) => {
      return skippedAssertionCountRequest + skippedAssertionsInTests(curRequest.request.tests)
    }, 0)

    return total + skippedAssertionsInRequest
  }, 0)
}

const totalFailedAssertions = (testCases) => {
  return testCases.reduce((total, curTestCase) => {
    const failedAssertionsInRequest = curTestCase.requests.reduce((failedAssertionCountRequest, curRequest) => {
      const tests = curRequest.request.tests

      if (!tests || !Array.isArray(tests.assertions)) {
        return failedAssertionCountRequest
      }

      const failedCountByStatus = tests.assertions.reduce((count, assertion) => {
        const status = assertion.resultStatus && assertion.resultStatus.status

        if (status === 'SUCCESS' || status === 'SKIPPED') {
          return count
        }

        return count + 1
      }, 0)

      // Fallback for legacy payloads where status is missing.
      if (failedCountByStatus === 0 && Number.isInteger(tests.passedAssertionsCount)) {
        return failedAssertionCountRequest + Math.max(tests.assertions.length - tests.passedAssertionsCount, 0)
      }

      return failedAssertionCountRequest + failedCountByStatus
    }, 0)

    return total + failedAssertionsInRequest
  }, 0)
}

const requestSkippedAssertions = (request) => {
  return skippedAssertionsInTests(request && request.tests)
}

const totalTestCases = (testCases) => {
  return testCases.length
}

const failedTestCases = (testCases) => {
  return testCases.reduce((total, curTestCase) => {
    const assertionsInRequest = curTestCase.requests.reduce((assertionCountRequest, curRequest) => {
      return assertionCountRequest + ((curRequest.request.tests && curRequest.request.tests.assertions) ? curRequest.request.tests.assertions.length : 0)
    }, 0)
    const passedAssertionsInRequest = curTestCase.requests.reduce((passedAssertionCountRequest, curRequest) => {
      return passedAssertionCountRequest + ((curRequest.request.tests && curRequest.request.tests.passedAssertionsCount) ? curRequest.request.tests.passedAssertionsCount : 0)
    }, 0)
    return total + (passedAssertionsInRequest === assertionsInRequest ? 0 : 1)
  }, 0)
}

const totalRequests = (testCases) => {
  return testCases.reduce((total, curTestCase) => {
    return total + curTestCase.requests.length
  }, 0)
}

const failedRequests = (testCases) => {
  return testCases.reduce((total, curTestCase) => {
    const faileRequestsCount = curTestCase.requests.reduce((failedRequestCountTemp, curRequest) => {
      return failedRequestCountTemp + ((curRequest.request.tests && curRequest.request.tests.assertions) ? (curRequest.request.tests.assertions.length === curRequest.request.tests.passedAssertionsCount ? 0 : 1) : 0)
    }, 0)
    return total + faileRequestsCount
  }, 0)
}

const testPassPercentage = (tests) => {
  if (tests && tests.assertions) {
    return Math.round(tests.passedAssertionsCount * 100 / tests.assertions.length)
  } else {
    return 100
  }
}

const ifAllTestsPassedInRequest = (request) => {
  if (request.tests && request.tests.assertions) {
    return request.tests.passedAssertionsCount === request.tests.assertions.length
  } else {
    return true
  }
}

const ifFailedTestCase = (testCase) => {
  const failedRequest = testCase.requests.find((item) => {
    if (item.request.tests && item.request.tests.assertions) {
      return item.request.tests.passedAssertionsCount !== item.request.tests.assertions.length
    } else {
      return false
    }
  })
  if (failedRequest) {
    return true
  } else {
    return false
  }
}

const ifSkippedRequest = (status) => {
  if (status && status === 'SKIPPED') {
    return true
  } else {
    return false
  }
}

const jsonStringify = (inputObject) => {
  return JSON.stringify(inputObject, null, 2)
}

const isAssertionPassed = (status) => {
  return status === 'SUCCESS'
}

const isAssertionSkipped = (status) => {
  return status === 'SKIPPED'
}

module.exports = {
  now,
  totalAssertions,
  totalPassedAssertions,
  totalSkippedAssertions,
  totalFailedAssertions,
  totalTestCases,
  failedTestCases,
  totalRequests,
  failedRequests,
  testPassPercentage,
  ifAllTestsPassedInRequest,
  ifFailedTestCase,
  jsonStringify,
  isAssertionPassed,
  isAssertionSkipped,
  requestSkippedAssertions,
  ifSkippedRequest
}
