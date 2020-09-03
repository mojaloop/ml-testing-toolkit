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

const storageAdapter = require('./storageAdapter')
const customLogger = require('./requestLogger')
const SYSTEM_CONFIG_FILE = 'spec_files/system_config.json'
const USER_CONFIG_FILE = 'spec_files/user_config.json'

var SYSTEM_CONFIG = {}
var USER_CONFIG = {
  data: undefined
}

const getSystemConfig = () => {
  return SYSTEM_CONFIG
}

const getUserConfig = async (user) => {
  const item = user ? user.dfspId : 'data'
  if (!USER_CONFIG[item]) {
    await loadUserConfig(user)
  }
  return USER_CONFIG[item]
}

const getStoredUserConfig = async (user) => {
  try {
    const storedConfig = await loadUserConfigDFSPWise(user)
    return storedConfig
  } catch (err) {
    customLogger.logMessage('error', `Can not read the file ${USER_CONFIG_FILE}`, { additionalData: err })
    return {}
  }
}

const setStoredUserConfig = async (newConfig, user) => {
  try {
    await storageAdapter.upsert(USER_CONFIG_FILE, newConfig, user)
    return true
  } catch (err) {
    return false
  }
}

const loadUserConfig = async (user) => {
  try {
    USER_CONFIG[user ? user.dfspId : 'data'] = await loadUserConfigDFSPWise(user)
  } catch (err) {
    console.log(err)
    customLogger.logMessage('error', `Can not read the file ${USER_CONFIG_FILE}`, { additionalData: err })
  }
  return true
}

const loadUserConfigDFSPWise = async (user) => {
  const userConfig = await storageAdapter.read(USER_CONFIG_FILE, user)
  return userConfig.data
}

const loadSystemConfig = () => {
  if (Object.keys(SYSTEM_CONFIG).length === 0) {
    Object.assign(SYSTEM_CONFIG, require('../../' + SYSTEM_CONFIG_FILE))
  }
}

loadSystemConfig()

module.exports = {
  getUserConfig: getUserConfig,
  getStoredUserConfig: getStoredUserConfig,
  setStoredUserConfig: setStoredUserConfig,
  loadUserConfig: loadUserConfig,
  getSystemConfig: getSystemConfig,
  loadSystemConfig: loadSystemConfig
}
