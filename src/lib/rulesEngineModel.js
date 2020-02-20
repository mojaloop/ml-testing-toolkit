const RulesEngine = require('./rulesEngine')
const fs = require('fs')
// var path = require('path')
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)
const accessFileAsync = promisify(fs.access)
const copyFileAsync = promisify(fs.copyFile)
const readDirAsync = promisify(fs.readdir)
const deleteFileAsync = promisify(fs.unlink)
const customLogger = require('./requestLogger')
// const _ = require('lodash')

const rulesResponseFilePathPrefix = 'spec_files/rules_response/'
const rulesValidationFilePathPrefix = 'spec_files/rules_validation/'
const rulesCallbackFilePathPrefix = 'spec_files/rules_callback/'

const DEFAULT_RULES_FILE_NAME = 'default.json'
const ACTIVE_RULES_FILE_NAME = 'activeRules.json'
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
  let rulesConfig = JSON.parse(rulesConfigRawData)

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
  let rulesConfig = JSON.parse(rulesConfigRawData)

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
  let rulesConfig = JSON.parse(rulesConfigRawData)

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
  try {
    const rulesRawdata = await readFileAsync(rulesResponseFilePathPrefix + fileName)
    return JSON.parse(rulesRawdata)
  } catch (err) {
    return err
  }
}

const setResponseRulesFileContent = async (fileName, fileContent) => {
  try {
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
  try {
    const rulesRawdata = await readFileAsync(rulesValidationFilePathPrefix + fileName)
    return JSON.parse(rulesRawdata)
  } catch (err) {
    return err
  }
}

const setValidationRulesFileContent = async (fileName, fileContent) => {
  try {
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
  try {
    const rulesRawdata = await readFileAsync(rulesCallbackFilePathPrefix + fileName)
    return JSON.parse(rulesRawdata)
  } catch (err) {
    return err
  }
}

const setCallbackRulesFileContent = async (fileName, fileContent) => {
  try {
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
  setActiveCallbackRulesFile
}
