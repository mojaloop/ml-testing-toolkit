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

const customLogger = require('./requestLogger')
const Config = require('./config')
const axios = require('axios').default
const https = require('https')
const objectStore = require('./objectStore')
const MyEventEmitter = require('./MyEventEmitter')
const JwsSigning = require('./jws/JwsSigning')
const ConnectionProvider = require('./configuration-providers/mb-connection-manager')
const { TraceHeaderUtils } = require('ml-testing-toolkit-shared-lib')
const UniqueIdGenerator = require('./uniqueIdGenerator')
const httpAgentStore = require('./httpAgentStore')

const handleCallback = async (callbackObject, context, req) => {
  if (callbackObject.delay) {
    await new Promise(resolve => setTimeout(resolve, callbackObject.delay))
  }
  const userConfig = await Config.getUserConfig(req.customInfo.user)
  const uniqueId = UniqueIdGenerator.generateUniqueId(req)
  let callbackEndpoint = userConfig.CALLBACK_ENDPOINT
  if (Config.getSystemConfig().HOSTING_ENABLED) {
    const endpointsConfig = await ConnectionProvider.getEndpointsConfig()
    if (endpointsConfig.dfspEndpoints && callbackObject.callbackInfo.fspid && endpointsConfig.dfspEndpoints[callbackObject.callbackInfo.fspid]) {
      callbackEndpoint = endpointsConfig.dfspEndpoints[callbackObject.callbackInfo.fspid]
    } else {
      customLogger.logMessage('warning', 'Hosting is enabled, But there is no endpoint configuration found for DFSP ID: ' + callbackObject.callbackInfo.fspid, { request: req })
    }
  } else {
    const endpointsDfspWise = userConfig.ENDPOINTS_DFSP_WISE
    if (userConfig.HUB_ONLY_MODE && callbackObject.callbackInfo && callbackObject.callbackInfo.fspid && endpointsDfspWise.dfsps[callbackObject.callbackInfo.fspid]) {
      const dfspEndpoints = endpointsDfspWise.dfsps[callbackObject.callbackInfo.fspid]
      const dfspEndpoint = dfspEndpoints.endpoints.find(endpoint => endpoint.method === callbackObject.method && endpoint.path && callbackObject.path && endpoint.endpoint)
      if (dfspEndpoint) {
        callbackEndpoint = dfspEndpoint.endpoint
      } else {
        callbackEndpoint = dfspEndpoints.defaultEndpoint
      }
    } else if (userConfig.CALLBACK_RESOURCE_ENDPOINTS && userConfig.CALLBACK_RESOURCE_ENDPOINTS.enabled) {
      const callbackEndpoints = userConfig.CALLBACK_RESOURCE_ENDPOINTS
      const matchedObject = callbackEndpoints.endpoints.find(item => {
        if (item.method === callbackObject.method) {
          const path = new RegExp(item.path.replace(/{.*}/, '.*'))
          return path.test(callbackObject.path)
        }
        return false
      })
      if (matchedObject && matchedObject.endpoint) {
        callbackEndpoint = matchedObject.endpoint
      }
    }
  }

  // Handle the host header for hub-only requests
  if (userConfig.HUB_ONLY_MODE && callbackObject.headers && callbackObject.headers.host) {
    delete callbackObject.headers.host
  }

  const httpAgentProps = {}
  let urlGenerated = callbackEndpoint + callbackObject.path
  if (userConfig.OUTBOUND_MUTUAL_TLS_ENABLED) {
    const tlsConfig = await ConnectionProvider.getTlsConfig()
    if (!tlsConfig.dfsps[callbackObject.callbackInfo.fspid]) {
      const errorMsg = 'Outbound TLS is enabled, but there is no TLS config found for DFSP ID: ' + callbackObject.callbackInfo.fspid
      customLogger.logMessage('error', errorMsg, { request: req, notification: false })
      throw errorMsg
    }
    const httpsAgent = new https.Agent({
      cert: tlsConfig.dfsps[callbackObject.callbackInfo.fspid].hubClientCert,
      key: tlsConfig.hubClientKey,
      ca: [tlsConfig.dfsps[callbackObject.callbackInfo.fspid].dfspServerCaRootCert],
      rejectUnauthorized: true
    })
    httpAgentProps.httpsAgent = httpsAgent
    urlGenerated = urlGenerated.replace('http:', 'https:')
  } else if (userConfig.CLIENT_MUTUAL_TLS_ENABLED) {
    const urlObject = new URL(urlGenerated)
    const cred = userConfig.CLIENT_TLS_CREDS.filter(item => item.HOST === urlObject.host)
    if (Array.isArray(cred) && cred.length === 1) {
      customLogger.logMessage('info', `Found the Client certificate for ${urlObject.host}`, { request: req, notification: false })
      httpAgentProps.httpsAgent = httpAgentStore.getHttpsAgent(urlObject.host, {
        cert: cred[0].CERT,
        key: cred[0].KEY,
        rejectUnauthorized: false
      })
      urlGenerated = urlGenerated.replace('http:', 'https:')
    } else {
      const errorMsg = `client mutual TLS is enabled, but there is no TLS config found for ${urlObject.host}`
      customLogger.logMessage('error', errorMsg, { request: req, notification: false })
    }
  } else {
    if (urlGenerated.startsWith('https:')) {
      httpAgentProps.httpsAgent = httpAgentStore.getHttpsAgent('generic', {
        rejectUnauthorized: false
      })
    } else {
      httpAgentProps.httpAgent = httpAgentStore.getHttpAgent('generic')
    }
  }

  // Pass on the traceparent header if exists
  if (req.headers.traceparent) {
    callbackObject.headers.traceparent = req.headers.traceparent
  } else {
    if (req.customInfo && req.customInfo.traceID) {
      callbackObject.headers.traceparent = TraceHeaderUtils.getTraceParentHeader(req.customInfo.traceID)
    }
  }

  const reqOpts = {
    method: callbackObject.method,
    url: urlGenerated,
    path: callbackObject.path,
    headers: callbackObject.headers,
    data: callbackObject.body,
    timeout: userConfig.DEFAULT_REQUEST_TIMEOUT || 3000,
    ...httpAgentProps
  }

  // JwsSigning
  if (!userConfig.HUB_ONLY_MODE) {
    try {
      await JwsSigning.sign(reqOpts)
    } catch (err) {
      customLogger.logMessage('error', 'JWS signing failed', { additionalData: err })
    }
  }
  // Validate callback against openapi
  if (callbackObject.method !== 'put') {
    const validationResult = await context.api.validateRequest(callbackObject)
    if (validationResult.valid) {
      customLogger.logMessage('info', 'Callback schema is valid ' + callbackObject.method + ' ' + callbackObject.path, { request: req })
    } else {
      customLogger.logMessage('error', 'Callback schema is invalid ' + callbackObject.method + ' ' + callbackObject.path, { additionalData: validationResult.errors, request: req })
    }
  }
  // Store callbacks for assertion
  let assertionPath = callbackObject.path
  const assertionData = { headers: callbackObject.headers, body: callbackObject.body }
  if (assertionPath.endsWith('/error')) {
    assertionPath = assertionPath.replace('/error', '')
    assertionData.error = true
  }
  objectStore.push('callbacks', assertionPath, assertionData)
  MyEventEmitter.getEmitter('assertionCallback', req.customInfo.user).emit(assertionPath, assertionData)

  // Store all the callbacks in callbacksHistory
  objectStore.push('callbacksHistory', callbackObject.method + ' ' + callbackObject.path, { headers: callbackObject.headers, body: callbackObject.body })

  // Send callback
  if (userConfig.SEND_CALLBACK_ENABLE) {
    customLogger.logOutboundRequest('info', 'Request: ' + reqOpts.method + ' ' + reqOpts.path, { additionalData: { request: reqOpts }, request: reqOpts, uniqueId })
    customLogger.logMessage('info', 'Sending callback ' + callbackObject.method + ' ' + reqOpts.url, { additionalData: callbackObject, request: req })
    axios(reqOpts).then((result) => {
      customLogger.logOutboundRequest('info', 'Response: ' + reqOpts.method + ' ' + reqOpts.path, { additionalData: { response: result }, request: reqOpts, uniqueId })
      customLogger.logMessage('info', 'Received callback response ' + result.status + ' ' + result.statusText, { request: req })
    }, (err) => {
      customLogger.logOutboundRequest('error', 'Response: ' + reqOpts.method + ' ' + reqOpts.path, { additionalData: err, request: reqOpts, uniqueId })
      customLogger.logMessage('error', 'Failed to send callback ' + callbackObject.method + ' ' + reqOpts.url, { additionalData: err.message, request: req })
    })
  } else {
    customLogger.logMessage('info', 'Log callback ' + callbackObject.method + ' ' + callbackObject.path, { additionalData: callbackObject, request: req })
  }
}

module.exports.handleCallback = handleCallback
