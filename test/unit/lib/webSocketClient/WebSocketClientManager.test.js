
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

const WebSocketClientManager = require('../../../../src/lib/webSocketClient/WebSocketClientManager').WebSocketClientManager
const WebSocket = require('ws')
jest.mock('ws')

const webSocketPositiveMock = () => {
  return {
    on: (eventType, callbackFn) => {
      if (eventType=='open') {
        callbackFn()
      } else if (eventType=='message') {
        callbackFn({ data: 'some data' })
      }
    },
    close: () => {},
    removeAllListeners: () => jest.fn()
  }
}
const webSocketPositiveMockDelayedMessage = () => {
  return {
    on: (eventType, callbackFn) => {
      if (eventType=='open') {
        callbackFn()
      } else if (eventType=='message') {
        setTimeout(callbackFn, 100, { data: 'some data' })
      }
    },
    close: () => {},
    removeAllListeners: () => jest.fn()
  }
}
const webSocketPositiveMockNoMessage = () => {
  return {
    on: (eventType, callbackFn) => {
      if (eventType=='open') {
        callbackFn()
      }
    },
    close: () => {},
    removeAllListeners: () => jest.fn()
  }
}
const webSocketNegativeMock1 = () => {
  return {
    on: (eventType, callbackFn) => {
      if (eventType=='close') {
        callbackFn()
      }
    },
    close: () => {},
    removeAllListeners: () => jest.fn()
  }
}
const webSocketNegativeMock2 = () => {
  return {
    on: (eventType, callbackFn) => {
      if (eventType=='error') {
        callbackFn()
      }
    },
    close: () => {},
    removeAllListeners: () => jest.fn()
  }
}

describe('WebSocketClientManager', () => {
  describe('websocket connect', () => {
    let websocket = null
    beforeEach(async () => {
      websocket = new WebSocketClientManager()
      await websocket.init()
    })
    afterEach(() => {
      websocket.clearAllTimers() // Clear all timers after each test
      websocket = null
    })
    it('websocket connect should return true', async () => {
      WebSocket.mockImplementationOnce(webSocketPositiveMock)
      await expect(websocket.connect('wss://www.host.com', 'test1')).resolves.toBe(true)
      expect(websocket.disconnect('test1')).toBe(true)
    })
    it('websocket connect should return false on websocket failure', async () => {
      WebSocket.mockImplementationOnce(webSocketNegativeMock1)
      await expect(websocket.connect('wss://www.host.com', 'test1')).resolves.toBe(false)
      expect(websocket.disconnect('test1')).toBe(true)
    })
    it('websocket connect should return false on websocket failure', async () => {
      WebSocket.mockImplementationOnce(webSocketNegativeMock2)
      await expect(websocket.connect('wss://www.host.com', 'test1')).resolves.toBe(false)
      expect(websocket.disconnect('test1')).toBe(true)
    })
    it('websocket connect should return false on duplicate name', async () => {
      WebSocket.mockImplementationOnce(webSocketPositiveMock)
      await expect(websocket.connect('wss://www.host.com', 'test1')).resolves.toBe(true)
      await expect(websocket.connect('wss://www.host.com', 'test1')).resolves.toBe(false)
      expect(websocket.disconnect('test1')).toBe(true)
    })
    it('websocket connect CLIENT_MUTUAL_TLS_ENABLED should return true', async () => {
    })
    it('websocket getMessage', async () => {
      WebSocket.mockImplementationOnce(webSocketPositiveMock)
      await expect(websocket.connect('wss://www.host.com', 'test1')).resolves.toBe(true)
      await expect(websocket.getMessage('test1')).resolves.toEqual({data: 'some data'})
      expect(websocket.disconnect('test1')).toBe(true)
    })
    it('websocket getMessage with delayed message', async () => {
      WebSocket.mockImplementationOnce(webSocketPositiveMockDelayedMessage)
      await expect(websocket.connect('wss://www.host.com', 'test1')).resolves.toBe(true)
      await expect(websocket.getMessage('test1')).resolves.toEqual({data: 'some data'})
      expect(websocket.disconnect('test1')).toBe(true)
    })
    it('websocket getMessage with no message', async () => {
      WebSocket.mockImplementationOnce(webSocketPositiveMockNoMessage)
      await expect(websocket.connect('wss://www.host.com', 'test1')).resolves.toBe(true)
      await expect(websocket.getMessage('test1', 100)).resolves.toBe(null)
      expect(websocket.disconnect('test1')).toBe(true)
    })
    it('websocket getMessage should fail with wrong websocket name', async () => {
      WebSocket.mockImplementationOnce(webSocketPositiveMock)
      await expect(websocket.connect('wss://www.host.com', 'test1')).resolves.toBe(true)
      await expect(websocket.getMessage('test2')).resolves.toBe(null)
      expect(websocket.disconnect('test1')).toBe(true)
    })
    it('websocket getMessage should fail after connect timeout', async () => {
      WebSocket.mockImplementationOnce(webSocketPositiveMock)
      await expect(websocket.connect('wss://www.host.com', 'test1', 100)).resolves.toBe(true)
      await new Promise((r) => setTimeout(r, 150))
      await expect(websocket.getMessage('test1')).resolves.toBe(null)
      expect(websocket.disconnect('test1')).toBe(true)
    })
    it('websocket disconnectAll should not throw error', async () => {
      WebSocket.mockImplementationOnce(webSocketPositiveMock)
      await expect(websocket.connect('wss://www.host.com', 'test1')).resolves.toBe(true)
      WebSocket.mockImplementationOnce(webSocketPositiveMock)
      await expect(websocket.connect('wss://www.host.com', 'test2')).resolves.toBe(true)
      expect(websocket.disconnectAll()).toBe(true)
    })
  })
})
