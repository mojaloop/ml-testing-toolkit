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
const testCaseRunner = require('#src/lib/test-outbound/testCaseRunner')

const makePromiseList = (count, timeoutMs) => [...Array(count)].map(() => () => sleep(timeoutMs))

describe('runPromiseListInBatches Tests -->', () => {
  test('should process several promises in one iteration', async () => {
    const count = 10
    const timeoutMs = 50
    const promiseList = makePromiseList(count, timeoutMs)
    const startAt = Date.now()

    await testCaseRunner.runPromiseListInBatches(promiseList, count)
    const durationMs = Date.now() - startAt
    expect(durationMs).toBeLessThan(timeoutMs * 2) // a bit more than 1 iteration
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
