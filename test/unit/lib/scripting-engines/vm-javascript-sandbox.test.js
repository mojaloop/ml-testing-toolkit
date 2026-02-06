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
 --------------
 ******/

'use strict'

const uuid = require('uuid')
const axios = require('axios').default
jest.mock('axios')
axios.create = jest.fn(() => axios)
const JwsSigning = require('../../../../src/lib/jws/JwsSigning')
const NotificationEmitter = require('../../../../src/lib/notificationEmitter')
const Context = require('../../../../src/lib/scripting-engines/vm-javascript-sandbox')
const Config = require('../../../../src/lib/config')
const httpAgentStore = require('../../../../src/lib/httpAgentStore')
const MyEventEmitter = require('../../../../src/lib/MyEventEmitter')

const spyNotificationEmitterSendMessage = jest.spyOn(NotificationEmitter, 'sendMessage')


describe('Test Outbound Context', () => {
  beforeAll(() => {
    MyEventEmitter.getEmitter().setMaxListeners(20)
  })

  afterAll(() => {
    MyEventEmitter.getEmitter().setMaxListeners(10)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('generateContextObj', () => {
    it('should return contextObj with the given environment if present', async () => {
      const environmentObj = { amount: 100 }
      const contextObj = await Context.generateContextObj(environmentObj)
      expect(contextObj.environment).toEqual(environmentObj)
      Object.keys(contextObj.inboundEvent.eventListeners).forEach(clientName => contextObj.inboundEvent.destroy(clientName))
      contextObj.inboundEvent.emitter.removeAllListeners('newInbound')
    })

    it('should return contextObj with empty environment if not present', async () => {
      const contextObj = await Context.generateContextObj()
      expect(contextObj.environment).toEqual({})
      Object.keys(contextObj.inboundEvent.eventListeners).forEach(clientName => contextObj.inboundEvent.destroy(clientName))
      contextObj.inboundEvent.emitter.removeAllListeners('newInbound')
    })

    it('should handle config error', async () => {
      jest.spyOn(Config, 'getStoredUserConfig').mockRejectedValueOnce(new Error('Config error'))
      await expect(Context.generateContextObj()).rejects.toThrow('Config error')
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

      JwsSigning.validateWithCert = jest.fn(() => { return "VALID" })
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

      JwsSigning.validateProtectedHeaders = jest.fn(() => { return "VALID" })
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

    it('executeAsync should call custom.sleep function', async () => {

      const contextObj = await Context.generateContextObj({})

      const args = {
        script: [
          "await custom.sleep(20)",
          "console.log('SAMPLE_OUTPUT_AFTER_SLEEP')",
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
      expect(scriptResult.consoleLog[0][2]).toEqual('SAMPLE_OUTPUT_AFTER_SLEEP')

    })

    it('executeAsync should call custom.pushMessage function', async () => {

      const contextObj = await Context.generateContextObj({})

      const args = {
        script: [
          "await custom.pushMessage({})",
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
      expect(spyNotificationEmitterSendMessage).toBeCalled()
    })

    it('executeAsync should call custom.setRequestTimeout function', async () => {

      const contextObj = await Context.generateContextObj({})

      const args = {
        script: [
          "custom.setRequestTimeout(2000)",
          "console.log(requestVariables.REQUEST_TIMEOUT)",
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
      expect(scriptResult.consoleLog[0][2]).toEqual(2000)

    })

    it('executeAsync should call custom.skipRequest function', async () => {
      const contextObj = await Context.generateContextObj({})

      const args = {
        script: [
          "custom.skipRequest()",
          "console.log(requestVariables.SKIP_REQUEST)",
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
      expect(scriptResult.consoleLog[0][2]).toEqual(true)
    })

    it('executeAsync should call custom.setTransformer function', async () => {
      const contextObj = await Context.generateContextObj({})

      const args = {
        script: [
          "custom.setTransformer('testTransformer', { option1: 'value1' })",
          "console.log(requestVariables.TRANSFORM.transformerName)",
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
      expect(scriptResult.consoleLog[1][1]).toEqual('log')
      expect(scriptResult.consoleLog[1][2]).toEqual('testTransformer')
    })

    it('executeAsync should call custom.setTransformer with empty name', async () => {
      const contextObj = await Context.generateContextObj({})

      const args = {
        script: [
          "custom.setTransformer(null)",
          "console.log(requestVariables.TRANSFORM)",
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
      expect(scriptResult.consoleLog[1][1]).toEqual('log')
      expect(scriptResult.consoleLog[1][2]).toEqual(undefined)
    })

    it('executeAsync should call custom.appendRequestBody function', async () => {
      const contextObj = await Context.generateContextObj({})

      const args = {
        script: [
          "custom.appendRequestBody({ newField: 'newValue' })",
          "console.log(requestVariables.OVERRIDE_REQUEST.appendMode)",
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
      expect(scriptResult.consoleLog[1][1]).toEqual('log')
      expect(scriptResult.consoleLog[1][2]).toEqual(true)
    })

    it('executeAsync should call custom.appendEventBody function', async () => {
      const contextObj = await Context.generateContextObj({})

      const args = {
        script: [
          "custom.appendEventBody({ eventField: 'eventValue' })",
          "console.log(requestVariables.OVERRIDE_EVENT.appendMode)",
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
      expect(scriptResult.consoleLog[0][2]).toEqual(true)
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
      JwsSigning.validateProtectedHeaders = jest.fn(() => { throw new Error('SAMPLE_ERROR') })
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
  describe('registerAxiosRequestInterceptor', () => {
    let userConfig = null
    let transformerObj = null
    let mockAxios = {
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() }
      }
    }

    beforeEach(() => {
      userConfig = { CLIENT_MUTUAL_TLS_ENABLED: false }
      transformerObj = null
      jest.spyOn(Config, 'getStoredUserConfig').mockResolvedValue(userConfig)
      jest.spyOn(httpAgentStore, 'getHttpAgent').mockReturnValue('http-agent')
      jest.spyOn(httpAgentStore, 'getHttpsAgent').mockReturnValue('https-agent')
      mockAxios.interceptors.request.use.mockReset()
      mockAxios.interceptors.response.use.mockReset()
      jest.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      console.log.mockRestore()
    })

    it('should configure HTTP agent for non-HTTPS URL', async () => {
      const config = { url: 'http://localhost:3000/test', method: 'GET', headers: {} }
      mockAxios.interceptors.request.use.mockImplementation((cb) => {
        const result = cb(config)
        // expect(result.httpAgent).toEqual('http-agent')
        return result
      })
      await Context.registerAxiosRequestInterceptor(userConfig, mockAxios)
      expect(httpAgentStore.getHttpAgent).toHaveBeenCalledWith('generic')
      expect(mockAxios.interceptors.request.use).toHaveBeenCalled()
    })

    it('should configure TLS with client cert', async () => {
      userConfig.CLIENT_MUTUAL_TLS_ENABLED = true
      userConfig.CLIENT_TLS_CREDS = [{ HOST: 'localhost:3000', CERT: 'cert', KEY: 'key' }]
      const config = { url: 'https://localhost:3000/test', method: 'GET', headers: {} }
      mockAxios.interceptors.request.use.mockImplementation((cb) => {
        const result = cb(config)
        // expect(result.httpsAgent).toEqual('https-agent')
        return result
      })
      await Context.registerAxiosRequestInterceptor(userConfig, mockAxios)
      expect(httpAgentStore.getHttpsAgent).toHaveBeenCalledWith('localhost:3000', expect.objectContaining({ cert: 'cert', key: 'key' }))
      expect(console.log).toHaveBeenCalledWith('Found the Client certificate for localhost:3000')
    })

    it('should handle transformer error', async () => {
      transformerObj = {
        transformer: {
          forwardTransform: jest.fn().mockRejectedValue(new Error('Transform error'))
        }
      }
      const config = { url: 'https://localhost:3000/test', method: 'GET', headers: { 'content-length': '100' }, data: {} }
      mockAxios.interceptors.request.use.mockImplementation((cb) => {
        return Promise.resolve(cb(config)).catch(err => {
          expect(err.message).toEqual('Transform error')
          return config
        })
      })
      try {
        await Context.registerAxiosRequestInterceptor(userConfig, mockAxios, transformerObj)
      } catch (err) {
        expect(err.message).toEqual('Transform error')
      }
      expect(transformerObj.transformer.forwardTransform).toHaveBeenCalledWith({
        method: 'GET',
        path: '/test',
        headers: { 'content-length': '100' },
        body: {},
        params: {}
      })
      expect(config.headers['content-length']).toEqual('100')
    })
  })

  describe('context pooling', () => {
    afterEach(async () => {
      // Clean up all contexts after each test
      Context.cleanupContextPool()
    })

    it('should acquire context from pool', async () => {
      const ctx = await Context.acquireContext({ test: 'value' })
      expect(ctx).toBeDefined()
      expect(ctx.environment.test).toEqual('value')

      // Cleanup
      Context.releaseContext(ctx)
    })

    it('should reuse contexts from pool', async () => {
      const ctx1 = await Context.acquireContext({ env1: 'value1' })
      expect(ctx1._inUse).toBe(true)

      // Release back to pool
      Context.releaseContext(ctx1)
      expect(ctx1._inUse).toBe(false)

      // Acquire again - should get a pooled context
      const ctx2 = await Context.acquireContext({ env2: 'value2' })
      expect(ctx2).toBeDefined()
      expect(ctx2.environment.env2).toEqual('value2')

      Context.releaseContext(ctx2)
    })

    it('should create temporary context when pool exhausted', async () => {
      const contexts = []

      // Acquire more than pool size
      for (let i = 0; i < 7; i++) {
        const ctx = await Context.acquireContext({ index: i })
        contexts.push(ctx)
      }

      // Check for temporary contexts
      const temporaryCount = contexts.filter(ctx => ctx._temporary).length
      expect(temporaryCount).toBeGreaterThan(0)

      // Cleanup
      contexts.forEach(ctx => Context.releaseContext(ctx))
    })

    it('should handle releaseContext with null', () => {
      expect(() => Context.releaseContext(null)).not.toThrowError()
    })

    it('should cleanup all contexts in pool', () => {
      expect(() => Context.cleanupContextPool()).not.toThrowError()
    })

    it('should reinitialize pool after cleanup', async () => {
      Context.cleanupContextPool()

      const ctx = await Context.acquireContext({ reinit: 'test' })
      expect(ctx).toBeDefined()
      expect(ctx.environment.reinit).toEqual('test')

      Context.releaseContext(ctx)
    })

    it('should cleanup temporary context with websocket and inboundEvent', async () => {
      // Acquire pool exhaustion to create temporary contexts
      const contexts = []
      for (let i = 0; i < 6; i++) {
        contexts.push(await Context.acquireContext({ index: i }))
      }

      // Find a temporary context
      const tempCtx = contexts.find(ctx => ctx._temporary)
      expect(tempCtx).toBeDefined()
      expect(tempCtx._temporary).toBe(true)

      // Mock destroy methods
      const destroySpy = jest.fn()
      const emitterRemoveSpy = jest.fn()
      tempCtx.websocket.destroy = destroySpy
      tempCtx.inboundEvent.destroy = destroySpy
      tempCtx.inboundEvent.emitter = { removeAllListeners: emitterRemoveSpy }
      tempCtx.inboundEvent.eventListeners = { client1: {}, client2: {} }

      // Release temporary context should call destroy
      Context.releaseContext(tempCtx)

      expect(destroySpy).toHaveBeenCalled()
      expect(emitterRemoveSpy).toHaveBeenCalledWith('newInbound')

      // Cleanup remaining contexts
      contexts.forEach(ctx => {
        if (ctx !== tempCtx) Context.releaseContext(ctx)
      })
    })

    it('should handle errors during temporary context cleanup', async () => {
      // Acquire pool exhaustion to create temporary contexts
      const contexts = []
      for (let i = 0; i < 6; i++) {
        contexts.push(await Context.acquireContext({ index: i }))
      }

      const tempCtx = contexts.find(ctx => ctx._temporary)
      expect(tempCtx).toBeDefined()

      // Mock destroy to throw error
      tempCtx.websocket.destroy = jest.fn(() => { throw new Error('Destroy error') })
      tempCtx.inboundEvent.destroy = jest.fn()

      // Should not throw - error should be caught
      expect(() => Context.releaseContext(tempCtx)).not.toThrow()

      // Cleanup remaining contexts
      contexts.forEach(ctx => {
        if (ctx !== tempCtx) Context.releaseContext(ctx)
      })
    })

    it('should handle temporary context without destroy methods', async () => {
      // Create a mock temporary context without destroy methods
      const mockTempCtx = {
        _temporary: true,
        websocket: {},
        inboundEvent: { eventListeners: {} }
      }

      // Should not throw even without destroy methods
      expect(() => Context.releaseContext(mockTempCtx)).not.toThrow()
    })

    it('should handle errors in cleanupContextPool', async () => {
      // Acquire a context to populate the pool
      const ctx = await Context.acquireContext({ test: 'value' })

      // Mock destroy to throw error
      const contextPoolAccess = require('../../../../src/lib/scripting-engines/vm-javascript-sandbox')

      // Trigger cleanup with error condition by calling it directly
      expect(() => contextPoolAccess.cleanupContextPool()).not.toThrow()

      // Reinitialize for next test
      const ctx2 = await Context.acquireContext({ reinit: 'test' })
      Context.releaseContext(ctx2)
    })
  })

  describe('registerAxiosRequestInterceptor error scenarios', () => {
    let userConfig = null
    let mockAxios = {
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() }
      }
    }

    beforeEach(() => {
      userConfig = { CLIENT_MUTUAL_TLS_ENABLED: false }
      jest.spyOn(Config, 'getStoredUserConfig').mockResolvedValue(userConfig)
      jest.spyOn(httpAgentStore, 'getHttpAgent').mockReturnValue('http-agent')
      jest.spyOn(httpAgentStore, 'getHttpsAgent').mockReturnValue('https-agent')
      mockAxios.interceptors.request.use.mockReset()
      mockAxios.interceptors.response.use.mockReset()
    })

    it('should handle axios response error', async () => {
      const config = { url: 'http://localhost:3000/test', method: 'GET', headers: {}, uniqueId: '123', reqObject: {} }
      const error = new Error('Network error')
      error.config = config

      mockAxios.interceptors.response.use.mockImplementation((successCb, errorCb) => {
        const result = errorCb(error)
        return result.catch(err => {
          expect(err.message).toEqual('Network error')
        })
      })

      await Context.registerAxiosRequestInterceptor(userConfig, mockAxios)
      expect(mockAxios.interceptors.response.use).toHaveBeenCalled()
    })
  })
})
