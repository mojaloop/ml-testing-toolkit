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
const axios = require('axios').default
const fs = require('fs')
const { promisify } = require('util')

const outbound = async (data, config) => {
  const writeFileAsync = promisify(fs.writeFile)
  let reportData
  let reportFilename
  switch (config.reportFormat) {
    case 'json':
      reportData = JSON.stringify(data, null, 2)
      reportFilename = config.reportFilename || `${data.name}-${data.runtimeInformation.completedTimeISO}.json`
      break
    case 'html':
    case 'printhtml': {
      const response = await axios.post(`http://localhost:5050/api/reports/testcase/${config.reportFormat}`, data, { headers: { 'Content-Type': 'application/json' } })
      reportData = response.data
      if (config.reportFilename) {
        reportFilename = config.reportFilename
      } else {
        const disposition = response.headers['content-disposition']
        if (disposition && disposition.indexOf('attachment') !== -1) {
          var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
          var matches = filenameRegex.exec(disposition)
          if (matches != null && matches[1]) {
            reportFilename = matches[1].replace(/['"]/g, '')
          }
        }
        if (!reportFilename) {
          reportFilename = 'report.html'
        }
      }
      break
    }
    default:
      console.log('reportFormat is not supported')
      return
  }
  await writeFileAsync(reportFilename, reportData)
  console.log(`${reportFilename} was generated`)
}

module.exports = {
  outbound
}
