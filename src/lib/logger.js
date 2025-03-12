const { loggerFactory, LOG_LEVELS } = require('@mojaloop/sdk-standard-components').Logger
const { hostname } = require('node:os')

const createLogger = (conf = {}) => {
  const {
    context = {
      hostname: hostname()
    },
    isJsonOutput = false
  } = conf

  return loggerFactory({ context, isJsonOutput })
}

const logger = createLogger() // global logger

module.exports = {
  logger,
  LOG_LEVELS
}
