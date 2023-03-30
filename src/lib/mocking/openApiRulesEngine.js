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

const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile)
const customLogger = require('../requestLogger')
const _ = require('lodash')
const rulesEngineModel = require('../rulesEngineModel')
const Config = require('../config')
const objectStore = require('../objectStore')
const utilsInternal = require('../utilsInternal')
const uuid = require('uuid')
const postmanContext = require('../scripting-engines/postman-sandbox')
const javascriptContext = require('../scripting-engines/vm-javascript-sandbox')
const { OpenApiMockGenerator } = require('@mojaloop/ml-testing-toolkit-shared-lib')

// const jsfRefFilePathPrefix = 'spec_files/jsf_ref_files/'

const removeEmpty = obj => {
  if (obj) {
    Object.keys(obj).forEach(key => {
      if (obj[key] && typeof obj[key] === 'object') removeEmpty(obj[key])
      else if (obj[key] == null) delete obj[key]
    })
  }
}

const executeScripts = async (curEvent, req) => {
  if (curEvent.params.scripts && curEvent.params.scripts.exec && curEvent.params.scripts.exec.length > 0 && curEvent.params.scripts.exec !== ['']) {
    const sandboxEnvironment = objectStore.get('inboundEnvironment')
    customLogger.logMessage('debug', 'Inbound Script: Starting...', { additionalData: curEvent.params.scripts.exec, request: req })
    let context = postmanContext
    if (curEvent.params.scripts.scriptingEngine && curEvent.params.scripts.scriptingEngine === 'javascript') {
      context = javascriptContext
    }
    const contextObj = await context.generateContextObj(sandboxEnvironment)

    const postmanRequest = {
      body: JSON.stringify(req.payload),
      method: req.method,
      headers: req.headers,
      url: {
        path: req.path,
        query: Object.keys(req.query || {}).length === 0 ? [] : req.query
      }
    }
    // Set global variables userConfig
    const globals = []
    const userConfig = await Config.getUserConfig(req.customInfo.user)
    globals.push(
      {
        type: 'any',
        key: 'userConfig',
        value: JSON.stringify(userConfig)
      }
    )
    const postmanSandbox = await context.executeAsync(curEvent.params.scripts.exec, { context: { ...contextObj, request: postmanRequest, globals }, id: uuid.v4() }, contextObj)

    const additionalData = {
      consoleLogArray: postmanSandbox.consoleLog && postmanSandbox.consoleLog.map(log => log[2]),
      environment: postmanSandbox.environment
    }
    customLogger.logMessage('debug', 'Inbound Script: Executed', { additionalData, request: req })
    // replace inbound environment with the sandbox environment
    const mergedInboundEnvironment = postmanSandbox.environment
    objectStore.set('inboundEnvironment', mergedInboundEnvironment)
    // Mutating event based on script output
    if (contextObj.requestVariables?.OVERRIDE_EVENT?.appendMode) {
      customLogger.logMessage('debug', 'Mutating event body based on script', {
        additionalData: contextObj.requestVariables.OVERRIDE_EVENT,
        request: req
      })
      _.merge(curEvent.params.body, contextObj.requestVariables.OVERRIDE_EVENT?.body)
    }
    contextObj.ctx.dispose()
    contextObj.ctx = null
  }
}

const replaceEnvironmentsFromRules = async (rulesObject) => {
  const rules = JSON.parse(JSON.stringify(rulesObject || []))
  const environment = objectStore.get('inboundEnvironment')

  let reloadRules = false
  rules.forEach(rule => {
    Object.keys(rule.conditions).forEach(conditionType => {
      rule.conditions[conditionType].forEach((condition) => {
        if (condition.value && condition.value.split('.')[0] === '{$environment') {
          condition.value = getEnvironmentValue(condition.value, environment)
          reloadRules = true
        }
      })
    })
  })

  return reloadRules ? rules : undefined
}

const validateRules = async (context, req) => {
  const rules = await rulesEngineModel.getValidationRules(req.customInfo.user)

  const newRules = await replaceEnvironmentsFromRules(rules)
  const rulesEngine = await rulesEngineModel.getValidationRulesEngine(newRules, req.customInfo.user)

  const curEvent = await evaluate(rulesEngine, context)

  let generatedErrorCallback = {}

  if (curEvent) {
    customLogger.logMessage('debug', 'Validation rules matched', { additionalData: curEvent, request: req })
    if (curEvent.params.delay) {
      generatedErrorCallback.delay = curEvent.params.delay
    }

    await executeScripts(curEvent, req)

    if (curEvent.type === 'FIXED_ERROR_CALLBACK') {
      const operationCallback = req.customInfo.callbackInfo.errorCallback.path

      generatedErrorCallback.path = (req.customInfo.callbackInfo.errorCallback.pathPattern)
        ? await replaceVariablesFromRequest(req.customInfo.callbackInfo.errorCallback.pathPattern, context, req)
        : operationCallback
      generatedErrorCallback.callbackInfo = await replaceVariablesFromRequest(req.customInfo.callbackInfo, context, req)
      generatedErrorCallback.method = req.customInfo.callbackInfo.errorCallback.method
      generatedErrorCallback.body = await replaceVariablesFromRequest(curEvent.params.body, context, req)
      generatedErrorCallback.headers = await replaceVariablesFromRequest(curEvent.params.headers, context, req)
    } else if (curEvent.type === 'MOCK_ERROR_CALLBACK') {
      if (req.customInfo.specFile) {
        generatedErrorCallback = await generateMockErrorCallback(context, req)

        _.merge(generatedErrorCallback.body, await replaceVariablesFromRequest(curEvent.params.body, context, req))
        _.merge(generatedErrorCallback.headers, await replaceVariablesFromRequest(curEvent.params.headers, context, req))
        removeEmpty(generatedErrorCallback.body)
      } else {
        customLogger.logMessage('error', 'No Specification file provided for validateRules function', { request: req })
      }
    } else if (curEvent.type === 'NO_CALLBACK') {
      customLogger.logMessage('info', 'Skipping validation callback', { additionalData: curEvent, request: req })
      generatedErrorCallback.skipCallback = true
    }
  }
  return generatedErrorCallback
}

const generateMockErrorCallback = async (context, req) => {
  const generatedErrorCallback = {}
  const callbackGenerator = new OpenApiMockGenerator()
  await callbackGenerator.load(path.join(req.customInfo.specFile))
  let jsfRefs1 = []
  if (req.customInfo.jsfRefFile) {
    try {
      const rawdata = await readFileAsync(req.customInfo.jsfRefFile)
      jsfRefs1 = JSON.parse(rawdata)
    } catch (err) {}
  }
  const operationCallback = req.customInfo.callbackInfo.errorCallback.path

  if (req.customInfo.callbackInfo.errorCallback.pathPattern) {
    generatedErrorCallback.path = await replaceVariablesFromRequest(req.customInfo.callbackInfo.errorCallback.pathPattern, context, req)
  } else {
    generatedErrorCallback.path = operationCallback
  }
  generatedErrorCallback.callbackInfo = await replaceVariablesFromRequest(req.customInfo.callbackInfo, context, req)
  generatedErrorCallback.method = req.customInfo.callbackInfo.errorCallback.method
  generatedErrorCallback.body = await callbackGenerator.generateRequestBody(operationCallback, generatedErrorCallback.method, jsfRefs1)
  generatedErrorCallback.headers = await callbackGenerator.generateRequestHeaders(operationCallback, generatedErrorCallback.method, jsfRefs1)

  // Override the values in generated callback with the values from callback map file
  if (req.customInfo.callbackInfo.errorCallback.bodyOverride) {
    _.merge(generatedErrorCallback.body, await replaceVariablesFromRequest(req.customInfo.callbackInfo.errorCallback.bodyOverride, context, req))
    removeEmpty(generatedErrorCallback.body)
  }
  if (req.customInfo.callbackInfo.errorCallback.headerOverride) {
    _.merge(generatedErrorCallback.headers, await replaceVariablesFromRequest(req.customInfo.callbackInfo.errorCallback.headerOverride, context, req))
  }
  return generatedErrorCallback
}

const evaluate = async (rulesEngine, context) => {
  const facts = {
    operationPath: context.operation.path,
    path: context.request.path,
    method: context.request.method,
    body: context.request.body || {},
    pathParams: context.request.params || {},
    headers: context.request.headers || {},
    queryParams: context.request.query ? JSON.parse(JSON.stringify(context.request.query)) : {}
  }
  const res = await rulesEngine.evaluate(facts)
  if (res) {
    const curEvent = res[0]
    if (!curEvent.params) {
      curEvent.params = {}
    }
    return curEvent
  }
}

const callbackRules = async (context, req) => {
  const rules = await rulesEngineModel.getCallbackRules(req.customInfo.user)

  const newRules = await replaceEnvironmentsFromRules(rules)
  const rulesEngine = await rulesEngineModel.getCallbackRulesEngine(newRules, req.customInfo.user)

  const curEvent = await evaluate(rulesEngine, context)

  const generatedCallback = {}
  if (curEvent) {
    customLogger.logMessage('debug', 'Callback rules are matched', { additionalData: curEvent, request: req })
    if (curEvent.params.delay) {
      generatedCallback.delay = curEvent.params.delay
    }

    await executeScripts(curEvent, req)

    if (curEvent.type === 'FIXED_CALLBACK') {
      // Add event info to generated callback
      generatedCallback.eventInfo = {
        ...curEvent
      }
      const operationCallback = req.customInfo.callbackInfo.successCallback.path

      // Check if pathPattern from callback_map file exists and determine the callback path
      if (req.customInfo.callbackInfo.successCallback.pathPattern) {
        generatedCallback.path = await replaceVariablesFromRequest(req.customInfo.callbackInfo.successCallback.pathPattern, context, req)
      } else {
        generatedCallback.path = operationCallback
      }
      generatedCallback.callbackInfo = await replaceVariablesFromRequest(req.customInfo.callbackInfo, context, req)
      generatedCallback.method = req.customInfo.callbackInfo.successCallback.method
      generatedCallback.body = await replaceVariablesFromRequest(curEvent.params.body, context, req)
      generatedCallback.headers = await replaceVariablesFromRequest(curEvent.params.headers, context, req)
    } else if (curEvent.type === 'MOCK_CALLBACK') {
      // Add event info to generated callback
      generatedCallback.eventInfo = {
        ...curEvent
      }
      if (req.customInfo.specFile) {
        const callbackGenerator = new OpenApiMockGenerator()
        await callbackGenerator.load(path.join(req.customInfo.specFile))
        let jsfRefs1 = []
        if (req.customInfo.jsfRefFile) {
          try {
            const rawdata = await readFileAsync(req.customInfo.jsfRefFile)
            jsfRefs1 = JSON.parse(rawdata)
          } catch (err) {}
        }
        const operationCallback = req.customInfo.callbackInfo.successCallback.path

        // Check if pathPattern from callback_map file exists and determine the callback path
        if (req.customInfo.callbackInfo.successCallback.pathPattern) {
          generatedCallback.path = await replaceVariablesFromRequest(req.customInfo.callbackInfo.successCallback.pathPattern, context, req)
        } else {
          generatedCallback.path = operationCallback
        }
        generatedCallback.callbackInfo = await replaceVariablesFromRequest(req.customInfo.callbackInfo, context, req)
        generatedCallback.method = req.customInfo.callbackInfo.successCallback.method
        generatedCallback.body = await callbackGenerator.generateRequestBody(operationCallback, generatedCallback.method, jsfRefs1)
        generatedCallback.headers = await callbackGenerator.generateRequestHeaders(operationCallback, generatedCallback.method, jsfRefs1)

        // Override the values in generated callback with the values from callback map file
        if (req.customInfo.callbackInfo.successCallback.bodyOverride) {
          _.merge(generatedCallback.body, await replaceVariablesFromRequest(req.customInfo.callbackInfo.successCallback.bodyOverride, context, req))
          removeEmpty(generatedCallback.body)
        }
        if (req.customInfo.callbackInfo.successCallback.headerOverride) {
          _.merge(generatedCallback.headers, await replaceVariablesFromRequest(req.customInfo.callbackInfo.successCallback.headerOverride, context, req))
        }

        // Override the values in generated callback with the values from event params
        _.merge(generatedCallback.body, await replaceVariablesFromRequest(curEvent.params.body, context, req))
        removeEmpty(generatedCallback.body)
        _.merge(generatedCallback.headers, await replaceVariablesFromRequest(curEvent.params.headers, context, req))
      } else {
        customLogger.logMessage('error', 'No Specification file provided for validateRules function', { request: req })
      }
    } else if (curEvent.type === 'NO_CALLBACK') {
      customLogger.logMessage('info', 'Skipping callback', { additionalData: curEvent, request: req })
      generatedCallback.skipCallback = true
    }
  } else {
    customLogger.logMessage('error', 'No callback rules are matched', { request: req })
  }

  return generatedCallback
}

const responseRules = async (context, req) => {
  const rules = await rulesEngineModel.getResponseRules(req.customInfo.user)

  const newRules = await replaceEnvironmentsFromRules(rules)
  const rulesEngine = await rulesEngineModel.getResponseRulesEngine(newRules, req.customInfo.user)

  const curEvent = await evaluate(rulesEngine, context)

  const generatedResponse = {}

  if (curEvent) {
    customLogger.logMessage('debug', 'Response rules are matched', { additionalData: curEvent, request: req })
    if (curEvent.params.delay) {
      generatedResponse.delay = curEvent.params.delay
    }

    await executeScripts(curEvent, req)

    if (curEvent.type === 'FIXED_RESPONSE') {
      generatedResponse.body = await replaceVariablesFromRequest(curEvent.params.body, context, req)
      generatedResponse.status = +curEvent.params.statusCode
    } else if (curEvent.type === 'MOCK_RESPONSE') {
      if (req.customInfo.specFile) {
        const responseGenerator = new OpenApiMockGenerator()
        await responseGenerator.load(path.join(req.customInfo.specFile))
        let jsfRefs1 = []
        if (req.customInfo.jsfRefFile) {
          try {
            const rawdata = await readFileAsync(req.customInfo.jsfRefFile)
            jsfRefs1 = JSON.parse(rawdata)
          } catch (err) {}
        }
        const { body, status } = await responseGenerator.generateResponseBody(context.operation.path, context.request.method, jsfRefs1)
        generatedResponse.body = body
        generatedResponse.status = +status
        // generatedResponse.headers = await responseGenerator.generateRequestHeaders(operationCallback, generatedResponse.method, jsfRefs1)

        // Override the values in generated callback with the values from callback map file
        if (req.customInfo.responseInfo && req.customInfo.responseInfo.response.bodyOverride) {
          _.merge(generatedResponse.body, await replaceVariablesFromRequest(req.customInfo.responseInfo.response.bodyOverride, context, req))
          removeEmpty(generatedResponse.body)
        }

        // Override the values in generated callback with the values from event params
        _.merge(generatedResponse.body, await replaceVariablesFromRequest(curEvent.params.body, context, req))
        removeEmpty(generatedResponse.body)
        _.merge(generatedResponse.headers, await replaceVariablesFromRequest(curEvent.params.headers, context, req))
      } else {
        customLogger.logMessage('error', 'No Specification file provided for responseRules function', { request: req })
      }
    }
  } else {
    customLogger.logMessage('info', 'No response rules are matched', { request: req })
  }
  return generatedResponse
}

const forwardRules = async (context, req) => {
  const rules = await rulesEngineModel.getForwardRules(req.customInfo.user)

  const newRules = await replaceEnvironmentsFromRules(rules)
  const rulesEngine = await rulesEngineModel.getForwardRulesEngine(newRules, req.customInfo.user)

  const curEvent = await evaluate(rulesEngine, context)

  if (curEvent) {
    const forwardedRequest = {}
    customLogger.logMessage('debug', 'Forward rules are matched', { additionalData: curEvent, request: req })
    await executeScripts(curEvent, req)

    if (curEvent.type === 'FORWARD') {
      if (req.customInfo && req.customInfo.callbackInfo) {
        forwardedRequest.callbackInfo = await replaceVariablesFromRequest(req.customInfo.callbackInfo, context, req)
      } else {
        forwardedRequest.callbackInfo = {}
      }
      if (curEvent.params.dfspId) {
        forwardedRequest.callbackInfo.fspid = curEvent.params.dfspId
      }
      forwardedRequest.path = req.path
      forwardedRequest.method = req.method
      forwardedRequest.body = req.payload
      forwardedRequest.headers = req.headers
    }
    return forwardedRequest
  } else {
    customLogger.logMessage('error', 'No forward rules are matched', { request: req })
    return false
  }
}

const replaceVariablesFromRequest = async (inputObject, context, req) => {
  let resultObject
  // Check whether inputObject is string or object. If it is object, then convert that to JSON string and parse it while return
  if (typeof inputObject === 'string') {
    resultObject = inputObject
  } else if (typeof inputObject === 'object') {
    resultObject = JSON.stringify(inputObject)
  } else {
    return inputObject
  }

  // Check the string for any inclusions like {$some_param}
  const environment = objectStore.get('inboundEnvironment')
  const matchedArray = resultObject.match(/{\$([^}]+)}/g)
  if (matchedArray) {
    const userConfig = await Config.getUserConfig(req.customInfo.user)
    matchedArray.forEach(element => {
      const splitArr = element.split('.')
      switch (splitArr[0]) {
        case '{$function':
          resultObject = resultObject.replace(element, getFunctionResult(element, context, req))
          break
        case '{$config': {
          resultObject = resultObject.replace(element, getConfigValue(element, userConfig))
          break
        }
        case '{$session':
          resultObject = resultObject.replace(element, getSessionValue(element, req.customInfo))
          break
        case '{$environment':
          resultObject = resultObject.replace(element, getEnvironmentValue(element, environment))
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
  const temp = param.replace(/{\$(.*)}/, '$1')
  return _.get(fromObject, temp)
}

// Get the config value from the object using lodash library
const getConfigValue = (param, fromObject) => {
  const temp = param.replace(/{\$config.(.*)}/, '$1')
  return _.get(fromObject, temp)
}

// Get the customInfo value from the object using lodash library
const getSessionValue = (param, fromObject) => {
  const temp = param.replace(/{\$session.(.*)}/, '$1')
  return _.get(fromObject, temp)
}

// Execute the function and return the result
const getFunctionResult = (param, fromObject, req) => {
  return utilsInternal.getFunctionResult(param, fromObject, req)
}

const getEnvironmentValue = (param, fromObject) => {
  const temp = param.replace(/{\$environment.(.*)}/, '$1')
  return _.get(fromObject, temp)
}

module.exports = {
  validateRules,
  callbackRules,
  responseRules,
  forwardRules,
  generateMockErrorCallback
}
