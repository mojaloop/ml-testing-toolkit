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
 * Kevin Leyow <kevin.leyow@modusbox.com>
 --------------
 ******/

'use strict'

const socketIO = require('socket.io')
const SocketServer = require('../../../src/lib/socket-server')
const Config = require('../../../src/lib/config')
const storageAdapter = require('../../../src/lib/storageAdapter')

jest.mock('socket.io')
jest.mock('../../../src/lib/storageAdapter')

describe('Socket Server', () => {
  describe('Init server', () => {
    it('Passes config options to library', async () => {
      storageAdapter.read.mockResolvedValueOnce({
        data: {
          SOCKET_IO_ENGINE_OPTIONS: {
            pingInterval: 1,
          }
        }
      })
      Config.loadSystemConfig()
      await expect(Config.getObjectStoreInitConfig()).resolves.toBeTruthy()
      await Config.getObjectStoreInitConfig()
      const httpMock = jest.mock()
      SocketServer.initServer(httpMock)
      expect(socketIO).toBeCalledWith(
        httpMock, {
          cors: expect.any(Object),
          pingInterval: 1,
        }
      )
    })
  })
})
