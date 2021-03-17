
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
    close: () => {}
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
    close: () => {}
  }
}
const webSocketPositiveMockNoMessage = () => {
  return {
    on: (eventType, callbackFn) => {
      if (eventType=='open') {
        callbackFn()
      }
    },
    close: () => {}
  }
}
const webSocketNegativeMock1 = () => {
  return {
    on: (eventType, callbackFn) => {
      if (eventType=='close') {
        callbackFn()
      }
    },
    close: () => {}
  }
}
const webSocketNegativeMock2 = () => {
  return {
    on: (eventType, callbackFn) => {
      if (eventType=='error') {
        callbackFn()
      }
    },
    close: () => {}
  }
}

describe('WebSocketClientManager', () => {
  describe('websocket connect', () => {
    let websocket = null
    beforeAll(async () => {
      websocket = new WebSocketClientManager()
      await websocket.init()
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
    it('websocket connect should return false on dupliceate name', async () => {
      WebSocket.mockImplementationOnce(webSocketPositiveMock)
      await expect(websocket.connect('wss://www.host.com', 'test1')).resolves.toBe(true)
      await expect(websocket.connect('wss://www.host.com', 'test1')).resolves.toBe(false)
      expect(websocket.disconnect('test1')).toBe(true)
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
      await new Promise((r) => setTimeout(r, 150));
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
