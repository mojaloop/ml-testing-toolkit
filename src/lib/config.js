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
const SYSTEM_CONFIG_FILE = 'spec_files/system_config.json'
const USER_CONFIG_FILE = 'spec_files/user_config.json'
const _ = require('lodash')

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
    console.log(`Can not read the file ${USER_CONFIG_FILE}`)
    return {}
  }
}

const setStoredUserConfig = async (newConfig, user) => {
  try {
    await storageAdapter.upsert(USER_CONFIG_FILE, { ...getUserConfig(), ...newConfig }, user)
    return true
  } catch (err) {
    return false
  }
}

const loadUserConfig = async (user) => {
  try {
    USER_CONFIG[user ? user.dfspId : 'data'] = await loadUserConfigDFSPWise(user)
  } catch (err) {
    console.log(`Can not read the file ${USER_CONFIG_FILE}`, err)
  }
  return true
}

const loadUserConfigDFSPWise = async (user) => {
  const userConfig = await storageAdapter.read(USER_CONFIG_FILE, user)
  return userConfig.data
}

const loadSystemConfig = async () => {
  try {
    SYSTEM_CONFIG = (await storageAdapter.read(SYSTEM_CONFIG_FILE)).data
    const systemConfigFromEnvironemnt = _getSystemConfigFromEnvironment()
    _.merge(SYSTEM_CONFIG, systemConfigFromEnvironemnt)
  } catch (err) {
    console.log(`Can not read the file ${SYSTEM_CONFIG_FILE}`, err)
  }
  return true
}

const _getSystemConfigFromEnvironment = () => {
  let systemConfigFromEnvironemnt = {}
  if (process.env.TTK_SYSTEM_CONFIG) {
    try {
      systemConfigFromEnvironemnt = JSON.parse(process.env.TTK_SYSTEM_CONFIG)
    } catch (err) {
      console.log(`Failed to parse system config passed in environment ${process.env.TTK_SYSTEM_CONFIG}`)
    }
  }
  return systemConfigFromEnvironemnt
}

const setSystemConfig = async (newConfig) => {
  try {
    await storageAdapter.upsert(SYSTEM_CONFIG_FILE, { ...getSystemConfig(), ...newConfig })
    await loadSystemConfig()
    return true
  } catch (err) {
    return false
  }
}

module.exports = {
  getUserConfig: getUserConfig,
  getStoredUserConfig: getStoredUserConfig,
  setStoredUserConfig: setStoredUserConfig,
  loadUserConfig: loadUserConfig,
  getSystemConfig: getSystemConfig,
  loadSystemConfig: loadSystemConfig,
  setSystemConfig: setSystemConfig
}
