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

'use strict'

// const Util = require('util')
var bunyan = require('bunyan')
var Logger = bunyan.createLogger({ name: 'ml-testing-toolkit', level: 'debug' })
const notificationEmitter = require('./notificationEmitter.js')

const logRequest = function (request) {
  let logMessage = `Request: ${request.method} ${request.path}`
  if (request.body) {
    logMessage += ` Body: ${request.body}`
  }
  const logObject = {
    request: {
      uniqueId: request.customInfo.uniqueId,
      headers: request.headers,
      body: request.payload
    }
  }
  Logger.info(logObject, logMessage)
  notificationEmitter.broadcastLog({ uniqueId: request.customInfo.uniqueId, resource: { method: request.method, path: request.path }, messageType: 'request', verbosity: 'info', message: logMessage, additionalData: logObject }, request.customInfo.sessionID)
}

const logResponse = function (request) {
  if (request.response) {
    const logObject = {
      response: {
        uniqueId: request.customInfo.uniqueId,
        body: request.response.source
      }
    }
    const logMessage = `Response: ${request.method} ${request.path} Status: ${request.response.statusCode}`
    Logger.info(logObject, logMessage)
    notificationEmitter.broadcastLog({ uniqueId: request.customInfo.uniqueId, resource: { method: request.method, path: request.path }, messageType: 'response', verbosity: 'info', message: logMessage, additionalData: logObject }, request ? request.customInfo.sessionID : null)
  }
}

const logMessage = (verbosity, message, additionalData = null, notification = true, request = null) => {
  switch (verbosity) {
    case 'debug':
      Logger.debug(additionalData, message)
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
    notificationEmitter.broadcastLog({ uniqueId: request ? request.customInfo.uniqueId : null, resource: request ? { method: request.method, path: request.path } : null, messageType: 'generic', verbosity, message: message, additionalData }, request ? request.customInfo.sessionID : null)
  }
}

module.exports = {
  logRequest,
  logResponse,
  logMessage
}
