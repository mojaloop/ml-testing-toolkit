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
 * Georgi Logodazhki <georgi.logodazhki@modusbox.com>
 * Vijaya Kumar Guthi <vijaya.guthi@modusbox.com> (Original Author)
 --------------
 ******/

const _ = require('lodash')
const customLogger = require('../requestLogger')
const axios = require('axios').default
const https = require('https')
const Config = require('../config')
const MyEventEmitter = require('../MyEventEmitter')
const notificationEmitter = require('../notificationEmitter.js')
const { readFileAsync } = require('../utils')
const expectOriginal = require('chai').expect // eslint-disable-line
const JwsSigning = require('../jws/JwsSigning')
const { TraceHeaderUtils } = require('ml-testing-toolkit-shared-lib')
const ConnectionProvider = require('../configuration-providers/mb-connection-manager')
require('request-to-curl')
require('atob') // eslint-disable-line
delete axios.defaults.headers.common.Accept
const postmanContext = require('../scripting-engines/postman-sandbox')
const javascriptContext = require('../scripting-engines/vm-javascript-sandbox')
const openApiDefinitionsModel = require('../mocking/openApiDefinitionsModel')
const uuid = require('uuid')
const utilsInternal = require('../utilsInternal')
const dbAdapter = require('../db/adapters/dbAdapter')
const arrayStore = require('../arrayStore')
const UniqueIdGenerator = require('../../lib/uniqueIdGenerator')
const httpAgentStore = require('../httpAgentStore')
const path = require('path')

const {
  Worker, isMainThread, parentPort, workerData, MessageChannel
} = require('worker_threads');

var terminateTraceIds = {}

const getTracing = (traceID, dfspId) => {
  const tracing = {
    outboundID: traceID,
    sessionID: null
  }
  if (traceID && TraceHeaderUtils.isCustomTraceID(traceID)) {
    tracing.outboundID = TraceHeaderUtils.getEndToEndID(traceID)
    tracing.sessionID = TraceHeaderUtils.getSessionID(traceID)
  }
  if (Config.getSystemConfig().HOSTING_ENABLED) {
    tracing.sessionID = dfspId
  }
  return tracing
}

const OutboundSend = async (inputTemplate, traceID, dfspId) => {

  const apiDefinitions = await openApiDefinitionsModel.getApiDefinitions()
  const user = dfspId ? { dfspId } : undefined
  const testOutboundEventChannel = new MessageChannel();
  


  const data = { action: 'OutboundSend', inputTemplate, traceID, dfspId, apiDefinitions, testOutboundEventPort: testOutboundEventChannel.port2 }
  const worker = new Worker(path.resolve(__dirname, 'testrunner-worker.js'), {
    workerData: data,
    transferList: [ testOutboundEventChannel.port2 ]
  });
  worker.on('message', () => {
    return 'Completed'
  });
  worker.on('error', (err) => {
    console.log(err.stack)
    return 'Error'
  });
  worker.on('exit', (code) => {
    if (code !== 0)
      console.log(`Worker stopped with exit code ${code}`);
  });

  testOutboundEventChannel.port1.on('message', (message) => {
    console.log('Message from worker through channel', message)
    if (message.action === 'listenCallbacks') {
      // Listen for success callback
      MyEventEmitter.getEmitter('testOutbound', user).once(message.successCallbackUrl, (callbackHeaders, callbackBody) => {
        MyEventEmitter.getEmitter('testOutbound', user).removeAllListeners(message.errorCallbackUrl)
        testOutboundEventChannel.port1.postMessage({
          callbackType: 'successCallback',
          callbackHeaders,
          callbackBody
        })
      })
      // Listen for error callback
      MyEventEmitter.getEmitter('testOutbound', user).once(message.errorCallbackUrl, (callbackHeaders, callbackBody) => {
        MyEventEmitter.getEmitter('testOutbound', user).removeAllListeners(message.successCallbackUrl)
        testOutboundEventChannel.port1.postMessage({
          callbackType: 'errorCallback',
          callbackHeaders,
          callbackBody
        })
      })
    }
  })


}

// const OutboundSendLoop = async (inputTemplate, traceID, dfspId, iterations) => {
//   const totalCounts = getTotalCounts(inputTemplate)

//   const globalConfig = {
//     broadcastOutboundProgressEnabled: false,
//     scriptExecution: true,
//     testsExecution: true,
//     totalProgress: {
//       testCasesTotal: totalCounts.totalTestCases,
//       testCasesProcessed: 0,
//       requestsTotal: totalCounts.totalRequests,
//       requestsProcessed: 0,
//       assertionsTotal: totalCounts.totalAssertions,
//       assertionsProcessed: 0,
//       assertionsPassed: 0,
//       assertionsFailed: 0
//     }
//   }
//   const tracing = getTracing(traceID, dfspId)

//   const environmentVariables = { ...inputTemplate.inputValues }
//   try {
//     const totalStartedTimeStamp = new Date()
//     const totalReport = {
//       iterations: []
//     }
//     for (let itn = 0; itn < iterations; itn++) {
//       const startedTimeStamp = new Date()
//       // Deep copy the template
//       const tmpTemplate = JSON.parse(JSON.stringify(inputTemplate))
//       // Execute all the test cases in the template
//       for (const i in tmpTemplate.test_cases) {
//         await processTestCase(tmpTemplate.test_cases[i], traceID, tmpTemplate.inputValues, environmentVariables, dfspId, globalConfig)
//       }
//       const completedTimeStamp = new Date()
//       const runDurationMs = completedTimeStamp.getTime() - startedTimeStamp.getTime()
//       const runtimeInformation = {
//         iterationNumber: itn,
//         completedTimeISO: completedTimeStamp.toISOString(),
//         startedTime: startedTimeStamp.toUTCString(),
//         completedTime: completedTimeStamp.toUTCString(),
//         runDurationMs: runDurationMs,
//         totalAssertions: 0,
//         totalPassedAssertions: 0
//       }
//       // TODO: This can be optimized by storing only results into the iterations array
//       totalReport.iterations.push(generateFinalReport(tmpTemplate, runtimeInformation))
//       notificationEmitter.broadcastOutboundProgress({
//         status: 'ITERATION_PROGRESS',
//         outboundID: tracing.outboundID,
//         iterationStatus: runtimeInformation
//       }, tracing.sessionID)
//     }

//     const totalCompletedTimeStamp = new Date()
//     const totalRunDurationMs = totalCompletedTimeStamp.getTime() - totalStartedTimeStamp.getTime()
//     // Send the total result to client
//     if (tracing.outboundID) {
//       notificationEmitter.broadcastOutboundProgress({
//         status: 'ITERATIONS_FINISHED',
//         outboundID: tracing.outboundID,
//         totalRunDurationMs,
//         totalReport
//       }, tracing.sessionID)
//     }
//   } catch (err) {
//     notificationEmitter.broadcastOutboundProgress({
//       status: 'ITERATIONS_TERMINATED',
//       outboundID: tracing.outboundID,
//       errorMessage: err.message
//     }, tracing.sessionID)
//   }
// }

const terminateOutbound = (traceID) => {
  terminateTraceIds[traceID] = true
}


module.exports = {
  OutboundSend,
  // OutboundSendLoop,
  terminateOutbound
}
