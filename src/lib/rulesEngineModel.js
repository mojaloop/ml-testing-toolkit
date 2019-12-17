const RulesEngine = require('./rulesEngine')
const fs = require('fs')
// var path = require('path')
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)
const accessFileAsync = promisify(fs.access)
const copyFileAsync = promisify(fs.copyFile)
const customLogger = require('./requestLogger')
// const _ = require('lodash')

const rulesValidationFilePathPrefix = 'spec_files/rules_validation/'
const rulesCallbackFilePathPrefix = 'spec_files/rules_callback/'

const DEFAULT_RULES_FILE_NAME = 'default.json'
const ACTIVE_RULES_FILE_NAME = 'activeRules.json'

var validationRules = null
var callbackRules = null

var validationRulesEngine = null
var callbackRulesEngine = null

const reloadValidationRules = async () => {
  try {
    await accessFileAsync(rulesValidationFilePathPrefix + ACTIVE_RULES_FILE_NAME, fs.constants.F_OK)
  } catch (err) {
    await copyFileAsync(rulesValidationFilePathPrefix + DEFAULT_RULES_FILE_NAME, rulesValidationFilePathPrefix + ACTIVE_RULES_FILE_NAME)
  }

  customLogger.logMessage('info', 'Reloading Validation Rules from file', null, false)
  const rulesRawdata = await readFileAsync(rulesValidationFilePathPrefix + ACTIVE_RULES_FILE_NAME)
  validationRules = JSON.parse(rulesRawdata)
}

const reloadCallbackRules = async () => {
  try {
    await accessFileAsync(rulesCallbackFilePathPrefix + ACTIVE_RULES_FILE_NAME, fs.constants.F_OK)
  } catch (err) {
    await copyFileAsync(rulesCallbackFilePathPrefix + DEFAULT_RULES_FILE_NAME, rulesCallbackFilePathPrefix + ACTIVE_RULES_FILE_NAME)
  }
  customLogger.logMessage('info', 'Reloading Callback Rules from file', null, false)
  const rulesRawdata = await readFileAsync(rulesCallbackFilePathPrefix + ACTIVE_RULES_FILE_NAME)
  callbackRules = JSON.parse(rulesRawdata)
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

const setValidationRules = async (rules) => {
  validationRules = rules
  validationRulesEngine = new RulesEngine()
  validationRulesEngine.loadRules(rules)
  customLogger.logMessage('info', 'Reloaded the validation rules', null, false)
  await writeFileAsync(rulesValidationFilePathPrefix + ACTIVE_RULES_FILE_NAME, JSON.stringify(rules, null, 2))
}

const setCallbackRules = async (rules) => {
  callbackRules = rules
  callbackRulesEngine = new RulesEngine()
  callbackRulesEngine.loadRules(rules)
  customLogger.logMessage('info', 'Reloaded the callback rules', null, false)
  await writeFileAsync(rulesCallbackFilePathPrefix + ACTIVE_RULES_FILE_NAME, JSON.stringify(rules, null, 2))
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

module.exports = {
  getValidationRulesEngine,
  getCallbackRulesEngine,
  getValidationRules,
  getCallbackRules,
  setValidationRules,
  setCallbackRules
}
