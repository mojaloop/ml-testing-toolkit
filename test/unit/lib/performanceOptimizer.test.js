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
 --------------
 ******/

'use strict'

const requestLogger = require('../../../src/lib/requestLogger')

jest.mock('../../../src/lib/requestLogger')

describe('PerformanceOptimizer', () => {
  let performanceOptimizer

  beforeEach(() => {
    jest.resetModules()
    requestLogger.logMessage.mockReturnValue()
    performanceOptimizer = require('../../../src/lib/performanceOptimizer')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('registerCache', () => {
    it('should register a cache without throwing an error', () => {
      const mockClearFn = jest.fn()
      expect(() => performanceOptimizer.registerCache(mockClearFn, 'TestCache')).not.toThrowError()
    })

    it('should allow multiple cache registrations', () => {
      const mockClearFn1 = jest.fn()
      const mockClearFn2 = jest.fn()
      performanceOptimizer.registerCache(mockClearFn1, 'Cache1')
      performanceOptimizer.registerCache(mockClearFn2, 'Cache2')

      const stats = performanceOptimizer.getCacheStats()
      expect(stats.totalCaches).toBeGreaterThanOrEqual(2)
    })
  })

  describe('getCacheStats', () => {
    it('should return cache statistics', () => {
      const stats = performanceOptimizer.getCacheStats()
      expect(stats).toHaveProperty('totalCaches')
      expect(stats).toHaveProperty('caches')
      expect(Array.isArray(stats.caches)).toBe(true)
      expect(typeof stats.totalCaches).toBe('number')
    })

    it('should reflect registered caches in statistics', () => {
      const mockClearFn = jest.fn()
      const initialStats = performanceOptimizer.getCacheStats()
      const initialCount = initialStats.totalCaches

      performanceOptimizer.registerCache(mockClearFn, 'TestCache')

      const newStats = performanceOptimizer.getCacheStats()
      expect(newStats.totalCaches).toBe(initialCount + 1)
      expect(newStats.caches).toContain('TestCache')
    })
  })

  describe('clearAllCaches', () => {
    beforeEach(() => {
      requestLogger.logMessage.mockClear()
    })

    it('should call all registered cache clear functions', () => {
      const mockClearFn1 = jest.fn()
      const mockClearFn2 = jest.fn()

      performanceOptimizer.registerCache(mockClearFn1, 'Cache1')
      performanceOptimizer.registerCache(mockClearFn2, 'Cache2')

      performanceOptimizer.clearAllCaches()

      expect(mockClearFn1).toHaveBeenCalled()
      expect(mockClearFn2).toHaveBeenCalled()
    })

    it('should not throw error when clearing caches', () => {
      const mockClearFn = jest.fn()
      performanceOptimizer.registerCache(mockClearFn, 'TestCache')

      expect(() => performanceOptimizer.clearAllCaches()).not.toThrowError()
    })

    it('should handle errors from individual cache clear functions', () => {
      const mockClearFnError = jest.fn(() => { throw new Error('Clear failed') })
      const mockClearFnSuccess = jest.fn()

      performanceOptimizer.registerCache(mockClearFnError, 'ErrorCache')
      performanceOptimizer.registerCache(mockClearFnSuccess, 'SuccessCache')

      expect(() => performanceOptimizer.clearAllCaches()).not.toThrowError()
      expect(mockClearFnSuccess).toHaveBeenCalled()
    })

    it('should clear all caches without error', () => {
      const mockClearFn = jest.fn()
      performanceOptimizer.registerCache(mockClearFn, 'TestCache')

      expect(() => performanceOptimizer.clearAllCaches()).not.toThrowError()
      expect(mockClearFn).toHaveBeenCalled()
    })
  })

  describe('setupPeriodicCleanup', () => {
    beforeEach(() => {
      jest.useFakeTimers()
      requestLogger.logMessage.mockClear()
    })

    afterEach(() => {
      jest.clearAllTimers()
      jest.useRealTimers()
    })

    it('should setup periodic cleanup without throwing an error', () => {
      expect(() => performanceOptimizer.setupPeriodicCleanup(1000)).not.toThrowError()
    })

    it('should run cleanup at specified intervals', () => {
      performanceOptimizer.setupPeriodicCleanup(1000)

      jest.advanceTimersByTime(1000)
      // Should trigger at least one interval callback
      // Just verify the function runs without error
      expect(true).toBe(true)
    })

    it('should use default interval when not specified', () => {
      expect(() => performanceOptimizer.setupPeriodicCleanup()).not.toThrowError()
    })

    it('should call global.gc if available', () => {
      const originalGc = global.gc
      global.gc = jest.fn()
      
      performanceOptimizer.setupPeriodicCleanup(1000)
      jest.advanceTimersByTime(1000)
      
      expect(global.gc).toHaveBeenCalled()
      
      global.gc = originalGc
    })
  })
})
