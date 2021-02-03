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
 * Steven Oderayi <steven.oderayi@modusbox.com> (Original Author)
 --------------
 ******/

const elasticSearch = require('./adapters/elastic-search')
const config = require('../config')
const ADAPTER_TYPES = { ELASTICSEARCH: 'ELASTICSEARCH', GRAFANA: 'GRAFANA' }
const sysConf = config.getSystemConfig()
let _adapter

const search = ({ query }) => {
  if (!sysConf.SERVER_LOGS || !sysConf.SERVER_LOGS.ENABLED) return
  const adapter = _getAdapter(sysConf)
  if (adapter) return adapter.search({ query })
}

const _getAdapter = (systemConfig) => {
  if (_adapter) return _adapter
  _validateAdapterConfig(systemConfig)
  if (systemConfig.SERVER_LOGS.ADAPTER.TYPE === ADAPTER_TYPES.ELASTICSEARCH) {
    if (!systemConfig.SERVER_LOGS.ADAPTER.API_URL) {
      throw new Error(`[SERVER LOGS] Host URL for adapter "${systemConfig.SERVER_LOGS.ADAPTER.TYPE}" cannot be blank.`)
    }
    elasticSearch.init({
      url: systemConfig.SERVER_LOGS.ADAPTER.API_URL,
      index: systemConfig.SERVER_LOGS.ADAPTER.INDEX,
      resultsPageSize: systemConfig.SERVER_LOGS.ADAPTER.RESULTS_PAGE_SIZE
    })
    _adapter = elasticSearch
    return _adapter
  }
  if (systemConfig.SERVER_LOGS.ADAPTER.TYPE === ADAPTER_TYPES.GRAFANA) {
    throw new Error('[SERVER LOGS] Grafana adapter not implemented.')
  }
}

const _validateAdapterConfig = (systemConfig) => {
  if (!systemConfig.SERVER_LOGS) {
    throw new Error('[SERVER LOGS] Server logs configuration is missing in system configuration.')
  }
  if (!systemConfig.SERVER_LOGS.ADAPTER) {
    throw new Error('[SERVER LOGS] Adapter configuration is missing.')
  }
  if (!Object.values(ADAPTER_TYPES).includes(systemConfig.SERVER_LOGS.ADAPTER.TYPE)) { throw new Error(`[SERVER LOGS] Adapter type "${systemConfig.SERVER_LOGS.ADAPTER.TYPE}" not supported.`) }
}

module.exports = {
  search
}
