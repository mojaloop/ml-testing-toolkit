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

const NotificationEmitter = require('../../../src/lib/notificationEmitter')

const mockEmit = jest.fn()
const mockIO = {
  emit: mockEmit,
  engine: {
    clientsCount: 0
  }
}

jest.mock('../../../src/lib/socket-server',() => ({
  getIO: jest.fn(() => mockIO)
}))

describe('NotificationEmitter', () => {
  beforeEach(() => {
    mockEmit.mockClear()
    mockIO.engine.clientsCount = 0
  })

  describe('broadcastLog', () => {
    it('should not throw an error when sessionID is missing', () => {
      mockIO.engine.clientsCount = 1
      expect(() => NotificationEmitter.broadcastLog({})).not.toThrowError()
    })
    it('should not throw an error', () => {
      mockIO.engine.clientsCount = 1
      expect(() => NotificationEmitter.broadcastLog({}, 'sessionID')).not.toThrowError()
    })
    it('should not throw error when sessionID is provided', () => {
      mockIO.engine.clientsCount = 1
      expect(() => NotificationEmitter.broadcastLog({}, 'sessionID')).not.toThrowError()
    })
    it('should not emit when no clients are connected', () => {
      mockIO.engine.clientsCount = 0
      NotificationEmitter.broadcastLog({}, 'sessionID')
      expect(mockEmit).not.toHaveBeenCalled()
    })
    it('should emit when clients are connected', () => {
      mockIO.engine.clientsCount = 1
      NotificationEmitter.broadcastLog({}, 'sessionID')
      expect(mockEmit).toHaveBeenCalled()
    })
    it('should handle when engine is undefined', () => {
      const originalEngine = mockIO.engine
      mockIO.engine = undefined
      NotificationEmitter.broadcastLog({}, 'sessionID')
      expect(mockEmit).not.toHaveBeenCalled()
      mockIO.engine = originalEngine
    })
  })
  describe('broadcastOutboundLog', () => {
    it('should not throw an error when sessionID is missing', () => {
      expect(() => NotificationEmitter.broadcastOutboundLog({})).not.toThrowError()
    })
    it('should not throw an error', () => {
      expect(() => NotificationEmitter.broadcastOutboundLog({}, 'sessionID')).not.toThrowError()
    })
  })
  describe('broadcastOutboundProgress', () => {
    it('should not throw an error when sessionID is missing', () => {
      expect(() => NotificationEmitter.broadcastOutboundProgress({})).not.toThrowError()
    })
    it('should not throw an error', () => {
      expect(() => NotificationEmitter.broadcastOutboundProgress({}, 'sessionID')).not.toThrowError()
    })
  })
  describe('sendMessage', () => {
    it('should not throw an error when sessionID is missing', () => {
      expect(() => NotificationEmitter.sendMessage({})).not.toThrowError()
    })
    it('should not throw an error', () => {
      expect(() => NotificationEmitter.sendMessage({}, 'sessionID')).not.toThrowError()
    })
  })
})
