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
 * Georgi Logodazhki <georgi.logodazhki@modusbox.com>
 * Vijaya Kumar Guthi <vijaya.guthi@modusbox.com> (Original Author)
 --------------
 ******/

const utils = require('./utils')
const dfspWiseDB = require('./db/dfspWiseDB')

const SYSTEM_CONFIG_FILE = 'spec_files/system_config.json'

var SYSTEM_CONFIG = {}
var USER_CONFIG = {}

const getSystemConfig = () => {
  return SYSTEM_CONFIG
}

const getUserConfig = async (dfspId) => {
  if (!USER_CONFIG[dfspId]) {
    await loadUserConfig(dfspId)
  }
  return USER_CONFIG[dfspId]
}

const getStoredUserConfig = async (dfspId) => {
  try {
    const storedConfig = await loadUserConfigDFSPWise(dfspId)
    return storedConfig
  } catch (err) {
    return {}
  }
}

const setStoredUserConfig = async (dfspId, newConfig) => {
  try {
    await dfspWiseDB.update('userConfig', newConfig, dfspId)
    return true
  } catch (err) {
    return false
  }
}

const loadUserConfig = async (dfspId) => {
  try {
    USER_CONFIG[dfspId] = await loadUserConfigDFSPWise(dfspId)
    return true
  } catch (err) {
    return false
  }
}

const loadUserConfigDFSPWise = async (dfspId) => {
  if (!dfspId) {
    dfspId = 'data'
  }
  const userConfig = (await dfspWiseDB.getDB().get('userConfig'))
  if (!userConfig[dfspId]) {
    userConfig[dfspId] = (await dfspWiseDB.update('userConfig', userConfig.data, dfspId))
  }
  return userConfig[dfspId]
}

// Function to load system configuration
const loadSystemConfig = async () => {
  try {
    const contents = await utils.readFileAsync(SYSTEM_CONFIG_FILE)
    SYSTEM_CONFIG = { ...JSON.parse(contents) }
  } catch (err) {
    console.log('Error: Can not read the file ' + SYSTEM_CONFIG_FILE)
  }
  return true
}

const loadSystemConfigMiddleware = () => {
  SYSTEM_CONFIG = require('../../' + SYSTEM_CONFIG_FILE)
}

module.exports = {
  getUserConfig: getUserConfig,
  getStoredUserConfig: getStoredUserConfig,
  setStoredUserConfig: setStoredUserConfig,
  loadUserConfig: loadUserConfig,
  getSystemConfig: getSystemConfig,
  loadSystemConfig: loadSystemConfig,
  loadSystemConfigMiddleware: loadSystemConfigMiddleware
}
