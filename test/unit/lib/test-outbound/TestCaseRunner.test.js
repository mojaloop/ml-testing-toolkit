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

jest.mock('#src/lib/config')

const { setTimeout: sleep } = require('node:timers/promises')
const TestCaseRunner = require('#src/lib/test-outbound/TestCaseRunner')
const config = require('#src/lib/config')

const makePromiseList = (count, timeoutMs) => [...Array(count)].map(() => () => sleep(timeoutMs))

describe('TestCaseRunner Tests -->', () => {
  let testCaseRunner

  beforeEach(  () => {
    testCaseRunner = new TestCaseRunner(config)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('runAll method Test', () => {
    test('should run testCases sequentially if PARALLEL_RUN_ENABLED config is not true', async () => {
      config.getSystemConfig.mockReturnValue({ PARALLEL_RUN_ENABLED: false })
      testCaseRunner.runPromiseListSequentially = jest.fn()

      await testCaseRunner.runAll({
        processTestCase: async () => {},
        inputTemplate: {
          test_cases: [],
          batchSize: 2
        }
      })
      expect(testCaseRunner.runPromiseListSequentially).toHaveBeenCalled()
    })

    test('should run testCases sequentially if batchSize is not set', async () => {
      config.getSystemConfig.mockReturnValue({ PARALLEL_RUN_ENABLED: true })
      testCaseRunner.runPromiseListSequentially = jest.fn()

      await testCaseRunner.runAll({
        processTestCase: async () => {},
        inputTemplate: {
          test_cases: [],
        }
      })
      expect(testCaseRunner.runPromiseListSequentially).toHaveBeenCalled()
    })

    test('should run testCases in parallel', async () => {
      config.getSystemConfig.mockReturnValue({ PARALLEL_RUN_ENABLED: true })
      testCaseRunner.runBucketsInExecutionOrder = jest.fn()

      await testCaseRunner.runAll({
        processTestCase: async () => {},
        inputTemplate: {
          test_cases: [],
          batchSize: 2
        }
      })
      expect(testCaseRunner.runBucketsInExecutionOrder).toHaveBeenCalled()
    })

    test('should increase globalConfig.totalProgress.testCasesProcessed', async () => {
      config.getSystemConfig.mockReturnValue({ PARALLEL_RUN_ENABLED: true })
      const globalConfig = {
        totalProgress: { testCasesProcessed: 0 }
      }

      await testCaseRunner.runAll({
        processTestCase: async () => {},
        inputTemplate: {
          test_cases: [
            { options: { executionOrder: 1 } },
            { options: { executionOrder: 1 } }
          ],
          batchSize: 2
        },
        globalConfig
      })
      expect(globalConfig.totalProgress.testCasesProcessed).toBeGreaterThan(0)
    })

    test('should not call processTestCase fn if no testCases with executionOrder', async () => {
      config.getSystemConfig.mockReturnValue({ PARALLEL_RUN_ENABLED: true })
      const processTestCase = jest.fn()

      await testCaseRunner.runAll({
        processTestCase,
        inputTemplate: {
          test_cases: [
            { options: {} },
            { options: {} }
          ],
          batchSize: 2
        },
      })
      expect(processTestCase).not.toHaveBeenCalled()
    })
  })

  describe('runPromiseListInBatches method Tests', () => {
    test('should process several promises in one iteration', async () => {
      const count = 10
      const timeoutMs = 50
      const promiseList = makePromiseList(count, timeoutMs)
      const startAt = Date.now()

      await testCaseRunner.runPromiseListInBatches(promiseList, count)
      const durationMs = Date.now() - startAt
      expect(durationMs).toBeLessThan(timeoutMs * 3) // faster than 3 sequential iterations
    })

    test('should process several promises sequentially [batchSize = 1]', async () => {
      const count = 10
      const timeoutMs = 50
      const promiseList = makePromiseList(count, timeoutMs)
      const startAt = Date.now()

      await testCaseRunner.runPromiseListInBatches(promiseList, 1)
      const durationMs = Date.now() - startAt
      expect(durationMs).toBeGreaterThanOrEqual(timeoutMs * count)
    })

    test('should return an array of results of each promise', async () => {
      const response = 123
      const promiseList = [async () => response]

      const results = await testCaseRunner.runPromiseListInBatches(promiseList)
      expect(results).toEqual([response])
    })
  })

  describe('runPromiseListSequentially method Tests', () => {
    test('should run promises sequentially', async () => {
      const count = 10
      const timeoutMs = 50
      const promiseList = makePromiseList(count, timeoutMs)
      const startAt = Date.now()

      await testCaseRunner.runPromiseListSequentially(promiseList)
      const durationMs = Date.now() - startAt
      expect(durationMs).toBeGreaterThanOrEqual(timeoutMs * count)
    })
  })
})
