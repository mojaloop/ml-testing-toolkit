
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
 * Shashikant Hirugade <shashikant.hirugade@modusbox.com>
--------------
 ******/

'use strict'

const InboundEventListener = require('../../../../src/lib/eventListenerClient/inboundEventListener').InboundEventListener
const MyEventEmitter = require('../../../../src/lib/MyEventEmitter')

describe('InboundEventListener', () => {
  describe('eventlistener init', () => {
    let eventListener = null
    let newInboundCallback = null
    let emitterMock = null

    beforeAll(async () => {
      emitterMock = {
        emit: jest.fn(),
        on: jest.fn((event, callback) => {
          if (event === 'newInbound') newInboundCallback = callback
        }),
        removeAllListeners: jest.fn()
      }
      jest.spyOn(MyEventEmitter, 'getEmitter').mockReturnValue(emitterMock)
      eventListener = new InboundEventListener()
      await eventListener.init()
    })

    beforeEach(() => {
      jest.useFakeTimers()
      eventListener.setTransformer(null)
      emitterMock.emit.mockReset()
      emitterMock.on.mockReset()
      emitterMock.removeAllListeners.mockReset()
    })

    afterEach(() => {
      jest.runAllTimers()
      emitterMock.removeAllListeners()
      if (eventListener) {
        Object.keys(eventListener.eventListeners).forEach(clientName => {
          eventListener.destroy(clientName)
        })
      }
    })

    afterAll(() => {
      if (eventListener) {
        eventListener.emitter.removeAllListeners('newInbound')
        Object.keys(eventListener.eventListeners).forEach(clientName => {
          eventListener.destroy(clientName)
        })
        eventListener = null
      }
      jest.useRealTimers()
    })

    it('addListener and getMessage with mock event', async () => {
      eventListener.addListener('test1', 'post', '/quotes')
      const mockEvent = {
        method: 'post',
        path: '/quotes',
        headers: { sampleHeader1: 'value1' },
        body: { sampleBodyParam1: 'value1' }
      }
      newInboundCallback(mockEvent)
      const result1 = await eventListener.getMessage('test1')
      expect(result1).toHaveProperty('method')
      expect(result1).toHaveProperty('path')
      expect(result1).toHaveProperty('headers')
      expect(result1).toHaveProperty('body')
      expect(result1.method).toEqual('post')
      expect(result1.path).toEqual('/quotes')
      expect(result1.headers).toHaveProperty('sampleHeader1', 'value1')
      expect(result1.body).toHaveProperty('sampleBodyParam1', 'value1')
    })

    it('addListener and getMessage with mock event with matching function', async () => {
      eventListener.addListener('test2', 'post', '/quotes', (headers, body) => {
        return body.sampleBodyParam1 === 'value2'
      })
      const mockEvent = {
        method: 'post',
        path: '/quotes',
        headers: { sampleHeader1: 'value2' },
        body: { sampleBodyParam1: 'value2' }
      }
      newInboundCallback(mockEvent)
      await expect(eventListener.getMessage('test2')).resolves.toBeTruthy()
    })

    it('addListener and getMessage with transformation', async () => {
      eventListener.addListener('test2', 'post', '/quotes', (headers, body) => {
        return body.sampleBodyParam1 === 'value2'
      })
      const mockEvent = {
        method: 'post',
        path: '/quotes',
        headers: { sampleHeader1: 'value2' },
        body: { sampleBodyParam1: 'value2' }
      }
      newInboundCallback(mockEvent)
      eventListener.setTransformer({
        transformer: {
          reverseTransform: async () => ({ data: 'transformed data' })
        }
      })
      await expect(eventListener.getMessage('test2')).resolves.toEqual({ data: 'transformed data' })
    })

    it('addListener and getMessage with erroneous transformation', async () => {
      eventListener.addListener('test2', 'post', '/quotes', (headers, body) => {
        return body.sampleBodyParam1 === 'value2'
      })
      const mockEvent = {
        method: 'post',
        path: '/quotes',
        headers: { sampleHeader1: 'value2' },
        body: { sampleBodyParam1: 'value2' }
      }
      newInboundCallback(mockEvent)
      eventListener.setTransformer({
        transformer: {
          reverseTransform: async () => { throw new Error('transform error') }
        }
      })
      await expect(eventListener.getMessage('test2')).resolves.toBeTruthy()
    })

    it('addListener and getMessage with mock event', async () => {
      eventListener.addListener('test2', 'post', '/quotes')
      const mockEvent = {
        method: 'post',
        path: '/quotes',
        headers: { sampleHeader1: 'value1' },
        body: { sampleBodyParam1: 'value1' }
      }
      jest.advanceTimersByTime(10)
      newInboundCallback(mockEvent)
      await expect(eventListener.getMessage('test2')).resolves.toBeTruthy()
    })

    it('addListener and getMessage transformation with mock event', async () => {
      eventListener.addListener('test2', 'post', '/quotes')
      const mockEvent = {
        method: 'post',
        path: '/quotes',
        headers: { sampleHeader1: 'value1' },
        body: { sampleBodyParam1: 'value1' }
      }
      jest.advanceTimersByTime(10)
      newInboundCallback(mockEvent)
      eventListener.setTransformer({
        transformer: {
          reverseTransform: async () => ({ data: 'transformed data' })
        }
      })
      await expect(eventListener.getMessage('test2')).resolves.toEqual({ data: 'transformed data' })
    })

    it('addListener and getMessage transformation with mock event', async () => {
      eventListener.addListener('test2', 'post', '/quotes')
      const mockEvent = {
        method: 'post',
        path: '/quotes',
        headers: { sampleHeader1: 'value1' },
        body: { sampleBodyParam1: 'value1' }
      }
      jest.advanceTimersByTime(10)
      newInboundCallback(mockEvent)
      eventListener.setTransformer({
        transformer: {
          reverseTransform: async () => { throw new Error('transform error') }
        }
      })
      await expect(eventListener.getMessage('test2')).resolves.toBeTruthy()
    })

    it('addListener and getMessage with wrong event till timeout', async () => {
      jest.setTimeout(35000)
      eventListener.addListener('test1', 'post', '/transfers')
      const mockEvent = {
        method: 'post',
        path: '/quotes',
        headers: {},
        body: {}
      }
      newInboundCallback(mockEvent)
      jest.advanceTimersByTime(15000)
      jest.advanceTimersByTime(5000)
      await expect(eventListener.getMessage('test1')).resolves.toBe(null)
    })

    it('addListener should handle listeners with the same name', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
      eventListener.addListener('test1', 'post', '/quotes')
      eventListener.addListener('test1', 'post', '/quotes')
      expect(consoleSpy).toHaveBeenCalledWith('Event listener already exists with that name')
      consoleSpy.mockRestore()
    })

    it('getMessage should handle message when no eventListeners are found', async () => {
      const result = await eventListener.getMessage('nonExistentListener')
      expect(result).toBe(null)
    })
  })
})