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
const _ = require('lodash')
const objectStore = require('./objectStore')
const { TraceHeaderUtils } = require('ml-testing-toolkit-shared-lib')

const TESTS_EXECUTION_TIMEOUT = 1000 * 60 * 15 // 15min timout

const cli = (commander) => {
  const configFile = {
    mode: 'outbound',
    reportFormat: 'json',
    baseURL: 'http://localhost:5050',
    logLevel: '0',
    reportAutoFilenameEnable: false
  }

  if (fs.existsSync(commander.config)) {
    const newConfig = JSON.parse(fs.readFileSync(commander.config, 'utf8'))
    _.merge(configFile, newConfig)
  }

  const config = {
    mode: commander.mode || configFile.mode,
    inputFiles: commander.inputFiles,
    logLevel: commander.logLevel || configFile.logLevel,
    environmentFile: commander.environmentFile,
    reportFormat: commander.reportFormat || configFile.reportFormat,
    reportAutoFilenameEnable: commander.reportAutoFilenameEnable === 'true' || configFile.reportAutoFilenameEnable === true,
    reportTarget: commander.reportTarget || configFile.reportTarget,
    slackWebhookUrl: commander.slackWebhookUrl || configFile.slackWebhookUrl,
    slackPassedImage: configFile.slackPassedImage,
    slackFailedImage: configFile.slackFailedImage,
    baseURL: commander.baseUrl || configFile.baseURL,
    extraSummaryInformation: commander.extraSummaryInformation || configFile.extraSummaryInformation
  }

  objectStore.set('config', config)

  switch (config.mode) {
    case 'monitoring':
      require('./utils/listeners').monitoring()
      break
    case 'outbound':
      if (config.inputFiles) {
        if (config.environmentFile) {
          // Generate a session ID
          const sessionId = TraceHeaderUtils.generateSessionId()
          require('./utils/listeners').outbound(sessionId)
          require('./modes/outbound').sendTemplate(sessionId)
          setTimeout(() => {
            console.log('Tests execution timed out....')
            process.exit(1)
          }, TESTS_EXECUTION_TIMEOUT)
        } else {
          console.log('error: required option \'-e, --environment-file <environmentFile>\' not specified')
          process.exit(1)
        }
      } else {
        console.log('error: required option \'-i, --input-files <inputFiles>\' not specified')
        process.exit(1)
      }
      break
    default:
      console.log('Mode is not supported')
      console.log('Terminate with exit code 1')
      process.exit(1)
  }
}

module.exports = {
  cli
}
