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
const Config = require('../lib/config.js')
const getSessionID = (request) => {
  if (Config.getSystemConfig().HOSTING_ENABLED) {
    return request && request.headers && request.headers['fspiop-source'] ? request.headers['fspiop-source'] : null
  } else {
    return request && request.customInfo ? request.customInfo.sessionID : null
  }
}

const saveLog = (log, data) => {
  if (Config.getSystemConfig().HOSTING_ENABLED) {
    if (!data.user) {
      data.user = data.request.customInfo.user
    }
  }
}

const logRequest = function (request, user) {
  let log = `Request: ${request.method} ${request.path}`
  if (request.body) {
    log += ` Body: ${request.body}`
  }
  logMessage('info', log, {
    additionalData: {
      request: {
        uniqueId: request.customInfo ? request.customInfo.uniqueId : null,
        headers: request.headers,
        queryParams: request.query,
        body: request.payload
      }
    },
    user,
    request,
    messageType: 'request'
  })
}

const logResponse = function (request, user) {
  if (request.response) {
    const log = `Response: ${request.method} ${request.path} Status: ${request.response.statusCode}`
    logMessage('info', log, {
      additionalData: {
        response: {
          uniqueId: request.customInfo ? request.customInfo.uniqueId : null,
          body: request.response.source
        }
      },
      user,
      request,
      messageType: 'response'
    })
  }
}

const logMessage = (verbosity, message, externalData = {}) => {
  const data = {
    additionalData: externalData.additionalData || null,
    notification: typeof externalData.notification !== 'undefined' ? externalData.notification : true,
    messageType: externalData.messageType || 'generic',
    request: externalData.request || null,
    user: externalData.user
  }
  switch (verbosity) {
    case 'debug':
      Logger.debug(data.additionalData, message)
      break
    case 'warn':
      Logger.warn(message)
      break
    case 'error':
      Logger.error(message)
      break
    case 'info':
    default: {
      Logger.info(message)
    }
  }

  if (data.notification) {
    console.log(data.notification)
    console.log(verbosity)
    const log = {
      uniqueId: (data.request && data.request.customInfo) ? data.request.customInfo.uniqueId : null,
      traceID: (data.request && data.request.customInfo) ? data.request.customInfo.traceID : null,
      resource: data.request ? { method: data.request.method, path: data.request.path } : null,
      messageType: data.messageType,
      verbosity: data.verbosity,
      message: data.message,
      additionalData: data.additionalData
    }
    saveLog(log, data)
    notificationEmitter.broadcastLog(log, getSessionID(data.request))
  }
}

module.exports = {
  logRequest,
  logResponse,
  logMessage
}
