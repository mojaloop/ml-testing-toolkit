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

const { rmdirAsync } = require('./utils')
const AdmZip = require('adm-zip')
const Config = require('./config')
const { Engine } = require('json-rules-engine')
const CONFIG_FILE_NAME = 'config.json'
const storageAdapter = require('./storageAdapter')

const exportSpecFiles = async (ruleTypes, user) => {
  const zip = new AdmZip()

  for (const index in ruleTypes) {
    const ruleType = ruleTypes[index]
    if (user) {
      if (ruleType.endsWith('.json')) {
        const filename = `spec_files/${ruleType}`
        const document = await storageAdapter.read(filename, user)
        zip.addFile(filename, Buffer.from(JSON.stringify(document.data)))
      } else {
        const filename = `spec_files/${ruleType}/`
        const documents = await storageAdapter.read(filename, user)
        for (const index in documents) {
          const id = filename + documents[index]
          const document = await storageAdapter.read(id, user)
          zip.addFile(id, Buffer.from(JSON.stringify(document.data)))
        }
      }
    } else {
      if (ruleType.endsWith('.json')) {
        const filename = `spec_files/${ruleType}`
        zip.addLocalFile(filename)
      } else {
        const filename = `spec_files/${ruleType}/`
        zip.addLocalFolder(filename, ruleType)
      }
    }
  }
  return {
    namePrefix: ruleTypes.length > 1 ? 'spec_files' : ruleTypes[0],
    buffer: zip.toBuffer()
  }
}

const validateRules = (entryName, ruleType, ruleVersion, rules) => {
  const engine = new Engine()
  rules.forEach(rule => {
    if (rule.type !== ruleType) {
      throw new Error(`validation error: rule ${rule.ruleId} in ${entryName} should be of type ${ruleType}`)
    }
    if (rule.version > ruleVersion) {
      throw new Error(`validation error: rule ${rule.ruleId} in ${entryName} version should at most ${ruleVersion}`)
    }
    try {
      engine.addRule(rule)
    } catch (err) {
      throw new Error(`validation error: rule ${rule.ruleId} in ${entryName} is not valid: ${err.message}`)
    }
  })
}

const validateInputData = (zipEntries, options) => {
  const entries = []
  zipEntries.forEach((zipEntry) => {
    const entryName = zipEntry.entryName
    const entryData = JSON.parse(zipEntry.getData().toString('utf-8'))
    entries.push({
      name: entryName,
      data: entryData
    })
    const element = entryName.split('/')[0]
    if (options.includes(element)) {
      switch (element) {
        case 'rules_response': {
          if (entryName !== `rules_response/${CONFIG_FILE_NAME}`) {
            validateRules(entryName, 'response', Config.getSystemConfig().CONFIG_VERSIONS.response, entryData)
          }
          break
        }
        case 'rules_validation': {
          if (entryName !== `rules_validation/${CONFIG_FILE_NAME}`) {
            validateRules(entryName, 'validation', Config.getSystemConfig().CONFIG_VERSIONS.validation, entryData)
          }
          break
        }
        case 'rules_callback': {
          if (entryName !== `rules_callback/${CONFIG_FILE_NAME}`) {
            validateRules(entryName, 'callback', Config.getSystemConfig().CONFIG_VERSIONS.callback, entryData)
          }
          break
        }
        case 'user_config.json': {
          const userSettingsVersion = Config.getSystemConfig().CONFIG_VERSIONS.userSettings
          if (entryData.VERSION > userSettingsVersion) {
            throw new Error(`validation error: user_config.json version ${entryData.VERSION} not supproted be at most ${userSettingsVersion}`)
          }
          break
        }
      }
    }
  })
  return entries
}

const extractData = async (zip, options, entries, user) => {
  for (const index in options) {
    if (user) {
      for (const index in entries) {
        const id = entries[index].name
        const data = entries[index].data
        await storageAdapter.upsert(id, data, user)
      }
    } else {
      const option = options[index]
      if (option === 'user_config.json') {
        zip.extractEntryTo(option, 'spec_files', false, true)
      } else {
        let deleted = false
        for (const index in entries) {
          const entry = entries[index].name
          if (entry.startsWith(option)) {
            if (!deleted) {
              await rmdirAsync(`spec_files/${option}`, { recursive: true })
              deleted = true
            }
            zip.extractEntryTo(entry, `spec_files/${option}`, false)
          }
        }
      }
    }
  }
}

const importSpecFiles = async (data, options, user) => {
  const zip = new AdmZip(Buffer.from(data))
  const entries = validateInputData(zip.getEntries(), options)
  await extractData(zip, options, entries, user)
}

const exportSpecFile = async (filepath, user) => {
  let documentBuffer
  if (user) {
    const filename = `spec_files/${filepath}`
    const document = await storageAdapter.read(filename, user)
    documentBuffer = Buffer.from(JSON.stringify(document.data))
  } else {
    const filename = `spec_files/${filepath}`
    const document = await storageAdapter.read(filename, null)
    documentBuffer = Buffer.from(JSON.stringify(document.data))
  }
  return {
    namePrefix: filepath,
    buffer: documentBuffer
  }
}

const importSpecFile = async (data, filePath, user) => {
  if (user) {
    const dataBuffer = JSON.parse(Buffer.from(data).toString())
    await storageAdapter.upsert(`spec_files/${filePath}`, dataBuffer, user)
  } else {
    const dataBuffer = JSON.parse(Buffer.from(data).toString())
    await storageAdapter.upsert(`spec_files/${filePath}`, dataBuffer, null)
  }
}

module.exports = {
  exportSpecFiles,
  importSpecFiles,
  exportSpecFile,
  importSpecFile
}
