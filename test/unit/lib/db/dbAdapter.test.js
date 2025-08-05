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

const dbAdapter = require('../../../../src/lib/db/adapters/dbAdapter')
const mongoose = require('mongoose')
const Config = require('../../../../src/lib/config')
jest.mock('../../../../src/lib/config')
jest.mock('mongoose')

const spyMongooseConnect = jest.spyOn(mongoose, 'connect')

mongoose.connect.mockReturnValueOnce({
  model: () => {
    return {
      findById: (id) => {
        switch (id) {
          case 'id1': return undefined
          case 'id2': return {
            data: {},
            save: async () => {}
          }
        }
      },
      create: (data) => data,
      countDocuments: () => 1,
      find: (query) => {
        if (query._id) {
          return {
            select: () => {
              return [{
                _id: 'id3'
              }]
            }
          }
        } else {
          return {
            sort: () => {
              return {
                select: () => {
                  return [{
                    _id: 'id4'
                  }]
                }
              }
            },
            select: () => {
              return {
                sort: () => {
                  return [{
                    _id: 'id4'
                  }]
                }
              }
            }
          }
        }
      },
      findOneAndRemove: () => {},
      findOneAndUpdate: () => {return {}}
    }
  }
})

describe('dbAdapter', () => {
  beforeAll(() => {
    Config.getSystemConfig.mockReturnValue({
      DB: {
        HOST: "localhost",
        PORT: 27017,
        USER: "ttk",
        PASSWORD: "ttk",
        DATABASE: "ttk"
      }
    })
  })
  const user = {
    dfspId: 'test'
  }
  describe('read', () => {
    it('should create new object if not exists', async () => {
      const result = await dbAdapter.read('id1', user)
      expect(result).toBeDefined()
    })
    it('should take existing object if exists', async () => {
      const result = await dbAdapter.read('id2', user)
      expect(result).toBeDefined()
    })
    it('should take existing logs', async () => {
      const result = await dbAdapter.read('logs', user)
      expect(result).toBeDefined()
    })
    it('should take existing logs in specific range', async () => {
      const result = await dbAdapter.read('logs', user, {
        query: {
          gte: new Date().toISOString(),
          lt: new Date().toISOString()
        }
      })
      expect(result).toBeDefined()
    })
    it('should take existing reports', async () => {
      const result = await dbAdapter.read('reports', user)
      expect(result).toBeDefined()
    })
    it('should take existing reports in specific range', async () => {
      const result = await dbAdapter.read('reports', user, {
        query: {
          gte: new Date().toISOString(),
          lt: new Date().toISOString()
        }
      })
      expect(result).toBeDefined()
    })
  })
  describe('find', () => {
    it('should return existing documents', async () => {
      const result = await dbAdapter.find('id3', user)
      expect(result).toBeDefined()
    })
  })
  describe('upsert', () => {
    it('should create new object if not exists', async () => {
      const result = await dbAdapter.upsert('id1', {}, user)
      expect(result).toBeDefined()
    })
    it('should create new object if not exists', async () => {
      const result = await dbAdapter.upsert('id2', {}, user)
      expect(result).toBeDefined()
    })
    it('should create new object if not exists', async () => {
      const result = await dbAdapter.upsert('logs', {}, user)
      expect(result).toBeUndefined()
    })
    it('should create new object if not exists', async () => {
      const result = await dbAdapter.upsert('reports', {
        name: 'test',
        runtimeInformation: {
          completedTimeISO: new Date()
        }
      }, user)
      expect(result).toBeUndefined()
    })
  })
  describe('remove', () => {
    it('should remove existing object', async () => {
      const result = await dbAdapter.remove('id1', user)
      expect(result).toBeUndefined()
    })
  })
  describe('upsertReport', () => {
    it('should create new object if not exists', async () => {
      const result = await dbAdapter.upsertReport({
        runtimeInformation: {
          testReportId: 'id1'
        }
      })
      expect(spyMongooseConnect).toHaveBeenCalledWith("mongodb://ttk:ttk@localhost:27017/ttk", {"useNewUrlParser": true, "useUnifiedTopology": true})
    })
    it('should create new object if not exists', async () => {
      const result = await dbAdapter.upsertReport({
        runtimeInformation: {
          testReportId: 'id2'
        }
      })
      expect(spyMongooseConnect).toHaveBeenCalledWith("mongodb://ttk:ttk@localhost:27017/ttk", {"useNewUrlParser": true, "useUnifiedTopology": true})
    })
  })
  describe('listReports', () => {
    it('should create new object if not exists', async () => {
      const result = await dbAdapter.listReports({})
      expect(spyMongooseConnect).toHaveBeenCalledWith("mongodb://ttk:ttk@localhost:27017/ttk", {"useNewUrlParser": true, "useUnifiedTopology": true})
    })
  })
  describe('listReports with filters scenario1', () => {
    it('should create new object if not exists', async () => {
      const result = await dbAdapter.listReports({
        filterDateRangeStart: '2022-01-01T01:00:00.000Z',
        filterDateRangeEnd: '2022-12-31T23:59:59.999Z',
        filterStatus: 'passed',
        skip: 1,
        limit: 1,
      })
      expect(spyMongooseConnect).toHaveBeenCalledWith("mongodb://ttk:ttk@localhost:27017/ttk", {"useNewUrlParser": true, "useUnifiedTopology": true})
    })
  })
  describe('listReports with filters scenario2', () => {
    it('should create new object if not exists', async () => {
      const result = await dbAdapter.listReports({
        filterDateRangeStart: '2022-01-01T01:00:00.000Z',
        filterDateRangeEnd: '2022-12-31T23:59:59.999Z',
        filterStatus: 'failed',
        skip: 1,
        limit: 1,
      })
      expect(spyMongooseConnect).toHaveBeenCalledWith("mongodb://ttk:ttk@localhost:27017/ttk", {"useNewUrlParser": true, "useUnifiedTopology": true})
    })
  })
  describe('getReport', () => {
    it('should create new object if not exists', async () => {
      const result = await dbAdapter.getReport('id1')
      expect(spyMongooseConnect).toHaveBeenCalledWith("mongodb://ttk:ttk@localhost:27017/ttk", {"useNewUrlParser": true, "useUnifiedTopology": true})
    })
  })

  describe('getConnection - params and SSL/TLS support', () => {
    let originalEnv
    let dbAdapterModule
    let mockConnect
    let mockLoggerInfo

    beforeEach(() => {
      jest.resetModules()
      originalEnv = { ...process.env }
      mockConnect = jest.fn().mockResolvedValue({
        model: () => ({
          findById: jest.fn(),
          create: jest.fn(),
          find: jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue([]), sort: jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue([]) }) }),
          findOneAndRemove: jest.fn(),
          findOneAndUpdate: jest.fn(),
          countDocuments: jest.fn().mockResolvedValue(0)
        }),
        disconnect: jest.fn()
      })
      mockLoggerInfo = jest.fn()
      jest.doMock('../../../../src/lib/db/models/mongoDBWrapper', () => ({
        connect: mockConnect,
        models: {
          logs: {},
          reports: {},
          common: {},
          commonModel: {},
        },
        Types: {
          ObjectId: jest.fn(() => 'mockObjectId')
        }
      }))
      jest.doMock('@mojaloop/central-services-logger', () => ({
        info: mockLoggerInfo
      }))
    })

    afterEach(async () => {
      process.env = originalEnv
      jest.resetModules()
      if (dbAdapterModule && dbAdapterModule._deleteConn) {
        await dbAdapterModule._deleteConn()
      }
    })

    it('should parse DB.PARAMS if string and pass to connection-string', async () => {
      jest.doMock('../../../../src/lib/config', () => ({
        getSystemConfig: () => ({
          DB: {
            HOST: "localhost",
            PORT: 27017,
            USER: "ttk",
            PASSWORD: "ttk",
            DATABASE: "ttk",
            PARAMS: '{"replicaSet":"rs0"}'
          }
        })
      }))
      dbAdapterModule = require('../../../../src/lib/db/adapters/dbAdapter')
      await dbAdapterModule.read('id1', { dfspId: 'test' })
      expect(mockConnect).toHaveBeenCalledWith(
        expect.stringContaining('replicaSet=rs0'),
        expect.objectContaining({ useNewUrlParser: true, useUnifiedTopology: true })
      )
      await dbAdapterModule._deleteConn()
    })

    it('should handle invalid DB.PARAMS string gracefully', async () => {
      jest.doMock('../../../../src/lib/config', () => ({
        getSystemConfig: () => ({
          DB: {
            HOST: "localhost",
            PORT: 27017,
            USER: "ttk",
            PASSWORD: "ttk",
            DATABASE: "ttk",
            PARAMS: '{invalidJson:}'
          }
        })
      }))
      dbAdapterModule = require('../../../../src/lib/db/adapters/dbAdapter')
      await dbAdapterModule.read('id1', { dfspId: 'test' })
      expect(mockConnect).toHaveBeenCalled()
      await dbAdapterModule._deleteConn()
    })

    it('should enable TLS/SSL if SSL_ENABLED is true', async () => {
      jest.doMock('../../../../src/lib/config', () => ({
        getSystemConfig: () => ({
          DB: {
            HOST: "localhost",
            PORT: 27017,
            USER: "ttk",
            PASSWORD: "ttk",
            DATABASE: "ttk",
            SSL_ENABLED: true
          }
        })
      }))
      dbAdapterModule = require('../../../../src/lib/db/adapters/dbAdapter')
      await dbAdapterModule.read('id1', { dfspId: 'test' })
      expect(mockConnect).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ tls: true })
      )
      await dbAdapterModule._deleteConn()
    })

    it('should set tlsAllowInvalidCertificates if SSL_VERIFY is false', async () => {
      jest.doMock('../../../../src/lib/config', () => ({
        getSystemConfig: () => ({
          DB: {
            HOST: "localhost",
            PORT: 27017,
            USER: "ttk",
            PASSWORD: "ttk",
            DATABASE: "ttk",
            SSL_ENABLED: true,
            SSL_VERIFY: false
          }
        })
      }))
      dbAdapterModule = require('../../../../src/lib/db/adapters/dbAdapter')
      await dbAdapterModule.read('id1', { dfspId: 'test' })
      expect(mockConnect).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ tlsAllowInvalidCertificates: true })
      )
      await dbAdapterModule._deleteConn()
    })

    it('should set tlsCAFile as Buffer if SSL_CA is string', async () => {
      const pem = '-----BEGIN CERTIFICATE-----\nabc\n-----END CERTIFICATE-----'
      jest.doMock('../../../../src/lib/config', () => ({
        getSystemConfig: () => ({
          DB: {
            HOST: "localhost",
            PORT: 27017,
            USER: "ttk",
            PASSWORD: "ttk",
            DATABASE: "ttk",
            SSL_ENABLED: true,
            SSL_CA: pem
          }
        })
      }))
      dbAdapterModule = require('../../../../src/lib/db/adapters/dbAdapter')
      await dbAdapterModule.read('id1', { dfspId: 'test' })
      expect(mockConnect).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ tlsCAFile: expect.any(Buffer) })
      )
      await dbAdapterModule._deleteConn()
    })

    it('should set tlsCAFile as array of Buffers if SSL_CA is comma-separated string', async () => {
      const pem1 = '-----BEGIN CERTIFICATE-----\nabc\n-----END CERTIFICATE-----'
      const pem2 = '-----BEGIN CERTIFICATE-----\ndef\n-----END CERTIFICATE-----'
      jest.doMock('../../../../src/lib/config', () => ({
        getSystemConfig: () => ({
          DB: {
            HOST: "localhost",
            PORT: 27017,
            USER: "ttk",
            PASSWORD: "ttk",
            DATABASE: "ttk",
            SSL_ENABLED: true,
            SSL_CA: `${pem1},${pem2}`
          }
        })
      }))
      dbAdapterModule = require('../../../../src/lib/db/adapters/dbAdapter')
      await dbAdapterModule.read('id1', { dfspId: 'test' })
      expect(mockConnect).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ tlsCAFile: expect.any(Array) })
      )
      await dbAdapterModule._deleteConn()
    })
  })
})
