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
 * Vijay Kumar Guthi <vijaya.guthi@modusbox.com>
 * Georgi Logodazhki <georgi.logodazhki@modusbox.com> (Original Author)
 --------------
 ******/
const axios = require('axios').default
const fs = require('fs')
const { promisify } = require('util')
const objectStore = require('../objectStore')
const s3Upload = require('../extras/s3-upload')

const outbound = async (data) => {
  const returnInfo = {}
  const config = objectStore.get('config')
  let reportData
  let reportFilename
  switch (config.reportFormat) {
    case 'json':
      reportData = JSON.stringify(data, null, 2)
      reportFilename = `${data.name}-${data.runtimeInformation.completedTimeISO}.json`
      break
    case 'html':
    case 'printhtml': {
      if (config.extraSummaryInformation) {
        const extraSummaryInformationArr = config.extraSummaryInformation.split(',')
        data.extraRuntimeInformation = extraSummaryInformationArr.map(info => {
          const infoArr = info.split(':')
          return {
            key: infoArr[0],
            value: infoArr[1]
          }
        })
      }
      const response = await axios.post(`${config.baseURL}/api/reports/testcase/${config.reportFormat}`, data, { headers: { 'Content-Type': 'application/json' } })
      reportData = response.data
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
      break
    }
    default:
      console.log('reportFormat is not supported')
      return
  }
  if (config.reportTarget) {
    const reportTargetRe = /(.*):\/\/(.*)/g
    const reportTargetArr = reportTargetRe.exec(config.reportTarget)
    let writeFileName = reportTargetArr[2]
    if (config.reportAutoFilenameEnable) {
      // Replace the last part with auto generated file name
      writeFileName = replaceFileName(writeFileName, reportFilename)
    }
    switch (reportTargetArr[1]) {
      case 'file': {
        const writeFileAsync = promisify(fs.writeFile)
        await writeFileAsync(writeFileName, reportData)
        console.log(`${writeFileName} was generated`)
        break
      }
      case 's3': {
        const uploadedReportURL = await s3Upload.uploadFileDataToS3('s3://' + writeFileName, reportData)
        returnInfo.uploadedReportURL = uploadedReportURL
        break
      }
      default:
        console.log('reportTarget is not supported')
        return
    }
  } else {
    // Store the file
    const writeFileAsync = promisify(fs.writeFile)
    await writeFileAsync(reportFilename, reportData)
    console.log(`${reportFilename} was generated`)
  }
  return returnInfo
}

const replaceFileName = (fullPath, fileName) => {
  const fullPathArr = fullPath.split('/')
  if (fullPathArr.length > 1) {
    return fullPath.split('/').slice(0, -1).join('/') + '/' + fileName
  } else {
    return fileName
  }
}

module.exports = {
  outbound
}
