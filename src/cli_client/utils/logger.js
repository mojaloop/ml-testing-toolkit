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
const fStr = require('node-strings')
const Table = require('cli-table3')

const outbound = (progress) => {
  let totalAssertionsCount = 0
  let totalPassedAssertionsCount = 0
  let totalRequestsCount = 0
  const testCasesTag = '--------------------TEST CASES--------------------'
  console.log(fStr.yellow(testCasesTag))
  progress.test_cases.forEach(testCase => {
    console.log(fStr.yellow(testCase.name))
    totalRequestsCount += testCase.requests.length
    testCase.requests.forEach(req => {
      totalAssertionsCount += req.request.tests.assertions.length
      totalPassedAssertionsCount += req.request.tests.passedAssertionsCount
      const logMessage = `\t${
        req.request.description} - ${
        req.request.method.toUpperCase()} - ${
        req.request.operationPath} - [${
        req.request.tests.passedAssertionsCount}/${
        req.request.tests.assertions.length}]`
      const passed = req.request.tests.passedAssertionsCount === req.request.tests.assertions.length
      console.log(passed ? fStr.green(logMessage) : fStr.red(logMessage))
    })
  })
  console.log(fStr.yellow(testCasesTag))
  const summary = new Table()
  summary.push(
    [{ colSpan: 2, content: 'SUMMARY', hAlign: 'center' }],
    { 'Total assertions': totalAssertionsCount },
    { 'Passed assertions': totalPassedAssertionsCount },
    { 'Failed assertions': totalAssertionsCount - totalPassedAssertionsCount },
    { 'Total requests': totalRequestsCount },
    { 'Total test cases': progress.test_cases.length },
    { 'Passed percentage': `${(100 * (totalPassedAssertionsCount / totalAssertionsCount)).toFixed(2)}%` },
    { 'Started time': progress.runtimeInformation.startedTime },
    { 'Completed time': progress.runtimeInformation.completedTime },
    { 'Runtime duration': `${progress.runtimeInformation.runDurationMs} ms` },
    { 'Average response time': progress.runtimeInformation.avgResponseTime }
  )
  console.log(summary.toString())

  const passed = totalPassedAssertionsCount === totalAssertionsCount
  return passed
}

const monitoring = (progress) => {
  console.log(
    fStr.red(`\n${progress.logTime}`) +
    fStr.blue(` ${progress.verbosity.toUpperCase()}`) +
    (progress.uniqueId ? fStr.yellow(`\t(${progress.uniqueId})`) : '\t') +
    fStr.green(`\t${progress.message}`) +
    (progress.additionalData ? ('\n' + JSON.stringify(progress.additionalData, null, 2)) : '\n')
  )
}

module.exports = {
  outbound,
  monitoring
}
