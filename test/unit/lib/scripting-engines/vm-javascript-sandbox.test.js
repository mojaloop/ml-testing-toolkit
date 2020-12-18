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

const Context = require('../../../../src/lib/scripting-engines/vm-javascript-sandbox')
const uuid = require('uuid')
const axios = require('axios').default
const JwsSigning = require('../../../../src/lib/jws/JwsSigning')
jest.mock('axios')
jest.mock('../../../../src/lib/jws/JwsSigning')


describe('Test Outbound Context', () => {
  describe('generateContextObj', () => {
    // Positive Scenarios
    it('generateContextObj should return contextObj with the given environment if present', async () => {
      const environment = { amount: 100 }
      const contextObj = (await Context.generateContextObj(environment))
      expect(contextObj.environment).toEqual(environment)
    })
    it('generateContextObj should return contextObj with empty environment if not present', async () => {
      const contextObj = (await Context.generateContextObj())
      expect(contextObj.environment).toEqual({})
    })
  })
  describe('executeAsync', () => {
    // Positive Scenarios
    it('executeAsync should return consoleLog and environment', async () => {

      const amountBefore = 100
      const expectedAmount = 200
      const contextObj = await Context.generateContextObj({amountBefore})

      const args = {
        script: [
          "var amountAfter = environment.amountBefore + 100",
          "environment.amountAfter = amountAfter",
          "console.log('amountAfter: ', environment.amountAfter)",
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

      expect(scriptResult.environment).toHaveProperty('amountBefore')
      expect(scriptResult.environment).toHaveProperty('amountAfter')
      expect(scriptResult.environment.amountBefore).toEqual(amountBefore)
      expect(scriptResult.environment.amountAfter).toEqual(expectedAmount)

    })

    it('executeAsync should return consoleLog with response, callback and collectionVariables', async () => {

      const amountBefore = 100
      const expectedAmount = 200
      const contextObj = await Context.generateContextObj({amountBefore})

      const collectionVariables = []
      collectionVariables.push(
        {
          type: 'any',
          key: 'data',
          value: 'sampleCollectionVariableData'
        }
      )

      const args = {
        script: [
          "console.log('response', response.data)",
          "console.log('callback', callback.data)",
          "console.log('collectionVariables', collectionVariables.data)",
        ],
        data: { context: {...contextObj, collectionVariables, response: { data: 'sampleResponseData' }, callback: { data: 'sampleCallbackData' }}, id: uuid.v4()},
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
      expect(scriptResult.consoleLog[0][2]).toEqual('response')
      expect(scriptResult.consoleLog[0][3]).toEqual('sampleResponseData')

      expect(scriptResult.consoleLog[1][1]).toEqual('log')
      expect(scriptResult.consoleLog[1][2]).toEqual('callback')
      expect(scriptResult.consoleLog[1][3]).toEqual('sampleCallbackData')

      expect(scriptResult.consoleLog[2][1]).toEqual('log')
      expect(scriptResult.consoleLog[2][2]).toEqual('collectionVariables')
      expect(scriptResult.consoleLog[2][3]).toEqual('sampleCollectionVariableData')


    })

    it('executeAsync should run axios commands', async () => {

      axios.mockImplementation(() => Promise.resolve(true))
      const contextObj = await Context.generateContextObj({})

      const args = {
        script: [
          "await axios.get('http://localhost:3999/test')",
          "console.log('axios command executed')",
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
      expect(scriptResult.consoleLog[0][2]).toEqual('axios command executed')
    })

    it('executeAsync JWS sign function should work', async () => {

      const contextObj = await Context.generateContextObj({})

      const args = {
        script: [
          "custom.jws.signRequest('SOME_KEY')",
          "console.log(requestVariables.TTK_JWS_SIGN_KEY)",
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
      expect(scriptResult.consoleLog[0][2]).toEqual('SOME_KEY')

    })

    it('executeAsync should call JWS validate function', async () => {

      JwsSigning.validateWithCert.mockImplementation(() => { return "VALID" })
      const contextObj = await Context.generateContextObj({})

      const args = {
        script: [
          "const result = custom.jws.validateCallback(null, null, null)",
          "console.log(result)",
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
      expect(scriptResult.consoleLog[0][2]).toEqual('VALID')

    })

    it('executeAsync should call JWS validateProtectedHeaders function', async () => {

      JwsSigning.validateProtectedHeaders.mockImplementation(() => { return "VALID" })
      const contextObj = await Context.generateContextObj({})

      const args = {
        script: [
          "const result = custom.jws.validateCallbackProtectedHeaders(null)",
          "console.log(result)",
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
      expect(scriptResult.consoleLog[0][2]).toEqual('VALID')

    })

    // Error scenarios
    it('executeAsync should return consoleLog with error messages', async () => {

      const contextObj = await Context.generateContextObj({})
      const args = {
        script: [
          "console.log('console message before error')",
          "asdf()"
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
      expect(scriptResult.consoleLog[0][2]).toEqual('console message before error')
      expect(scriptResult.consoleLog[1][1]).toEqual('executionError')
      expect(scriptResult.consoleLog[1][2]).toEqual('ReferenceError: asdf is not defined')
    })
    it('executeAsync JWS validation should fail', async () => {
      JwsSigning.validateWithCert.mockImplementation(() => { throw new Error('SAMPLE_ERROR') })
      const contextObj = await Context.generateContextObj({})

      const args = {
        script: [
          "const result = custom.jws.validateCallback(null, null, null)",
          "console.log(result)",
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
      expect(scriptResult.consoleLog[0][2]).toEqual('SAMPLE_ERROR')

    })
    it('executeAsync JWS validateProtectedHeaders should fail', async () => {
      JwsSigning.validateProtectedHeaders.mockImplementation(() => { throw new Error('SAMPLE_ERROR') })
      const contextObj = await Context.generateContextObj({})

      const args = {
        script: [
          "const result = custom.jws.validateCallbackProtectedHeaders(null)",
          "console.log(result)",
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
      expect(scriptResult.consoleLog[0][2]).toEqual('SAMPLE_ERROR')

    })
  })
})
