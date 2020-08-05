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

const RulesEngine = require('./rulesEngine')
const fs = require('fs')
const utils = require('./utils')
const customLogger = require('./requestLogger')
const Config = require('./config')

const DEFAULT_RULES_FILE_NAME = 'default.json'
const CONFIG_FILE_NAME = 'config.json'

const response = {
  rulesFilePathPrefix: 'spec_files/rules_response/',
  rules: null,
  rulesEngine: null,
  activeRulesFile: DEFAULT_RULES_FILE_NAME,
  ruleType: 'response'
}

const validation = {
  rulesFilePathPrefix: 'spec_files/rules_validation/',
  rules: null,
  rulesEngine: null,
  activeRulesFile: DEFAULT_RULES_FILE_NAME,
  ruleType: 'validation'
}

const callback = {
  rulesFilePathPrefix: 'spec_files/rules_callback/',
  rules: null,
  rulesEngine: null,
  activeRulesFile: DEFAULT_RULES_FILE_NAME,
  ruleType: 'callback'
}

const forward = {
  rulesFilePathPrefix: 'spec_files/rules_forward/',
  rules: null,
  rulesEngine: null,
  activeRulesFile: DEFAULT_RULES_FILE_NAME,
  ruleType: 'forward'
}

// response rules
const reloadResponseRules = async () => {
  await reloadRules(response)
}

const setActiveResponseRulesFile = async (fileName) => {
  await setActiveRulesFile(response, fileName)
}

const getResponseRules = async () => {
  const rules = await getRules(response)
  return rules
}

const getResponseRulesEngine = async (convertedRules) => {
  const rulesEngine = await getRulesEngine(response, convertedRules)
  return rulesEngine
}

const getResponseRulesFiles = async () => {
  await getResponseRules()
  const rulesFiles = await getRulesFiles(response)
  return rulesFiles
}

const getResponseRulesFileContent = async (fileName) => {
  const rulesFileContent = await getRulesFileContent(response.rulesFilePathPrefix, fileName)
  return rulesFileContent
}

const setResponseRulesFileContent = async (fileName, fileContent) => {
  const rulesFileContent = await setRulesFileContent(response, fileName, fileContent)
  return rulesFileContent
}

const deleteResponseRulesFile = async (fileName) => {
  const deleted = await deleteRulesFile(response, fileName)
  return deleted
}

// validation rules
const reloadValidationRules = async () => {
  await reloadRules(validation)
}

const setActiveValidationRulesFile = async (fileName) => {
  await setActiveRulesFile(validation, fileName)
}

const getValidationRules = async () => {
  const rules = await getRules(validation)
  return rules
}

const getValidationRulesEngine = async (convertedRules) => {
  const rulesEngine = await getRulesEngine(validation, convertedRules)
  return rulesEngine
}

const getValidationRulesFiles = async () => {
  await getValidationRules()
  const rulesFiles = await getRulesFiles(validation)
  return rulesFiles
}

const getValidationRulesFileContent = async (fileName) => {
  const rulesFileContent = await getRulesFileContent(validation.rulesFilePathPrefix, fileName)
  return rulesFileContent
}

const setValidationRulesFileContent = async (fileName, fileContent) => {
  const rulesFileContent = await setRulesFileContent(validation, fileName, fileContent)
  return rulesFileContent
}

const deleteValidationRulesFile = async (fileName) => {
  const deleted = await deleteRulesFile(validation, fileName)
  return deleted
}

// callback rules
const reloadCallbackRules = async () => {
  await reloadRules(callback)
}

const setActiveCallbackRulesFile = async (fileName) => {
  await setActiveRulesFile(callback, fileName)
}

const getCallbackRules = async () => {
  const rules = await getRules(callback)
  return rules
}

const getCallbackRulesEngine = async (convertedRules) => {
  const rulesEngine = await getRulesEngine(callback, convertedRules)
  return rulesEngine
}

const getCallbackRulesFiles = async () => {
  await getCallbackRules()
  const rulesFiles = await getRulesFiles(callback)
  return rulesFiles
}

const getCallbackRulesFileContent = async (fileName) => {
  const rulesFileContent = await getRulesFileContent(callback.rulesFilePathPrefix, fileName)
  return rulesFileContent
}

const setCallbackRulesFileContent = async (fileName, fileContent) => {
  const rulesFileContent = await setRulesFileContent(callback, fileName, fileContent)
  return rulesFileContent
}

const deleteCallbackRulesFile = async (fileName) => {
  const deleted = await deleteRulesFile(callback, fileName)
  return deleted
}

// forward rules
const reloadForwardRules = async () => {
  await reloadRules(forward)
}

const setActiveForwardRulesFile = async (fileName) => {
  await setActiveRulesFile(forward, fileName)
}

const getForwardRules = async () => {
  const rules = await getRules(forward)
  return rules
}

const getForwardRulesEngine = async (convertedRules) => {
  const rulesEngine = await getRulesEngine(forward, convertedRules)
  return rulesEngine
}

const getForwardRulesFiles = async () => {
  await getCallbackRules()
  const rulesFiles = await getRulesFiles(forward)
  return rulesFiles
}

const getForwardRulesFileContent = async (fileName) => {
  const rulesFileContent = await getRulesFileContent(forward.rulesFilePathPrefix, fileName)
  return rulesFileContent
}

const setForwardRulesFileContent = async (fileName, fileContent) => {
  const rulesFileContent = await setRulesFileContent(forward, fileName, fileContent)
  return rulesFileContent
}

const deleteForwardRulesFile = async (fileName) => {
  const deleted = await deleteRulesFile(forward, fileName)
  return deleted
}

// common functions
const reloadRules = async (objStore) => {
  const rulesConfigRawData = await utils.readFileAsync(objStore.rulesFilePathPrefix + CONFIG_FILE_NAME)
  const rulesConfig = JSON.parse(rulesConfigRawData)
  try {
    await utils.accessFileAsync(objStore.rulesFilePathPrefix + rulesConfig.activeRulesFile, fs.constants.F_OK)
  } catch (err) {
    // If active rules file not found then make default rules file as active
    await setActiveRulesFile(objStore, DEFAULT_RULES_FILE_NAME)
  }
  objStore.activeRulesFile = rulesConfig.activeRulesFile
  customLogger.logMessage('info', `Reloading ${objStore.ruleType} Rules from file ` + rulesConfig.activeRulesFile, null, false)
  const rulesRawdata = await utils.readFileAsync(objStore.rulesFilePathPrefix + rulesConfig.activeRulesFile)

  objStore.rules = JSON.parse(rulesRawdata)
  objStore.rulesEngine = new RulesEngine()
  if (!objStore.rules.length) {
    objStore.rules = []
  }
  objStore.rulesEngine.loadRules(objStore.rules)
}

const setActiveRulesFile = async (objStore, fileName) => {
  const rulesConfig = {
    activeRulesFile: fileName
  }
  await utils.writeFileAsync(objStore.rulesFilePathPrefix + CONFIG_FILE_NAME, JSON.stringify(rulesConfig, null, 2))
  objStore.activeRulesFile = fileName
  await reloadRules(objStore)
}

const getRules = async (objStore) => {
  if (!objStore.rules) {
    await reloadRules(objStore)
  }
  return objStore.rules
}

const getRulesEngine = async (objStore, convertedRules) => {
  if (convertedRules) {
    objStore.rulesEngine = new RulesEngine()
    objStore.rulesEngine.loadRules(convertedRules)
  } else if (!objStore.rulesEngine) {
    objStore.rulesEngine = new RulesEngine()
    const rules = await getRules(objStore)
    objStore.rulesEngine.loadRules(rules)
  }
  return objStore.rulesEngine
}

const getRulesFiles = async (objStore) => {
  try {
    const files = await utils.readDirAsync(objStore.rulesFilePathPrefix)
    const resp = {}
    // Do not return the config file
    resp.files = files.filter(item => {
      return (item !== CONFIG_FILE_NAME)
    })
    resp.activeRulesFile = objStore.activeRulesFile
    return resp
  } catch (err) {
    return null
  }
}

const deleteRulesFile = async (objStore, fileName) => {
  try {
    await utils.deleteFileAsync(objStore.rulesFilePathPrefix + fileName)
    await reloadRules(objStore)
    return true
  } catch (err) {
    return err
  }
}

const setRulesFileContent = async (objStore, fileName, fileContent) => {
  try {
    addTypeAndVersion(objStore.ruleType, fileContent)
    await utils.writeFileAsync(objStore.rulesFilePathPrefix + fileName, JSON.stringify(fileContent, null, 2))
    await reloadRules(objStore)
    return true
  } catch (err) {
    return err
  }
}

const getRulesFileContent = async (rulesFilePathPrefix, fileName) => {
  const rulesRawdata = await utils.readFileAsync(rulesFilePathPrefix + fileName)
  return JSON.parse(rulesRawdata)
}

const addTypeAndVersion = (ruleType, fileContent) => {
  for (const index in fileContent) {
    if (!fileContent[index].type) {
      fileContent[index].type = ruleType
    }
    if (!fileContent[index].version) {
      fileContent[index].version = parseFloat(Config.getSystemConfig().CONFIG_VERSIONS[ruleType])
    }
  }
}

module.exports = {
  reloadResponseRules,
  setActiveResponseRulesFile,
  getResponseRules,
  getResponseRulesEngine,
  getResponseRulesFiles,
  getResponseRulesFileContent,
  setResponseRulesFileContent,
  deleteResponseRulesFile,

  reloadValidationRules,
  setActiveValidationRulesFile,
  getValidationRules,
  getValidationRulesEngine,
  getValidationRulesFiles,
  getValidationRulesFileContent,
  setValidationRulesFileContent,
  deleteValidationRulesFile,

  reloadCallbackRules,
  setActiveCallbackRulesFile,
  getCallbackRules,
  getCallbackRulesEngine,
  getCallbackRulesFiles,
  getCallbackRulesFileContent,
  setCallbackRulesFileContent,
  deleteCallbackRulesFile,

  reloadForwardRules,
  setActiveForwardRulesFile,
  getForwardRules,
  getForwardRulesEngine,
  getForwardRulesFiles,
  getForwardRulesFileContent,
  setForwardRulesFileContent,
  deleteForwardRulesFile
}
