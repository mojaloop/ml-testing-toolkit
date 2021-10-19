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
const Config = require('../../../../src/lib/config')
const ServerLogs = require('../../../../src/lib/server-logs')

const spyGetSystemConfig = jest.spyOn(Config, 'getSystemConfig')

jest.mock('../../../../src/lib/server-logs/adapters/elastic-search', () => {
    return {
        init: () => { },
        search: () => [
            {
                data: {}
            }
        ]
    }
})


describe('Server Logs', () => {
    describe('search', () => {
        it('should return search result from enabled adapter', async () => {
            spyGetSystemConfig.mockReturnValueOnce({
                SERVER_LOGS: {
                    ENABLED: true,
                    ADAPTER: {
                        TYPE: 'ELASTICSEARCH',
                        API_URL: 'http://mockurl.com',
                        INDEX: 'mock-index',
                        RESULTS_PER_PAGE: 10
                    }
                }
            })
            expect(await ServerLogs.search({ query: { 'metadata.trace.traceId': 'mockTraceId' } })).toHaveLength(1)
        })
        it('should throw error if API_URL is missing', async () => {
            spyGetSystemConfig.mockReturnValueOnce({
                SERVER_LOGS: {
                    ENABLED: true,
                    ADAPTER: {
                        TYPE: 'ELASTICSEARCH',
                        API_URL: undefined,
                        INDEX: 'mock-index',
                        RESULTS_PER_PAGE: 10
                    }
                }
            })
            ServerLogs.setAdapter(undefined)
            expect(() => {
                ServerLogs.search({ query: { 'metadata.trace.traceId': 'mockTraceId' } })
            }).toThrowError()
        })
        it('should return falsy value if SERVER LOGS ADAPTER config is missing', async () => {
            spyGetSystemConfig.mockReturnValueOnce({})
            ServerLogs.setAdapter(undefined)
            expect(ServerLogs.search({ query: { 'metadata.trace.traceId': 'mockTraceId' } })).toBeFalsy()
        })
        it('should throw error if SERVER LOGS ADAPTER TYPE config is unsupported', async () => {
            spyGetSystemConfig.mockReturnValueOnce({
                SERVER_LOGS: {
                    ENABLED: true,
                    ADAPTER: {
                        TYPE: 'UNSUPPORTED',
                        API_URL: 'http://mockurl.com',
                        INDEX: 'mock-index',
                        RESULTS_PER_PAGE: 10
                    }
                }
            })
            ServerLogs.setAdapter(undefined)
            expect(() => {
                ServerLogs.search({ query: { 'metadata.trace.traceId': 'mockTraceId' } })
            }).toThrowError()
        })
    })
})
