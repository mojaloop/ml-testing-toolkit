/*****
 License
 --------------
 Copyright © 2020-2025 Mojaloop Foundation
 The Mojaloop files are made available by the Mojaloop Foundation under the Apache License, Version 2.0 (the "License") and you may not use these files except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, the Mojaloop files are distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

 Contributors
 --------------
 This is the official list of the Mojaloop project contributors for this file.
 Names of the original copyright holders (individuals or organizations)
 should be listed with a '*' in the first column. People who have
 contributed from an organization can be listed under the organization
 that actually holds the copyright for their contributions (see the
 Mojaloop Foundation for an example). Those individuals should have
 their names indented and be marked with a '-'. Email address can be added
 optionally within square brackets <email>.

 * Mojaloop Foundation
 - Name Surname <name.surname@mojaloop.io>

 * ModusBox
 * Georgi Logodazhki <georgi.logodazhki@modusbox.com>
 * Vijaya Kumar Guthi <vijaya.guthi@modusbox.com> (Original Author)
 --------------
 ******/

'use strict'

const util = require('node:util')
const Logger = require('@mojaloop/central-services-logger')
const Config = require('./config')
const NotificationEmitter = require('./notificationEmitter')
const DBAdapter = require('./db/adapters/dbAdapter')
const { TraceHeaderUtils } = require('@mojaloop/ml-testing-toolkit-shared-lib')

const logRequest = async (request, user) => {
  let message = `Request: ${request.method} ${request.path}`
  if (request.body) {
    message += ` Body: ${request.body}`
  }
  const userConfig = await Config.getUserConfig()
  logMessage('info', message, {
    additionalData: {
      request: {
        uniqueId: request.customInfo ? request.customInfo.uniqueId : null,
        headers: request.headers,
        queryParams: request.query,
        body: userConfig.MONITORING_LOG_INCLUDE_PAYLOAD ? request.payload : 'Payload is hidden - enable it in user-config MONITORING_LOG_INCLUDE_PAYLOAD'
      }
    },
    user,
    request,
    messageType: 'request'
  })
}

const logOutboundRequest = (verbosity, message, externalData = {}) => {
  externalData.notificationType = 'newOutboundLog'

  if (externalData.request.headers && externalData.request.headers.traceparent) {
    const traceparentHeaderArr = externalData.request.headers.traceparent.split('-')
    if (traceparentHeaderArr.length > 1) {
      const traceID = traceparentHeaderArr[1]
      if (!externalData.request.customInfo) {
        externalData.request.customInfo = {}
      }
      externalData.request.customInfo.traceID = traceID
      if (TraceHeaderUtils.isCustomTraceID(traceID)) {
        externalData.request.customInfo.endToEndID = TraceHeaderUtils.getEndToEndID(traceID)
        externalData.request.customInfo.sessionID = TraceHeaderUtils.getSessionID(traceID)
      }
    }
  }

  if (externalData.additionalData) {
    if (externalData.additionalData.request) {
      externalData.additionalData.request = {
        url: externalData.additionalData.request.url,
        uniqueId: externalData.uniqueId,
        headers: externalData.additionalData.request.headers,
        queryParams: externalData.additionalData.request.query,
        body: externalData.additionalData.request.payload || externalData.additionalData.request.data
      }
    } else if (externalData.additionalData.response) {
      const response = externalData.additionalData.response
      externalData.additionalData.response = {
        status: response.status,
        statusText: response.statusText,
        uniqueId: externalData.uniqueId,
        headers: response.headers,
        body: response.payload || response.data
      }
    }
  }
  logMessage(verbosity, message, externalData)
}

const logResponse = async (request, user) => {
  if (request.response) {
    const message = `Response: ${request.method} ${request.path} Status: ${request.response.statusCode}`
    const userConfig = await Config.getUserConfig()
    logMessage('info', message, {
      additionalData: {
        response: {
          uniqueId: request.customInfo.uniqueId || null,
          body: userConfig.MONITORING_LOG_INCLUDE_PAYLOAD ? request.response.source : 'Payload is hidden - enable it in user-config MONITORING_LOG_INCLUDE_PAYLOAD',
          status: request.response.statusCode
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
    additionalData: externalData.additionalData,
    notification: typeof externalData.notification !== 'undefined' ? externalData.notification : true,
    messageType: externalData.messageType || 'generic',
    request: externalData.request || null,
    user: externalData.user
  }
  switch (verbosity) {
    case 'debug':
      Logger.debug(message)
      if (data.additionalData !== undefined) Logger.debug(util.inspect(data.additionalData))
      break
    case 'warn':
      Logger.warn(message)
      if (data.additionalData !== undefined) Logger.warn(util.inspect(data.additionalData))
      break
    case 'error':
      Logger.error(message)
      if (data.additionalData !== undefined) Logger.error(util.inspect(data.additionalData))
      break
    case 'info':
    default: {
      Logger.info(message)
      if (data.additionalData !== undefined) Logger.info(util.inspect(data.additionalData))
    }
  }

  if (data.notification) {
    const log = {
      uniqueId: externalData.uniqueId || ((data.request && data.request.customInfo) ? data.request.customInfo.uniqueId : null),
      traceID: externalData.traceID || ((data.request && data.request.customInfo) ? data.request.customInfo.traceID : null),
      resource: externalData.resource || (data.request ? { method: data.request.method, path: data.request.path } : null),
      messageType: data.messageType,
      notificationType: externalData.notificationType || 'newLog',
      verbosity,
      message,
      additionalData: data.additionalData,
      logTime: new Date()
    }

    let sessionID
    const hostingEnabled = Config.getSystemConfig().HOSTING_ENABLED
    if (hostingEnabled) {
      if (!data.user && data.request && data.request.customInfo) {
        data.user = data.request.customInfo.user
      }
      sessionID = data.user ? data.user.dfspId : null
    } else {
      sessionID = data.request && data.request.customInfo ? data.request.customInfo.sessionID : null
    }

    if (log.notificationType === 'newOutboundLog') {
      NotificationEmitter.broadcastOutboundLog(log, sessionID)
    } else {
      NotificationEmitter.broadcastLog(log, sessionID)
    }

    if (hostingEnabled && data.user) {
      DBAdapter.upsert('logs', log, data.user)
    }
  }
}

module.exports = {
  logRequest,
  logOutboundRequest,
  logResponse,
  logMessage
}
