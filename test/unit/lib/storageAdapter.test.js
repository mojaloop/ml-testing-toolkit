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
 * Georgi Logodazhki <georgi.logodazhki@modusbox.com>
 * Vijaya Kumar Guthi <vijaya.guthi@modusbox.com> (Original Author)
 --------------
 ******/

const axios = require('axios').default
axios.create = jest.fn(() => axios)
jest.mock('axios')

axios.get.mockImplementation(url => Promise.resolve({data: {url}}))

const storageAdapter = require('../../../src/lib/storageAdapter')
const Config = require('../../../src/lib/config')
jest.mock('../../../src/lib/config')
Config.getSystemConfig.mockReturnValue({
  HOSTING_ENABLED: true
})
jest.mock('../../../src/lib/db/adapters/dbAdapter', () => {
  return {
    read: (id) => {
      switch (id) {
        case 'read_3': return {
          data: {}
        }
        case 'read_6': return {
          data: {
            key: 'value'
          }
        }
      }
    },
    upsert: (id) => {
      switch (id) {
        case 'read_1/': return {}
        case 'read_3': return {
          data: {}
        }
        case 'upsert_1': return {}
      }
    },
    find: (id) => {
      switch (id) {
        case 'read_1/': return []
        case 'read_2/': return ['file']
      }
    },
    remove: (id) => {
      switch (id) {
        case 'remove_1': return undefined
      }
    },
  }
})
jest.mock('../../../src/lib/fileAdapter', () => {
  return {
    read: (id) => {
      switch (id) {
        case 'read_1/': return {}
        case 'read_3': return {}
        case 'read_5': return {}
        case 'read_8': return 'http://localhost/read_8'
        case 'read_9': return 'https://localhost/read_9'
      }
    },
    readDir: (id) => {
      switch (id) {
        case 'read_1/': return ['file']
        case 'read_4/': return ['file']
        case 'read_7/': return ['file']
      }
    },
    upsert: (id) => {
      switch (id) {
        case 'upsert_2': return {}
      }
    },
    remove: (id) => {
      switch (id) {
        case 'remove_2': return undefined
      }
    },
  }
})

describe('dbAdapter', () => {
  describe('when user defined', () => {
    const user = {
      dfspId: 'test'
    }
    describe('read', () => {
      it('should read whole directory', async () => {
        const result = await storageAdapter.read('read_1/', user)
        expect(result).toBeDefined()
      })
      it('should read whole directory', async () => {
        const result = await storageAdapter.read('read_2/', user)
        expect(result).toBeDefined()
      })
      it('should read only 1 file', async () => {
        const result = await storageAdapter.read('read_3', user)
        expect(result).toBeDefined()
      })
      it('should read only 1 file', async () => {
        const result = await storageAdapter.read('read_6', user)
        expect(result).toBeDefined()
      })
    })
    describe('upsert', () => {
      it('should read whole directory', async () => {
        const result = await storageAdapter.upsert('upsert_1', {}, user)
        expect(result).toBeUndefined()
      })
    })
    describe('remove', () => {
      it('should read whole directory', async () => {
        const result = await storageAdapter.remove('remove_1', user)
        expect(result).toBeUndefined()
      })
    })
  })
  describe('when user undefined', () => {
    describe('read', () => {
      it('should read whole directory', async () => {
        const result = await storageAdapter.read('read_4/')
        expect(result).toBeDefined()
      })
      it('should read only 1 file', async () => {
        const result = await storageAdapter.read('read_5')
        expect(result).toBeDefined()
      })
      it('should read only 1 file', async () => {
        const result = await storageAdapter.read('read_7/')
        expect(result).toBeDefined()
      })
      it('should fetch http', async () => {
        const result = await storageAdapter.read('read_8')
        expect(result).toBeDefined()
        expect(result.data).toEqual({url: 'http://localhost/read_8'})
      })
      it('should fetch https', async () => {
        const result = await storageAdapter.read('read_9')
        expect(result).toBeDefined()
        expect(result.data).toEqual({url: 'https://localhost/read_9'})
      })
    })
    describe('upsert', () => {
      it('should read whole directory', async () => {
        const result = await storageAdapter.upsert('upsert_2', {})
        expect(result).toBeUndefined()
      })
    })
    describe('remove', () => {
      it('should read whole directory', async () => {
        const result = await storageAdapter.remove('remove_2')
        expect(result).toBeUndefined()
      })
    })
  })
})
