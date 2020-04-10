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
const ConnectionProvider = require('../configuration-providers/mb-connection-manager')

const OutboundSend = async (inputTemplate, outboundID) => {
  for (const i in inputTemplate.test_cases) {
    await processTestCase(inputTemplate.test_cases[i], outboundID, inputTemplate.inputValues)
  }

  // Send the total result to client
  const totalResult = inputTemplate
  notificationEmitter.broadcastOutboundProgress({
    status: 'FINISHED',
    outboundID: outboundID,
    totalResult
  })
}

const processTestCase = async (testCase, outboundID, inputValues) => {
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

  // TODO; Include version support
  const cbMapRawdata = await readFileAsync('spec_files/api_definitions/fspiop_1.0/callback_map.json')
  const reqCallbackMap = JSON.parse(cbMapRawdata)

  // Iterate the request ID array
  for (const i in templateIDArr) {
    const request = requestsObj[templateIDArr[i]]
    let convertedRequest = JSON.parse(JSON.stringify(request))
    // console.log(request)
    // Form the actual http request headers, body, path and method by replacing configurable parameters
    // Replace the parameters
    convertedRequest = replaceVariables(request, inputValues, request, requestsObj)
    convertedRequest = replaceRequestVariables(convertedRequest)

    // console.log(convertedRequest)
    // Form the path from params and operationPath
    convertedRequest.path = replacePathVariables(request.operationPath, convertedRequest.params)

    // Form callbacks
    // TODO: Get version from accept / content-type headers
    let successCallbackUrl = null
    let errorCallbackUrl = null
    if (reqCallbackMap[request.operationPath]) {
      if (reqCallbackMap[request.operationPath][request.method]) {
        successCallbackUrl = reqCallbackMap[request.operationPath][request.method].successCallback.method + ' ' + replaceVariables(reqCallbackMap[request.operationPath][request.method].successCallback.pathPattern, null, convertedRequest)
        errorCallbackUrl = reqCallbackMap[request.operationPath][request.method].errorCallback.method + ' ' + replaceVariables(reqCallbackMap[request.operationPath][request.method].errorCallback.pathPattern, null, convertedRequest)
      }
    }

    // Send http request
    try {
      const resp = await sendRequest(convertedRequest.method, convertedRequest.path, convertedRequest.headers, convertedRequest.body, successCallbackUrl, errorCallbackUrl)

      const testResult = await handleTests(convertedRequest, resp.syncResponse, resp.callback)
      request.appended = {
        status: 'SUCCESS',
        testResult,
        response: resp.syncResponse,
        callback: resp.callback,
        request: convertedRequest
      }
      notificationEmitter.broadcastOutboundProgress({
        outboundID: outboundID,
        testCaseId: testCase.id,
        status: 'SUCCESS',
        requestId: request.id,
        response: resp.syncResponse,
        callback: resp.callback,
        requestSent: convertedRequest,
        testResult
      })
    } catch (err) {
      const resp = JSON.parse(err.message)
      const testResult = await handleTests(convertedRequest, resp.syncResponse, resp.callback)
      request.appended = {
        status: 'ERROR',
        testResult,
        response: resp.syncResponse,
        callback: resp.callback,
        request: convertedRequest
      }
      notificationEmitter.broadcastOutboundProgress({
        outboundID: outboundID,
        testCaseId: testCase.id,
        status: 'ERROR',
        requestId: request.id,
        response: resp.syncResponse,
        callback: resp.callback,
        requestSent: convertedRequest,
        testResult
      })
      break
    }
  }

  // Return status report of this test case
  return testCase
  // Set a timeout if the response callback is not received in a particular time
}

const handleTests = async (request, response = null, callback = null) => {
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

const sendRequest = (method, path, headers, body, successCallbackUrl, errorCallbackUrl) => {
  return new Promise((resolve, reject) => {
    const httpsProps = {}
    let urlGenerated = Config.getUserConfig().CALLBACK_ENDPOINT + path
    if (Config.getUserConfig().OUTBOUND_MUTUAL_TLS_ENABLED) {
      const tlsConfig = ConnectionProvider.getTlsConfig()
      const httpsAgent = new https.Agent({
        cert: tlsConfig.hubClientCert,
        key: tlsConfig.hubClientKey,
        ca: [tlsConfig.dfspServerCaRootCert],
        rejectUnauthorized: true
      })
      httpsProps.httpsAgent = httpsAgent
      urlGenerated = urlGenerated = urlGenerated.replace('http:', 'https:')
    }

    const reqOpts = {
      method: method,
      url: urlGenerated,
      path: path,
      headers: headers,
      data: body,
      timeout: 3000,
      validateStatus: function (status) {
        return status < 900 // Reject only if the status code is greater than or equal to 900
      },
      ...httpsProps
    }
    try {
      JwsSigning.sign(reqOpts)
    } catch (err) {
      console.log(err)
    }
    axios(reqOpts).then((result) => {
      const syncResponse = {
        status: result.status,
        statusText: result.statusText,
        data: result.data
      }
      if (result.status > 299) {
        reject(new Error(JSON.stringify({ syncResponse })))
      }
      customLogger.logMessage('info', 'Received response ' + result.status + ' ' + result.statusText, result.data, false)
      // Listen for success callback
      MyEventEmitter.getTestOutboundEmitter().once(successCallbackUrl, (callbackHeaders, callbackBody) => {
        MyEventEmitter.getTestOutboundEmitter().removeAllListeners(errorCallbackUrl)
        resolve({ syncResponse: syncResponse, callback: { headers: callbackHeaders, body: callbackBody } })
      })

      // Listen for error callback
      MyEventEmitter.getTestOutboundEmitter().once(errorCallbackUrl, (callbackHeaders, callbackBody) => {
        MyEventEmitter.getTestOutboundEmitter().removeAllListeners(successCallbackUrl)
        reject(new Error(JSON.stringify({ syncResponse: syncResponse, callback: { body: callbackBody } })))
      })
    }, (err) => {
      customLogger.logMessage('info', 'Failed to send request ' + method + ' Error: ' + err.message, err, false)
      reject(new Error(JSON.stringify({ errorCode: 4000 })))
    })
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
          var replacedValue = _.get(requestsObj[temp1Arr[0]].appended, temp1.replace(temp1Arr[0] + '.', ''))
          if (replacedValue) {
            resultObject = resultObject.replace(element, replacedValue)
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
  const temp = param.replace(/{\$function\.(.*)}/, '$1').split('.')
  if (temp.length === 2) {
    const fileName = temp[0]
    const functionName = temp[1]
    try {
      const fn = require('./custom-functions/' + fileName)[functionName]
      if (!fn) {
        customLogger.logMessage('error', 'The specified custom function does not exist', param, false)
        return param
      }
      return fn(inputValues, request)
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND') {
        customLogger.logMessage('error', 'The specified custom function does not exist', param, false)
      } else {
        throw e
      }
      return param
    }
  } else {
    customLogger.logMessage('error', 'The specified custom function format is not correct', param, false)
    return param
  }
}

module.exports = {
  OutboundSend,
  handleTests,
  sendRequest,
  replaceVariables,
  replaceRequestVariables,
  replacePathVariables,
  getFunctionResult
}
