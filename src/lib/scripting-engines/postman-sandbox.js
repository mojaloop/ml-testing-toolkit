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
 * Georgi Logodazhki <georgi.logodazhki@modusbox.com> (Original Author)
 --------------
 ******/

const Sandbox = require('postman-sandbox')
const util = require('util')
const axios = require('axios').default
const customLogger = require('../requestLogger')
const UniqueIdGenerator = require('../../lib/uniqueIdGenerator')

// Context pool for reusing sandbox contexts
const CONTEXT_POOL_SIZE = 5
const contextPool = []
let contextPoolInitialized = false

// const createContextAsync = util.promisify(Sandbox.createContext)
const createContextAsync = (options) => {
  return new Promise((resolve, reject) => {
    Sandbox.createContext(options || {}, function (err, ctx) {
      if (err) {
        reject(err)
        return console.error(err)
      }
      resolve(ctx)
    })
  })
}

// Initialize context pool on first use
const initializeContextPool = async () => {
  if (contextPoolInitialized) return
  contextPoolInitialized = true

  customLogger.logMessage('info', `Initializing sandbox context pool with ${CONTEXT_POOL_SIZE} contexts`, { notification: false })
  const promises = []
  for (let i = 0; i < CONTEXT_POOL_SIZE; i++) {
    promises.push(createContextAsync())
  }
  const contexts = await Promise.all(promises)

  contexts.forEach(ctx => {
    ctx.executeAsync = util.promisify(ctx.execute)
    ctx.on('error', function (cursor, err) {
      // log the error in postman sandbox
      console.log(cursor, err)
    })
    contextPool.push({ ctx, inUse: false })
  })
  customLogger.logMessage('info', 'Sandbox context pool initialized', { notification: false })
}

// Get context from pool or create new one
const acquireContext = async () => {
  await initializeContextPool()

  // Try to find an available context in the pool
  const available = contextPool.find(item => !item.inUse)
  if (available) {
    available.inUse = true
    return available.ctx
  }

  // If pool is exhausted, create a new context (temporary)
  customLogger.logMessage('debug', 'Context pool exhausted, creating temporary context', { notification: false })
  const ctx = await createContextAsync()
  ctx.executeAsync = util.promisify(ctx.execute)
  ctx.on('error', function (cursor, err) {
    console.log(cursor, err)
  })
  return ctx
}

// Release context back to pool
const releaseContext = (ctx) => {
  const poolItem = contextPool.find(item => item.ctx === ctx)
  if (poolItem) {
    // Context is being returned to pool
    // executeAsync already cleans up execution-specific listeners in its finally block
    // so we don't need to do additional cleanup here
    poolItem.inUse = false
  } else {
    // This was a temporary context (not in pool), dispose it
    try {
      if (ctx && typeof ctx.dispose === 'function') {
        ctx.dispose()
      }
    } catch (err) {
      customLogger.logMessage('warn', 'Failed to dispose temporary context', { additionalData: err.message })
    }
  }
}

const generateContextObj = async (environment = {}) => {
  const ctx = await acquireContext()
  const transformerObj = {
    transformer: null,
    transformerName: null,
    options: {}
  }
  const contextObj = {
    ctx,
    environment,
    transformerObj,
    _release: () => releaseContext(ctx),
    _isPooled: contextPool.some(item => item.ctx === ctx)
  }
  return contextObj
}

// Cleanup function for graceful shutdown
const cleanupContextPool = () => {
  customLogger.logMessage('info', 'Cleaning up sandbox context pool', { notification: false })
  contextPool.forEach(({ ctx }) => {
    try {
      ctx.removeAllListeners()
      ctx.dispose()
    } catch (err) {
      customLogger.logMessage('warn', 'Failed to dispose context', { additionalData: err.message })
    }
  })
  contextPool.length = 0
  contextPoolInitialized = false
  customLogger.logMessage('info', 'Context pool cleanup complete', { notification: false })
}

// Register cleanup with performance optimizer
try {
  const perfOptimizer = require('../performanceOptimizer')
  perfOptimizer.registerCache(cleanupContextPool, 'Sandbox Context Pool')
} catch (err) {
  // Performance optimizer not available
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

  // Define event handlers that we'll remove later
  const consoleHandler = function () {
    consoleLog.push(Array.from(arguments))
  }

  contextObj.ctx.on('console', consoleHandler)

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
  } finally {
    // Clean up event listeners to prevent memory leaks
    try {
      contextObj.ctx.removeListener('console', consoleHandler)
      contextObj.ctx.removeAllListeners(`execution.request.${data.id}`)
      contextObj.ctx.removeAllListeners(`execution.response.${data.id}`)
      contextObj.ctx.removeAllListeners(`execution.error.${data.id}`)
    } catch (cleanupErr) {
      // Ignore cleanup errors
    }
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
  executeAsync,
  releaseContext,
  cleanupContextPool
}
