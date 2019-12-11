const customLogger = require('./requestLogger')

const handleCallback = async (callbackObject) => {
  if (callbackObject.delay) {
    await new Promise(resolve => setTimeout(resolve, callbackObject.delay))
  }
  customLogger.logMessage('debug', 'Send callback ' + callbackObject.method + ' ' + callbackObject.path, callbackObject.body)
  // TODO: Send HTTP request via mojaRequest method in sdk-standard-components library based on the config option
}

module.exports.handleCallback = handleCallback
