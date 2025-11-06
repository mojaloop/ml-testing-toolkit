const { loggerFactory, LOG_LEVELS } = require('@mojaloop/sdk-standard-components').Logger

const createLogger = (conf = {}) => {
  const {
    context = {
      context: 'ML_TTK'
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
