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

 * ModusBox
 * Georgi Logodazhki <georgi.logodazhki@modusbox.com> (Original Author)
 *
 * Mojaloop
 * Shashikant Hirugade <shashi.mojaloop@gmail.com>
 --------------
 ******/

'use strict'

const Context = require('../../../../src/lib/scripting-engines/postman-sandbox')
const uuid = require('uuid')
const axios = require('axios').default
axios.create = jest.fn(() => axios)
jest.mock('axios')

describe('Test Outbound Context', () => {
  let contextObj // Store contextObj for cleanup

  // Global cleanup to ensure no contexts are left open
  afterEach(async () => {
    if (contextObj && contextObj.ctx) {
      // Remove all event listeners to prevent leaks
      contextObj.ctx.removeAllListeners()
      try {
        await contextObj.ctx.dispose() // Ensure dispose is awaited
      } catch (err) {
        console.warn('Error disposing context:', err)
      }
      contextObj.ctx = null
      contextObj = null
    }
  })

  describe('generateContextObj', () => {
    it('generateContextObj should return contextObj with the given environment if present', async () => {
      const environment = { amount: 100 }
      contextObj = await Context.generateContextObj(environment)
      expect(contextObj.environment).toEqual(environment)
    })

    it('generateContextObj should return contextObj with empty environment if not present', async () => {
      contextObj = await Context.generateContextObj()
      expect(contextObj.environment).toEqual({})
    })
  })

  describe('executeAsync', () => {
    it('executeAsync should return consoleLog and environment', async () => {
      axios.mockImplementation(() => Promise.resolve(true))
      const amountBefore = 100
      const expectedAmount = 200
      contextObj = await Context.generateContextObj({ amountBefore })

      const args = {
        script: [
          "var amountAfter = Number(pm.environment.get('amountBefore') + 100)",
          "pm.environment.set('amountAfter', amountAfter)",
          "console.log('amountAfter: ', pm.environment.get('amountAfter'))",
          "pm.sendRequest({ url: 'http://localhost:3999/test?state=OPEN', body: { mode: 'raw', raw: '{}'}, header: {'Accept': 'application/json'}}, function (err, response) {})"
        ],
        data: { context: { ...contextObj }, id: uuid.v4() },
        contextObj: contextObj
      }

      const scriptResult = await Context.executeAsync(args.script, args.data, args.contextObj)

      expect(scriptResult.consoleLog[0][1]).toEqual('log')
      expect(scriptResult.consoleLog[0][2]).toEqual('amountAfter: ')
      expect(scriptResult.consoleLog[0][3]).toEqual(expectedAmount)

      expect(scriptResult.environment).toHaveProperty('amountBefore')
      expect(scriptResult.environment).toHaveProperty('amountAfter')
      expect(scriptResult.environment.amountBefore).toEqual(amountBefore)
      expect(scriptResult.environment.amountAfter).toEqual(expectedAmount)
    })

    it('executeAsync should return consoleLog and environment', async () => {
      axios.mockImplementation(() => Promise.resolve(true))
      const amountBefore = 100
      const expectedAmount = 200
      contextObj = await Context.generateContextObj({ amountBefore })

      const args = {
        script: [
          "var amountAfter = Number(pm.environment.get('amountBefore') + 100)",
          "pm.environment.set('amountAfter', amountAfter)",
          "console.log('amountAfter: ', pm.environment.get('amountAfter'))",
          "pm.sendRequest({ url: 'http://localhost/test'}, function (err, response) {})"
        ],
        data: { context: { ...contextObj }, id: uuid.v4() },
        contextObj: contextObj
      }

      const scriptResult = await Context.executeAsync(args.script, args.data, args.contextObj)

      expect(scriptResult.consoleLog[0][1]).toEqual('log')
      expect(scriptResult.consoleLog[0][2]).toEqual('amountAfter: ')
      expect(scriptResult.consoleLog[0][3]).toEqual(expectedAmount)

      expect(scriptResult.environment).toHaveProperty('amountBefore')
      expect(scriptResult.environment).toHaveProperty('amountAfter')
      expect(scriptResult.environment.amountBefore).toEqual(amountBefore)
      expect(scriptResult.environment.amountAfter).toEqual(expectedAmount)
    })

    it('executeAsync should return consoleLog and environment', async () => {
      axios.mockImplementation(() => Promise.reject(true))
      const amountBefore = 100
      const expectedAmount = 200
      contextObj = await Context.generateContextObj({ amountBefore })

      const args = {
        script: [
          "var amountAfter = Number(pm.environment.get('amountBefore') + 100)",
          "pm.environment.set('amountAfter', amountAfter)",
          "console.log('amountAfter: ', pm.environment.get('amountAfter'))",
          "pm.sendRequest({ url: 'http://localhost:3999/test?state=OPEN', header: {'Accept': 'application/json'}}, function (err, response) {})"
        ],
        data: { context: { ...contextObj }, id: uuid.v4() },
        contextObj: contextObj
      }

      const scriptResult = await Context.executeAsync(args.script, args.data, args.contextObj)

      expect(scriptResult.consoleLog[0][1]).toEqual('log')
      expect(scriptResult.consoleLog[0][2]).toEqual('amountAfter: ')
      expect(scriptResult.consoleLog[0][3]).toEqual(expectedAmount)

      expect(scriptResult.environment).toHaveProperty('amountBefore')
      expect(scriptResult.environment).toHaveProperty('amountAfter')
      expect(scriptResult.environment.amountBefore).toEqual(amountBefore)
      expect(scriptResult.environment.amountAfter).toEqual(expectedAmount)
    })

    it('executeAsync should return consoleLog and environment', async () => {
      axios.mockImplementation(() => Promise.reject({ response: {} }))
      const amountBefore = 100
      const expectedAmount = 200
      contextObj = await Context.generateContextObj({ amountBefore })

      const args = {
        script: [
          "var amountAfter = Number(pm.environment.get('amountBefore') + 100)",
          "pm.environment.set('amountAfter', amountAfter)",
          "console.log('amountAfter: ', pm.environment.get('amountAfter'))",
          "pm.sendRequest({ url: 'http://localhost:3999/test?state=OPEN', header: {'Accept': 'application/json'}}, function (err, response) {})"
        ],
        data: { context: { ...contextObj }, id: uuid.v4() },
        contextObj: contextObj
      }

      const scriptResult = await Context.executeAsync(args.script, args.data, args.contextObj)

      expect(scriptResult.consoleLog[0][1]).toEqual('log')
      expect(scriptResult.consoleLog[0][2]).toEqual('amountAfter: ')
      expect(scriptResult.consoleLog[0][3]).toEqual(expectedAmount)

      expect(scriptResult.environment).toHaveProperty('amountBefore')
      expect(scriptResult.environment).toHaveProperty('amountAfter')
      expect(scriptResult.environment.amountBefore).toEqual(amountBefore)
      expect(scriptResult.environment.amountAfter).toEqual(expectedAmount)
    })

    it('executeAsync should return consoleLog with error messages', async () => {
      contextObj = await Context.generateContextObj({})
      const args = {
        script: ["asdf()"],
        data: { context: { ...contextObj }, id: uuid.v4() },
        contextObj: contextObj
      }

      const scriptResult = await Context.executeAsync(args.script, args.data, args.contextObj)

      expect(scriptResult.consoleLog[0][1]).toEqual('executionError')
      expect(scriptResult.consoleLog[0][2]).toHaveProperty('type')
      expect(scriptResult.consoleLog[0][2]).toHaveProperty('name')
      expect(scriptResult.consoleLog[0][2]).toHaveProperty('message')
      expect(scriptResult.consoleLog[0][2].type).toEqual('Error')
      expect(scriptResult.consoleLog[0][2].name).toEqual('ReferenceError')
      expect(scriptResult.consoleLog[0][2].message).toEqual('asdf is not defined')
    })
  })
})
