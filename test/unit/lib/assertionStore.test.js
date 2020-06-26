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

const AssertionStore = require('../../../src/lib/assertionStore')

jest.setTimeout(20000)

describe('AssertionStore', () => {
  describe('Requests', () => {
    const path = '/assertionStoreRequests'
    const data = {}
    it('should not throw an error', () => {
      const retrievedData = AssertionStore.popRequest(path)
      expect(retrievedData).toStrictEqual(null)
    })
    it('should not throw an error', () => {
      expect(() => {AssertionStore.pushRequest(path, data)}).not.toThrowError()
    })
    it('should not throw an error', () => {
      const retrievedData = AssertionStore.popRequest(path)
      expect(retrievedData).toStrictEqual(data)
    })
  })
  describe('Callbacks', () => {
    const path = '/assertionStoreCallbacks'
    const data = {}
    it('should not throw an error', () => {
      const retrievedData = AssertionStore.popCallback(path)
      expect(retrievedData).toStrictEqual(null)
    })
    it('should not throw an error', () => {
      expect(() => {AssertionStore.pushCallback(path, data)}).not.toThrowError()
    })
    it('should not throw an error', () => {
      const retrievedData = AssertionStore.popCallback(path)
      expect(retrievedData).toStrictEqual(data)
    })
  })
  describe('clearOldAssertions', () => {
    const path = '/assertionStore'
    const data = {}
    it('should not throw an error', async () => {
      AssertionStore.pushRequest(path, data)
      AssertionStore.pushCallback(path, data)
      AssertionStore.initAssertionStore()
      await new Promise(resolve => setTimeout(resolve, 1000))
      AssertionStore.popRequest(path)
      AssertionStore.popCallback(path)
    })
  })
})
