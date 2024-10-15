
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
 * Shashikant Hirugade <shashikant.hirugade@modusbox.com>
--------------
 ******/

'use strict'

const InboundEventListener = require('../../../../src/lib/eventListenerClient/inboundEventListener').InboundEventListener
const MyEventEmitter = require('../../../../src/lib/MyEventEmitter')
const SpyMyEventEmitter = jest.spyOn(MyEventEmitter, 'getEmitter')
let eventCallbackFn = null
SpyMyEventEmitter.mockReturnValue({
  emit: () => {},
  on: (eventName, passedEventCallbackFn) => {
    eventCallbackFn = passedEventCallbackFn
  }
})

jest.setTimeout(8000)

// const webSocketPositiveMock = () => {
//   return {
//     on: (eventType, callbackFn) => {
//       if (eventType=='open') {
//         callbackFn()
//       } else if (eventType=='message') {
//         callbackFn({ data: 'some data' })
//       }
//     },
//     close: () => {}
//   }
// }
// const webSocketPositiveMockDelayedMessage = () => {
//   return {
//     on: (eventType, callbackFn) => {
//       if (eventType=='open') {
//         callbackFn()
//       } else if (eventType=='message') {
//         setTimeout(callbackFn, 100, { data: 'some data' })
//       }
//     },
//     close: () => {}
//   }
// }
// const webSocketPositiveMockNoMessage = () => {
//   return {
//     on: (eventType, callbackFn) => {
//       if (eventType=='open') {
//         callbackFn()
//       }
//     },
//     close: () => {}
//   }
// }
// const webSocketNegativeMock1 = () => {
//   return {
//     on: (eventType, callbackFn) => {
//       if (eventType=='close') {
//         callbackFn()
//       }
//     },
//     close: () => {}
//   }
// }
// const webSocketNegativeMock2 = () => {
//   return {
//     on: (eventType, callbackFn) => {
//       if (eventType=='error') {
//         callbackFn()
//       }
//     },
//     close: () => {}
//   }
// }

describe('InboundEventListener', () => {
  describe('eventlistener init', () => {
    let eventListener = null
    beforeAll(async () => {
      eventListener = new InboundEventListener()
      await eventListener.init()
    })
    it('addListener and getMessage with mock event', async () => {
      eventListener.addListener('test1', 'post', '/quotes')
      eventCallbackFn({
        method: 'post',
        path: '/quotes',
        headers: {
          sampleHeader1: 'value1'
        },
        body: {
          sampleBodyParam1: 'value1'
        }
      })
      const result1 = await eventListener.getMessage('test1')
      expect(result1).toHaveProperty('method')
      expect(result1).toHaveProperty('path')
      expect(result1).toHaveProperty('headers')
      expect(result1).toHaveProperty('body')
      expect(result1.method).toEqual('post')
      expect(result1.path).toEqual('/quotes')
      expect(result1.headers).toHaveProperty('sampleHeader1')
      expect(result1.headers.sampleHeader1).toEqual('value1')
      expect(result1.body).toHaveProperty('sampleBodyParam1')
      expect(result1.body.sampleBodyParam1).toEqual('value1')
    })
    it('addListener and getMessage with mock event with matching function', async () => {
      eventListener.addListener('test2', 'post', '/quotes', (headers, body) => {
        return body.sampleBodyParam1 === 'value2'
      })
      eventCallbackFn({
        method: 'post',
        path: '/quotes',
        headers: {
          sampleHeader1: 'value2'
        },
        body: {
          sampleBodyParam1: 'value2'
        }
      })
      await expect(eventListener.getMessage('test2')).resolves.toBeTruthy()
    })
    it('addListener and getMessage with mock event', async () => {
      eventListener.addListener('test2', 'post', '/quotes')
      setTimeout(() => {
        eventCallbackFn({
          method: 'post',
          path: '/quotes',
          headers: {
            sampleHeader1: 'value1'
          },
          body: {
            sampleBodyParam1: 'value1'
          }
        })
      }, 10)
      await expect(eventListener.getMessage('test2')).resolves.toBeTruthy()
    })
    it('addListener and getMessage with wrong event till timeout', async () => {
      // TODO: use fake timers to speed up the test
      eventListener.addListener('test1', 'post', '/transfers')
      eventCallbackFn({
        method: 'post',
        path: '/quotes',
        headers: {},
        body: {}
      })
      await expect(eventListener.getMessage('test1')).resolves.toBe(null)
    })
    it('addListener should handle listeners with the same name', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      eventListener.addListener('test1', 'post', '/quotes');
      eventListener.addListener('test1', 'post', '/quotes');
      expect(consoleSpy).toHaveBeenCalledWith('Event listener already exists with that name');
      consoleSpy.mockRestore();
    });

    it('getMessage should handle message when no eventListeners are found', async () => {
      const result = await eventListener.getMessage('nonExistentListener');
      expect(result).toBe(null);
    });

    // it('websocket connect should return false on websocket failure', async () => {
    //   WebSocket.mockImplementationOnce(webSocketNegativeMock1)
    //   await expect(websocket.connect('wss://www.host.com', 'test1')).resolves.toBe(false)
    //   expect(websocket.disconnect('test1')).toBe(true)
    // })
    // it('websocket connect should return false on websocket failure', async () => {
    //   WebSocket.mockImplementationOnce(webSocketNegativeMock2)
    //   await expect(websocket.connect('wss://www.host.com', 'test1')).resolves.toBe(false)
    //   expect(websocket.disconnect('test1')).toBe(true)
    // })
    // it('websocket connect should return false on dupliceate name', async () => {
    //   WebSocket.mockImplementationOnce(webSocketPositiveMock)
    //   await expect(websocket.connect('wss://www.host.com', 'test1')).resolves.toBe(true)
    //   await expect(websocket.connect('wss://www.host.com', 'test1')).resolves.toBe(false)
    //   expect(websocket.disconnect('test1')).toBe(true)
    // })
    // it('websocket getMessage', async () => {
    //   WebSocket.mockImplementationOnce(webSocketPositiveMock)
    //   await expect(websocket.connect('wss://www.host.com', 'test1')).resolves.toBe(true)
    //   await expect(websocket.getMessage('test1')).resolves.toEqual({data: 'some data'})
    //   expect(websocket.disconnect('test1')).toBe(true)
    // })
    // it('websocket getMessage with delayed message', async () => {
    //   WebSocket.mockImplementationOnce(webSocketPositiveMockDelayedMessage)
    //   await expect(websocket.connect('wss://www.host.com', 'test1')).resolves.toBe(true)
    //   await expect(websocket.getMessage('test1')).resolves.toEqual({data: 'some data'})
    //   expect(websocket.disconnect('test1')).toBe(true)
    // })
    // it('websocket getMessage with no message', async () => {
    //   WebSocket.mockImplementationOnce(webSocketPositiveMockNoMessage)
    //   await expect(websocket.connect('wss://www.host.com', 'test1')).resolves.toBe(true)
    //   await expect(websocket.getMessage('test1', 100)).resolves.toBe(null)
    //   expect(websocket.disconnect('test1')).toBe(true)
    // })
    // it('websocket getMessage should fail with wrong websocket name', async () => {
    //   WebSocket.mockImplementationOnce(webSocketPositiveMock)
    //   await expect(websocket.connect('wss://www.host.com', 'test1')).resolves.toBe(true)
    //   await expect(websocket.getMessage('test2')).resolves.toBe(null)
    //   expect(websocket.disconnect('test1')).toBe(true)
    // })
    // it('websocket getMessage should fail after connect timeout', async () => {
    //   WebSocket.mockImplementationOnce(webSocketPositiveMock)
    //   await expect(websocket.connect('wss://www.host.com', 'test1', 100)).resolves.toBe(true)
    //   await new Promise((r) => setTimeout(r, 150));
    //   await expect(websocket.getMessage('test1')).resolves.toBe(null)
    //   expect(websocket.disconnect('test1')).toBe(true)
    // })
    // it('websocket disconnectAll should not throw error', async () => {
    //   WebSocket.mockImplementationOnce(webSocketPositiveMock)
    //   await expect(websocket.connect('wss://www.host.com', 'test1')).resolves.toBe(true)
    //   WebSocket.mockImplementationOnce(webSocketPositiveMock)
    //   await expect(websocket.connect('wss://www.host.com', 'test2')).resolves.toBe(true)
    //   expect(websocket.disconnectAll()).toBe(true)
    // })
  })
})
