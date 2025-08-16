/*****
 License
 --------------
 Copyright © 2020-2025 Mojaloop Foundation
 The Mojaloop files are made available by the Mojaloop Foundation under the Apache License, Version 2.0 (the "License") and you may not use these files except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, the Mojaloop files are distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

 Contributors
 --------------
 This is the official list of the Mojaloop project contributors for this file.
 Names of the original copyright holders (individuals or organizations)
 should be listed with a '*' in the first column. People who have
 contributed from an organization can be listed under the organization
 that actually holds the copyright for their contributions (see the
 Mojaloop Foundation for an example). Those individuals should have
 their names indented and be marked with a '-'. Email address can be added
 optionally within square brackets <email>.

 * Mojaloop Foundation
 - Name Surname <name.surname@mojaloop.io>

 * Eugen Klymniuk <eugen.klymniuk@infitx.com>
 --------------
 **********/

const { setTimeout: sleep } = require('node:timers/promises')
const { loggerFactory } = require('@mojaloop/central-services-logger/src/contextLogger')

// think, if it's better to move to system config
const DEFAULT_BATCH_SIZE = parseInt(process.env.DEFAULT_BATCH_SIZE, 10) || 1
const BATCH_PAUSE_MS = parseInt(process.env.BATCH_PAUSE_MS, 10) || 10

const EMPTY_ORDER_KEY = -1 // default bucket for testCases without executionOrder
// think, if testCases without executionOrder should be run together with executionOrder = 0?
const SKIP_EMPTY_EXECUTION_ORDER = false // skip testCases without executionOrder in parallel run

class TestCaseRunner {
  constructor (config, logger) {
    this.config = config
    this.logger = logger || loggerFactory({ context: 'TTK', system: 'TestCaseRunner' })
  }

  static lib = inputTemplate => inputTemplate.test_cases.reduce((acc, testCase) =>
    testCase.options?.lib ? testCase.requests.reduce((acc, request) => ({ ...acc, [`${testCase.id}.${request.id}`]: request }), acc) : acc
  , {})

  async runAll ({
    processTestCase, inputTemplate, traceID, variableData, dfspId, globalConfig, metrics
  }) {
    const lib = TestCaseRunner.lib(inputTemplate)
    const runOneTestCase = (testCase, index) => () => {
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
        inputTemplate.name,
        inputTemplate.saveReport,
        index,
        lib
      )
    }

    const isParallelRun = this.config.getSystemConfig().PARALLEL_RUN_ENABLED && inputTemplate.batchSize > 1
    this.logger.info(`isParallelRun: ${isParallelRun}`)

    if (!isParallelRun) {
      return this.runPromiseListSequentially(inputTemplate.test_cases.map(runOneTestCase))
    }

    const executionBuckets = new Map([[EMPTY_ORDER_KEY, []]])
    inputTemplate.test_cases.forEach((testCase, index) => {
      const { executionOrder } = testCase.options || {}
      if (typeof executionOrder !== 'number') {
        this.logger.warn(`executionOrder should be a number! Skipped testCase: ${testCase.name}`, { executionOrder })
        return
        // think, if it's better throw an error here?
      }

      if (!executionOrder) {
        executionBuckets.get(EMPTY_ORDER_KEY).push(runOneTestCase(testCase, index))
      } else {
        if (!executionBuckets.has(executionOrder)) executionBuckets.set(executionOrder, [])
        executionBuckets.get(executionOrder).push(runOneTestCase(testCase, index))
      }
    })

    return this.runBucketsInExecutionOrder(executionBuckets, inputTemplate.batchSize)
  }

  async runBucketsInExecutionOrder (executionBuckets, batchSize) {
    const sortedOrderKeys = Array.from(executionBuckets.keys()).sort((a, b) => a - b)
    this.logger.info('sortedOrderKeys:', { sortedOrderKeys })
    const results = []

    for (const orderKey of sortedOrderKeys) {
      if (SKIP_EMPTY_EXECUTION_ORDER && orderKey === EMPTY_ORDER_KEY) continue
      const batchResults = await this.runPromiseListInBatches(executionBuckets.get(orderKey), batchSize)
      results.push(...batchResults)
    }

    this.logger.verbose('all testCases with parallel runs have finished')
    return results
  }

  /**
   * Executes a list of promises (async functions) in series (batches).
   * It waits for the first {batchSize} promises to finish before starting the next batch.
   *
   * @param {Array<() => Promise<any>>} promiseList - array of functions, which return promises (async tasks/jobs/operations)
   * @param {number} [batchSize=DEFAULT_BATCH_SIZE] - batchSize (default is 1 - run all sequentially)
   * @returns {Promise<any[]>} - array of results from all promises
   */
  async runPromiseListInBatches (promiseList, batchSize = DEFAULT_BATCH_SIZE) {
    const results = []

    let position = 0
    let iteration = 1

    while (position < promiseList.length) {
      const batch = promiseList.slice(position, position + batchSize)
      const batchResult = await Promise.all(batch.map(pr => pr()))
      // todo: think about using Promise.allSettled

      this.logger.debug('batch is done', { iteration, batchSize })
      results.push(...batchResult)
      iteration += 1
      position += batchSize

      if (BATCH_PAUSE_MS) await sleep(BATCH_PAUSE_MS)
    }
    this.logger.debug('all batches are done', { iteration, batchSize })

    return results
  }

  /**
   * Executes a list of promises (async functions) sequentially.
   * It waits for a promise to finish before starting the next one.
   *
   * @param {Array<() => Promise<any>>} promiseList - array of functions, which return promises (async tasks/jobs/operations)
   * @returns {Promise<any[]>} - array of results from all promises
   */
  async runPromiseListSequentially (promiseList) {
    const results = []
    for (const pr of promiseList) {
      results.push(await pr())
    }
    this.logger.verbose('all testCases are run sequentially')
    return results
  }
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

module.exports = TestCaseRunner
