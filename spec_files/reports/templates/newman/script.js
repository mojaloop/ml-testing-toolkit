function now() {
  return new Date().toLocaleDateString()
}

function totalAssertions(test_cases) {
  return test_cases.reduce((total, curTestCase) => {
      const assertionsInRequest = curTestCase.requests.reduce((assertionCountRequest, curRequest) => {
          return assertionCountRequest + ((curRequest.request.tests && curRequest.request.tests.assertions)? curRequest.request.tests.assertions.length : 0)
      }, 0)
      return total + assertionsInRequest
  }, 0)
}

function totalPassedAssertions(test_cases) {
  return test_cases.reduce((total, curTestCase) => {
      const assertionsInRequest = curTestCase.requests.reduce((assertionCountRequest, curRequest) => {
          return assertionCountRequest + ((curRequest.request.tests && curRequest.request.tests.assertions)? curRequest.request.tests.assertions.length : 0)
      }, 0)
      const passedAssertionsInRequest = curTestCase.requests.reduce((passedAssertionCountRequest, curRequest) => {
          return passedAssertionCountRequest + ((curRequest.request.tests && curRequest.request.tests.passedAssertionsCount)? curRequest.request.tests.passedAssertionsCount : 0)
      }, 0)
      return total + passedAssertionsInRequest
  }, 0)
}

function totalFailedAssertions(test_cases) {
  return totalAssertions(test_cases) - totalPassedAssertions(test_cases)
}

function totalTestCases(test_cases) {
  return test_cases.length
}

function failedTestCases(test_cases) {
  return test_cases.reduce((total, curTestCase) => {
      const assertionsInRequest = curTestCase.requests.reduce((assertionCountRequest, curRequest) => {
          return assertionCountRequest + ((curRequest.request.tests && curRequest.request.tests.assertions)? curRequest.request.tests.assertions.length : 0)
      }, 0)
      const passedAssertionsInRequest = curTestCase.requests.reduce((passedAssertionCountRequest, curRequest) => {
          return passedAssertionCountRequest + ((curRequest.request.tests && curRequest.request.tests.passedAssertionsCount)? curRequest.request.tests.passedAssertionsCount : 0)
      }, 0)
      return total + (passedAssertionsInRequest===assertionsInRequest? 0 : 1)
  }, 0)
}

function totalRequests(test_cases) {
  return test_cases.reduce((total, curTestCase) => {
      return total + curTestCase.requests.length
  }, 0)
}

function failedRequests(test_cases) {
  return test_cases.reduce((total, curTestCase) => {
      const faileRequestsCount = curTestCase.requests.reduce((failedRequestCountTemp, curRequest) => {
          return failedRequestCountTemp + ((curRequest.request.tests && curRequest.request.tests.assertions)? (curRequest.request.tests.assertions.length===curRequest.request.tests.passedAssertionsCount? 0 : 1) : 0)
      }, 0)
      return total + faileRequestsCount
  }, 0)
}

function testPassPercentage(tests) {
  if (tests && tests.assertions) {
    return Math.round(tests.passedAssertionsCount * 100 / tests.assertions.length)
  } else {
    return 0
  }
}

function ifAllTestsPassedInRequest(request) {
  if (request.tests && request.tests.assertions) {
    return request.tests.passedAssertionsCount===request.tests.assertions.length
  } else {
    return false
  }
}

function ifFailedTestCase(testCase) {
  const failedRequest = testCase.requests.find((item) => {
    if (item.request.tests.assertions) {
      return item.request.tests.passedAssertionsCount!=item.request.tests.assertions.length
    } else {
      return false
    }
  })
  if(failedRequest) {
    return true
  } else {
    return false
  }

}

function jsonStringify( inputObject ) {
  return JSON.stringify(inputObject, null, 2)
}

function isAssertionPassed(status) {
  return status==='SUCCESS'
}