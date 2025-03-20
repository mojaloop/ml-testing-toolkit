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
 * Vijaya Kumar Guthi <vijaya.guthi@modusbox.com> (Original Author)
 --------------
 ******/

const http = require('http')
const https = require('https')
const _ = require('lodash')
const customLogger = require('./requestLogger')
const Config = require('./config')

const httpAgentStore = {}
const httpsAgentStore = {}

const _createAgent = (agentModule, options) => {
  customLogger.logMessage('info', 'Creating new http/https agent', { notification: false })
  const httpAgent = new agentModule.Agent({
    ...options,
    keepAlive: (Config.getSystemConfig().HTTP_CLIENT && Config.getSystemConfig().HTTP_CLIENT.KEEP_ALIVE) || true,
    maxSockets: (Config.getSystemConfig().HTTP_CLIENT && Config.getSystemConfig().HTTP_CLIENT.MAX_SOCKETS) || 50
  })
  httpAgent.toJSON = () => ({})
  return httpAgent
}

const _addAgentStoreItem = (agentStore, key, passedOptions, agent) => {
  // Create a new entry in the store
  agentStore[key] = {
    createdDate: Date.now(),
    lastAccessDate: Date.now(),
    lastModifiedDate: Date.now(),
    passedOptions,
    agent
  }
}

const _replaceAgentStoreItem = (agentStore, key, passedOptions, agent) => {
  agentStore[key].agent = agent
  agentStore[key].passedOptions = passedOptions
  agentStore[key].lastModifiedDate = Date.now()
}

const _compareAgentStoreItemOptions = (agentStore, key, options) => {
  return _.isEqual(options, agentStore[key].passedOptions)
}

const _pickAgentStoreItem = (agentStore, key) => {
  customLogger.logMessage('info', 'Using existing http/https agent for ' + key, { notification: false })
  agentStore[key].lastAccessDate = Date.now()
}

const getHttpAgent = (key, options) => {
  if (!httpAgentStore[key]) {
    const httpAgent = _createAgent(http, options)
    _addAgentStoreItem(httpAgentStore, key, options, httpAgent)
  } else {
    if (!_compareAgentStoreItemOptions(httpAgentStore, key, options)) {
      const httpAgent = _createAgent(http, options)
      _replaceAgentStoreItem(httpAgentStore, key, options, httpAgent)
    }
    _pickAgentStoreItem(httpAgentStore, key)
  }
  return httpAgentStore[key].agent
}

const getHttpsAgent = (key, options) => {
  if (!httpsAgentStore[key]) {
    const httpsAgent = _createAgent(https, options)
    _addAgentStoreItem(httpsAgentStore, key, options, httpsAgent)
  } else {
    if (!_compareAgentStoreItemOptions(httpsAgentStore, key, options)) {
      const httpsAgent = _createAgent(http, options)
      _replaceAgentStoreItem(httpsAgentStore, key, options, httpsAgent)
    }
    _pickAgentStoreItem(httpsAgentStore, key)
  }
  return httpsAgentStore[key].agent
}

const _clear = (agentStoreObj, interval) => {
  for (const item in agentStoreObj) {
    const timeDiff = Date.now() - agentStoreObj[item].lastAccessDate
    if (timeDiff >= interval) {
      // TODO: Check the current socket connections that this agent is using. Destroy only if the agent is free
      try {
        customLogger.logMessage('info', 'Destroying http/https agent for ' + item + ': Timeout reached ' + timeDiff + 'ms', { notification: false })
        agentStoreObj[item].agent.destroy()
      } catch (err) {
        console.log('INFO: Error destroying http/https agent', err.stack)
      }
      delete agentStoreObj[item]
    }
  }
}

const _clearAgents = (unUsedAgentsExpiryMs) => {
  _clear(httpsAgentStore, unUsedAgentsExpiryMs)
  _clear(httpAgentStore, unUsedAgentsExpiryMs)
}

const init = () => {
  const timerInterval = (Config.getSystemConfig().HTTP_CLIENT && Config.getSystemConfig().HTTP_CLIENT.UNUSED_AGENTS_CHECK_TIMER_MS !== undefined) ? Config.getSystemConfig().HTTP_CLIENT.UNUSED_AGENTS_CHECK_TIMER_MS : (5 * 60 * 1000) // Check for the cleanup every 5min
  const unUsedAgentsExpiryMs = (Config.getSystemConfig().HTTP_CLIENT && Config.getSystemConfig().HTTP_CLIENT.UNUSED_AGENTS_EXPIRY_MS !== undefined) ? Config.getSystemConfig().HTTP_CLIENT.UNUSED_AGENTS_EXPIRY_MS : (30 * 60 * 1000) // Clear http agents not being used for more this time
  setInterval(_clearAgents, timerInterval, unUsedAgentsExpiryMs)
}

module.exports = {
  getHttpAgent,
  getHttpsAgent,
  init
}
