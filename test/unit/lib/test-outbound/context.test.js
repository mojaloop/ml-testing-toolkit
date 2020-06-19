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

'use strict'

const Context = require('../../../../src/lib/test-outbound/context')
const uuid = require('uuid')
const axios = require('axios').default
jest.mock('axios')


describe('Test Outbound Context', () => {
  describe('generageContextObj', () => {
    // Positive Scenarios
    it('generageContextObj should return contextObj with the given environment if present', async () => {
      const environment = [
        {type: 'any', key: 'amount', value: '100'}
      ]
      const contextObj = (await Context.generageContextObj(environment))
      expect(contextObj.environment).toEqual(environment)
    })
    it('generageContextObj should return contextObj with empty environment if not present', async () => {
      const contextObj = (await Context.generageContextObj())
      expect(contextObj.environment).toEqual([])
    })
  })
  describe('executeAsync', () => {
    // Positive Scenarios
    it('executeAsync should return consoleLog and environment', async () => {

      axios.mockImplementation(() => Promise.resolve(true))
      const amountBefore = 100
      const expectedAmount = 200
      const contextObj = await Context.generageContextObj([{type: 'any', key: 'amountBefore', value: amountBefore}])

      const args = {
        script: [
          "var amountAfter = Number(pm.environment.get('amountBefore') + 100)",
          "pm.environment.set('amountAfter', amountAfter)",
          "console.log('amountAfter: ', pm.environment.get('amountAfter'))",
          "pm.sendRequest({ url: 'http://localhost:3999/test?state=OPEN', header: {'Accept': 'application/json'}}, function (err, response) {})"
        ],
        data: { context: {...contextObj}, id: uuid.v4()},
        contextObj: contextObj
      }

      let scriptResult
      try {
        scriptResult = await Context.executeAsync(args.script, args.data, args.contextObj)
      } finally {
        contextObj.ctx.dispose()
        contextObj.ctx = null
      }

      expect(scriptResult.consoleLog[0][1]).toEqual('log')
      expect(scriptResult.consoleLog[0][2]).toEqual('amountAfter: ')
      expect(scriptResult.consoleLog[0][3]).toEqual(expectedAmount)

      expect(scriptResult.environment[0]).toEqual({type: 'any', key: 'amountBefore', value: amountBefore})
      expect(scriptResult.environment[1]).toEqual({type: 'any', key: 'amountAfter', value: expectedAmount})

    })
    it('executeAsync should return consoleLog and environment', async () => {

      axios.mockImplementation(() => Promise.reject(true))
      const amountBefore = 100
      const expectedAmount = 200
      const contextObj = await Context.generageContextObj([{type: 'any', key: 'amountBefore', value: amountBefore}])

      const args = {
        script: [
          "var amountAfter = Number(pm.environment.get('amountBefore') + 100)",
          "pm.environment.set('amountAfter', amountAfter)",
          "console.log('amountAfter: ', pm.environment.get('amountAfter'))",
          "pm.sendRequest({ url: 'http://localhost:3999/test?state=OPEN', header: {'Accept': 'application/json'}}, function (err, response) {})"
        ],
        data: { context: {...contextObj}, id: uuid.v4()},
        contextObj: contextObj
      }

      let scriptResult
      try {
        scriptResult = await Context.executeAsync(args.script, args.data, args.contextObj)
      } finally {
        contextObj.ctx.dispose()
        contextObj.ctx = null
      }

      expect(scriptResult.consoleLog[0][1]).toEqual('log')
      expect(scriptResult.consoleLog[0][2]).toEqual('amountAfter: ')
      expect(scriptResult.consoleLog[0][3]).toEqual(expectedAmount)

      expect(scriptResult.environment[0]).toEqual({type: 'any', key: 'amountBefore', value: amountBefore})
      expect(scriptResult.environment[1]).toEqual({type: 'any', key: 'amountAfter', value: expectedAmount})

    })
  })
})
