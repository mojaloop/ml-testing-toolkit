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
})
