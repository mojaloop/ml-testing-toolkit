
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
 * Steven Oderayi <steven.oderayi@modusbox.com> (Original Author)
 --------------
 ******/

'use strict'

const ESAdapter = require('../../../../../src/lib/server-logs/adapters/elastic-search')

jest.mock('@elastic/elasticsearch', () => {
  return {
    Client: jest.fn().mockImplementation(() => {
      return {
        search: jest.fn().mockImplementation(async () => {
          return {
            statusCode: 200,
            body: {
              hits: {
                total: { value: 1 }, hits: [{
                  _source: {
                    metadata: {
                      trace: {
                        service: 'mock-service',
                        startTimestamp: '2021-02-03T10:37:45.045Z',
                        tags: {
                          source: 'mock-source-dfsp',
                          destination: 'mock-dest-dfsp'
                        }
                      },
                      event: {
                        state: {
                          status: 'success'
                        }
                      }
                    }
                  }
                }]
              }
            }
          }
        })
      }
    })
  }
})

describe('Elastic Search adapter', () => {
  describe('init', () => {
    it('should throw exception when URL is not specified', () => {
      expect(() => {
        ESAdapter.init({})
      }).toThrow('[ElasticSearch Adapter] URL is required.')
    })
    it('should not throw exception when URL is specified', () => {
      expect(() => {
        ESAdapter.init({ url: 'http://mockurl.com' })
      }).not.toThrow()
    })
  })
  describe('search', () => {
    it('should not throw exception when URL is specified', async () => {
      ESAdapter.init({ url: 'http://mockurl.com' })
      expect(await ESAdapter.search({ query: { traceId: 'mockTraceId' } })).toHaveLength(1)
    })
    it('should return empty result if response code is not 200', async () => {
      ESAdapter.init({ url: 'http://mockurl.com' })

      ESAdapter.setClient({
        search: () => ({ statusCode: 500 })
      })
      expect(await ESAdapter.search({ query: { traceId: 'mockTraceId' } })).toBeFalsy()
      ESAdapter.setClient(null)
    })
  })
})
