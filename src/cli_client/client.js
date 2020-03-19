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
 * Vijaya Kumar Guthi <vijaya.guthi@modusbox.com> (Original Author)
 --------------
 ******/
const axios = require('axios').default
const socketIOClient = require('socket.io-client')
const fStr = require('node-strings')

const template = require('../../examples/test-cases/p2p_transfer.json')

const sendTemplate = async () => {
  try {
    const outboundRequestID = Math.random().toString(36).substring(7)
    await axios.post('http://localhost:5050/api/outbound/template/' + outboundRequestID, template, { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.log(err)
  }
}

const handleIncomingProgress = (progress) => {
  if (progress.status === 'FINISHED') {
    console.log(fStr.bold('\n\t****** Test case finished ******\n'))
    process.exit(0)
  } else {
    const testCase = template.test_cases.find(item => item.id === progress.testCaseId)
    const request = testCase.requests.find(item => item.id === progress.requestId)
    const testResultText = progress.testResult.passedCount + '/' + request.tests.assertions.length
    const testResultFailed = progress.testResult.passedCount < request.tests.assertions.length
    console.log(
      (progress.status === 'SUCCESS' ? fStr.green(progress.status) : fStr.red(progress.status)) +
      '\t' + (testResultFailed ? fStr.red(testResultText) : fStr.green(testResultText)) +
      '\t' + fStr.italic(fStr.yellow('"' + testCase.name + '"')) + fStr.grey(' -> ') + fStr.cyan(request.method + ' ' + request.operationPath)
    )
  }
}
const socket = socketIOClient('http://127.0.0.1:5050')
socket.on('outboundProgress', handleIncomingProgress)

console.log(fStr.bold('\n\t****** Test case initiated ******\n'))

sendTemplate()
