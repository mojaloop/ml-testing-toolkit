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
 * Vijay Kumar Guthi <vijaya.guthi@modusbox.com> (Original Author)
 --------------
 ******/
const { IncomingWebhook } = require('@slack/webhook')
const objectStore = require('../objectStore')

const config = objectStore.get('config')

const generateSlackBlocks = (progress) => {
  const slackBlocks = []
  let totalAssertionsCount = 0
  let totalPassedAssertionsCount = 0
  let totalRequestsCount = 0
  progress.test_cases.forEach(testCase => {
    // console.log(fStr.yellow(testCase.name))
    totalRequestsCount += testCase.requests.length
    // let testCaseAssertionsCount = 0
    // let testCasePassedAssertionsCount = 0
    testCase.requests.forEach(req => {
      const passedAssertionsCount = req.request.tests && req.request.tests.passedAssertionsCount ? req.request.tests.passedAssertionsCount : 0
      const assertionsCount = req.request.tests && req.request.tests.assertions && req.request.tests.assertions.length ? req.request.tests.assertions.length : 0
      totalAssertionsCount += assertionsCount
      totalPassedAssertionsCount += passedAssertionsCount
      // testCaseAssertionsCount += assertionsCount
      // testCasePassedAssertionsCount += passedAssertionsCount
    })
    // const passed = testCasePassedAssertionsCount === testCaseAssertionsCount
    // // TODO: make sure this list should not be more than 40 because we can add only max 50 blocks in a slack message
    // if(!passed) {
    //   slackBlocks.push({
    //     type: 'section',
    //     text: {
    //       type: 'mrkdwn',
    //       text: `${testCase.name} - [ *${testCasePassedAssertionsCount}/${testCaseAssertionsCount}* ]` + ' `FAILED`'
    //     }
    //   })
    // }
  })
  let summaryText = ''

  summaryText += '>Total assertions: *' + totalAssertionsCount + '*\n'
  summaryText += '>Passed assertions: *' + totalPassedAssertionsCount + '*\n'
  summaryText += '>Failed assertions: *' + (totalAssertionsCount - totalPassedAssertionsCount) + '*\n'
  summaryText += '>Total requests: *' + totalRequestsCount + '*\n'
  summaryText += '>Total test cases: *' + progress.test_cases.length + '*\n'
  summaryText += '>Passed percentage: *' + `${(100 * (totalPassedAssertionsCount / totalAssertionsCount)).toFixed(2)}%` + '*\n'
  summaryText += '>Started time: *' + progress.runtimeInformation.startedTime + '*\n'
  summaryText += '>Completed time: *' + progress.runtimeInformation.completedTime + '*\n'
  summaryText += '>Runtime duration: *' + `${progress.runtimeInformation.runDurationMs} ms` + '*\n'

  const additionalParams = {}
  if (totalAssertionsCount === totalPassedAssertionsCount) {
    if (config.slackPassedImage) {
      additionalParams.accessory = {
        type: 'image',
        image_url: config.slackPassedImage,
        alt_text: 'PASSED'
      }
    }
  } else {
    if (config.slackFailedImage) {
      additionalParams.accessory = {
        type: 'image',
        image_url: config.slackFailedImage,
        alt_text: 'FAILED'
      }
    }
  }
  let extramSummaryText = ''
  if (config.extraSummaryInformation) {
    const extraSummaryInformationArr = config.extraSummaryInformation.split(',')
    extraSummaryInformationArr.forEach(info => {
      const infoArr = info.split(':')
      extramSummaryText += infoArr[0] + ': `' + infoArr[1] + '`\n'
    })
  }
  slackBlocks.push({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: '*Test Result:*' + ((totalAssertionsCount === totalPassedAssertionsCount) ? ' `PASSED` ' : ' `FAILED` ') + '\n' + extramSummaryText + summaryText
    },
    ...additionalParams
  })
  return slackBlocks
}

const sendSlackNotification = async (progress, reportURL = null) => {
  if (config.slackWebhookUrl) {
    const url = config.slackWebhookUrl
    const webhook = new IncomingWebhook(url)
    let slackBlocks = []
    slackBlocks.push({
      type: 'header',
      text: {
        type: 'plain_text',
        text: 'Testing Toolkit Report',
        emoji: true
      }
    })
    slackBlocks = slackBlocks.concat(generateSlackBlocks(progress))
    if (reportURL) {
      slackBlocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '<' + reportURL + '|View Report>'
        }
      })
    }
    slackBlocks.push({
      type: 'divider'
    })
    try {
      // console.log(JSON.stringify(slackBlocks, null, 2))
      await webhook.send({
        text: 'Test Report',
        blocks: slackBlocks
      })
      console.log('Slack notification sent.')
    } catch (err) {
      console.log('ERROR: Sending slack notification failed. ', err.message)
    }
  }
}

module.exports = {
  sendSlackNotification
}
