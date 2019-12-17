const customLogger = require('./requestLogger')
const Config = require('../lib/config')
const axios = require('axios').default

const handleCallback = async (callbackObject, req) => {
  if (callbackObject.delay) {
    await new Promise(resolve => setTimeout(resolve, callbackObject.delay))
  }
  if (Config.USER_CONFIG.SEND_CALLBACK_ENABLE) {
    customLogger.logMessage('info', 'Sending callback ' + callbackObject.method + ' ' + callbackObject.path, callbackObject, true, req)
    axios({
      method: callbackObject.method,
      url: Config.USER_CONFIG.CALLBACK_ENDPOINT + callbackObject.path,
      headers: callbackObject.headers,
      data: callbackObject.body,
      timeout: 3000
    }).then((result) => {
      customLogger.logMessage('info', 'Received callback response ' + result.status + ' ' + result.statusText, null, true, req)
    }, (err) => {
      customLogger.logMessage('info', 'Failed to send callback ' + callbackObject.method + ' ' + callbackObject.path, err, true, req)
    })
  } else {
    customLogger.logMessage('info', 'Log callback ' + callbackObject.method + ' ' + callbackObject.path, callbackObject, true, req)
  }
}

module.exports.handleCallback = handleCallback
