const RC = require('parse-strings-in-object')(require('rc')('TOOLKIT', require('../../config/default.json')))
const defaultConfig = require('../../src/lib/config')

/**
 * testConfig extends ./src/lib/config.js with test-specific
 * environment variable config
 */

module.exports = {
  /* Test Config */
  TEST_TOOLKIT_HOST: RC.TEST_TOOLKIT_HOST,

  ...defaultConfig
}