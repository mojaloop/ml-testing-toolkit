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

const RulesEngine = require('./rulesEngine')
const fs = require('fs')
// var path = require('path')
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)
const accessFileAsync = promisify(fs.access)
const AdmZip = require('adm-zip')
// const copyFileAsync = promisify(fs.copyFile)
const readDirAsync = promisify(fs.readdir)
const rmDirAsync = promisify(fs.rmdir)
const deleteFileAsync = promisify(fs.unlink)
const customLogger = require('./requestLogger')
const Config = require('./config')
const { Engine } = require('json-rules-engine')
// const _ = require('lodash')

const rulesResponseFilePathPrefix = 'spec_files/rules_response/'
const rulesValidationFilePathPrefix = 'spec_files/rules_validation/'
const rulesCallbackFilePathPrefix = 'spec_files/rules_callback/'

const DEFAULT_RULES_FILE_NAME = 'default.json'
const CONFIG_FILE_NAME = 'config.json'

var responseRules = null
var validationRules = null
var callbackRules = null

var responseRulesEngine = null
var validationRulesEngine = null
var callbackRulesEngine = null

var activeResponseRulesFile = null
var activeValidationRulesFile = null
var activeCallbackRulesFile = null

const reloadResponseRules = async () => {
  const rulesConfigRawData = await readFileAsync(rulesResponseFilePathPrefix + CONFIG_FILE_NAME)
  const rulesConfig = JSON.parse(rulesConfigRawData)

  try {
    await accessFileAsync(rulesResponseFilePathPrefix + rulesConfig.activeRulesFile, fs.constants.F_OK)
  } catch (err) {
    // If active rules file not found then make default rules file as active
    await setActiveResponseRulesFile(DEFAULT_RULES_FILE_NAME)
  }
  activeResponseRulesFile = rulesConfig.activeRulesFile
  customLogger.logMessage('info', 'Reloading Response Rules from file ' + rulesConfig.activeRulesFile, null, false)
  const rulesRawdata = await readFileAsync(rulesResponseFilePathPrefix + rulesConfig.activeRulesFile)
  responseRules = JSON.parse(rulesRawdata)
  responseRulesEngine = new RulesEngine()
  if (!responseRules.length) {
    responseRules = []
  }
  responseRulesEngine.loadRules(responseRules)
}

const reloadValidationRules = async () => {
  const rulesConfigRawData = await readFileAsync(rulesValidationFilePathPrefix + CONFIG_FILE_NAME)
  const rulesConfig = JSON.parse(rulesConfigRawData)

  try {
    await accessFileAsync(rulesValidationFilePathPrefix + rulesConfig.activeRulesFile, fs.constants.F_OK)
  } catch (err) {
    // If active rules file not found then make default rules file as active
    await setActiveValidationRulesFile(DEFAULT_RULES_FILE_NAME)
  }
  activeValidationRulesFile = rulesConfig.activeRulesFile
  customLogger.logMessage('info', 'Reloading Validation Rules from file ' + rulesConfig.activeRulesFile, null, false)
  const rulesRawdata = await readFileAsync(rulesValidationFilePathPrefix + rulesConfig.activeRulesFile)
  validationRules = JSON.parse(rulesRawdata)
  validationRulesEngine = new RulesEngine()
  if (!validationRules.length) {
    validationRules = []
  }
  validationRulesEngine.loadRules(validationRules)
}

const reloadCallbackRules = async () => {
  const rulesConfigRawData = await readFileAsync(rulesCallbackFilePathPrefix + CONFIG_FILE_NAME)
  const rulesConfig = JSON.parse(rulesConfigRawData)

  try {
    await accessFileAsync(rulesCallbackFilePathPrefix + rulesConfig.activeRulesFile, fs.constants.F_OK)
  } catch (err) {
    // If active rules file not found then make default rules file as active
    await setActiveCallbackRulesFile(DEFAULT_RULES_FILE_NAME)
  }
  activeCallbackRulesFile = rulesConfig.activeRulesFile
  customLogger.logMessage('info', 'Reloading Callback Rules from file ' + rulesConfig.activeRulesFile, null, false)
  const rulesRawdata = await readFileAsync(rulesCallbackFilePathPrefix + rulesConfig.activeRulesFile)
  callbackRules = JSON.parse(rulesRawdata)
  callbackRulesEngine = new RulesEngine()
  if (!callbackRules.length) {
    callbackRules = []
  }
  callbackRulesEngine.loadRules(callbackRules)
}

const setActiveResponseRulesFile = async (fileName) => {
  const rulesConfig = {
    activeRulesFile: fileName
  }
  await writeFileAsync(rulesResponseFilePathPrefix + CONFIG_FILE_NAME, JSON.stringify(rulesConfig, null, 2))
  activeResponseRulesFile = fileName
  await reloadResponseRules()
}

const setActiveValidationRulesFile = async (fileName) => {
  const rulesConfig = {
    activeRulesFile: fileName
  }
  await writeFileAsync(rulesValidationFilePathPrefix + CONFIG_FILE_NAME, JSON.stringify(rulesConfig, null, 2))
  activeValidationRulesFile = fileName
  await reloadValidationRules()
}

const setActiveCallbackRulesFile = async (fileName) => {
  const rulesConfig = {
    activeRulesFile: fileName
  }
  await writeFileAsync(rulesCallbackFilePathPrefix + CONFIG_FILE_NAME, JSON.stringify(rulesConfig, null, 2))
  activeCallbackRulesFile = fileName
  await reloadCallbackRules()
}

const getResponseRules = async () => {
  if (!responseRules) {
    await reloadResponseRules()
  }
  return responseRules
}

const getValidationRules = async () => {
  if (!validationRules) {
    await reloadValidationRules()
  }
  return validationRules
}

const getCallbackRules = async () => {
  if (!callbackRules) {
    await reloadCallbackRules()
  }
  return callbackRules
}

const getResponseRulesEngine = async () => {
  if (!responseRulesEngine) {
    responseRulesEngine = new RulesEngine()
    const rules = await getResponseRules()
    responseRulesEngine.loadRules(rules)
  }
  return responseRulesEngine
}

const getValidationRulesEngine = async () => {
  if (!validationRulesEngine) {
    validationRulesEngine = new RulesEngine()
    const rules = await getValidationRules()
    validationRulesEngine.loadRules(rules)
  }
  return validationRulesEngine
}

const getCallbackRulesEngine = async () => {
  if (!callbackRulesEngine) {
    callbackRulesEngine = new RulesEngine()
    const rules = await getCallbackRules()
    callbackRulesEngine.loadRules(rules)
  }
  return callbackRulesEngine
}

const getResponseRulesFiles = async () => {
  await getResponseRules()
  try {
    const files = await readDirAsync(rulesResponseFilePathPrefix)
    const resp = {}
    // Do not return the config file
    resp.files = files.filter(item => {
      return (item !== CONFIG_FILE_NAME)
    })
    resp.activeRulesFile = activeResponseRulesFile
    return resp
  } catch (err) {
    return null
  }
}

const getResponseRulesFileContent = async (fileName) => {
  const rulesRawdata = await readFileAsync(rulesResponseFilePathPrefix + fileName)
  return JSON.parse(rulesRawdata)
}

const addTypeAndVersion = (ruleType, fileContent) => {
  if (!fileContent[fileContent.length - 1].type) {
    fileContent[fileContent.length - 1].type = ruleType
  }
  if (!fileContent[fileContent.length - 1].version) {
    fileContent[fileContent.length - 1].version = parseFloat(Config.getSystemConfig().RULES_VERSIONS[ruleType])
  }
}

const setResponseRulesFileContent = async (fileName, fileContent) => {
  try {
    addTypeAndVersion('response', fileContent)
    await writeFileAsync(rulesResponseFilePathPrefix + fileName, JSON.stringify(fileContent, null, 2))
    await reloadResponseRules()
    return true
  } catch (err) {
    return err
  }
}

const deleteResponseRulesFile = async (fileName) => {
  try {
    await deleteFileAsync(rulesResponseFilePathPrefix + fileName)
    await reloadResponseRules()
    return true
  } catch (err) {
    return err
  }
}

const getValidationRulesFiles = async () => {
  await getValidationRules()
  try {
    const files = await readDirAsync(rulesValidationFilePathPrefix)
    const resp = {}
    // Do not return the config file
    resp.files = files.filter(item => {
      return (item !== CONFIG_FILE_NAME)
    })
    resp.activeRulesFile = activeValidationRulesFile
    return resp
  } catch (err) {
    return null
  }
}

const getValidationRulesFileContent = async (fileName) => {
  const rulesRawdata = await readFileAsync(rulesValidationFilePathPrefix + fileName)
  return JSON.parse(rulesRawdata)
}

const setValidationRulesFileContent = async (fileName, fileContent) => {
  try {
    addTypeAndVersion('validation', fileContent)
    await writeFileAsync(rulesValidationFilePathPrefix + fileName, JSON.stringify(fileContent, null, 2))
    await reloadValidationRules()
    return true
  } catch (err) {
    return err
  }
}

const deleteValidationRulesFile = async (fileName) => {
  try {
    await deleteFileAsync(rulesValidationFilePathPrefix + fileName)
    await reloadValidationRules()
    return true
  } catch (err) {
    return err
  }
}

const getCallbackRulesFiles = async () => {
  await getCallbackRules()
  try {
    const files = await readDirAsync(rulesCallbackFilePathPrefix)
    const resp = {}
    // Do not return the config file
    resp.files = files.filter(item => {
      return (item !== CONFIG_FILE_NAME)
    })
    resp.activeRulesFile = activeCallbackRulesFile
    return resp
  } catch (err) {
    return null
  }
}

const getCallbackRulesFileContent = async (fileName) => {
  const rulesRawdata = await readFileAsync(rulesCallbackFilePathPrefix + fileName)
  return JSON.parse(rulesRawdata)
}

const setCallbackRulesFileContent = async (fileName, fileContent) => {
  try {
    addTypeAndVersion('callback', fileContent)
    await writeFileAsync(rulesCallbackFilePathPrefix + fileName, JSON.stringify(fileContent, null, 2))
    await reloadCallbackRules()
    return true
  } catch (err) {
    return err
  }
}

const deleteCallbackRulesFile = async (fileName) => {
  try {
    await deleteFileAsync(rulesCallbackFilePathPrefix + fileName)
    await reloadCallbackRules()
    return true
  } catch (err) {
    return err
  }
}

const exportFiles = async (ruleTypes) => {
  const zip = new AdmZip()
  ruleTypes.forEach(ruleType => {
    const filename = `spec_files/${ruleType}`
    if (filename.endsWith('.json')) {
      zip.addLocalFile(filename)
    } else {
      zip.addLocalFolder(filename, ruleType)
    }
  })
  return {
    namePrefix: ruleTypes.length > 1 ? 'spec_files' : ruleTypes[0],
    buffer: zip.toBuffer()
  }
}

const rulesHelper = async (ruleType, folder, zipEntry) => {
  if (zipEntry.entryName !== `${folder}/${CONFIG_FILE_NAME}`) {
    const rules = JSON.parse(zipEntry.getData().toString('utf-8'))
    const responseVersion = Config.getSystemConfig().RULES_VERSIONS[ruleType]
    const engine = new Engine()
    rules.forEach(rule => {
      if (rule.type !== ruleType) {
        throw new Error(`validation error: rule ${rule.ruleId} in ${zipEntry.entryName} should be of type ${ruleType}`)
      }
      if (rule.version > responseVersion) {
        throw new Error(`validation error: rule ${rule.ruleId} in ${zipEntry.entryName} version should at most ${responseVersion}`)
      }
      try {
        engine.addRule(rule)
      } catch (err) {
        throw new Error(`validation error: rule ${rule.ruleId} in ${zipEntry.entryName} is not valid: ${err.message}`)
      }
    })
  }
}

const importFiles = async (data) => {
  console.log(data)
  const zip = new AdmZip(Buffer.from(data))
  const elements = []
  const zipEntries = zip.getEntries()
  zipEntries.forEach((zipEntry) => {
    if (!zipEntry.isDirectory) {
      const element = zipEntry.entryName.split('/')[0]
      if (!elements.includes(element)) {
        elements.push(element)
      }
      switch (element) {
        case 'rules_response': {
          rulesHelper('response', 'rules_response', zipEntry)
          break
        }
        case 'rules_validation': {
          rulesHelper('validation', 'rules_validation', zipEntry)
          break
        }
        case 'rules_callback': {
          rulesHelper('callback', 'rules_callback', zipEntry)
          break
        }
        case 'user_config.json': {
          // already validated
          break
        }
        default:
          throw new Error(`validation error: element ${element} not supported`)
      }
    }
  })
  for (const index in elements) {
    const elementToRemove = `spec_files/${elements[index]}`
    if (elementToRemove.endsWith('.json')) {
      await deleteFileAsync(elementToRemove)
    } else {
      await rmDirAsync(elementToRemove, { recursive: true })
    }
  }
  zip.extractAllTo('spec_files')
  return elements
}

module.exports = {
  getResponseRulesEngine,
  getValidationRulesEngine,
  getCallbackRulesEngine,
  getResponseRules,
  getValidationRules,
  getCallbackRules,
  // setValidationRules,
  // setCallbackRules,
  getResponseRulesFiles,
  getResponseRulesFileContent,
  setResponseRulesFileContent,
  deleteResponseRulesFile,
  getValidationRulesFiles,
  getValidationRulesFileContent,
  setValidationRulesFileContent,
  deleteValidationRulesFile,
  getCallbackRulesFiles,
  getCallbackRulesFileContent,
  setCallbackRulesFileContent,
  deleteCallbackRulesFile,
  setActiveValidationRulesFile,
  setActiveCallbackRulesFile,
  setActiveResponseRulesFile,
  exportFiles,
  importFiles
}
