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
const customLogger = require('./requestLogger')
const Config = require('./config')
const dfspWiseDB = require('../lib/db/dfspWiseDB')

const local = {
  data: {
    response: {
      document: 'userResponseRules',
      rules: null,
      rulesEngine: null,
      activeRulesFile: 'default.json',
      ruleType: 'response'
    },
    validation: {
      document: 'userValidationRules',
      rules: null,
      rulesEngine: null,
      activeRulesFile: 'default.json',
      ruleType: 'validation'
    },
    callback: {
      document: 'userCallbackRules',
      rules: null,
      rulesEngine: null,
      activeRulesFile: 'default.json',
      ruleType: 'callback'
    },
    forward: {
      document: 'userForwardRules',
      rules: null,
      rulesEngine: null,
      activeRulesFile: 'default.json',
      ruleType: 'forward'
    }
  }
}

const getLocalData = async (dfspId = 'data', dfspType) => {
  if (!local[dfspId]) {
    local[dfspId] = {}
  }
  if (!local[dfspId][dfspType]) {
    local[dfspId][dfspType] = { ...local.data[dfspType] }
    const userRules = await dfspWiseDB.getDB().get(local[dfspId][dfspType].document)
    if (!userRules[dfspId]) {
      await dfspWiseDB.update(local[dfspId][dfspType].document, userRules.data, dfspId)
    }
  }
  return local[dfspId][dfspType]
}

// response rules
const reloadResponseRules = async (dfspId) => {
  await reloadRules(await getLocalData(dfspId, 'response'), dfspId)
}

const setActiveResponseRulesFile = async (fileName, dfspId) => {
  await setActiveRulesFile(await getLocalData(dfspId, 'response'), fileName, dfspId)
}

const getResponseRules = async (dfspId) => {
  const rules = await getRules(await getLocalData(dfspId, 'response'), dfspId)
  return rules
}

const getResponseRulesEngine = async (convertedRules, dfspId) => {
  const rulesEngine = await getRulesEngine(await getLocalData(dfspId, 'response'), convertedRules, dfspId)
  return rulesEngine
}

const getResponseRulesFiles = async (dfspId) => {
  await getResponseRules(dfspId)
  const rulesFiles = await getRulesFiles(await getLocalData(dfspId, 'response'), dfspId)
  return rulesFiles
}

const getResponseRulesFileContent = async (fileName, dfspId) => {
  const rulesFileContent = await getRulesFileContent(await getLocalData(dfspId, 'response'), fileName, dfspId)
  return rulesFileContent
}

const setResponseRulesFileContent = async (fileName, fileContent, dfspId) => {
  const rulesFileContent = await setRulesFileContent(await getLocalData(dfspId, 'response'), fileName, fileContent, dfspId)
  return rulesFileContent
}

const deleteResponseRulesFile = async (fileName, dfspId) => {
  const deleted = await deleteRulesFile(await getLocalData(dfspId, 'response'), fileName, dfspId)
  return deleted
}

// validation rules
const reloadValidationRules = async (dfspId) => {
  await reloadRules(await getLocalData(dfspId, 'validation'), dfspId)
}

const setActiveValidationRulesFile = async (fileName, dfspId) => {
  await setActiveRulesFile(await getLocalData(dfspId, 'validation'), fileName, dfspId)
}

const getValidationRules = async (dfspId) => {
  const rules = await getRules(await getLocalData(dfspId, 'validation'), dfspId)
  return rules
}

const getValidationRulesEngine = async (convertedRules, dfspId) => {
  const rulesEngine = await getRulesEngine(await getLocalData(dfspId, 'validation'), convertedRules, dfspId)
  return rulesEngine
}

const getValidationRulesFiles = async (dfspId) => {
  await getValidationRules(dfspId)
  const rulesFiles = await getRulesFiles(await getLocalData(dfspId, 'validation'), dfspId)
  return rulesFiles
}

const getValidationRulesFileContent = async (fileName, dfspId) => {
  const rulesFileContent = await getRulesFileContent(await getLocalData(dfspId, 'validation'), fileName, dfspId)
  return rulesFileContent
}

const setValidationRulesFileContent = async (fileName, fileContent, dfspId) => {
  const rulesFileContent = await setRulesFileContent(await getLocalData(dfspId, 'validation'), fileName, fileContent, dfspId)
  return rulesFileContent
}

const deleteValidationRulesFile = async (fileName, dfspId) => {
  const deleted = await deleteRulesFile(await getLocalData(dfspId, 'validation'), fileName, dfspId)
  return deleted
}

// callback rules
const reloadCallbackRules = async (dfspId) => {
  await reloadRules(await getLocalData(dfspId, 'callback'), dfspId)
}

const setActiveCallbackRulesFile = async (fileName, dfspId) => {
  await setActiveRulesFile(await getLocalData(dfspId, 'callback'), fileName, dfspId)
}

const getCallbackRules = async (dfspId) => {
  const rules = await getRules(await getLocalData(dfspId, 'callback'), dfspId)
  return rules
}

const getCallbackRulesEngine = async (convertedRules, dfspId) => {
  const rulesEngine = await getRulesEngine(await getLocalData(dfspId, 'callback'), convertedRules, dfspId)
  return rulesEngine
}

const getCallbackRulesFiles = async (dfspId) => {
  await getCallbackRules(dfspId)
  const rulesFiles = await getRulesFiles(await getLocalData(dfspId, 'callback'), dfspId)
  return rulesFiles
}

const getCallbackRulesFileContent = async (fileName, dfspId) => {
  const rulesFileContent = await getRulesFileContent(await getLocalData(dfspId, 'callback'), fileName, dfspId)
  return rulesFileContent
}

const setCallbackRulesFileContent = async (fileName, fileContent, dfspId) => {
  const rulesFileContent = await setRulesFileContent(await getLocalData(dfspId, 'callback'), fileName, fileContent, dfspId)
  return rulesFileContent
}

const deleteCallbackRulesFile = async (fileName, dfspId) => {
  const deleted = await deleteRulesFile(await getLocalData(dfspId, 'callback'), fileName, dfspId)
  return deleted
}

// forward rules
const reloadForwardRules = async (dfspId) => {
  await reloadRules(await getLocalData(dfspId, 'forward'), dfspId)
}

const setActiveForwardRulesFile = async (fileName, dfspId) => {
  await setActiveRulesFile(await getLocalData(dfspId, 'forward'), fileName, dfspId)
}

const getForwardRules = async (dfspId) => {
  const rules = await getRules(await getLocalData(dfspId, 'forward'), dfspId)
  return rules
}

const getForwardRulesEngine = async (convertedRules, dfspId) => {
  const rulesEngine = await getRulesEngine(await getLocalData(dfspId, 'forward'), convertedRules, dfspId)
  return rulesEngine
}

const getForwardRulesFiles = async (dfspId) => {
  await getForwardRules(dfspId)
  const rulesFiles = await getRulesFiles(await getLocalData(dfspId, 'forward'), dfspId)
  return rulesFiles
}

const getForwardRulesFileContent = async (fileName, dfspId) => {
  const rulesFileContent = await getRulesFileContent(await getLocalData(dfspId, 'forward'), fileName, dfspId)
  return rulesFileContent
}

const setForwardRulesFileContent = async (fileName, fileContent, dfspId) => {
  const rulesFileContent = await setRulesFileContent(await getLocalData(dfspId, 'forward'), fileName, fileContent, dfspId)
  return rulesFileContent
}

const deleteForwardRulesFile = async (fileName, dfspId) => {
  const deleted = await deleteRulesFile(await getLocalData(dfspId, 'forward'), fileName, dfspId)
  return deleted
}

// common functions
const reloadRules = async (objStore, dfspId = 'data') => {
  const userRules = await dfspWiseDB.getDB().get(objStore.document)
  objStore.activeRulesFile = userRules[dfspId].activeRulesFile
  customLogger.logMessage('info', `Reloading ${objStore.ruleType} Rules from file ` + userRules.activeRulesFile, null, false)

  objStore.rules = userRules[dfspId].rules[userRules[dfspId].activeRulesFile]
  objStore.rulesEngine = new RulesEngine()
  if (!objStore.rules || !objStore.rules.length) {
    objStore.rules = []
  }
  loadRules(objStore.rules, objStore)
}

const setActiveRulesFile = async (objStore, fileName, dfspId = 'data') => {
  const userRules = await dfspWiseDB.getDB().get(objStore.document)
  userRules[dfspId].activeRulesFile = fileName
  await dfspWiseDB.update(objStore.document, userRules[dfspId], dfspId)
  objStore.activeRulesFile = fileName
  await reloadRules(objStore, dfspId)
}

const getRules = async (objStore, dfspId) => {
  if (!objStore.rules || objStore.rules.length === 0) {
    await reloadRules(objStore, dfspId)
  }
  return objStore.rules
}

const getRulesEngine = async (objStore, convertedRules, dfspId) => {
  if (convertedRules) {
    objStore.rulesEngine = new RulesEngine()
    loadRules(convertedRules, objStore)
  } else if (!objStore.rulesEngine) {
    objStore.rulesEngine = new RulesEngine()
    const rules = await getRules(objStore, dfspId)
    loadRules(rules, objStore)
  }
  return objStore.rulesEngine
}

const loadRules = (rules, objStore) => {
  rules.forEach(rule => {
    rule.conditions.all.forEach(condition => {
      if (condition.fact === 'headers') {
        condition.path = condition.path.toLowerCase()
      }
    })
  })
  objStore.rulesEngine.loadRules(rules)
}

const getRulesFiles = async (objStore, dfspId = 'data') => {
  try {
    const userRules = await dfspWiseDB.getDB().get(objStore.document)
    const resp = {
      files: Object.keys(userRules[dfspId].rules),
      activeRulesFile: objStore.activeRulesFile
    }
    return resp
  } catch (err) {
    return null
  }
}

const deleteRulesFile = async (objStore, fileName, dfspId = 'data') => {
  try {
    const userRules = await dfspWiseDB.getDB().get(objStore.document)
    delete userRules[dfspId].rules[fileName]
    await dfspWiseDB.update(objStore.document, userRules[dfspId], dfspId)
    await reloadRules(objStore, dfspId)
    return true
  } catch (err) {
    return err
  }
}

const setRulesFileContent = async (objStore, fileName, fileContent, dfspId = 'data') => {
  try {
    addTypeAndVersion(objStore.ruleType, fileContent)
    const userRules = await dfspWiseDB.getDB().get(objStore.document)
    userRules[dfspId].rules[fileName] = fileContent
    await dfspWiseDB.update(objStore.document, userRules[dfspId], dfspId)
    await reloadRules(objStore, dfspId)
    return true
  } catch (err) {
    return err
  }
}

const getRulesFileContent = async (objStore, fileName, dfspId) => {
  if (!dfspId) {
    dfspId = 'data'
  }
  const userRules = await dfspWiseDB.getDB().get(objStore.document)
  return userRules[dfspId].rules[fileName]
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
