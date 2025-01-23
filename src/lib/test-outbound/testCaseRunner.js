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
 - Name Surname <name.surname@gatesfoundation.com>

 * Eugen Klymniuk <eugen.klymniuk@infitx.com>
 --------------
 **********/

const { setTimeout: sleep } = require('node:timers/promises')
const { loggerFactory } = require('@mojaloop/central-services-logger/src/contextLogger')
const config = require('../config')

const logger = loggerFactory('TTK')

const { PARALLEL_RUN_ENABLED = false } = config.getSystemConfig()

// think, if it's better to move to system config
const DEFAULT_BATCH_SIZE = parseInt(process.env.DEFAULT_BATCH_SIZE, 10) || 1
const BATCH_PAUSE_MS = parseInt(process.env.BATCH_PAUSE_MS, 10) || 10

/**
 * Executes a list of promises (async functions) in series (batches).
 * It waits for the first {batchSize} promises to finish before starting the next batch.
 *
 * @param {Array<() => Promise<any>>} promiseList - array of functions, which return promises (async tasks/jobs/operations)
 * @param {number} [batchSize=DEFAULT_BATCH_SIZE] - batchSize (default is 1 - run all sequentially)
 * @returns {Promise<any[]>} - array of results from all promises
 */
const runPromiseListInBatches = async (promiseList, batchSize = DEFAULT_BATCH_SIZE) => {
  const startAt = Date.now()
  const results = []

  let position = 0
  let iteration = 1

  while (position < promiseList.length) {
    const batch = promiseList.slice(position, position + batchSize)
    const batchResult = await Promise.all(batch.map(pr => pr()))
    // todo: think about using Promise.allSettled

    logger.debug('batch is done', { iteration, batchSize })
    results.push(...batchResult)
    iteration += 1
    position += batchSize

    if (BATCH_PAUSE_MS) await sleep(BATCH_PAUSE_MS)
  }

  const duration = ((Date.now() - startAt) / 1000).toFixed(1)
  logger.verbose(`all batches are done [sec: ${duration}]`, { iteration, batchSize })

  return results
}

/**
 * Executes a list of promises (async functions) sequentially.
 * It waits for a promise to finish before starting the next one.
 *
 * @param {Array<() => Promise<any>>} promiseList - array of functions, which return promises (async tasks/jobs/operations)
 * @returns {Promise<any[]>} - array of results from all promises
 */
const runPromiseListSequentially = async (promiseList) => {
  const results = []
  for (const pr of promiseList) {
    results.push(await pr())
  }
  logger.verbose('all testCases are run sequentially')
  return results
}

/**
 * Executes a list of promises sequentially or in batches.
 * It waits for the first {batchSize} promises to finish before starting the next batch.
 *
 * @param {Array<() => Promise<any>>} promiseList - array of functions, which return promises (async tasks/jobs/operations)
 * @param {number} [batchSize] - batchSize (default is 1 - run all sequentially)
 * @returns {Promise<any[]>} - array of results from all promises
 */
// const run = async (promiseList, batchSize) => {
//   const isParallelRun = PARALLEL_RUN_ENABLED && batchSize > 1
//   logger.info(`isParallelRun: ${isParallelRun}`)
//
//   return isParallelRun
//     ? runPromiseListInBatches(promiseList, batchSize)
//     : runPromiseListSequentially(promiseList)
// }

// todo: add JSDocs
const runAll = async ({
  processTestCase, inputTemplate, traceID, variableData, dfspId, globalConfig, metrics
}) => {
  const runOneTestCase = testCase => () => {
    globalConfig.totalProgress.testCasesProcessed++
    return processTestCase(
      testCase,
      traceID,
      inputTemplate.inputValues,
      variableData,
      dfspId,
      globalConfig,
      inputTemplate.options,
      metrics,
      inputTemplate.name
    )
  }
  const asyncFnList = inputTemplate.test_cases.map(runOneTestCase)

  const isParallelRun = PARALLEL_RUN_ENABLED && inputTemplate.batchSize > 1
  logger.info(`isParallelRun: ${isParallelRun}`)

  return isParallelRun
    ? runPromiseListInBatches(asyncFnList, inputTemplate.batchSize)
    : runPromiseListSequentially(asyncFnList)
}

// todo: add unit-tests
module.exports = {
  runAll,
  runPromiseListInBatches,
  runPromiseListSequentially
}
