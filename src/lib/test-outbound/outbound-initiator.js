const _ = require('lodash')
const customLogger = require('../requestLogger')
const axios = require('axios').default
const Config = require('../config')
const MyEventEmitter = require('../MyEventEmitter')
const notificationEmitter = require('../notificationEmitter.js')
const fs = require('fs')
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile)

const OutboundSend = async (inputTemplate, outboundID) => {
  // Load the requests array into an object by the request id to access a particular object faster
  // console.log(inputTemplate.requests)
  const requestsObj = {}
  // Store the request ids into a new array
  const templateIDArr = []
  for (const i in inputTemplate.requests) {
    requestsObj[inputTemplate.requests[i].id] = inputTemplate.requests[i]
    templateIDArr.push(inputTemplate.requests[i].id)
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
    convertedRequest = replaceVariables(request, inputTemplate.inputValues, request, requestsObj)
    console.log(convertedRequest)
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
      // console.log(resp)
      request.appended = {
        response: resp,
        request: convertedRequest
      }
      notificationEmitter.broadcastOutboundProgress({
        outboundID: outboundID,
        status: 'SUCCESS',
        id: request.id,
        response: resp
      })
    } catch (err) {
      console.log('GVK', 'Caught the error, breaking the loop', err.message)
      notificationEmitter.broadcastOutboundProgress({
        outboundID: outboundID,
        status: 'ERROR',
        id: request.id,
        error: JSON.parse(err.message)
      })
      break
    }
  }
  // Set a timout if the response callback is not received in a particular time
  // Inform the progress to the client
  // Inform success to the client
}

const sendRequest = (method, path, headers, body, successCallbackUrl, errorCallbackUrl) => {
  return new Promise((resolve, reject) => {
    axios({
      method: method,
      url: Config.getUserConfig().CALLBACK_ENDPOINT + path,
      headers: headers,
      data: body,
      timeout: 3000,
      validateStatus: function (status) {
        return status < 900 // Reject only if the status code is greater than or equal to 900
      }
    }).then((result) => {
      if (result.status > 299) {
        reject(new Error(JSON.stringify(result.data)))
      }
      customLogger.logMessage('info', 'Received response ' + result.status + ' ' + result.statusText, result.data, false)
      // Listen for success callback
      MyEventEmitter.getTestOutboundEmitter().once(successCallbackUrl, (callbackHeaders, callbackBody) => {
        MyEventEmitter.getTestOutboundEmitter().removeAllListeners(errorCallbackUrl)
        resolve({ headers: callbackHeaders, body: callbackBody })
      })
      // Listen for error callback
      MyEventEmitter.getTestOutboundEmitter().once(errorCallbackUrl, (callbackHeaders, callbackBody) => {
        MyEventEmitter.getTestOutboundEmitter().removeAllListeners(successCallbackUrl)
        reject(new Error(JSON.stringify(callbackBody)))
      })
    }, (err) => {
      customLogger.logMessage('info', 'Failed to send request ' + method + ' ' + method, err, false)
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
          if (replacedValue2) {
            resultObject = resultObject.replace(element, replacedValue2)
          }
          break
        case '{$inputs':
          var temp = element.replace(/{\$inputs.(.*)}/, '$1')
          if (inputValues[temp]) {
            resultObject = resultObject.replace(element, inputValues[temp])
          }
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

const replacePathVariables = (operationPath, params) => {
  let resultObject = operationPath

  // Check the string for any inclusions like {$some_param}
  const matchedArray = resultObject.match(/{([^}]+)}/g)
  if (matchedArray) {
    matchedArray.forEach(element => {
      var temp = element.replace(/{([^}]+)}/, '$1')
      if (params[temp]) {
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
  OutboundSend
}
