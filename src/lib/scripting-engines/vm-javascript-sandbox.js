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
const axios = require('axios').default
const atob = require('atob')
const WebSocketClientManager = require('../webSocketClient/WebSocketClientManager').WebSocketClientManager
const JwsSigning = require('../jws/JwsSigning')

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
    console: consoleFn,
    custom: customFn,
    consoleOutObj
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
    await Sandbox.runInNewContext(fullScript, contextObj, { timeout: 30000, microtaskMode: 'afterEvaluate' })
    for (let i = 0; i < contextObj.consoleOutObj.stdOut.length; i++) {
      consoleLog.push([{ execution: 0 }, 'log', ...contextObj.consoleOutObj.stdOut[i]])
    }
  } catch (err) {
    // console.log(err)
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
