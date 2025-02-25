/*****
 License
 --------------
 Copyright © 2020-2025 Mojaloop Foundation
 The Mojaloop files are made available by the Mojaloop Foundation under the Apache License, Version 2.0 (the "License") and you may not use these files except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, the Mojaloop files are distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

 Contributors
 --------------
 This is the official list of the Mojaloop project contributors for this file.
 Names of the original copyright holders (individuals or organizations)
 should be listed with a '*' in the first column. People who have
 contributed from an organization can be listed under the organization
 that actually holds the copyright for their contributions (see the
 Mojaloop Foundation for an example). Those individuals should have
 their names indented and be marked with a '-'. Email address can be added
 optionally within square brackets <email>.

 * Mojaloop Foundation
 - Name Surname <name.surname@mojaloop.io>

 * ModusBox
 * Vijaya Kumar Guthi <vijaya.guthi@modusbox.com> (Original Author)
 --------------
 ******/
const Handlebars = require('handlebars')
const { readFileAsync } = require('../utils')
const reportHelpers = require('./helpers')
const customLogger = require('../requestLogger')

const BASE_TEMPLATE_PATH = 'spec_files/reports/templates'

const testResultTemplates = {
  html: {
    file: 'html_template.html',
    handle: null
  },
  pdf: {
    file: 'pdf_template.html',
    handle: null
  }
}

const testcaseDefinitionTemplates = {
  html: {
    file: 'table_view.html',
    handle: null
  }
}

const _initializeTestReports = async () => {
  for (const key of Object.keys(testResultTemplates)) {
    const templateContent = await readFileAsync(BASE_TEMPLATE_PATH + '/newman/' + testResultTemplates[key].file)
    testResultTemplates[key].handle = Handlebars.compile(templateContent.toString())
    customLogger.logMessage('debug', key + ' template compiled')
  }
}

const _initializeTestcaseDefinition = async () => {
  for (const key of Object.keys(testcaseDefinitionTemplates)) {
    const templateContent = await readFileAsync(BASE_TEMPLATE_PATH + '/testcase_definition/' + testcaseDefinitionTemplates[key].file)
    testcaseDefinitionTemplates[key].handle = Handlebars.compile(templateContent.toString())
    customLogger.logMessage('debug', key + ' template compiled')
  }
}

const initialize = async () => {
  customLogger.logMessage('info', 'Initializing Report Generator...')
  await _initializeTestReports()
  await _initializeTestcaseDefinition()
}

const generateReport = async (jsonReport, format) => {
  let templateHandle = testResultTemplates.html.handle
  if (format === 'pdf' || format === 'printhtml') {
    templateHandle = testResultTemplates.pdf.handle
  }

  if (templateHandle) {
    try {
      const data = jsonReport
      const options = {
        helpers: reportHelpers
      }
      const result = templateHandle(data, options)
      customLogger.logMessage('debug', 'Report generated in ' + format + ' format')
      return result
    } catch (err) {
      customLogger.logMessage('error', 'Error in generating template: ' + err.message)
      throw (err)
    }
  } else {
    customLogger.logMessage('error', 'No template generator found for ' + format)
    throw (new Error('No template generator found for ' + format))
  }
}

const generateTestcaseDefinition = async (template, format) => {
  const templateHandle = testcaseDefinitionTemplates.html.handle

  if (templateHandle) {
    try {
      const data = template
      const options = {
        // helpers: reportHelpers
      }
      const result = templateHandle(data, options)
      customLogger.logMessage('debug', 'Report generated in ' + format + ' format')
      return result
    } catch (err) {
      customLogger.logMessage('error', 'Error in generating template: ' + err.message)
      throw (err)
    }
  } else {
    customLogger.logMessage('error', 'No template generator found for ' + format)
    throw (new Error('No template generator found for ' + format))
  }
}

module.exports = {
  initialize,
  generateReport,
  generateTestcaseDefinition
}
