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
