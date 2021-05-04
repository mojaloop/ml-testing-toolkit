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

const http = require('http')
const https = require('https')

const httpAgentStore = {}
const httpsAgentStore = {}

const getHttpAgent = (key, options) => {
  if (!httpAgentStore[key]) {
    const httpAgent = new http.Agent({
      ...options,
      keepAlive: true,
      maxSockets: 50
    })
    httpAgentStore[key] = {
      createdDate: Date.now(),
      lastAccessDate: Date.now(),
      lastModifiedDate: Date.now(),
      agent: httpAgent
    }
  } else {
    httpAgentStore[key].lastAccessDate = Date.now()
    // TODO: Check for the keys and values in the options, if there are any changes then we need to re-create the agent and update the modified date
  }
  return httpAgentStore[key].agent
}

const getHttpsAgent = (key, options) => {
  if (!httpsAgentStore[key]) {
    const httpsAgent = new https.Agent({
      ...options,
      keepAlive: true,
      maxSockets: 50
    })
    httpsAgentStore[key] = {
      createdDate: Date.now(),
      lastAccessDate: Date.now(),
      lastModifiedDate: Date.now(),
      agent: httpsAgent
    }
  } else {
    httpsAgentStore[key].lastAccessDate = Date.now()
    // TODO: Check for the keys and values in the options, if there are any changes then we need to re-create the agent and update the modified date
  }
  return httpsAgentStore[key].agent
}

const clear = (agentStoreObj, interval) => {
  for (const item in agentStoreObj) {
    const timeDiff = Date.now() - agentStoreObj[item].lastAccessDate
    if (timeDiff > interval) {
      // TODO: Check the current socket connections that this agent is using. Destroy only if the agent is free
      try {
        agentStoreObj[item].agent.destroy()
      } catch (err) {
        console.log('INFO: Error destroying http/https agent', err.stack)
      }
      delete agentStoreObj[item]
    }
  }
}

const clearAgents = () => {
  const interval = 30 * 60 * 1000 // Clear http agents not being used for more than 30min
  clear(httpsAgentStore, interval)
  clear(httpAgentStore, interval)
}

const init = () => {
  setInterval(clearAgents, 5 * 60 * 1000) // Check for the cleanup every 5min
}

module.exports = {
  getHttpAgent,
  getHttpsAgent,
  init
}
