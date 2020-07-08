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
const Config = require('../lib/config')
const axios = require('axios').default
const https = require('https')
const assertionStore = require('./assertionStore')
const MyEventEmitter = require('./MyEventEmitter')
const JwsSigning = require('./jws/JwsSigning')
const ConnectionProvider = require('../lib/configuration-providers/mb-connection-manager')

const handleCallback = async (callbackObject, context, req) => {
  if (callbackObject.delay) {
    await new Promise(resolve => setTimeout(resolve, callbackObject.delay))
  }
  const userConfig = Config.getUserConfig()

  let callbackEndpoint = userConfig.CALLBACK_ENDPOINT
  if (userConfig.CALLBACK_RESOURCE_ENDPOINTS && userConfig.CALLBACK_RESOURCE_ENDPOINTS.enabled) {
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

  const httpsProps = {}
  let urlGenerated = callbackEndpoint + callbackObject.path
  if (userConfig.OUTBOUND_MUTUAL_TLS_ENABLED) {
    const tlsConfig = ConnectionProvider.getTlsConfig()
    const httpsAgent = new https.Agent({
      cert: tlsConfig.hubClientCert,
      key: tlsConfig.hubClientKey,
      ca: [tlsConfig.dfspServerCaRootCert],
      rejectUnauthorized: true
    })
    httpsProps.httpsAgent = httpsAgent
    urlGenerated = urlGenerated.replace('http:', 'https:')
  }

  // Pass on the traceparent header if exists
  if (req.headers.traceparent) {
    callbackObject.headers.traceparent = req.headers.traceparent
  }

  // JwsSigning
  const reqOpts = {
    method: callbackObject.method,
    url: urlGenerated,
    path: callbackObject.path,
    headers: callbackObject.headers,
    data: callbackObject.body,
    timeout: 3000,
    ...httpsProps
  }
  try {
    JwsSigning.sign(reqOpts)
  } catch (err) {
    console.log(err)
  }
  // Validate callback against openapi
  const validationResult = await context.api.validateRequest(callbackObject)
  if (validationResult.valid) {
    customLogger.logMessage('info', 'Callback schema is valid ' + callbackObject.method + ' ' + callbackObject.path, null, true, req)
  } else {
    customLogger.logMessage('error', 'Callback schema is invalid ' + callbackObject.method + ' ' + callbackObject.path, validationResult.errors, true, req)
  }
  // Store callbacks for assertion
  let assertionPath = callbackObject.path
  const assertionData = { headers: callbackObject.headers, body: callbackObject.body }
  if (assertionPath.endsWith('/error')) {
    assertionPath = assertionPath.replace('/error', '')
    assertionData.error = true
  }
  assertionStore.pushCallback(assertionPath, assertionData)
  MyEventEmitter.getEmitter('assertionCallback').emit(assertionPath, assertionData)

  // Send callback
  if (userConfig.SEND_CALLBACK_ENABLE) {
    customLogger.logMessage('info', 'Sending callback ' + callbackObject.method + ' ' + callbackObject.path, callbackObject, true, req)
    axios(reqOpts).then((result) => {
      customLogger.logMessage('info', 'Received callback response ' + result.status + ' ' + result.statusText, null, true, req)
    }, (err) => {
      customLogger.logMessage('error', 'Failed to send callback ' + callbackObject.method + ' ' + callbackObject.path, err, true, req)
    })
  } else {
    customLogger.logMessage('info', 'Log callback ' + callbackObject.method + ' ' + callbackObject.path, callbackObject, true, req)
  }
}

module.exports.handleCallback = handleCallback
