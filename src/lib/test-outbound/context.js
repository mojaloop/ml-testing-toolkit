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

const createContextAsync = util.promisify(Sandbox.createContext)

const generageContextObj = async (environment) => {
  const ctx = await createContextAsync({ timeout: 5000 })
  ctx.executeAsync = util.promisify(ctx.execute)
  ctx.on('error', function (cursor, err) {
    console.log(cursor, err)
  })
  const contextObj = {
    ctx: ctx,
    environment: environment
  }
  return contextObj
}

const executeAsync = async (script, data, contextObj) => {
  let consoleLog = []

  contextObj.ctx.on('console', function () {
    consoleLog.push(Array.from(arguments))
  })

  try {
    contextObj.ctx.on(`execution.request.${data.id}`, async (cursor, id, requestId, req) => {
      const uri = `${req.url.protocol}://${req.url.host[0]}:${req.url.port}/`
      const response = await axios({
        method: req.method,
        url: uri + req.url.path.join('/'),
        headers: req.header
      })
      contextObj.ctx.dispatch(`execution.response.${id}`, requestId, null, {
        code: response.status,
        body: JSON.stringify(response.data)
      })
    })
    contextObj.ctx.on(`execution.error.${data.id}`, function (cur, err) {
      consoleLog.push([
        cur,
        'executionError',
        err
      ])
    })
    const resp = await contextObj.ctx.executeAsync(script, data)
    contextObj.environment = resp.environment
  } catch (err) {
    console.log(err.message)
  }
  const result = {
    consoleLog: consoleLog,
    environment: contextObj.environment.values
  }
  consoleLog = []
  return result
}

module.exports = {
  generageContextObj,
  executeAsync
}
