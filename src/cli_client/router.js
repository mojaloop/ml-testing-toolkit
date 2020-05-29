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

const cli = (commander) => {
  const configFile = JSON.parse(fs.readFileSync(commander.config || 'cli-default-config.json', 'utf8'))

  const config = {
    mode: commander.mode || configFile.mode,
    inputFiles: commander.inputFiles,
    environmentFile: commander.environmentFile,
    reportFormat: commander.reportFormat || configFile.reportFormat,
    reportFilename: commander.reportFilename
  }

  switch (config.mode) {
    case 'monitoring':
      require('./utils/listeners').monitoring()
      require('./modes/monitoring')
      break
    case 'outbound':
      if (config.inputFiles) {
        if (config.environmentFile) {
          require('./utils/listeners').outbound()
          require('./modes/outbound').sendTemplate(config)
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
