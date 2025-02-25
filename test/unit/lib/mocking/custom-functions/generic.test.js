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
 * Vijaya Kumar Guthi <vijaya.guthi@modusbox.com> (Original Author)
 --------------
 ******/

'use strict'

const Generic = require('../../../../../src/lib/mocking/custom-functions/generic')
const ulidx = require('ulidx')

jest.mock('ulidx',() => {
  const originalModule = jest.requireActual('ulidx');
  return {
    ...originalModule,
    monotonicFactory: jest.fn(() => jest.fn()),
  };
})

describe('Generic Custom Functions', () => {
  describe('generateUUID', () => {
    it('It should return some uuid value', async () => {
      const result = Generic.generateUUID()
      expect(result).toBeTruthy()
      expect(result.length).toBeGreaterThan(20)
    })
    it('It should return unique values each time', async () => {
      const result1 = Generic.generateUUID()
      const result2 = Generic.generateUUID()
      expect(result1).toBeTruthy()
      expect(result2).toBeTruthy()
      expect(result1).not.toEqual(result2)
    })
  })
  describe('curDate', () => {
    it('It should return proper date', async () => {
      const result = Generic.curDate()
      expect(result).toBeTruthy()
      expect(result.length).toBeGreaterThan(20)
    })
  })
  describe('curDateISO', () => {
    it('It should return proper date', async () => {
      const result = Generic.curDateISO()
      expect(result).toBeTruthy()
      expect(result.length).toBeGreaterThan(15)
    })
  })
  describe('generateID', () => {
    it('It should return some uuid value when options.generateIDType === uuid', async () => {
      const result = Generic.generateID({ generateIDType: 'uuid' })
      expect(result).toBeTruthy()
      expect(result.length).toBeGreaterThan(20)
    })
    it('It should return some uuid value when options.generateIDType === ulid', async () => {
      Generic.generateID({ generateIDType: 'ulid' })
      expect(ulidx.monotonicFactory).toBeCalled()
    })
  })
})

