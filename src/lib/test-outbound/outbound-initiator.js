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

const _ = require('lodash')
const customLogger = require('../requestLogger')
const axios = require('axios').default
const https = require('https')
const Config = require('../config')
const MyEventEmitter = require('../MyEventEmitter')
const notificationEmitter = require('../notificationEmitter.js')
const fs = require('fs')
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile)
const expect = require('chai').expect // eslint-disable-line
const JwsSigning = require('../jws/JwsSigning')
const traceHeaderUtils = require('../traceHeaderUtils')
const ConnectionProvider = require('../configuration-providers/mb-connection-manager')
require('request-to-curl')
require('atob') // eslint-disable-line
delete axios.defaults.headers.common.Accept
const context = require('./context')
const openApiDefinitionsModel = require('../mocking/openApiDefinitionsModel')
const uuid = require('uuid')
const utilsInternal = require('../utilsInternal')

var terminateTraceIds = {}

const OutboundSend = async (inputTemplate, traceID, dfspId) => {
  const startedTimeStamp = new Date()
  let outboundID = traceID
  let sessionID = null
  if (traceID && traceHeaderUtils.isCustomTraceID(traceID)) {
    outboundID = traceHeaderUtils.getEndToEndID(traceID)
    sessionID = traceHeaderUtils.getSessionID(traceID)
  }

  const environmentVariables = {
    items: Object.entries(inputTemplate.inputValues).map((item) => { return { type: 'any', key: item[0], value: item[1] } })
  }
  try {
    for (const i in inputTemplate.test_cases) {
      await processTestCase(inputTemplate.test_cases[i], traceID, inputTemplate.inputValues, environmentVariables, dfspId)
    }

    const completedTimeStamp = new Date()
    const runDurationMs = completedTimeStamp.getTime() - startedTimeStamp.getTime()
    // Send the total result to client
    if (outboundID) {
      const runtimeInformation = {
        completedTimeISO: completedTimeStamp.toISOString(),
        startedTime: startedTimeStamp.toUTCString(),
        completedTime: completedTimeStamp.toUTCString(),
        runDurationMs: runDurationMs,
        avgResponseTime: 'NA'
      }
      const totalResult = generateFinalReport(inputTemplate, runtimeInformation)
      notificationEmitter.broadcastOutboundProgress({
        status: 'FINISHED',
        outboundID: outboundID,
        totalResult
      }, sessionID)
    }
  } catch (err) {
    notificationEmitter.broadcastOutboundProgress({
      status: 'TERMINATED',
      outboundID: outboundID
    }, sessionID)
  }
}

const terminateOutbound = (traceID) => {
  terminateTraceIds[traceID] = true
}

const processTestCase = async (testCase, traceID, inputValues, environmentVariables, dfspId) => {
  let outboundID = traceID
  let sessionID = null
  if (traceID && traceHeaderUtils.isCustomTraceID(traceID)) {
    outboundID = traceHeaderUtils.getEndToEndID(traceID)
    sessionID = traceHeaderUtils.getSessionID(traceID)
  }

  // Load the requests array into an object by the request id to access a particular object faster
  // console.log(testCase.requests)
  const requestsObj = {}
  // Store the request ids into a new array
  const templateIDArr = []
  for (const i in testCase.requests) {
    requestsObj[testCase.requests[i].id] = testCase.requests[i]
    templateIDArr.push(testCase.requests[i].id)
  }
  // Sort the request ids array
  templateIDArr.sort((a, b) => {
    return a > b
  })
  // console.log(requestsObj)
  // console.log(templateIDArr)

  const apiDefinitions = await openApiDefinitionsModel.getApiDefinitions()
  // Iterate the request ID array
  for (const i in templateIDArr) {
    if (terminateTraceIds[traceID]) {
      delete terminateTraceIds[traceID]
      throw new Error('Terminated')
    }
    const request = requestsObj[templateIDArr[i]]

    const reqApiDefinition = apiDefinitions.find((item) => {
      return (
        item.majorVersion === +request.apiVersion.majorVersion &&
        item.minorVersion === +request.apiVersion.minorVersion &&
        item.type === request.apiVersion.type
      )
    })

    let convertedRequest = JSON.parse(JSON.stringify(request))
    // console.log(request)
    // Form the actual http request headers, body, path and method by replacing configurable parameters
    // Replace the parameters
    convertedRequest = replaceVariables(request, inputValues, request, requestsObj)
    convertedRequest = replaceRequestVariables(convertedRequest)

    // console.log(convertedRequest)
    // Form the path from params and operationPath
    convertedRequest.path = replacePathVariables(request.operationPath, convertedRequest.params)

    // Insert traceparent header if sessionID passed
    if (sessionID) {
      convertedRequest.headers.traceparent = '00-' + traceID + '-0123456789abcdef0-00'
    }

    const scriptsExecution = {}
    let environment
    // Send http request
    try {
      const contextObj = await context.generageContextObj(environmentVariables.items)

      if (request.scripts && request.scripts.preRequest && request.scripts.preRequest.exec.length > 0 && request.scripts.preRequest.exec !== ['']) {
        scriptsExecution.preRequest = await context.executeAsync(request.scripts.preRequest.exec, { context: { ...contextObj, request: convertedRequest }, id: uuid.v4() }, contextObj)
        environmentVariables.items = scriptsExecution.preRequest.environment
      }

      environment = environmentVariables.items.reduce((envObj, item) => { envObj[item.key] = item.value; return envObj }, {})
      convertedRequest = replaceEnvironmentVariables(convertedRequest, environment)

      // Form callbacks
      // TODO: Get version from accept / content-type headers
      let successCallbackUrl = null
      let errorCallbackUrl = null
      if (request.apiVersion.asynchronous === true) {
        const cbMapRawdata = await readFileAsync(reqApiDefinition.callbackMapFile)
        const reqCallbackMap = JSON.parse(cbMapRawdata)
        if (reqCallbackMap[request.operationPath] && reqCallbackMap[request.operationPath][request.method]) {
          const successCallback = reqCallbackMap[request.operationPath][request.method].successCallback
          const errorCallback = reqCallbackMap[request.operationPath][request.method].errorCallback
          successCallbackUrl = successCallback.method + ' ' + replaceVariables(successCallback.pathPattern, null, convertedRequest)
          errorCallbackUrl = errorCallback.method + ' ' + replaceVariables(errorCallback.pathPattern, null, convertedRequest)
        }
      }

      if (request.delay) {
        await new Promise(resolve => setTimeout(resolve, request.delay))
      }
      const resp = await sendRequest(convertedRequest.url, convertedRequest.method, convertedRequest.path, convertedRequest.queryParams, convertedRequest.headers, convertedRequest.body, successCallbackUrl, errorCallbackUrl, convertedRequest.ignoreCallbacks, dfspId)

      if (request.scripts && request.scripts.postRequest && request.scripts.postRequest.exec.length > 0 && request.scripts.postRequest.exec !== ['']) {
        const response = { code: resp.syncResponse.status, status: resp.syncResponse.statusText, body: resp.syncResponse.data }
        scriptsExecution.postRequest = await context.executeAsync(request.scripts.postRequest.exec, { context: { ...contextObj, response }, id: uuid.v4() }, contextObj)
        environmentVariables.items = scriptsExecution.postRequest.environment
      }

      environment = environmentVariables.items.reduce((envObj, item) => { envObj[item.key] = item.value; return envObj }, {})

      contextObj.ctx.dispose()
      contextObj.ctx = null

      const testResult = await handleTests(convertedRequest, resp.syncResponse, resp.callback, environment)
      request.appended = {
        status: 'SUCCESS',
        testResult,
        response: resp.syncResponse,
        callback: resp.callback,
        request: convertedRequest,
        additionalInfo: {
          curlRequest: resp.curlRequest
        }
      }
      if (outboundID) {
        notificationEmitter.broadcastOutboundProgress({
          outboundID: outboundID,
          testCaseId: testCase.id,
          status: 'SUCCESS',
          requestId: request.id,
          response: resp.syncResponse,
          callback: resp.callback,
          requestSent: convertedRequest,
          additionalInfo: {
            curlRequest: resp.curlRequest,
            scriptsExecution: scriptsExecution
          },
          testResult
        }, sessionID)
      }
    } catch (err) {
      let resp
      try {
        resp = JSON.parse(err.message)
      } catch (err) {
        resp = err.message
      }
      const testResult = await handleTests(convertedRequest, resp.syncResponse, resp.callback, environment)
      request.appended = {
        status: 'ERROR',
        testResult,
        response: resp.syncResponse,
        callback: resp.callback,
        request: convertedRequest,
        additionalInfo: {
          curlRequest: resp.curlRequest
        }
      }
      if (outboundID) {
        notificationEmitter.broadcastOutboundProgress({
          outboundID: outboundID,
          testCaseId: testCase.id,
          status: 'ERROR',
          requestId: request.id,
          response: resp.syncResponse,
          callback: resp.callback,
          requestSent: convertedRequest,
          additionalInfo: {
            curlRequest: resp.curlRequest,
            scriptsExecution: scriptsExecution
          },
          testResult
        }, sessionID)
      }
      // break
    }
  }

  // Return status report of this test case
  return testCase
  // Set a timeout if the response callback is not received in a particular time
}

const handleTests = async (request, response = null, callback = null, environment = []) => {
  try {
    const results = {}
    let passedCount = 0
    if (request.tests && request.tests.assertions.length > 0) {
      for (const k in request.tests.assertions) {
        const testCase = request.tests.assertions[k]
        // console.log(testCase.description, response)
        try {
          eval(testCase.exec.join('\n')) // eslint-disable-line
          results[testCase.id] = {
            status: 'SUCCESS'
          }
          passedCount++
        } catch (err) {
          results[testCase.id] = {
            status: 'FAILED',
            message: err.message
          }
        }
      }
    }
    return { results, passedCount }
  } catch (err) {
    return null
  }
}

const getUrlPrefix = (baseUrl) => {
  let returnUrl = baseUrl
  if (!returnUrl.startsWith('http:') && !returnUrl.startsWith('https:')) {
    returnUrl = 'http://' + returnUrl
  }
  if (returnUrl.endsWith('/')) {
    returnUrl = returnUrl.slice(0, returnUrl.length - 1)
  }
  return returnUrl
}

const sendRequest = (baseUrl, method, path, queryParams, headers, body, successCallbackUrl, errorCallbackUrl, ignoreCallbacks, dfspId) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const httpsProps = {}
      let urlGenerated = Config.getUserConfig().CALLBACK_ENDPOINT + path
      if (Config.getSystemConfig().HOSTING_ENABLED) {
        const endpointsConfig = await ConnectionProvider.getEndpointsConfig()
        if (endpointsConfig.dfspEndpoints && dfspId && endpointsConfig.dfspEndpoints[dfspId]) {
          urlGenerated = endpointsConfig.dfspEndpoints[dfspId] + path
        } else {
          customLogger.logMessage('warning', 'Hosting is enabled, But there is no endpoint configuration found for DFSP ID: ' + dfspId, null, true, null)
        }
      }
      if (baseUrl) {
        urlGenerated = getUrlPrefix(baseUrl) + path
      }
      if (Config.getUserConfig().OUTBOUND_MUTUAL_TLS_ENABLED) {
        const tlsConfig = await ConnectionProvider.getTlsConfig()
        if (!tlsConfig.dfsps[dfspId]) {
          const errorMsg = 'Outbound TLS is enabled, but there is no TLS config found for DFSP ID: ' + dfspId
          customLogger.logMessage('error', errorMsg, null, true, null)
          reject(new Error(JSON.stringify({ errorCode: 4000, errorDescription: errorMsg })))
        }
        const httpsAgent = new https.Agent({
          cert: tlsConfig.dfsps[dfspId].hubClientCert,
          key: tlsConfig.hubClientKey,
          ca: [tlsConfig.dfsps[dfspId].dfspServerCaRootCert],
          rejectUnauthorized: true
        })
        httpsProps.httpsAgent = httpsAgent
        urlGenerated = urlGenerated.replace('http:', 'https:')
      }

      const reqOpts = {
        method: method,
        url: urlGenerated,
        path: path,
        params: queryParams,
        headers: headers,
        data: body,
        timeout: 3000,
        validateStatus: function (status) {
          return status < 900 // Reject only if the status code is greater than or equal to 900
        },
        ...httpsProps
      }
      try {
        await JwsSigning.sign(reqOpts)
      } catch (err) {
        console.log(err)
      }
      axios(reqOpts).then((result) => {
        const syncResponse = {
          status: result.status,
          statusText: result.statusText,
          data: result.data
        }
        const curlRequest = result.request ? result.request.toCurl() : ''

        if (result.status > 299) {
          reject(new Error(JSON.stringify({ curlRequest: curlRequest, syncResponse })))
        }

        customLogger.logMessage('info', 'Received response ' + result.status + ' ' + result.statusText, result.data, false)
        if (successCallbackUrl && errorCallbackUrl && (ignoreCallbacks !== true)) {
          const timer = setTimeout(() => {
            MyEventEmitter.getEmitter('testOutbound').removeAllListeners(successCallbackUrl)
            MyEventEmitter.getEmitter('testOutbound').removeAllListeners(errorCallbackUrl)
            reject(new Error(JSON.stringify({ curlRequest: curlRequest, syncResponse: syncResponse, errorCode: 4001, errorMessage: 'Timeout for receiving callback' })))
          }, Config.getUserConfig().CALLBACK_TIMEOUT)
          // Listen for success callback
          MyEventEmitter.getEmitter('testOutbound').once(successCallbackUrl, (callbackHeaders, callbackBody) => {
            clearTimeout(timer)
            MyEventEmitter.getEmitter('testOutbound').removeAllListeners(errorCallbackUrl)
            resolve({ curlRequest: curlRequest, syncResponse: syncResponse, callback: { headers: callbackHeaders, body: callbackBody } })
          })
          // Listen for error callback
          MyEventEmitter.getEmitter('testOutbound').once(errorCallbackUrl, (callbackHeaders, callbackBody) => {
            clearTimeout(timer)
            MyEventEmitter.getEmitter('testOutbound').removeAllListeners(successCallbackUrl)
            reject(new Error(JSON.stringify({ curlRequest: curlRequest, syncResponse: syncResponse, callback: { body: callbackBody } })))
          })
        } else {
          resolve({ curlRequest: curlRequest, syncResponse: syncResponse })
        }
      }, (err) => {
        customLogger.logMessage('info', 'Failed to send request ' + method + ' Error: ' + err.message, err, false)
        reject(new Error(JSON.stringify({ errorCode: 4000 })))
      })
    })()
  })
}

const replaceVariables = (inputObject, inputValues, request, requestsObj) => {
  var resultObject
  // Check whether inputObject is string or object. If it is object, then convert that to JSON string and parse it while return
  if (typeof inputObject === 'string') {
    resultObject = inputObject
  } else if (typeof inputObject === 'object') {
    resultObject = JSON.stringify(inputObject)
  } else {
    return inputObject
  }
  // Check the string for any inclusions like {$some_param}
  const matchedArray = resultObject.match(/{\$([^}]+)}/g)
  if (matchedArray) {
    matchedArray.forEach(element => {
      // Check for the function type of param, if its function we need to call a function in custom-functions and replace the returned value
      const splitArr = element.split('.')
      switch (splitArr[0]) {
        case '{$function':
          resultObject = resultObject.replace(element, getFunctionResult(element, inputValues, request))
          break
        case '{$prev':
          var temp1 = element.replace(/{\$prev.(.*)}/, '$1')
          var temp1Arr = temp1.split('.')
          try {
            var replacedValue = _.get(requestsObj[temp1Arr[0]].appended, temp1.replace(temp1Arr[0] + '.', ''))
            if (replacedValue) {
              resultObject = resultObject.replace(element, replacedValue)
            }
          } catch (err) {
            console.log(`${element} not found`)
          }
          break
        case '{$request':
          var temp2 = element.replace(/{\$request.(.*)}/, '$1')
          var replacedValue2 = _.get(request, temp2)
          if (replacedValue2 && !replacedValue2.startsWith('{$')) {
            resultObject = resultObject.replace(element, replacedValue2)
          }
          break
        case '{$inputs':
          var temp = element.replace(/{\$inputs.(.*)}/, '$1')
          if (inputValues[temp]) {
            resultObject = resultObject.replace(element, inputValues[temp])
          }
          break
        default:
          break
      }
    })
  }

  if (typeof inputObject === 'object') {
    return JSON.parse(resultObject)
  } else {
    return resultObject
  }
}

const replaceRequestVariables = (inputRequest) => {
  var resultObject
  // Check whether inputRequest is string or object. If it is object, then convert that to JSON string and parse it while return
  if (typeof inputRequest === 'string') {
    resultObject = inputRequest
  } else if (typeof inputRequest === 'object') {
    resultObject = JSON.stringify(inputRequest)
  } else {
    return inputRequest
  }

  // Check once again for the replaced request variables
  const matchedArray2 = resultObject.match(/{\$([^}]+)}/g)
  if (matchedArray2) {
    matchedArray2.forEach(element => {
      // Check for the function type of param, if its function we need to call a function in custom-functions and replace the returned value
      const splitArr = element.split('.')
      switch (splitArr[0]) {
        case '{$request':
          var temp2 = element.replace(/{\$request.(.*)}/, '$1')
          var replacedValue2 = _.get(inputRequest, temp2)
          if (replacedValue2) {
            resultObject = resultObject.replace(element, replacedValue2)
          }
          break
        default:
          break
      }
    })
  }

  if (typeof inputRequest === 'object') {
    return JSON.parse(resultObject)
  } else {
    return resultObject
  }
}

const replaceEnvironmentVariables = (inputRequest, environment) => {
  var resultObject
  // Check whether inputRequest is string or object. If it is object, then convert that to JSON string and parse it while return
  if (typeof inputRequest === 'string') {
    resultObject = inputRequest
  } else if (typeof inputRequest === 'object') {
    resultObject = JSON.stringify(inputRequest)
  } else {
    return inputRequest
  }

  // Check once again for the replaced request variables
  const matchedArray2 = resultObject.match(/{\$([^}]+)}/g)
  if (matchedArray2) {
    matchedArray2.forEach(element => {
      // Check for the function type of param, if its function we need to call a function in custom-functions and replace the returned value
      const splitArr = element.split('.')
      switch (splitArr[0]) {
        case '{$environment':
          var temp2 = element.replace(/{\$environment.(.*)}/, '$1')
          var replacedValue2 = _.get(environment, temp2)
          if (replacedValue2) {
            resultObject = resultObject.replace(element, replacedValue2)
          }
          break
        default:
          break
      }
    })
  }

  if (typeof inputRequest === 'object') {
    return JSON.parse(resultObject)
  } else {
    return resultObject
  }
}

const replacePathVariables = (operationPath, params) => {
  let resultObject = operationPath

  // Check the string for any inclusions like {$some_param}
  const matchedArray = resultObject.match(/{([^}]+)}/g)
  if (matchedArray) {
    matchedArray.forEach(element => {
      var temp = element.replace(/{([^}]+)}/, '$1')
      if (params && params[temp]) {
        resultObject = resultObject.replace(element, params[temp])
      }
    })
  }

  return resultObject
}

// Execute the function and return the result
const getFunctionResult = (param, inputValues, request) => {
  return utilsInternal.getFunctionResult(param, inputValues, request)
}

// Generate consolidated final report
const generateFinalReport = (inputTemplate, runtimeInformation) => {
  const { test_cases, ...remaingPropsInTemplate } = inputTemplate  // eslint-disable-line
  const resultTestCases = test_cases.map(testCase => {
    const { requests, ...remainingPropsInTestCase } = testCase
    const resultRequests = requests.map(requestItem => {
      const { testResult, request, ...remainginPropsInRequest } = requestItem.appended
      if (request.tests && request.tests.assertions) {
        request.tests.assertions = request.tests.assertions.map(assertion => {
          return {
            ...assertion,
            resultStatus: testResult.results[assertion.id]
          }
        })
        request.tests.passedAssertionsCount = testResult.passedCount
      }
      return {
        request,
        ...remainginPropsInRequest
      }
    })
    return {
      ...remainingPropsInTestCase,
      requests: resultRequests
    }
  })
  return {
    ...remaingPropsInTemplate,
    test_cases: resultTestCases,
    runtimeInformation: runtimeInformation
  }
}

module.exports = {
  OutboundSend,
  terminateOutbound,
  handleTests,
  sendRequest,
  replaceVariables,
  replaceRequestVariables,
  replaceEnvironmentVariables,
  replacePathVariables,
  getFunctionResult,
  generateFinalReport
}
