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
const RequestLogger = require('./requestLogger')

const SYSTEM_CONFIG_FILE = 'spec_files/system_config.json'
const USER_CONFIG_FILE = 'spec_files/user_config.json'

var SYSTEM_CONFIG = {}
var USER_CONFIG = {}

const getSystemConfig = () => {
  return SYSTEM_CONFIG
}

const getUserConfig = () => {
  return USER_CONFIG
}

const getStoredUserConfig = async () => {
  let storedConfig = {}
  try {
    const contents = await utils.readFileAsync(USER_CONFIG_FILE)
    storedConfig = JSON.parse(contents)
  } catch (err) {
    RequestLogger.logMessage('error', 'Can not read the file spec_files/user_config.json', null, true, null)
  }
  return storedConfig
}

const setStoredUserConfig = async (newConfig) => {
  try {
    await utils.writeFileAsync(USER_CONFIG_FILE, JSON.stringify(newConfig, null, 2))
    return true
  } catch (err) {
    return false
  }
}

const loadUserConfig = async () => {
  try {
    const contents = await utils.readFileAsync(USER_CONFIG_FILE)
    USER_CONFIG = JSON.parse(contents)
  } catch (err) {
    RequestLogger.logMessage('error', 'Can not read the file ' + USER_CONFIG_FILE, null, true, null)
  }
  return true
}

// Function to load system configuration
const loadSystemConfig = async () => {
  try {
    const contents = await utils.readFileAsync(SYSTEM_CONFIG_FILE)
    SYSTEM_CONFIG = JSON.parse(contents)
  } catch (err) {
    RequestLogger.logMessage('error', 'Can not read the file ' + SYSTEM_CONFIG_FILE, null, true, null)
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
