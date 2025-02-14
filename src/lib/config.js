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
const rc = require('rc')

const releaseCd = rc('release_cd', {})

let SYSTEM_CONFIG = {}

const USER_CONFIG = {
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
    console.log(`Can not read the file ${USER_CONFIG_FILE}`, err)
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
    const systemConfigFromEnvironment = _getSystemConfigFromEnvironment()
    _.merge(SYSTEM_CONFIG, systemConfigFromEnvironment)
    const secretsFromEnvironment = _getSecretsFromEnvironment()
    console.log(secretsFromEnvironment)
    _.merge(SYSTEM_CONFIG, secretsFromEnvironment)
  } catch (err) {
    console.log(`Can not read the file ${SYSTEM_CONFIG_FILE}`, err)
  }
  return true
}

const _getSecretsFromEnvironment = () => {
  const secretsFromEnvironment = {}
  if (process.env.REPORTING_DB_CONNECTION_PASSWORD || process.env.REPORTING_DB_CONNECTION_STRING) {
    try {
      const reportingDbConnectionPassword = process.env.REPORTING_DB_CONNECTION_PASSWORD
      const reportingDbConnectionString = process.env.REPORTING_DB_CONNECTION_STRING
      console.log(`Retrieved reporting database password in environment '${process.env.REPORTING_DB_CONNECTION_PASSWORD}'`)
      console.log(`Retrieved reporting database connection string in environment '${process.env.REPORTING_DB_CONNECTION_STRING}'`)
      secretsFromEnvironment.DB = {
        PASSWORD: reportingDbConnectionPassword,
        CONNECTION_STRING: reportingDbConnectionString
      }
      console.log(`Secrets retrieved from environment to be merged into system config ${secretsFromEnvironment}`)
    } catch (err) {
      console.log(err)
      console.log('Failed to retrieve reporting database password or connection string in environment')
    }
  }
  return secretsFromEnvironment
}

const _getSystemConfigFromEnvironment = () => {
  let systemConfigFromEnvironment = {}
  if (process.env.TTK_SYSTEM_CONFIG) {
    try {
      systemConfigFromEnvironment = JSON.parse(process.env.TTK_SYSTEM_CONFIG)
    } catch (err) {
      console.log(`Failed to parse system config passed in environment ${process.env.TTK_SYSTEM_CONFIG}`)
    }
  }
  return systemConfigFromEnvironment
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

// const _getObjectStoreInitConfigFromEnvironment = () => {
//   let objectStoreInitConfigFromEnvironment = {}
//   if (process.env.TTK_OBJECT_STORE_INIT_CONFIG) {
//     try {
//       objectStoreInitConfigFromEnvironment = JSON.parse(process.env.TTK_OBJECT_STORE_INIT_CONFIG)
//     } catch (err) {
//       console.log(`Failed to parse objectStore init config passed in environment ${process.env.TTK_OBJECT_STORE_INIT_CONFIG}`)
//     }
//   }
//   return objectStoreInitConfigFromEnvironment
// }

const _getObjectStoreInitConfigFromSystemConfig = () => {
  let objectStoreInitConfigFromSystemConfig = {}
  if (SYSTEM_CONFIG.INIT_CONFIG && SYSTEM_CONFIG.INIT_CONFIG.objectStore) {
    objectStoreInitConfigFromSystemConfig = SYSTEM_CONFIG.INIT_CONFIG.objectStore
  }
  return objectStoreInitConfigFromSystemConfig
}

const getObjectStoreInitConfig = async () => {
  return _getObjectStoreInitConfigFromSystemConfig()
}

module.exports = {
  getUserConfig,
  getStoredUserConfig,
  setStoredUserConfig,
  loadUserConfig,
  getSystemConfig,
  loadSystemConfig,
  setSystemConfig,
  getObjectStoreInitConfig,
  releaseCd
}
