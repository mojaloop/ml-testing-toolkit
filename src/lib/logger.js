const { loggerFactory, LOG_LEVELS } = require('@mojaloop/sdk-standard-components').Logger
const os = require('node:os')

const logger = loggerFactory({
  context: 'TTK',
  hostname: os.hostname(),
  isJsonOutput: false
}) // global logger

module.exports = {
  logger,
  LOG_LEVELS
}
