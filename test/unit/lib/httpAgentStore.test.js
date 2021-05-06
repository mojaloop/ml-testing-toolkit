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
 * Vijaya Kumar Guthi <vijaya.guthi@modusbox.com> (Original Author)
 --------------
 ******/

'use strict'

const Config = require('../../../src/lib/config')
const SpyGetSystemConfig = jest.spyOn(Config, 'getSystemConfig')
const httpAgentStore = require('../../../src/lib/httpAgentStore')

describe('httpAgentStore', () => {
  describe('getHttpAgent', () => {
    it('getHttpAgent method should return a http agent', async () => {
      const httpAgent = httpAgentStore.getHttpAgent('generic', { option1: 'value1' })
      expect(httpAgent).toHaveProperty('protocol')
      expect(httpAgent.protocol).toEqual('http:')
      expect(httpAgent.options).toHaveProperty('keepAlive')
      expect(httpAgent.options.keepAlive).toEqual(true)
      expect(httpAgent.options).toHaveProperty('option1')

    })
    it('getHttpAgent second call should retrun the same object for same key and options', async () => {
      const httpAgent1 = httpAgentStore.getHttpAgent('someclient', { option1: 'value1' })
      const httpAgent2 = httpAgentStore.getHttpAgent('someclient', { option1: 'value1' })
      expect(Object.is(httpAgent1, httpAgent2)).toBe(true)
    })
    it('getHttpAgent second call should retrun a new object for a different key', async () => {
      const httpAgent1 = httpAgentStore.getHttpAgent('someclient1', {})
      const httpAgent2 = httpAgentStore.getHttpAgent('someclient2', {})
      expect(Object.is(httpAgent1, httpAgent2)).toBe(false)
    })
    it('getHttpAgent second call should retrun a new object for different options', async () => {
      const httpAgent1 = httpAgentStore.getHttpAgent('someclient3', { option1: 'value1' })
      const httpAgent2 = httpAgentStore.getHttpAgent('someclient3', { option2: 'value2' })
      expect(Object.is(httpAgent1, httpAgent2)).toBe(false)
    })
  })
  describe('getHttpsAgent', () => {
    it('getHttpsAgent method should return a https agent', async () => {
      const httpsAgent = httpAgentStore.getHttpsAgent('generic', { option1: 'value1' })
      expect(httpsAgent).toHaveProperty('protocol')
      expect(httpsAgent.protocol).toEqual('https:')
      expect(httpsAgent.options).toHaveProperty('keepAlive')
      expect(httpsAgent.options.keepAlive).toEqual(true)
      expect(httpsAgent.options).toHaveProperty('option1')

    })
    it('getHttpsAgent second call should retrun the same object for same key and options', async () => {
      const httpsAgent1 = httpAgentStore.getHttpsAgent('someclient', { option1: 'value1' })
      const httpsAgent2 = httpAgentStore.getHttpsAgent('someclient', { option1: 'value1' })
      expect(Object.is(httpsAgent1, httpsAgent2)).toBe(true)
    })
    it('getHttpsAgent second call should retrun a new object for a different key', async () => {
      const httpsAgent1 = httpAgentStore.getHttpsAgent('someclient1', {})
      const httpsAgent2 = httpAgentStore.getHttpsAgent('someclient2', {})
      expect(Object.is(httpsAgent1, httpsAgent2)).toBe(false)
    })
    it('getHttpsAgent second call should retrun a new object for different options', async () => {
      const httpsAgent1 = httpAgentStore.getHttpsAgent('someclient3', { option1: 'value1' })
      const httpsAgent2 = httpAgentStore.getHttpsAgent('someclient3', { option2: 'value2' })
      expect(Object.is(httpsAgent1, httpsAgent2)).toBe(false)
    })
  })
  describe('getHttpsAgent timer', () => {
    let httpsAgent1
    it('Start the timer', async () => {
      jest.useFakeTimers()
      SpyGetSystemConfig.mockReturnValue({
        API_DEFINITIONS: [],
        HTTP_CLIENT: {
          KEEP_ALIVE: true,
          MAX_SOCKETS: 50,
          UNUSED_AGENTS_EXPIRY_MS: 0,
          UNUSED_AGENTS_CHECK_TIMER_MS: 10000
        }
      })
      httpAgentStore.init()
      SpyGetSystemConfig.mockClear()
    })
    it('Create a https agent', async () => {
      httpsAgent1 = httpAgentStore.getHttpsAgent('agent1', { option1: 'value1' })
      expect(httpsAgent1).not.toBeNull()
    })
    it('Request for another https agent with same key and options', async () => {
      const httpsAgent2 = httpAgentStore.getHttpsAgent('agent1', { option1: 'value1' })
      expect(httpsAgent2).not.toBeNull()
      expect(Object.is(httpsAgent1, httpsAgent2)).toBe(true)
    })
    it('Fast forward the timer', async () => {
      jest.advanceTimersByTime(15000)
    })
    it('Request for another https agent with same key and options after clear timer', async () => {
      jest.useRealTimers()
      await new Promise((r) => setTimeout(r, 100))
      const httpsAgent2 = httpAgentStore.getHttpsAgent('agent1', { option1: 'value1' })
      expect(httpsAgent2).not.toBeNull()
      expect(Object.is(httpsAgent1, httpsAgent2)).toBe(false)
    })
  })
})
