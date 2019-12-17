const fs = require('fs')
var path = require('path')
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile)
const customLogger = require('../requestLogger')
const _ = require('lodash')
const rulesEngineModel = require('../rulesEngineModel')

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
      generatedErrorCallback.path = replaceVariablesFromRequest(curEvent.params.path, context)
      generatedErrorCallback.body = replaceVariablesFromRequest(curEvent.params.body, context)
      generatedErrorCallback.headers = replaceVariablesFromRequest(curEvent.params.headers, context)
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
          generatedErrorCallback.path = replaceVariablesFromRequest(req.customInfo.callbackInfo.errorCallback.pathPattern, context)
        } else {
          generatedErrorCallback.path = operationCallback
        }
        generatedErrorCallback.method = req.customInfo.callbackInfo.errorCallback.method
        generatedErrorCallback.body = await callbackGenerator.generateRequestBody(operationCallback, generatedErrorCallback.method, jsfRefs1)
        generatedErrorCallback.headers = await callbackGenerator.generateRequestHeaders(operationCallback, generatedErrorCallback.method, jsfRefs1)

        _.merge(generatedErrorCallback.body, replaceVariablesFromRequest(curEvent.params.body, context))
        _.merge(generatedErrorCallback.headers, replaceVariablesFromRequest(curEvent.params.headers, context))
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
      generatedCallback.path = replaceVariablesFromRequest(curEvent.params.path, context)
      generatedCallback.body = replaceVariablesFromRequest(curEvent.params.body, context)
      generatedCallback.headers = replaceVariablesFromRequest(curEvent.params.headers, context)
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

        if (req.customInfo.callbackInfo.successCallback.pathPattern) {
          generatedCallback.path = replaceVariablesFromRequest(req.customInfo.callbackInfo.successCallback.pathPattern, context)
        } else {
          generatedCallback.path = operationCallback
        }
        generatedCallback.method = req.customInfo.callbackInfo.successCallback.method
        generatedCallback.body = await callbackGenerator.generateRequestBody(operationCallback, generatedCallback.method, jsfRefs1)
        generatedCallback.headers = await callbackGenerator.generateRequestHeaders(operationCallback, generatedCallback.method, jsfRefs1)

        _.merge(generatedCallback.body, replaceVariablesFromRequest(curEvent.params.body, context))
        _.merge(generatedCallback.headers, replaceVariablesFromRequest(curEvent.params.headers, context))
        if (curEvent.params.delay) {
          generatedCallback.delay = curEvent.params.delay
        }
      } else {
        customLogger.logMessage('error', 'No Specification file provided for validateRules function', null, true, req)
      }
    }
  }
  return generatedCallback
}

const replaceVariablesFromRequest = (inputObject, fromObject) => {
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
      resultObject = resultObject.replace(element, getVariableValue(element, fromObject))
    })
  }

  if (typeof inputObject === 'object') {
    return JSON.parse(resultObject)
  } else {
    return resultObject
  }
}

const getVariableValue = (param, fromObject) => {
  const temp = param.replace(/{\$(.*)}/, "$1")
  return _.get(fromObject, temp)
}

module.exports.validateRules = validateRules
module.exports.callbackRules = callbackRules
