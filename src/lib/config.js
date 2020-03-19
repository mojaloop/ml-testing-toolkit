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

const RC = require('parse-strings-in-object')(require('rc')('ALS', require('../../config/default.json')))
const fs = require('fs')
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)
const RequestLogger = require('./requestLogger')

const USER_CONFIG_FILE = 'spec_files/user_config.json'
// const getOrDefault = (value, defaultValue) => {
//   if (value === undefined) {
//     return defaultValue
//   }

//   return value
// }

var USER_CONFIG = {}

const getUserConfig = () => {
  return USER_CONFIG
}

const getStoredUserConfig = async () => {
  let storedConfig = {}
  try {
    const contents = await readFileAsync(USER_CONFIG_FILE)
    storedConfig = JSON.parse(contents)
  } catch (err) {
    RequestLogger.logMessage('error', 'Can not read the file spec_files/user_config.json', null, true, null)
  }
  return storedConfig
}

const setStoredUserConfig = async (newConfig) => {
  try {
    await writeFileAsync(USER_CONFIG_FILE, JSON.stringify(newConfig, null, 2))
    return true
  } catch (err) {
    return false
  }
}

// Function to load user configuration from .env file or environment incase of running in container
const loadUserConfig = async () => {
  // if (fs.existsSync('local.env')) {
  //   require('dotenv').config({ path: 'local.env' })
  // }
  try {
    const contents = await readFileAsync(USER_CONFIG_FILE)
    USER_CONFIG = JSON.parse(contents)
  } catch (err) {
    RequestLogger.logMessage('error', 'Can not read the file ' + USER_CONFIG_FILE, null, true, null)
  }

  if (USER_CONFIG.OVERRIDE_WITH_ENV) {
    for (var prop in USER_CONFIG) {
      if (Object.prototype.hasOwnProperty.call(USER_CONFIG, prop)) {
        if (process.env[prop]) {
          if ((typeof USER_CONFIG[prop]) === 'boolean') {
            USER_CONFIG[prop] = process.env[prop] === 'true'
          } else {
            USER_CONFIG[prop] = process.env[prop]
          }
        }
      }
    }
  }
  return true
}

module.exports = {
  API_PORT: RC.API_PORT,
  DISPLAY_ROUTES: RC.DISPLAY_ROUTES,
  API_DEFINITIONS: RC.API_DEFINITIONS,
  getUserConfig: getUserConfig,
  getStoredUserConfig: getStoredUserConfig,
  setStoredUserConfig: setStoredUserConfig,
  loadUserConfig: loadUserConfig
}
