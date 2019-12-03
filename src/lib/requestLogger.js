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

 * Rajiv Mothilal <rajiv.mothilal@modusbox.com>

 --------------
 ******/

'use strict'

// const Util = require('util')
var bunyan = require('bunyan')
var Logger = bunyan.createLogger({ name: 'ml-self-testing-toolkit', level: 'debug' })
const notificationEmitter = require('./notificationEmitter.js')

const logRequest = function (request) {
  let logMessage = `Request: ${request.method} ${request.path}`
  if (request.body) {
    logMessage += ` Body: ${request.body}`
  }
  const logObject = {
    request: {
      headers: request.headers,
      body: request.payload
    }
  }
  Logger.info(logObject, logMessage)
  notificationEmitter.broadcastLog({ messageType: 'request', verbosity: 'info', message: logMessage, additionalData: logObject })
}

const logResponse = function (request) {
  if (request.response) {
    const logObject = {
      response: {
        body: request.response.source
      }
    }
    const logMessage = `Response: ${request.method} ${request.path} Status: ${request.response.statusCode}`
    Logger.info(logObject, logMessage)
    notificationEmitter.broadcastLog({ messageType: 'response', verbosity: 'info', message: logMessage, additionalData: logObject })
  }
}

const logMessage = (verbosity, message, notification = true) => {
  switch (verbosity) {
    case 'debug':
      Logger.debug(message)
      break
    case 'warn':
      Logger.warn(message)
      break
    case 'error':
      Logger.error(message)
      break
    case 'info':
    default:
      Logger.info(message)
  }

  if (notification) {
    notificationEmitter.broadcastLog({ messageType: 'generic', verbosity, message: message })
  }
}

module.exports = {
  logRequest,
  logResponse,
  logMessage
}
