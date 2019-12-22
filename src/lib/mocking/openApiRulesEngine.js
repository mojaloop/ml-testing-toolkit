const fs = require('fs')
var path = require('path')
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile)
const customLogger = require('../requestLogger')
const _ = require('lodash')
const rulesEngineModel = require('../rulesEngineModel')
const Config = require('../config')

const jsfRefFilePathPrefix = 'spec_files/jsf_ref_files/'

const validateRules = async (context, req) => {
  const rulesEngine = await rulesEngineModel.getValidationRulesEngine()

  const facts = {
    operationPath: context.operation.path,
    path: context.request.path,
    body: context.request.body,
    method: context.request.method,
    pathParams: context.request.params
  }

  const res = await rulesEngine.evaluate(facts)
  const generatedErrorCallback = {}

  if (res) {
    customLogger.logMessage('debug', 'Validation rules matched', res, true, req)
    const curEvent = res[0]
    if (curEvent.type === 'FIXED_ERROR_CALLBACK') {
      generatedErrorCallback.method = curEvent.params.method
      generatedErrorCallback.path = replaceVariablesFromRequest(curEvent.params.path, context, req)
      generatedErrorCallback.body = replaceVariablesFromRequest(curEvent.params.body, context, req)
      generatedErrorCallback.headers = replaceVariablesFromRequest(curEvent.params.headers, context, req)
      if (curEvent.params.delay) {
        generatedErrorCallback.delay = curEvent.params.delay
      }
    } else if (curEvent.type === 'MOCK_ERROR_CALLBACK') {
      if (req.customInfo.specFile) {
        const callbackGenerator = new (require('./openApiRequestGenerator'))()
        await callbackGenerator.load(path.join(req.customInfo.specFile))
        const rawdata = await readFileAsync(jsfRefFilePathPrefix + 'test1.json')
        const jsfRefs1 = JSON.parse(rawdata)
        const operationCallback = req.customInfo.callbackInfo.errorCallback.path

        if (req.customInfo.callbackInfo.errorCallback.pathPattern) {
          generatedErrorCallback.path = replaceVariablesFromRequest(req.customInfo.callbackInfo.errorCallback.pathPattern, context, req)
        } else {
          generatedErrorCallback.path = operationCallback
        }
        generatedErrorCallback.method = req.customInfo.callbackInfo.errorCallback.method
        generatedErrorCallback.body = await callbackGenerator.generateRequestBody(operationCallback, generatedErrorCallback.method, jsfRefs1)
        generatedErrorCallback.headers = await callbackGenerator.generateRequestHeaders(operationCallback, generatedErrorCallback.method, jsfRefs1)

        _.merge(generatedErrorCallback.body, replaceVariablesFromRequest(curEvent.params.body, context, req))
        _.merge(generatedErrorCallback.headers, replaceVariablesFromRequest(curEvent.params.headers, context, req))
        if (curEvent.params.delay) {
          generatedErrorCallback.delay = curEvent.params.delay
        }
      } else {
        customLogger.logMessage('error', 'No Specification file provided for validateRules function', null, true, req)
      }
    }
  }
  return generatedErrorCallback
}

const callbackRules = async (context, req) => {
  const rulesEngine = await rulesEngineModel.getCallbackRulesEngine()

  const facts = {
    operationPath: context.operation.path,
    path: context.request.path,
    body: context.request.body,
    method: context.request.method,
    pathParams: context.request.params
  }

  const res = await rulesEngine.evaluate(facts)
  const generatedCallback = {}

  if (res) {
    customLogger.logMessage('debug', 'Callback rules matched', res, true, req)
    const curEvent = res[0]
    if (curEvent.type === 'FIXED_CALLBACK') {
      generatedCallback.method = curEvent.params.method
      generatedCallback.path = replaceVariablesFromRequest(curEvent.params.path, context, req)
      generatedCallback.body = replaceVariablesFromRequest(curEvent.params.body, context, req)
      generatedCallback.headers = replaceVariablesFromRequest(curEvent.params.headers, context, req)
      if (curEvent.params.delay) {
        generatedCallback.delay = curEvent.params.delay
      }
    } else if (curEvent.type === 'MOCK_CALLBACK') {
      if (req.customInfo.specFile) {
        const callbackGenerator = new (require('./openApiRequestGenerator'))()
        await callbackGenerator.load(path.join(req.customInfo.specFile))
        const rawdata = await readFileAsync(jsfRefFilePathPrefix + 'test1.json')
        const jsfRefs1 = JSON.parse(rawdata)
        const operationCallback = req.customInfo.callbackInfo.successCallback.path

        // Check if pathPattern from callback_map file exists and determine the callback path
        if (req.customInfo.callbackInfo.successCallback.pathPattern) {
          generatedCallback.path = replaceVariablesFromRequest(req.customInfo.callbackInfo.successCallback.pathPattern, context, req)
        } else {
          generatedCallback.path = operationCallback
        }
        generatedCallback.method = req.customInfo.callbackInfo.successCallback.method
        generatedCallback.body = await callbackGenerator.generateRequestBody(operationCallback, generatedCallback.method, jsfRefs1)
        generatedCallback.headers = await callbackGenerator.generateRequestHeaders(operationCallback, generatedCallback.method, jsfRefs1)

        // Override the values in generated callback with the values from callback map file
        if (req.customInfo.callbackInfo.successCallback.bodyOverride) {
          _.merge(generatedCallback.body, replaceVariablesFromRequest(req.customInfo.callbackInfo.successCallback.bodyOverride, context, req))
        }
        if (req.customInfo.callbackInfo.successCallback.headerOverride) {
          _.merge(generatedCallback.headers, replaceVariablesFromRequest(req.customInfo.callbackInfo.successCallback.headerOverride, context, req))
        }

        // Override the values in generated callback with the values from event params
        _.merge(generatedCallback.body, replaceVariablesFromRequest(curEvent.params.body, context, req))
        _.merge(generatedCallback.headers, replaceVariablesFromRequest(curEvent.params.headers, context, req))
        if (curEvent.params.delay) {
          generatedCallback.delay = curEvent.params.delay
        }
      } else {
        customLogger.logMessage('error', 'No Specification file provided for validateRules function', null, true, req)
      }
    }
  }
  require('./middleware-functions/ilp_stuff').handleQuoteIlp(context, generatedCallback)
  require('./middleware-functions/ilp_stuff').handleTransferIlp(context, generatedCallback)
  return generatedCallback
}

const replaceVariablesFromRequest = (inputObject, context, req) => {
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
          resultObject = resultObject.replace(element, getFunctionResult(element, context, req))
          break
        case '{$config':
          resultObject = resultObject.replace(element, getConfigValue(element, Config.USER_CONFIG))
          break
        case '{$request':
        default:
          resultObject = resultObject.replace(element, getVariableValue(element, context))

      }
    })
  }

  if (typeof inputObject === 'object') {
    return JSON.parse(resultObject)
  } else {
    return resultObject
  }
}

// Get the variable from the object using lodash library
const getVariableValue = (param, fromObject) => {
  const temp = param.replace(/{\$(.*)}/, "$1")
  return _.get(fromObject, temp)
}

// Get the config value from the object using lodash library
const getConfigValue = (param, fromObject) => {
  const temp = param.replace(/{\$config.(.*)}/, "$1")
  return _.get(fromObject, temp)
}

// Execute the function and return the result
const getFunctionResult = (param, fromObject, req) => {
  const temp = param.replace(/{\$function\.(.*)}/, "$1").split('.')
  if (temp.length === 2) {
    const fileName = temp[0]
    const functionName = temp[1]
    try {
      const fn = require('./custom-functions/' + fileName)[functionName]
      return fn(fromObject)
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND') {
        customLogger.logMessage('error', 'The specified custom function does not exist', param, true, req)
      } else {
        throw e
      }
      return param
    }
  } else {
    customLogger.logMessage('error', 'The specified custom function format is not correct', param, true, req)
    return param
  }
}

module.exports.validateRules = validateRules
module.exports.callbackRules = callbackRules
