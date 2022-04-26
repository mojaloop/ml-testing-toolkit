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
const report = require('../utils/report')
const logger = require('../utils/logger')
const fStr = require('node-strings')
const fs = require('fs')
const { promisify } = require('util')
const objectStore = require('../objectStore')
const slackBroadcast = require('../extras/slack-broadcast')
const TemplateGenerator = require('../utils/templateGenerator')
const { TraceHeaderUtils } = require('@mojaloop/ml-testing-toolkit-shared-lib')

const totalProgress = {
  totalTestCases: 0,
  totalRequests: 0,
  totalAssertions: 0,
  passedAssertions: 0,
  skippedAssertions: 0,
  failedAssertions: 0
}

const updateTotalProgressCounts = (progress) => {
  if (progress.requestSent && progress.requestSent.tests && progress.requestSent.tests.assertions) {
    progress.requestSent.tests.assertions.forEach(assertion => {
      if (progress.testResult.results[assertion.id].status === 'SUCCESS') {
        totalProgress.passedAssertions++
      } else if (progress.testResult.results[assertion.id].status === 'SKIPPED') {
        totalProgress.skippedAssertions++
      } else {
        totalProgress.failedAssertions++
      }
    })
  }
}

const printTotalProgressCounts = () => {
  const progressStr = '[ ' + fStr.green(totalProgress.passedAssertions + ' passed, ') + fStr.yellow(totalProgress.skippedAssertions + ' skipped, ') + fStr.red(totalProgress.failedAssertions + ' failed') + ' of ' + totalProgress.totalAssertions + ' ]'
  process.stdout.write(progressStr)
}

const printProgress = (progress) => {
  const config = objectStore.get('config')
  switch (config.logLevel) {
    // Only Errors
    case '1':
    {
      printTotalProgressCounts()
      let failedAssertions = ''
      if (progress.requestSent && progress.requestSent.tests && progress.requestSent.tests.assertions) {
        progress.requestSent.tests.assertions.forEach(assertion => {
          if (progress.testResult.results[assertion.id].status !== 'SUCCESS') {
            failedAssertions += '\t' + fStr.red('[ ' + progress.testResult.results[assertion.id].status + ' ]') + '\t' + fStr.red(assertion.description) + '\n'
          }
        })
      }
      console.log('\n  ' + fStr.blue(progress.testCaseName + ' -> ' + progress.requestSent.description))
      if (failedAssertions) {
        console.log(failedAssertions)
      } else {
        console.log()
      }
      break
    }
    // All assertions
    case '2':
    {
      printTotalProgressCounts()
      console.log('\n  ' + fStr.cyan(progress.testCaseName + ' -> ' + progress.requestSent.description))
      if (progress.status === 'SKIPPED') {
        console.log('  ' + fStr.yellow('(Request Skipped)'))
      }
      if (progress.requestSent && progress.requestSent.tests && progress.requestSent.tests.assertions) {
        progress.requestSent.tests.assertions.forEach(assertion => {
          if (progress.testResult.results[assertion.id].status === 'SUCCESS') {
            console.log('\t' + fStr.green('[ ' + progress.testResult.results[assertion.id].status + ' ]') + '\t' + fStr.green(assertion.description))
          } else if (progress.testResult.results[assertion.id].status === 'SKIPPED') {
            console.log('\t' + fStr.yellow('[ ' + progress.testResult.results[assertion.id].status + ' ]') + '\t' + fStr.yellow(assertion.description))
          } else {
            console.log('\t' + fStr.red('[ ' + progress.testResult.results[assertion.id].status + ' ]') + '\t' + fStr.red(assertion.description))
          }
        })
      }
      break
    }
    // Only Requests and test counts
    default:
      printTotalProgressCounts()
      console.log('\t' + fStr.blue(progress.testCaseName + ' -> ' + progress.requestSent.description))
      break
  }
}

const sendTemplate = async (sessionId) => {
  const config = objectStore.get('config')
  try {
    const readFileAsync = promisify(fs.readFile)

    // Calculate the outbound request ID based on sessionId for catching progress notifications
    const traceIdPrefix = TraceHeaderUtils.getTraceIdPrefix()
    const currentEndToEndId = TraceHeaderUtils.generateEndToEndId()
    const outboundRequestID = traceIdPrefix + sessionId + currentEndToEndId

    const inputFiles = config.inputFiles.split(',')
    const selectedLabels = config.labels ? config.labels.split(',') : []
    const template = await TemplateGenerator.generateTemplate(inputFiles, selectedLabels)
    template.inputValues = JSON.parse(await readFileAsync(config.environmentFile, 'utf8')).inputValues

    template.test_cases.forEach(testCase => {
      totalProgress.totalTestCases++
      if (testCase.requests) {
        totalProgress.totalRequests += testCase.requests.length
      }
      testCase.requests.forEach(request => {
        if (request.tests && request.tests.assertions) {
          totalProgress.totalAssertions += request.tests.assertions.length
        }
      })
      testCase.breakOnError = (config.breakRunOnError === 'true')
    })
    await axios.post(`${config.baseURL}/api/outbound/template/` + outboundRequestID, template, { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

const handleIncomingProgress = async (progress) => {
  if (progress.status === 'FINISHED') {
    let passed
    try {
      passed = logger.outbound(progress.totalResult)
      const resultReport = await report.outbound(progress.totalResult)
      await slackBroadcast.sendSlackNotification(progress.totalResult, resultReport.uploadedReportURL)
    } catch (err) {
      console.log(err)
      passed = false
    }
    if (passed) {
      console.log(fStr.green('Terminate with exit code 0'))
      process.exit(0)
    } else {
      console.log(fStr.red('Terminate with exit code 1'))
      process.exit(1)
    }
  } else if (progress.status === 'TERMINATED') {
    console.log(fStr.red('Terminate with exit code 1'))
    process.exit(1)
  } else {
    updateTotalProgressCounts(progress)
    printProgress(progress)
  }
}

module.exports = {
  sendTemplate,
  handleIncomingProgress
}
