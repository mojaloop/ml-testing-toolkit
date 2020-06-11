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
 * Georgi Logodazhki <georgi.logodazhki@modusbox.com> (Original Author)
 --------------
 ******/

const fs = require('fs')
const { promisify } = require('util')
const AdmZip = require('adm-zip')
const rmDirAsync = promisify(fs.rmdir)
const Config = require('./config')
const { Engine } = require('json-rules-engine')

const CONFIG_FILE_NAME = 'config.json'

const exportSpecFiles = async (ruleTypes) => {
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

const validateRules = (entryName, ruleType, responseVersion, rules) => {
  const engine = new Engine()
  rules.forEach(rule => {
    if (rule.type !== ruleType) {
      throw new Error(`validation error: rule ${rule.ruleId} in ${entryName} should be of type ${ruleType}`)
    }
    if (rule.version > responseVersion) {
      throw new Error(`validation error: rule ${rule.ruleId} in ${entryName} version should at most ${responseVersion}`)
    }
    try {
      engine.addRule(rule)
    } catch (err) {
      throw new Error(`validation error: rule ${rule.ruleId} in ${entryName} is not valid: ${err.message}`)
    }
  })
}

const importSpecFiles = async (data, options) => {
  const zip = new AdmZip(Buffer.from(data))
  const zipEntries = zip.getEntries()

  const entries = []
  zipEntries.forEach((zipEntry) => {
    const entryName = zipEntry.entryName
    const entryData = JSON.parse(zipEntry.getData().toString('utf-8'))
    entries.push(entryName)
    const element = entryName.split('/')[0]
    if (options.includes(element)) {
      switch (element) {
        case 'rules_response': {
          if (entryName !== `rules_response/${CONFIG_FILE_NAME}`) {
            validateRules(entryName, 'response', Config.getSystemConfig().RULES_VERSIONS.response, entryData)
          }
          break
        }
        case 'rules_validation': {
          if (entryName !== `rules_validation/${CONFIG_FILE_NAME}`) {
            validateRules(entryName, 'validation', Config.getSystemConfig().RULES_VERSIONS.validation, entryData)
          }
          break
        }
        case 'rules_callback': {
          if (entryName !== `rules_callback/${CONFIG_FILE_NAME}`) {
            validateRules(entryName, 'callback', Config.getSystemConfig().RULES_VERSIONS.callback, entryData)
          }
          break
        }
        default:
          // ignore
      }
    }
  })
  for (const index in options) {
    const option = options[index]
    if (option === 'user_config.json') {
      zip.extractEntryTo(option, 'spec_files', false, true)
    } else {
      let deleted
      for (const index in entries) {
        const entry = entries[index]
        if (entry.startsWith(option)) {
          if (!deleted) {
            await rmDirAsync(`spec_files/${option}`, { recursive: true })
            deleted = true
          }
          zip.extractEntryTo(entry, `spec_files/${option}`, false)
        }
      }
    }
  }
}

module.exports = {
  exportSpecFiles,
  importSpecFiles,
  validateRules
}
