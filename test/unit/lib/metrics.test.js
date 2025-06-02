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
 
 * Shashikant Hirugade <shashi.mojaloop@gmail.com> (Original Author)

 --------------
 ******/

'use strict'

const Metrics = require('@mojaloop/central-services-metrics')
jest.mock('@mojaloop/central-services-metrics')

const metrics = require('../../../src/lib/metrics')

describe('metrics', () => {
  let mockRegister
  let mockClient
  let mockCounter
  let mockReq
  let mockRes
  let mockNext

  beforeEach(() => {
    mockRegister = { clear: jest.fn() }
    mockCounter = jest.fn().mockImplementation(() => ({
      inc: jest.fn()
    }))
    mockClient = { Counter: mockCounter }
    
    Metrics.getDefaultRegister.mockReturnValue(mockRegister)
    Metrics.setup.mockReturnValue(undefined)
    Metrics.getClient.mockReturnValue(mockClient)
    Metrics.getMetricsForPrometheus.mockResolvedValue('prometheus_metrics_data')

    mockReq = { url: '/some-route' }
    mockRes = {
      set: jest.fn(),
      send: jest.fn()
    }
    mockNext = jest.fn()

    jest.clearAllMocks()
  })

  it('should initialize metrics with default config', () => {
    const middleware = metrics()
    
    expect(Metrics.getDefaultRegister).toHaveBeenCalled()
    expect(mockRegister.clear).toHaveBeenCalled()
    expect(Metrics.setup).toHaveBeenCalledWith({
      timeout: 5000,
      defaultLabels: {}
    })
    expect(Metrics.getClient).toHaveBeenCalled()
    expect(mockCounter).toHaveBeenCalledTimes(4)
    expect(mockCounter).toHaveBeenCalledWith({
      name: 'assert_success_total',
      help: 'Successful assertions',
      labelNames: ['request', 'test']
    })
    expect(mockCounter).toHaveBeenCalledWith({
      name: 'assert_fail_total',
      help: 'Failed assertions',
      labelNames: ['request', 'test']
    })
    expect(mockCounter).toHaveBeenCalledWith({
      name: 'test_success_total',
      help: 'Successful tests',
      labelNames: ['template']
    })
    expect(mockCounter).toHaveBeenCalledWith({
      name: 'test_fail_total',
      help: 'Failed tests',
      labelNames: ['template']
    })

    middleware(mockReq, mockRes, mockNext)
    expect(mockNext).toHaveBeenCalled()
  })

  it('should initialize metrics with custom config', () => {
    const customConfig = {
      timeout: 10000,
      defaultLabels: { env: 'test' }
    }
    metrics(customConfig)

    expect(Metrics.setup).toHaveBeenCalledWith({
      timeout: 10000,
      defaultLabels: { env: 'test' }
    })
  })

  it('should attach metrics to req for non-metrics route', () => {
    const middleware = metrics()
    
    mockReq.url = '/api/test'
    middleware(mockReq, mockRes, mockNext)

    expect(mockReq.metrics).toBeDefined()
    expect(mockReq.metrics.assertSuccess.add).toBeDefined()
    expect(mockReq.metrics.assertFail.add).toBeDefined()
    expect(mockReq.metrics.testSuccess.add).toBeDefined()
    expect(mockReq.metrics.testFail.add).toBeDefined()
    expect(mockNext).toHaveBeenCalled()
    expect(mockRes.set).not.toHaveBeenCalled()
    expect(mockRes.send).not.toHaveBeenCalled()
  })

  it('should serve Prometheus metrics for /metrics route', async () => {
    const middleware = metrics()
    
    mockReq.url = '/metrics'
    await new Promise(resolve => {
      mockRes.send.mockImplementation(() => resolve())
      middleware(mockReq, mockRes, mockNext)
    })

    expect(mockRes.set).toHaveBeenCalledWith('Content-Type', 'text/plain; version=0.0.4')
    expect(Metrics.getMetricsForPrometheus).toHaveBeenCalled()
    expect(mockRes.send).toHaveBeenCalledWith('prometheus_metrics_data')
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should increment assertSuccess counter', () => {
    const middleware = metrics()
    
    middleware(mockReq, mockRes, mockNext)
    const labels = { request: 'req1', test: 'test1' }
    mockReq.metrics.assertSuccess.add(1, labels)

    const assertSuccessCounter = mockCounter.mock.results[0].value
    expect(assertSuccessCounter.inc).toHaveBeenCalledWith(labels, 1)
  })

  it('should increment assertFail counter', () => {
    const middleware = metrics()
    
    middleware(mockReq, mockRes, mockNext)
    const labels = { request: 'req2', test: 'test2' }
    mockReq.metrics.assertFail.add(1, labels)

    const assertFailCounter = mockCounter.mock.results[1].value
    expect(assertFailCounter.inc).toHaveBeenCalledWith(labels, 1)
  })

  it('should increment testSuccess and testFail counters', () => {
    const middleware = metrics()
    
    middleware(mockReq, mockRes, mockNext)
    const testSuccessLabels = { template: 'template1' }
    const testFailLabels = { template: 'template2' }
    mockReq.metrics.testSuccess.add(1, testSuccessLabels)
    mockReq.metrics.testFail.add(1, testFailLabels)

    const testSuccessCounter = mockCounter.mock.results[2].value
    const testFailCounter = mockCounter.mock.results[3].value
    expect(testSuccessCounter.inc).toHaveBeenCalledWith(testSuccessLabels, 1)
    expect(testFailCounter.inc).toHaveBeenCalledWith(testFailLabels, 1)
  })
})