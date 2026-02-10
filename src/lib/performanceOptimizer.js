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

/**
 * Performance Optimizer Module
 *
 * This module provides utilities for managing caches and optimizing
 * performance across the application.
 *
 * Key Optimizations:
 * 1. Postman Sandbox Context Pooling - Reuse postman-sandbox contexts
 * 2. JavaScript Sandbox Context Pooling - Reuse vm-javascript-sandbox contexts
 * 3. Schema Compilation Caching - Cache AJV compiled schemas
 */

const customLogger = require('./requestLogger')

// Registry of cache management functions
const cacheManagers = []

/**
 * Register a cache management function
 * @param {Function} clearFn - Function to clear/manage the cache
 * @param {String} name - Name of the cache for logging
 */
const registerCache = (clearFn, name) => {
  cacheManagers.push({ clearFn, name })
}

/**
 * Clear all registered caches
 * Use this when you need to reset all caches (e.g., configuration reload)
 */
const clearAllCaches = () => {
  customLogger.logMessage('info', 'Clearing all performance caches', { notification: false })
  cacheManagers.forEach(({ clearFn, name }) => {
    try {
      clearFn()
      customLogger.logMessage('debug', `Cleared cache: ${name}`, { notification: false })
    } catch (err) {
      customLogger.logMessage('error', `Failed to clear cache: ${name}`, { additionalData: err.message, notification: false })
    }
  })
  customLogger.logMessage('info', `Cleared ${cacheManagers.length} caches`, { notification: false })
}

/**
 * Get cache statistics
 * @returns {Object} Statistics about registered caches
 */
const getCacheStats = () => {
  return {
    totalCaches: cacheManagers.length,
    caches: cacheManagers.map(({ name }) => name)
  }
}

/**
 * Setup periodic cache cleanup
 * @param {Number} intervalMs - Interval in milliseconds (default: 1 hour)
 */
const setupPeriodicCleanup = (intervalMs = 3600000) => {
  setInterval(() => {
    customLogger.logMessage('debug', 'Running periodic cache cleanup', { notification: false })
    // Trigger garbage collection hint if available
    if (global.gc) {
      global.gc()
    }
  }, intervalMs)
}

module.exports = {
  registerCache,
  clearAllCaches,
  getCacheStats,
  setupPeriodicCleanup
}
