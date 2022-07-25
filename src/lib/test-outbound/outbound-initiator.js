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
const { readFileAsync } = require('../utils')
const expectOriginal = require('chai').expect // eslint-disable-line
const JwsSigning = require('../jws/JwsSigning')
const { TraceHeaderUtils } = require('@mojaloop/ml-testing-toolkit-shared-lib')
const ConnectionProvider = require('../configuration-providers/mb-connection-manager')
require('request-to-curl')
require('atob') // eslint-disable-line
delete axios.defaults.headers.common.Accept
const postmanContext = require('../scripting-engines/postman-sandbox')
const javascriptContext = require('../scripting-engines/vm-javascript-sandbox')
const openApiDefinitionsModel = require('../mocking/openApiDefinitionsModel')
const uuid = require('uuid')
const utilsInternal = require('../utilsInternal')
const dbAdapter = require('../db/adapters/dbAdapter')
const arrayStore = require('../arrayStore')
const UniqueIdGenerator = require('../../lib/uniqueIdGenerator')
const httpAgentStore = require('../httpAgentStore')

const terminateTraceIds = {}

const getTracing = (traceID, dfspId) => {
  const tracing = {
    outboundID: traceID,
    sessionID: null
  }
  if (traceID && TraceHeaderUtils.isCustomTraceID(traceID)) {
    tracing.outboundID = TraceHeaderUtils.getEndToEndID(traceID)
    tracing.sessionID = TraceHeaderUtils.getSessionID(traceID)
  }
  if (Config.getSystemConfig().HOSTING_ENABLED) {
    tracing.sessionID = dfspId
  }
  return tracing
}

const OutboundSend = async (inputTemplate, traceID, dfspId) => {
  const totalCounts = getTotalCounts(inputTemplate)
  const globalConfig = {
    broadcastOutboundProgressEnabled: true,
    scriptExecution: true,
    testsExecution: true,
    totalProgress: {
      testCasesTotal: totalCounts.totalTestCases,
      testCasesProcessed: 0,
      requestsTotal: totalCounts.totalRequests,
      requestsProcessed: 0,
      assertionsTotal: totalCounts.totalAssertions,
      assertionsProcessed: 0,
      assertionsPassed: 0,
      assertionsFailed: 0
    }
  }

  const startedTimeStamp = new Date()
  const tracing = getTracing(traceID, dfspId)

  const variableData = {
    environment: { ...inputTemplate.inputValues }
  }
  try {
    for (const i in inputTemplate.test_cases) {
      globalConfig.totalProgress.testCasesProcessed++
      await processTestCase(inputTemplate.test_cases[i], traceID, inputTemplate.inputValues, variableData, dfspId, globalConfig)
    }

    const completedTimeStamp = new Date()
    const runDurationMs = completedTimeStamp.getTime() - startedTimeStamp.getTime()
    // Send the total result to client
    if (tracing.outboundID) {
      const runtimeInformation = {
        completedTimeISO: completedTimeStamp.toISOString(),
        startedTime: startedTimeStamp.toUTCString(),
        completedTime: completedTimeStamp.toUTCString(),
        runDurationMs,
        avgResponseTime: 'NA',
        totalAssertions: 0,
        totalPassedAssertions: 0
      }
      const totalResult = generateFinalReport(inputTemplate, runtimeInformation)
      if (Config.getSystemConfig().HOSTING_ENABLED) {
        const totalResultCopy = JSON.parse(JSON.stringify(totalResult))
        totalResultCopy.runtimeInformation.completedTimeISO = completedTimeStamp
        dbAdapter.upsert('reports', totalResultCopy, { dfspId })
      }
      notificationEmitter.broadcastOutboundProgress({
        status: 'FINISHED',
        outboundID: tracing.outboundID,
        totalResult
      }, tracing.sessionID)
    }
  } catch (err) {
    console.log(err)
    notificationEmitter.broadcastOutboundProgress({
      status: 'TERMINATED',
      outboundID: tracing.outboundID
    }, tracing.sessionID)
  }
}

const OutboundSendLoop = async (inputTemplate, traceID, dfspId, iterations) => {
  const totalCounts = getTotalCounts(inputTemplate)

  const globalConfig = {
    broadcastOutboundProgressEnabled: false,
    scriptExecution: true,
    testsExecution: true,
    totalProgress: {
      testCasesTotal: totalCounts.totalTestCases,
      testCasesProcessed: 0,
      requestsTotal: totalCounts.totalRequests,
      requestsProcessed: 0,
      assertionsTotal: totalCounts.totalAssertions,
      assertionsProcessed: 0,
      assertionsPassed: 0,
      assertionsFailed: 0
    }
  }
  const tracing = getTracing(traceID, dfspId)

  const environmentVariables = { ...inputTemplate.inputValues }
  try {
    const totalStartedTimeStamp = new Date()
    const totalReport = {
      iterations: []
    }
    for (let itn = 0; itn < iterations; itn++) {
      const startedTimeStamp = new Date()
      // Deep copy the template
      const tmpTemplate = JSON.parse(JSON.stringify(inputTemplate))
      // Execute all the test cases in the template
      for (const i in tmpTemplate.test_cases) {
        await processTestCase(tmpTemplate.test_cases[i], traceID, tmpTemplate.inputValues, environmentVariables, dfspId, globalConfig)
      }
      const completedTimeStamp = new Date()
      const runDurationMs = completedTimeStamp.getTime() - startedTimeStamp.getTime()
      const runtimeInformation = {
        iterationNumber: itn,
        completedTimeISO: completedTimeStamp.toISOString(),
        startedTime: startedTimeStamp.toUTCString(),
        completedTime: completedTimeStamp.toUTCString(),
        runDurationMs,
        totalAssertions: 0,
        totalPassedAssertions: 0
      }
      // TODO: This can be optimized by storing only results into the iterations array
      totalReport.iterations.push(generateFinalReport(tmpTemplate, runtimeInformation))
      notificationEmitter.broadcastOutboundProgress({
        status: 'ITERATION_PROGRESS',
        outboundID: tracing.outboundID,
        iterationStatus: runtimeInformation
      }, tracing.sessionID)
    }

    const totalCompletedTimeStamp = new Date()
    const totalRunDurationMs = totalCompletedTimeStamp.getTime() - totalStartedTimeStamp.getTime()
    // Send the total result to client
    if (tracing.outboundID) {
      notificationEmitter.broadcastOutboundProgress({
        status: 'ITERATIONS_FINISHED',
        outboundID: tracing.outboundID,
        totalRunDurationMs,
        totalReport
      }, tracing.sessionID)
    }
  } catch (err) {
    notificationEmitter.broadcastOutboundProgress({
      status: 'ITERATIONS_TERMINATED',
      outboundID: tracing.outboundID,
      errorMessage: err.message
    }, tracing.sessionID)
  }
}

const terminateOutbound = (traceID) => {
  terminateTraceIds[traceID] = true
}

const processTestCase = async (testCase, traceID, inputValues, variableData, dfspId, globalConfig) => {
  const tracing = getTracing(traceID)

  // Load the requests array into an object by the request id to access a particular object faster
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

  const apiDefinitions = await openApiDefinitionsModel.getApiDefinitions()
  // Iterate the request ID array
  for (const i in templateIDArr) {
    if (terminateTraceIds[traceID]) {
      delete terminateTraceIds[traceID]
      throw new Error('Terminated')
    }
    const request = requestsObj[templateIDArr[i]]

    let convertedRequest = JSON.parse(JSON.stringify(request))

    if (request.disabled) {
      await setSkippedResponse(convertedRequest, request, 'SKIPPED', tracing, testCase, {}, globalConfig)
      continue
    }

    const reqApiDefinition = apiDefinitions.find((item) => {
      return (
        item.majorVersion === +request.apiVersion.majorVersion &&
        item.minorVersion === +request.apiVersion.minorVersion &&
        item.type === request.apiVersion.type
      )
    })

    if (request.delay) {
      await new Promise(resolve => setTimeout(resolve, request.delay))
    }

    // Form the actual http request headers, body, path and method by replacing configurable parameters
    // Replace the parameters
    convertedRequest = replaceVariables(request, inputValues, request, requestsObj)
    convertedRequest = replaceRequestVariables(convertedRequest)

    // Form the path from params and operationPath
    convertedRequest.path = replacePathVariables(request.operationPath, convertedRequest.params)

    // Insert traceparent header if sessionID passed
    if (tracing.sessionID) {
      convertedRequest.headers = convertedRequest.headers || {}
      convertedRequest.headers.traceparent = '00-' + traceID + '-0123456789abcdef0-00'
    }

    const scriptsExecution = {}
    let contextObj = null
    if (globalConfig.scriptExecution) {
      let context = postmanContext
      if (convertedRequest.scriptingEngine && convertedRequest.scriptingEngine === 'javascript') {
        context = javascriptContext
      }
      contextObj = await context.generateContextObj(variableData.environment)
    }

    // Send http request
    let status
    try {
      // Extra step to access request variables that consists of environment variables in scripts
      const tmpRequest = replaceEnvironmentVariables(convertedRequest, variableData.environment)
      if (globalConfig.scriptExecution) {
        await executePreRequestScript(tmpRequest, scriptsExecution, contextObj, variableData)
      }

      convertedRequest = replaceEnvironmentVariables(convertedRequest, variableData.environment)
      convertedRequest = replaceRequestLevelEnvironmentVariables(convertedRequest, contextObj.requestVariables)

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
      if (contextObj.requestVariables && contextObj.requestVariables.SKIP_REQUEST) {
        status = 'SKIPPED'
        await setSkippedResponse(convertedRequest, request, status, tracing, testCase, scriptsExecution, globalConfig)
      } else {
        const resp = await sendRequest(convertedRequest.url, convertedRequest.method, convertedRequest.path, convertedRequest.queryParams, convertedRequest.headers, convertedRequest.body, successCallbackUrl, errorCallbackUrl, convertedRequest.ignoreCallbacks, dfspId, contextObj)
        status = 'SUCCESS'
        await setResponse(convertedRequest, resp, variableData, request, status, tracing, testCase, scriptsExecution, contextObj, globalConfig)
      }
    } catch (err) {
      let resp
      try {
        resp = JSON.parse(err.message)
      } catch (parsingErr) {
        resp = err.message
      }
      status = 'ERROR'
      await setResponse(convertedRequest, resp, variableData, request, status, tracing, testCase, scriptsExecution, contextObj, globalConfig)
    } finally {
      if (contextObj) {
        contextObj.ctx.dispose()
        contextObj.ctx = null
      }
    }
    if (status === 'ERROR' && (testCase.breakOnError)) {
      terminateOutbound(traceID)
    }
  }

  // Return status report of this test case
  return testCase
  // Set a timeout if the response callback is not received in a particular time
}

const setResponse = async (convertedRequest, resp, variableData, request, status, tracing, testCase, scriptsExecution, contextObj, globalConfig) => {
  // Get the requestsHistory and callbacksHistory from the arrayStore
  const requestsHistoryObj = arrayStore.get('requestsHistory')
  const callbacksHistoryObj = arrayStore.get('callbacksHistory')
  const backgroundData = {
    requestsHistory: requestsHistoryObj,
    callbacksHistory: callbacksHistoryObj
  }

  if (globalConfig.scriptExecution) {
    await executePostRequestScript(convertedRequest, resp, scriptsExecution, contextObj, variableData, backgroundData)
  }

  let testResult = null
  console.log('GVK', resp)
  if (globalConfig.testsExecution) {
    testResult = await handleTests(convertedRequest, resp.syncResponse, resp.callback, variableData.environment, backgroundData, contextObj.requestVariables)
  }
  request.appended = {
    status,
    testResult,
    response: resp.syncResponse,
    callback: resp.callback,
    request: convertedRequest,
    additionalInfo: {
      curlRequest: resp.curlRequest
    }
  }

  // Update total progress counts
  globalConfig.totalProgress.requestsProcessed++
  globalConfig.totalProgress.assertionsProcessed += request.tests && request.tests.assertions ? request.tests.assertions.length : 0
  globalConfig.totalProgress.assertionsPassed += testResult.passedCount
  globalConfig.totalProgress.assertionsFailed += request.tests && request.tests.assertions ? (request.tests.assertions.length - testResult.passedCount) : 0

  if (tracing.outboundID && globalConfig.broadcastOutboundProgressEnabled) {
    notificationEmitter.broadcastOutboundProgress({
      outboundID: tracing.outboundID,
      testCaseId: testCase.id,
      testCaseName: testCase.name,
      status,
      requestId: request.id,
      response: resp.syncResponse,
      callback: resp.callback,
      requestSent: convertedRequest,
      additionalInfo: {
        curlRequest: resp.curlRequest,
        scriptsExecution
      },
      testResult,
      totalProgress: globalConfig.totalProgress
    }, tracing.sessionID)
  }
}

const setSkippedResponse = async (convertedRequest, request, status, tracing, testCase, scriptsExecution, globalConfig) => {
  let testResult = null
  if (globalConfig.testsExecution) {
    testResult = await setAllTestsSkipped(convertedRequest)
  }
  request.appended = {
    status,
    testResult,
    response: null,
    callback: null,
    request: convertedRequest,
    additionalInfo: {
      curlRequest: null
    }
  }

  // Update total progress counts
  globalConfig.totalProgress.requestsProcessed++
  globalConfig.totalProgress.assertionsProcessed += request.tests && request.tests.assertions && request.tests.assertions.length
  globalConfig.totalProgress.assertionsPassed += testResult.passedCount
  // globalConfig.totalProgress.assertionsFailed += 0

  if (tracing.outboundID && globalConfig.broadcastOutboundProgressEnabled) {
    notificationEmitter.broadcastOutboundProgress({
      outboundID: tracing.outboundID,
      testCaseId: testCase.id,
      testCaseName: testCase.name,
      status,
      requestId: request.id,
      response: null,
      callback: null,
      requestSent: convertedRequest,
      additionalInfo: {
        curlRequest: null,
        scriptsExecution
      },
      testResult,
      totalProgress: globalConfig.totalProgress
    }, tracing.sessionID)
  }
}

const executePreRequestScript = async (convertedRequest, scriptsExecution, contextObj, variableData) => {
  if (convertedRequest.scripts && convertedRequest.scripts.preRequest && convertedRequest.scripts.preRequest.exec.length > 0 && convertedRequest.scripts.preRequest.exec !== ['']) {
    let context = postmanContext
    if (convertedRequest.scriptingEngine && convertedRequest.scriptingEngine === 'javascript') {
      context = javascriptContext
    }
    const requestToPass = {
      url: convertedRequest.url,
      method: convertedRequest.method,
      path: convertedRequest.path,
      queryParams: convertedRequest.queryParams,
      headers: convertedRequest.headers,
      body: convertedRequest.body
    }
    scriptsExecution.preRequest = await context.executeAsync(convertedRequest.scripts.preRequest.exec, { context: { request: requestToPass }, id: uuid.v4() }, contextObj)
    variableData.environment = scriptsExecution.preRequest.environment
  }
}

const executePostRequestScript = async (convertedRequest, resp, scriptsExecution, contextObj, variableData, backgroundData) => {
  if (convertedRequest.scripts && convertedRequest.scripts.postRequest && convertedRequest.scripts.postRequest.exec.length > 0 && convertedRequest.scripts.postRequest.exec !== ['']) {
    let response
    if (_.isString(resp)) {
      response = resp
    } else if (resp.syncResponse) {
      response = { code: resp.syncResponse.status, status: resp.syncResponse.statusText, body: resp.syncResponse.body || resp.syncResponse.data }
    }

    let callback
    if (resp.callback) {
      callback = resp.callback
    }

    // Pass the requestsHistory and callbacksHistory to postman sandbox
    const collectionVariables = []
    collectionVariables.push(
      {
        type: 'any',
        key: 'requestsHistory',
        value: JSON.stringify(backgroundData.requestsHistory)
      },
      {
        type: 'any',
        key: 'callbacksHistory',
        value: JSON.stringify(backgroundData.callbacksHistory)
      }
    )
    let context = postmanContext
    if (convertedRequest.scriptingEngine && convertedRequest.scriptingEngine === 'javascript') {
      context = javascriptContext
    }
    scriptsExecution.postRequest = await context.executeAsync(convertedRequest.scripts.postRequest.exec, { context: { response, callback, collectionVariables }, id: uuid.v4() }, contextObj)
    variableData.environment = scriptsExecution.postRequest.environment
  }
}

const handleTests = async (request, response = null, callback = null, environment = {}, backgroundData = {}, requestVariables = {}) => {
  try {
    const results = {}
    let passedCount = 0
    if (request.tests && request.tests.assertions.length > 0) {
      for (const k in request.tests.assertions) {
        const testCase = request.tests.assertions[k]
        try {
          let status = 'SKIPPED'
          const expect = (args) => { // eslint-disable-line
            status = 'SUCCESS'
            return expectOriginal(args)
          }
          const testsString = testCase.exec.join('\n')

          eval(testsString) // eslint-disable-line
          results[testCase.id] = {
            status
          }
          passedCount++
        } catch (err) {
          console.log(err)
          results[testCase.id] = {
            status: 'FAILED',
            message: err.message
          }
        }
      }
    }
    return { results, passedCount }
  } catch (err) {
    console.log(err)
    return null
  }
}

const setAllTestsSkipped = async (request) => {
  const results = {}
  let passedCount = 0
  if (request.tests && request.tests.assertions.length > 0) {
    for (const k in request.tests.assertions) {
      const testCase = request.tests.assertions[k]
      results[testCase.id] = {
        status: 'SKIPPED'
      }
      passedCount++
    }
  }
  return { results, passedCount }
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

const sendRequest = (baseUrl, method, path, queryParams, headers, body, successCallbackUrl, errorCallbackUrl, ignoreCallbacks, dfspId, contextObj = {}) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const httpAgentProps = {}
      const user = dfspId ? { dfspId } : undefined
      const userConfig = await Config.getUserConfig(user)
      const uniqueId = UniqueIdGenerator.generateUniqueId()
      let urlGenerated = userConfig.CALLBACK_ENDPOINT + path
      if (baseUrl) {
        urlGenerated = getUrlPrefix(baseUrl) + path
      }
      if (Config.getSystemConfig().OUTBOUND_MUTUAL_TLS_ENABLED) {
        const tlsConfig = await ConnectionProvider.getTlsConfig()
        if (!tlsConfig.dfsps[dfspId]) {
          const errorMsg = 'Outbound TLS is enabled, but there is no TLS config found for DFSP ID: ' + dfspId
          customLogger.logMessage('error', errorMsg, { user })
          return reject(new Error(JSON.stringify({ errorCode: 4000, errorDescription: errorMsg })))
        }
        httpAgentProps.httpsAgent = new https.Agent({
          cert: tlsConfig.dfsps[dfspId].hubClientCert,
          key: tlsConfig.hubClientKey,
          ca: [tlsConfig.dfsps[dfspId].dfspServerCaRootCert],
          rejectUnauthorized: true
        })
        urlGenerated = urlGenerated.replace('http:', 'https:')
      } else if (userConfig.CLIENT_MUTUAL_TLS_ENABLED) {
        const urlObject = new URL(urlGenerated)
        const cred = userConfig.CLIENT_TLS_CREDS.filter(item => item.HOST === urlObject.host)
        if (Array.isArray(cred) && cred.length === 1) {
          customLogger.logMessage('info', `Found the Client certificate for ${urlObject.host}`, { notification: false })
          httpAgentProps.httpsAgent = httpAgentStore.getHttpsAgent(urlObject.host, {
            cert: cred[0].CERT,
            key: cred[0].KEY,
            rejectUnauthorized: false
          })
          urlGenerated = urlGenerated.replace('http:', 'https:')
        } else {
          const errorMsg = `client mutual TLS is enabled, but there is no TLS config found for ${urlObject.host}`
          customLogger.logMessage('error', errorMsg, { notification: false })
        }
      } else {
        if (urlGenerated.startsWith('https:')) {
          httpAgentProps.httpsAgent = httpAgentStore.getHttpsAgent('generic', {
            rejectUnauthorized: false
          })
        } else {
          httpAgentProps.httpAgent = httpAgentStore.getHttpAgent('generic')
        }
      }

      const reqOpts = {
        method,
        url: urlGenerated,
        path,
        params: queryParams,
        headers,
        data: body,
        timeout: (contextObj.requestVariables && contextObj.requestVariables.REQUEST_TIMEOUT) || userConfig.DEFAULT_REQUEST_TIMEOUT,
        validateStatus: function (status) {
          return status < 900 // Reject only if the status code is greater than or equal to 900
        },
        ...httpAgentProps
      }

      if (contextObj.requestVariables && contextObj.requestVariables.TTK_JWS_SIGN_KEY) {
        try {
          await JwsSigning.signWithKey(reqOpts, contextObj.requestVariables.TTK_JWS_SIGN_KEY)
        } catch (err) {
          customLogger.logMessage('error', err.message, { additionalData: err })
        }
      } else {
        try {
          await JwsSigning.sign(reqOpts)
          customLogger.logOutboundRequest('info', 'JWS signed', { uniqueId, request: reqOpts })
        } catch (err) {
          customLogger.logMessage('error', err.message, { additionalData: err })
        }
      }

      let syncResponse = {}
      let curlRequest = ''
      let timer = null
      if (successCallbackUrl && errorCallbackUrl && (ignoreCallbacks !== true)) {
        timer = setTimeout(() => {
          MyEventEmitter.getEmitter('testOutbound', user).removeAllListeners(successCallbackUrl)
          MyEventEmitter.getEmitter('testOutbound', user).removeAllListeners(errorCallbackUrl)
          return reject(new Error(JSON.stringify({ curlRequest, syncResponse, errorCode: 4001, errorMessage: 'Timeout for receiving callback' })))
        }, userConfig.CALLBACK_TIMEOUT)
        // Listen for success callback
        MyEventEmitter.getEmitter('testOutbound', user).once(successCallbackUrl, (callbackHeaders, callbackBody) => {
          clearTimeout(timer)
          MyEventEmitter.getEmitter('testOutbound', user).removeAllListeners(errorCallbackUrl)
          customLogger.logMessage('info', 'Received success callback ' + successCallbackUrl, { request: { headers: callbackHeaders, body: callbackBody }, notification: false })
          return resolve({ curlRequest, syncResponse, callback: { url: successCallbackUrl, headers: callbackHeaders, body: callbackBody } })
        })
        // Listen for error callback
        MyEventEmitter.getEmitter('testOutbound', user).once(errorCallbackUrl, (callbackHeaders, callbackBody) => {
          clearTimeout(timer)
          MyEventEmitter.getEmitter('testOutbound', user).removeAllListeners(successCallbackUrl)
          customLogger.logMessage('info', 'Received error callback ' + errorCallbackUrl, { request: { headers: callbackHeaders, body: callbackBody }, notification: false })
          return reject(new Error(JSON.stringify({ curlRequest, syncResponse, callback: { url: errorCallbackUrl, headers: callbackHeaders, body: callbackBody } })))
        })
      }

      customLogger.logOutboundRequest('info', 'Sending request ' + reqOpts.method + ' ' + reqOpts.url, { additionalData: { request: reqOpts }, user, uniqueId, request: reqOpts })

      axios(reqOpts).then((result) => {
        syncResponse = {
          status: result.status,
          statusText: result.statusText,
          body: result.data,
          headers: result.headers
        }
        curlRequest = result.request ? result.request.toCurl() : ''

        if (result.status > 299) {
          customLogger.logOutboundRequest('error', 'Received response ' + result.status + ' ' + result.statusText, { additionalData: { response: result }, user, uniqueId, request: reqOpts })
          if (timer) {
            clearTimeout(timer)
            MyEventEmitter.getEmitter('testOutbound', user).removeAllListeners(successCallbackUrl)
            MyEventEmitter.getEmitter('testOutbound', user).removeAllListeners(errorCallbackUrl)
          }
          return reject(new Error(JSON.stringify({ curlRequest, syncResponse })))
        } else {
          customLogger.logOutboundRequest('info', 'Received response ' + result.status + ' ' + result.statusText, { additionalData: { response: result }, user, uniqueId, request: reqOpts })
        }

        if (!successCallbackUrl || !errorCallbackUrl || ignoreCallbacks) {
          return resolve({ curlRequest, syncResponse })
        }
        customLogger.logMessage('info', 'Received response ' + result.status + ' ' + result.statusText, { additionalData: result.data, notification: false, user })
      }, (err) => {
        syncResponse = {
          status: 500,
          statusText: err.message
        }
        customLogger.logOutboundRequest('error', 'Failed to send request ' + method + ' Error: ' + err.message, { additionalData: { errorStack: err.stack }, user, uniqueId, request: reqOpts })
        customLogger.logMessage('error', 'Failed to send request ' + method + ' Error: ' + err.message, { additionalData: { errorStack: err.stack }, notification: false, user })
        return reject(new Error(JSON.stringify({ errorCode: 4000, syncResponse })))
      })
    })()
  })
}

const setResultObject = (inputObject) => {
  if (typeof inputObject === 'string') {
    return inputObject
  } else if (typeof inputObject === 'object') {
    return JSON.stringify(inputObject)
  }
}

const replaceVariables = (inputObject, inputValues, request, requestsObj) => {
  let resultObject = setResultObject(inputObject)
  if (!resultObject) {
    return inputObject
  }
  // Check the string for any inclusions like {$some_param}
  const matchedArray = resultObject.match(/{\$([^}]+)}/g)
  if (matchedArray) {
    matchedArray.forEach(element => {
      // Check for the function type of param, if its function we need to call a function in custom-functions and replace the returned value
      const splitArr = element.split('.')
      switch (splitArr[0]) {
        case '{$function': {
          resultObject = resultObject.replace(element, getFunctionResult(element, inputValues, request))
          break
        }
        case '{$prev': {
          const temp = element.replace(/{\$prev.(.*)}/, '$1')
          const tempArr = temp.split('.')
          try {
            const replacedValue = _.get(requestsObj[tempArr[0]].appended, temp.replace(tempArr[0] + '.', ''))
            if (replacedValue) {
              resultObject = resultObject.replace(element, replacedValue)
            }
          } catch (err) {
            customLogger.logMessage('error', `${element} not found`, { notification: false })
          }
          break
        }
        case '{$request': {
          const temp = element.replace(/{\$request.(.*)}/, '$1')
          const replacedValue = _.get(request, temp)
          if (replacedValue && !replacedValue.startsWith('{$')) {
            resultObject = resultObject.replace(element, replacedValue)
          }
          break
        }
        case '{$inputs': {
          const temp = element.replace(/{\$inputs.(.*)}/, '$1')
          if (inputValues[temp]) {
            resultObject = resultObject.replace(element, inputValues[temp])
          }
          break
        }
        default:
          break
      }
    })
  }

  return (typeof inputObject === 'object') ? JSON.parse(resultObject) : resultObject
}

const replaceRequestVariables = (inputRequest) => {
  return _replaceGenericVariables(inputRequest, inputRequest, 'request')
}

const replaceEnvironmentVariables = (inputRequest, environment) => {
  return _replaceGenericVariables(inputRequest, environment, 'environment')
}

const replaceRequestLevelEnvironmentVariables = (inputRequest, requestVariables) => {
  return _replaceGenericVariables(inputRequest, requestVariables, 'requestVariables')
}

const _replaceGenericVariables = (inputRequest, replaceObject, variablePrefix) => {
  let resultObject = setResultObject(inputRequest)
  if (!resultObject) {
    return inputRequest
  }

  // Check once again for the replaced request variables
  const matchedArray = resultObject.match(/{\$([^}]+)}/g)
  if (matchedArray) {
    matchedArray.forEach(element => {
      // Check for the function type of param, if its function we need to call a function in custom-functions and replace the returned value
      const splitArr = element.split('.')
      if (splitArr[0] === '{$' + variablePrefix) {
        const regExp1 = new RegExp('{\\$' + variablePrefix + '.(.*)}')
        const temp2 = element.replace(regExp1, '$1')
        const replacedValue2 = _.get(replaceObject, temp2)
        if (replacedValue2 !== undefined) {
          resultObject = resultObject.replace(element, replacedValue2)
        }
      }
    })
  }

  return (typeof inputRequest === 'object') ? JSON.parse(resultObject) : resultObject
}

const replacePathVariables = (operationPath, params) => {
  let resultObject = operationPath

  // Check the string for any inclusions like {$some_param}
  const matchedArray = resultObject.match(/{([^}]+)}/g)
  if (matchedArray) {
    matchedArray.forEach(element => {
      const temp = element.replace(/{([^}]+)}/, '$1')
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

// Get Total Counts
const getTotalCounts = (inputTemplate) => {
  const result = {
    totalTestCases: 0,
    totalRequests: 0,
    totalAssertions: 0
  }
  const { test_cases } = inputTemplate  // eslint-disable-line
  result.totalTestCases = test_cases.length  // eslint-disable-line
  test_cases.forEach(testCase => { // eslint-disable-line
    const { requests } = testCase
    result.totalRequests += requests.length
    requests.forEach(request => {
      result.totalAssertions += request.tests && request.tests.assertions && request.tests.assertions.length
    })
  })
  return result
}

// Generate consolidated final report
const generateFinalReport = (inputTemplate, runtimeInformation) => {
  const { test_cases, ...remaingPropsInTemplate } = inputTemplate  // eslint-disable-line
  const resultTestCases = test_cases.map(testCase => { // eslint-disable-line
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
        runtimeInformation.totalAssertions += request.tests.assertions.length
        runtimeInformation.totalPassedAssertions += request.tests.passedAssertionsCount
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
    runtimeInformation
  }
}

module.exports = {
  OutboundSend,
  OutboundSendLoop,
  terminateOutbound,
  handleTests,
  sendRequest,
  replaceVariables,
  replaceRequestVariables,
  replaceEnvironmentVariables,
  replaceRequestLevelEnvironmentVariables,
  replacePathVariables,
  getFunctionResult,
  generateFinalReport
}
