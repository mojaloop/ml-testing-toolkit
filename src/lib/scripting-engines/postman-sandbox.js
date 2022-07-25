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
 * Georgi Logodazhki <georgi.logodazhki@modusbox.com> (Original Author)
 --------------
 ******/

const Sandbox = require('postman-sandbox')
const util = require('util')
const axios = require('axios').default
const customLogger = require('../requestLogger')
const UniqueIdGenerator = require('../../lib/uniqueIdGenerator')

// const createContextAsync = util.promisify(Sandbox.createContext)
const createContextAsync = () => {
  return new Promise((resolve, reject) => {
    Sandbox.createContext(function (err, ctx) {
      if (err) {
        reject(err)
        return console.error(err)
      }
      resolve(ctx)
    })
  })
}

const generateContextObj = async (environment = {}) => {
  const ctx = await createContextAsync({ timeout: 30000 })
  ctx.executeAsync = util.promisify(ctx.execute)
  ctx.on('error', function (cursor, err) {
    // log the error in postman sandbox
    console.log(cursor, err)
  })
  const contextObj = {
    ctx,
    environment
  }
  return contextObj
}

const executeAsync = async (script, data, contextObj) => {
  let consoleLog = []
  const uniqueId = UniqueIdGenerator.generateUniqueId()
  // Append ctx and environment to data.context
  if (!data.context) {
    data.context = {}
  }
  data.context.ctx = contextObj.ctx
  data.context.environment = Object.entries(contextObj.environment || {}).map((item) => { return { type: 'any', key: item[0], value: item[1] } })

  contextObj.ctx.on('console', function () {
    consoleLog.push(Array.from(arguments))
  })

  contextObj.ctx.on(`execution.request.${data.id}`, async (cursor, id, requestId, req) => {
    const host = `${req.url.protocol}://${req.url.host.join('.')}${req.url.port ? ':' + req.url.port : ''}/`
    let response
    try {
      let queryParams = ''
      if (req.url.query && req.url.query.length > 0) {
        queryParams = '?'
        req.url.query.forEach(queryParam => {
          queryParams += `${queryParam.key}=${queryParam.value}&`
        })
      }
      const reqObject = {
        method: req.method,
        url: host + req.url.path.join('/') + queryParams,
        headers: req.header ? req.header.reduce((rObj, item) => { rObj[item.key] = item.value; return rObj }, {}) : null,
        data: req.body && req.body.mode === 'raw' ? JSON.parse(req.body.raw) : null,
        path: '/' + req.url.path.join('/'),
        timeout: 3000
      }
      customLogger.logOutboundRequest('info', 'Request: ' + reqObject.method + ' ' + reqObject.path, { additionalData: { request: reqObject }, request: reqObject, uniqueId })
      try {
        response = await axios(reqObject)
        customLogger.logOutboundRequest('info', 'Response: ' + response.status + ' ' + response.statusText, { additionalData: { response }, request: reqObject, uniqueId })
      } catch (err) {
        customLogger.logOutboundRequest('error', 'Error Response: ' + err.message, { additionalData: err, request: reqObject, uniqueId })
        throw (err)
      }
    } catch (err) {
      consoleLog.push([cursor, 'executionError', err])
      response = err.response ? err.response : { status: 4001, data: err.message }
    }
    contextObj.ctx.dispatch(`execution.response.${id}`, requestId, null, {
      code: response.status,
      body: JSON.stringify(response.data)
    })
  })

  contextObj.ctx.on(`execution.error.${data.id}`, function (cur, err) {
    customLogger.logMessage('error', 'Script Execution Error' + err.message, { notification: false })
    consoleLog.push([cur, 'executionError', err])
  })

  try {
    const resp = await contextObj.ctx.executeAsync(script, data)
    contextObj.environment = resp.environment.values.reduce((envObj, item) => { envObj[item.key] = item.value; return envObj }, {})
  } catch (err) {
    // consoleLog.push([{execution: 0}, 'executionError', err.message])
  }
  const result = {
    consoleLog,
    environment: { ...contextObj.environment }
  }
  consoleLog = []
  return result
}

module.exports = {
  generateContextObj,
  executeAsync
}
