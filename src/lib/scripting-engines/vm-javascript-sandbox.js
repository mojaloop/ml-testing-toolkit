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
 * Vijaya Kumar <vijaya.guthi@modusbox.com> (Original Author)
 --------------
 ******/

const Sandbox = require('vm')
const axiosModule = require('axios').default
const atob = require('atob')
const WebSocketClientManager = require('../webSocketClient/WebSocketClientManager').WebSocketClientManager
const InboundEventListener = require('../eventListenerClient/inboundEventListener').InboundEventListener
const JwsSigning = require('../jws/JwsSigning')
const Config = require('../config')
const httpAgentStore = require('../httpAgentStore')
const UniqueIdGenerator = require('../../lib/uniqueIdGenerator')
const customLogger = require('../requestLogger')

const registerAxiosRequestInterceptor = (userConfig, axios) => {
  axios.interceptors.request.use(config => {
    const options = { rejectUnauthorized: false }
    // Log the request
    const uniqueId = UniqueIdGenerator.generateUniqueId()
    config.uniqueId = uniqueId
    const reqObject = {
      method: config.method,
      url: config.url,
      path: config.url,
      headers: config.headers,
      data: config.body
    }
    config.reqObject = reqObject
    customLogger.logOutboundRequest('info', 'Request: ' + reqObject.method + ' ' + reqObject.url, { additionalData: { request: reqObject }, request: reqObject, uniqueId })
    // get the httpsAgent before the request is sent
    const urlObject = new URL(config.url)
    if (userConfig.CLIENT_MUTUAL_TLS_ENABLED) {
      const cred = userConfig.CLIENT_TLS_CREDS.filter(item => item.HOST === urlObject.host)
      if (Array.isArray(cred) && cred.length === 1) {
        console.log(`Found the Client certificate for ${urlObject.host}`)
        options.cert = cred[0].CERT
        options.key = cred[0].KEY
      } else {
        console.log(`Client certificate not found for ${urlObject.host}`)
      }
      config.httpsAgent = httpAgentStore.getHttpsAgent(urlObject.host, options)
    } else {
      if (config.url.startsWith('https:')) {
        config.httpsAgent = httpAgentStore.getHttpsAgent('generic', options)
      } else {
        config.httpAgent = httpAgentStore.getHttpAgent('generic')
      }
    }
    return config
  })
  axios.interceptors.response.use(res => {
    const config = res.config
    const uniqueId = config.uniqueId
    const reqObject = config.reqObject
    customLogger.logOutboundRequest('info', 'Response: ' + res.status + ' ' + res.statusText, { additionalData: { response: res }, request: reqObject, uniqueId })
    return res
  }, error => {
    const config = error.config
    const reqObject = config.reqObject
    const uniqueId = config.uniqueId
    customLogger.logOutboundRequest('error', 'Error Response: ' + error.message, { additionalData: error.stack, request: reqObject, uniqueId })
    return Promise.reject(error)
  })
}

const consoleWrapperFn = (consoleOutObj) => {
  return {
    log: function () {
      consoleOutObj.stdOut.push(arguments)
    }
  }
}

const customWrapperFn = (requestVariables) => {
  return {
    jws: {
      signRequest: function (key) {
        requestVariables.TTK_JWS_SIGN_KEY = key
      },
      validateCallback: function (headers, body, certificate) {
        try {
          JwsSigning.validateWithCert(headers, body, certificate)
          return 'VALID'
        } catch (err) {
          return err.message
        }
      },
      validateCallbackProtectedHeaders: function (headers) {
        try {
          JwsSigning.validateProtectedHeaders(headers)
          return 'VALID'
        } catch (err) {
          return err.message
        }
      }
    },
    sleep: function (delay) {
      return new Promise(resolve => setTimeout(resolve, delay))
    },
    setRequestTimeout: function (timeout) {
      requestVariables.REQUEST_TIMEOUT = timeout
    },
    skipRequest: function () {
      requestVariables.SKIP_REQUEST = true
    }
  }
}

const clearConsole = (consoleOutObj) => {
  consoleOutObj.stdOut = []
}

const preScript = `
(async () => {
`

const postScript = `
  return true
})()
`

const generateContextObj = async (environmentObj = {}) => {
  const consoleOutObj = {
    stdOut: []
  }
  const requestVariables = {}
  const consoleFn = consoleWrapperFn(consoleOutObj)
  const customFn = customWrapperFn(requestVariables)
  const websocket = new WebSocketClientManager(consoleFn)
  await websocket.init()
  const inboundEvent = new InboundEventListener(consoleFn)
  await inboundEvent.init()

  const userConfig = await Config.getStoredUserConfig()

  const axios = axiosModule.create()
  registerAxiosRequestInterceptor(userConfig, axios)

  const contextObj = {
    ctx: {
      dispose: () => {}
    },
    environment: { ...environmentObj },
    requestVariables,
    axios,
    atob,
    consoleWrapperFn,
    customWrapperFn,
    executeAsync,
    websocket,
    inboundEvent,
    console: consoleFn,
    custom: customFn,
    consoleOutObj,
    userConfig
  }
  return contextObj
}

const executeAsync = async (script, data, contextObj) => {
  const fullScript = preScript + script.join('\n') + postScript
  let consoleLog = []

  if (data.context.request) {
    contextObj.request = data.context.request
  }

  if (data.context.response) {
    contextObj.response = data.context.response
  }

  if (data.context.callback) {
    contextObj.callback = data.context.callback
  }

  if (data.context.collectionVariables) {
    contextObj.collectionVariables = data.context.collectionVariables.reduce((rObj, item) => { rObj[item.key] = item.value; return rObj }, {})
  }

  try {
    const options = { timeout: (contextObj.userConfig && contextObj.userConfig.SCRIPT_TIMEOUT) || 30000, microtaskMode: 'afterEvaluate' }
    await Sandbox.runInNewContext(fullScript, contextObj, options)
    for (let i = 0; i < contextObj.consoleOutObj.stdOut.length; i++) {
      consoleLog.push([{ execution: 0 }, 'log', ...contextObj.consoleOutObj.stdOut[i]])
    }
  } catch (err) {
    console.log(err)
    for (let i = 0; i < contextObj.consoleOutObj.stdOut.length; i++) {
      consoleLog.push([{ execution: 0 }, 'log', ...contextObj.consoleOutObj.stdOut[i]])
    }
    consoleLog.push([{ execution: 0 }, 'executionError', err.toString()])
  }

  const result = {
    consoleLog: consoleLog,
    environment: { ...contextObj.environment }
  }
  clearConsole(contextObj.consoleOutObj)
  consoleLog = []
  return result
}

module.exports = {
  generateContextObj,
  executeAsync
}
