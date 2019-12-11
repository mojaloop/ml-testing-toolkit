const RulesEngine = require('../RulesEngine')
const fs = require('fs')
var path = require('path')
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile)
const customLogger = require('../requestLogger')
const _ = require('lodash')

const rulesValidationFilePathPrefix = 'spec_files/rules_validation/'
const rulesCallbackFilePathPrefix = 'spec_files/rules_callback/'
const jsfRefFilePathPrefix = 'spec_files/jsf_ref_files/'

const validateRules = async (context, req) => {
  const rulesRespRawdata = await readFileAsync(rulesValidationFilePathPrefix + 'validationSet1.json')
  const rulesResp = JSON.parse(rulesRespRawdata)
  const rulesEngine = new RulesEngine()
  rulesEngine.loadRules(rulesResp)

  const facts = {
    operationPath: context.operation.path,
    path: context.request.path,
    body: context.request.body,
    method: context.request.method
  }

  const res = await rulesEngine.evaluate(facts)
  const generatedErrorCallback = {}

  if (res) {
    customLogger.logMessage('debug', 'Validation rules matched', res)
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
        const callbackGenerator = new (require('./openApiRequestGenerator'))(path.join(req.customInfo.specFile))
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
        // TODO: Generate mock request headers also from openapi file

        _.merge(generatedErrorCallback.body, replaceVariablesFromRequest(curEvent.params.body, context))
        if (curEvent.params.delay) {
          generatedErrorCallback.delay = curEvent.params.delay
        }
      } else {
        customLogger.logMessage('error', 'No Specification file provided for validateRules function')
      }
    }
  }
  return generatedErrorCallback
}

const callbackRules = async (context, req) => {
  const rulesCallbackRawdata = await readFileAsync(rulesCallbackFilePathPrefix + 'callbackSet1.json')
  const rulesCallback = JSON.parse(rulesCallbackRawdata)
  const rulesEngine = new RulesEngine()
  rulesEngine.loadRules(rulesCallback)

  const facts = {
    path: context.operation.path,
    body: context.request.body,
    method: context.request.method
  }

  const res = await rulesEngine.evaluate(facts)
  const generatedCallback = {}

  if (res) {
    customLogger.logMessage('debug', 'Callback rules matched', res)
    const curEvent = res[0]
    if (curEvent.type === 'FIXED_CALLBACK') {
      // TODO: replacement of params like ID and TYPE in path with the previous values
      generatedCallback.method = curEvent.params.method
      generatedCallback.path = curEvent.params.path
      // TODO: Replacement of any params in body with the previous values
      generatedCallback.body = curEvent.params.body
      // TODO: Replacement of any params in headers with the previous values
      generatedCallback.headers = curEvent.params.headers
      if (curEvent.params.delay) {
        generatedCallback.delay = curEvent.params.delay
      }
    } else if (curEvent.type === 'MOCK_CALLBACK') {
      if (req.customInfo.specFile) {
        const callbackGenerator = new (require('./openApiRequestGenerator'))(path.join(req.customInfo.specFile))
        const rawdata = await readFileAsync(jsfRefFilePathPrefix + 'test1.json')
        const jsfRefs1 = JSON.parse(rawdata)
        // TODO: Define a syntax to replace the params in path like ID or TYPE and replace those values in generatedErrorCallaback path
        generatedCallback.path = req.customInfo.callbackInfo.successCallback.path
        generatedCallback.method = req.customInfo.callbackInfo.successCallback.method
        generatedCallback.body = await callbackGenerator.generateRequestBody(generatedCallback.path, generatedCallback.method, jsfRefs1)
        // TODO: Generate mock request headers also from openapi file
        _.merge(generatedCallback.body, curEvent.params.body)
        if (curEvent.params.delay) {
          generatedCallback.delay = curEvent.params.delay
        }
      } else {
        customLogger.logMessage('error', 'No Specification file provided for validateRules function')
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
