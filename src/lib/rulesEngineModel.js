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
const storageAdapter = require('./storageAdapter')

const DEFAULT_RULES_FILE_NAME = 'default.json'
const CONFIG_FILE_NAME = 'config.json'

const model = {
  data: {
    response: {
      rulesFilePathPrefix: 'spec_files/rules_response/',
      rules: null,
      rulesEngine: null,
      activeRulesFile: DEFAULT_RULES_FILE_NAME,
      ruleType: 'response'
    },
    validation: {
      rulesFilePathPrefix: 'spec_files/rules_validation/',
      rules: null,
      rulesEngine: null,
      activeRulesFile: DEFAULT_RULES_FILE_NAME,
      ruleType: 'validation'
    },
    callback: {
      rulesFilePathPrefix: 'spec_files/rules_callback/',
      rules: null,
      rulesEngine: null,
      activeRulesFile: DEFAULT_RULES_FILE_NAME,
      ruleType: 'callback'
    },
    forward: {
      rulesFilePathPrefix: 'spec_files/rules_forward/',
      rules: null,
      rulesEngine: null,
      activeRulesFile: DEFAULT_RULES_FILE_NAME,
      ruleType: 'forward'
    }
  }
}

const getModel = async (user, dfspType) => {
  if (user) {
    const dfspId = user.dfspId
    if (!model[dfspId]) {
      model[dfspId] = {}
    }
    if (!model[dfspId][dfspType]) {
      console.log(model.data[dfspType])
      model[dfspId][dfspType] = { ...model.data[dfspType] }
      await getRulesFiles(model[dfspId][dfspType], user)
    }
    return model[dfspId][dfspType]
  }
  return model.data[dfspType]
}

// response rules
const reloadResponseRules = async (user) => {
  const model = await getModel(user, 'response')
  await reloadRules(model, user)
}

const setActiveResponseRulesFile = async (fileName, user) => {
  const model = await getModel(user, 'response')
  await setActiveRulesFile(model, fileName, user)
}

const getResponseRules = async (user) => {
  const model = await getModel(user, 'response')
  const rules = await getRules(model, user)
  return rules
}

const getResponseRulesEngine = async (convertedRules, user) => {
  const model = await getModel(user, 'response')
  const rulesEngine = await getRulesEngine(model, convertedRules, user)
  return rulesEngine
}

const getResponseRulesFiles = async (user) => {
  // await getResponseRules(user)
  const model = await getModel(user, 'response')
  const rulesFiles = await getRulesFiles(model, user)
  return rulesFiles
}

const getResponseRulesFileContent = async (fileName, user) => {
  const model = await getModel(user, 'response')
  const rulesFileContent = await getRulesFileContent(model, fileName, user)
  return rulesFileContent
}

const setResponseRulesFileContent = async (fileName, fileContent, user) => {
  const model = await getModel(user, 'response')
  const rulesFileContent = await setRulesFileContent(model, fileName, fileContent, user)
  return rulesFileContent
}

const deleteResponseRulesFile = async (fileName, user) => {
  const model = await getModel(user, 'response')
  const deleted = await deleteRulesFile(model, fileName, user)
  return deleted
}

// validation rules
const reloadValidationRules = async (user) => {
  const model = await getModel(user, 'validation')
  await reloadRules(model, user)
}

const setActiveValidationRulesFile = async (fileName, user) => {
  const model = await getModel(user, 'validation')
  await setActiveRulesFile(model, fileName, user)
}

const getValidationRules = async (user) => {
  const model = await getModel(user, 'validation')
  const rules = await getRules(model, user)
  return rules
}

const getValidationRulesEngine = async (convertedRules, user) => {
  const model = await getModel(user, 'validation')
  const rulesEngine = await getRulesEngine(model, convertedRules, user)
  return rulesEngine
}

const getValidationRulesFiles = async (user) => {
  // await getValidationRules(user)
  const model = await getModel(user, 'validation')
  const rulesFiles = await getRulesFiles(model, user)
  return rulesFiles
}

const getValidationRulesFileContent = async (fileName, user) => {
  const model = await getModel(user, 'validation')
  const rulesFileContent = await getRulesFileContent(model, fileName, user)
  return rulesFileContent
}

const setValidationRulesFileContent = async (fileName, fileContent, user) => {
  const model = await getModel(user, 'validation')
  const rulesFileContent = await setRulesFileContent(model, fileName, fileContent, user)
  return rulesFileContent
}

const deleteValidationRulesFile = async (fileName, user) => {
  const model = await getModel(user, 'validation')
  const deleted = await deleteRulesFile(model, fileName, user)
  return deleted
}

// callback rules
const reloadCallbackRules = async (user) => {
  const model = await getModel(user, 'callback')
  await reloadRules(model, user)
}

const setActiveCallbackRulesFile = async (fileName, user) => {
  const model = await getModel(user, 'callback')
  await setActiveRulesFile(model, fileName, user)
}

const getCallbackRules = async (user) => {
  const model = await getModel(user, 'callback')
  const rules = await getRules(model, user)
  return rules
}

const getCallbackRulesEngine = async (convertedRules, user) => {
  const model = await getModel(user, 'callback')
  const rulesEngine = await getRulesEngine(model, convertedRules, user)
  return rulesEngine
}

const getCallbackRulesFiles = async (user) => {
  // await getCallbackRules(user)
  const model = await getModel(user, 'callback')
  const rulesFiles = await getRulesFiles(model, user)
  return rulesFiles
}

const getCallbackRulesFileContent = async (fileName, user) => {
  const model = await getModel(user, 'callback')
  const rulesFileContent = await getRulesFileContent(model, fileName, user)
  return rulesFileContent
}

const setCallbackRulesFileContent = async (fileName, fileContent, user) => {
  const model = await getModel(user, 'callback')
  const rulesFileContent = await setRulesFileContent(model, fileName, fileContent, user)
  return rulesFileContent
}

const deleteCallbackRulesFile = async (fileName, user) => {
  const model = await getModel(user, 'callback')
  const deleted = await deleteRulesFile(model, fileName, user)
  return deleted
}

// forward rules
const reloadForwardRules = async (user) => {
  const model = await getModel(user, 'forward')
  await reloadRules(model, user)
}

const setActiveForwardRulesFile = async (fileName, user) => {
  const model = await getModel(user, 'forward')
  await setActiveRulesFile(model, fileName, user)
}

const getForwardRules = async (user) => {
  const model = await getModel(user, 'forward')
  const rules = await getRules(model, user)
  return rules
}

const getForwardRulesEngine = async (convertedRules, user) => {
  const model = await getModel(user, 'forward')
  const rulesEngine = await getRulesEngine(model, convertedRules, user)
  return rulesEngine
}

const getForwardRulesFiles = async (user) => {
  // await getForwardRules(user)
  const model = await getModel(user, 'forward')
  const rulesFiles = await getRulesFiles(model, user)
  return rulesFiles
}

const getForwardRulesFileContent = async (fileName, user) => {
  const model = await getModel(user, 'forward')
  const rulesFileContent = await getRulesFileContent(model, fileName, user)
  return rulesFileContent
}

const setForwardRulesFileContent = async (fileName, fileContent, user) => {
  const model = await getModel(user, 'forward')
  const rulesFileContent = await setRulesFileContent(model, fileName, fileContent, user)
  return rulesFileContent
}

const deleteForwardRulesFile = async (fileName, user) => {
  const model = await getModel(user, 'forward')
  const deleted = await deleteRulesFile(model, fileName, user)
  return deleted
}

// common functions
const reloadRules = async (model, user) => {
  customLogger.logMessage('info', `Reloading ${model.ruleType} Rules from file ` + model.activeRulesFile, null, false)
  const userRules = await storageAdapter.read(model.rulesFilePathPrefix + model.activeRulesFile, user)
  model.rules = userRules.data
  if (!model.rules || !model.rules.length) {
    model.rules = []
  }
  loadRules(model, model.rules)
}

const setActiveRulesFile = async (model, fileName, user) => {
  const rulesConfig = {
    activeRulesFile: fileName
  }
  await storageAdapter.upsert(model.rulesFilePathPrefix + CONFIG_FILE_NAME, rulesConfig, user)
  model.activeRulesFile = fileName
  await reloadRules(model, user)
}

const getRules = async (model, user) => {
  if (!model.rules || model.rules.length === 0) {
    await reloadRules(model, user)
  }
  return model.rules
}

const getRulesEngine = async (model, convertedRules) => {
  if (!model.rulesEngine) {
    model.rulesEngine = new RulesEngine()
  }
  if (convertedRules) {
    loadRules(model, convertedRules)
  }
  return model.rulesEngine
}

const loadRules = (model, rules) => {
  rules.forEach(rule => {
    rule.conditions.all.forEach(condition => {
      if (condition.fact === 'headers') {
        condition.path = condition.path.toLowerCase()
      }
    })
  })
  model.rulesEngine = new RulesEngine()
  model.rulesEngine.loadRules(rules)
}

const getRulesFiles = async (model, user) => {
  try {
    const files = await storageAdapter.read(model.rulesFilePathPrefix, user)
    const resp = {}
    // Do not return the config file
    resp.files = files.data.filter(item => {
      return (item !== CONFIG_FILE_NAME)
    })
    resp.activeRulesFile = model.activeRulesFile
    return resp
  } catch (err) {
    console.log(err)
    return null
  }
}

const deleteRulesFile = async (model, fileName, user) => {
  try {
    await storageAdapter.remove(model.rulesFilePathPrefix + fileName, user)
    await setActiveRulesFile(model, DEFAULT_RULES_FILE_NAME, user)
    return true
  } catch (err) {
    return err
  }
}

const setRulesFileContent = async (model, fileName, fileContent, user) => {
  try {
    addTypeAndVersion(model, fileContent)
    await storageAdapter.upsert(model.rulesFilePathPrefix + fileName, fileContent, user)
    await reloadRules(model, user)
    return true
  } catch (err) {
    return err
  }
}

const getRulesFileContent = async (model, fileName, user) => {
  const userRules = await storageAdapter.read(model.rulesFilePathPrefix + fileName, user)
  return userRules.data
}

const addTypeAndVersion = (model, fileContent) => {
  for (const index in fileContent) {
    if (!fileContent[index].type) {
      fileContent[index].type = model.ruleType
    }
    if (!fileContent[index].version) {
      fileContent[index].version = parseFloat(Config.getSystemConfig().CONFIG_VERSIONS[model.ruleType])
    }
  }
}

module.exports = {
  getModel,

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
