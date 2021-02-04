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

const Logs = require('../../../../src/lib/server-logs/logs')

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


describe('Logs', () => {
    describe('search', () => {
        it('should return search result from enabled adapter', async () => {
            const systemConfig = {
                SERVER_LOGS: {
                    ENABLED: true,
                    ADAPTER: {
                        TYPE: 'ELASTICSEARCH',
                        API_URL: 'http://mockurl.com',
                        INDEX: 'mock-index',
                        RESULTS_PER_PAGE: 10
                    }
                }
            };
            expect(await Logs.search({ query: { 'metadata.trace.traceId': 'mockTraceId' }, systemConfig })).toHaveLength(1)
        })
        it('should throw error if API_URL is missing', async () => {
            const systemConfig = {
                SERVER_LOGS: {
                    ENABLED: true,
                    ADAPTER: {
                        TYPE: 'ELASTICSEARCH',
                        API_URL: undefined,
                        INDEX: 'mock-index',
                        RESULTS_PER_PAGE: 10
                    }
                }
            };
            Logs.setAdapter(undefined)
            expect(() => {
                Logs.search({ query: { 'metadata.trace.traceId': 'mockTraceId' }, systemConfig })
            }).toThrowError()
        })
        it('should throw error if ADAPTER config is missing', async () => {
            const systemConfig = {
                SERVER_LOGS: {
                    ENABLED: true
                }
            };
            Logs.setAdapter(undefined)
            expect(() => {
                Logs.search({ query: { 'metadata.trace.traceId': 'mockTraceId' }, systemConfig })
            }).toThrowError()
        })
        it('should throw error if GRAFANA adapter is used', async () => {
            const systemConfig = {
                SERVER_LOGS: {
                    ENABLED: true,
                    ADAPTER: {
                        TYPE: 'GRAFANA',
                        API_URL: 'http://mockurl.com',
                        INDEX: 'mock-index',
                        RESULTS_PER_PAGE: 10
                    }
                }
            };
            Logs.setAdapter(undefined)
            expect(() => {
                Logs.search({ query: { 'metadata.trace.traceId': 'mockTraceId' }, systemConfig })
            }).toThrowError()
        })
        it('should return falsy value if SERVER LOGS ADAPTER config is missing', async () => {
            const systemConfig = {};
            Logs.setAdapter(undefined)
            expect(Logs.search({ query: { 'metadata.trace.traceId': 'mockTraceId' }, systemConfig })).toBeFalsy()
        })
        it('should throw error if SERVER LOGS ADAPTER TYPE config is unsupported', async () => {
            const systemConfig = {
                SERVER_LOGS: {
                    ENABLED: true,
                    ADAPTER: {
                        TYPE: 'UNSUPPORTED',
                        API_URL: 'http://mockurl.com',
                        INDEX: 'mock-index',
                        RESULTS_PER_PAGE: 10
                    }
                }
            };
            Logs.setAdapter(undefined)
            expect(() => {
                Logs.search({ query: { 'metadata.trace.traceId': 'mockTraceId' }, systemConfig })
            }).toThrowError()
        })
    })
})
