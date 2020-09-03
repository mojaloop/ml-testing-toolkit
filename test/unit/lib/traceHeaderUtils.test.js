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
 * Vijaya Kumar Guthi <vijaya.guthi@modusbox.com> (Original Author)
 --------------
 ******/

'use strict'

const TraceHeaderUtils = require('../../../src/lib/traceHeaderUtils')

describe('TraceHeaderUtils', () => {
  describe('isCustomTraceID', () => {
    const customTraceID = 'aabb14d5b207d3ba722c6c0fdcd44c61'
    const nonCustomTraceID = '664314d5b207d3ba722c6c0fdcd44c61'
    it('Result must be false for non custom traceIDs', () => {
      const result = TraceHeaderUtils.isCustomTraceID(nonCustomTraceID)
      expect(result).toBe(false)
    })
    it('Result must be true for custom traceIDs', () => {
      const result = TraceHeaderUtils.isCustomTraceID(customTraceID)
      expect(result).toBe(true)
    })
  })
  describe('getEndToEndID', () => {
    const traceID1 = 'aabb14d5b207d3ba722c6c0fdcd44c61'
    const traceID2 = 'aabb14d5b207d3ba722c6c0fdcd41234'
    it('Should get the end to end properly', () => {
      const result = TraceHeaderUtils.getEndToEndID(traceID1)
      expect(result).toEqual('4c61')
    })
    it('Should get the end to end properly', () => {
      const result = TraceHeaderUtils.getEndToEndID(traceID2)
      expect(result).toEqual('1234')
    })
  })
  describe('getSessionID', () => {
    const traceID = 'aabb14d5b207d3ba722c6c0fdcd44c61'
    it('Should get the session ID properly', () => {
      const result = TraceHeaderUtils.getSessionID(traceID)
      expect(result).toEqual('14d5b207d3ba722c6c0fdcd4')
    })
  })
  describe('getTraceIdPrefix', () => {
    it('Should get the session ID properly', () => {
      const result = TraceHeaderUtils.getTraceIdPrefix()
      expect(result).toBeDefined()
    })
  })
  describe('getTraceParentHeader', () => {
    it('Should get the session ID properly', () => {
      const result = TraceHeaderUtils.getTraceParentHeader('aabb')
      expect(result).toBeDefined()
    })
  })
  describe('generateRandTraceId', () => {
    it('Should get the random trace ID properly', () => {
      const result = TraceHeaderUtils.generateRandTraceId(4)
      expect(result).toBeDefined()
    })
  })
})
