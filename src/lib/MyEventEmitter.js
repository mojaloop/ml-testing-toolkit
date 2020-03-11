const EventEmitter = require('events')
class MyEmitter extends EventEmitter {}
var testOutbound = null
var assertionRequest = null
var assertionCallback = null

const getTestOutboundEmitter = () => {
  if (!testOutbound) {
    testOutbound = new MyEmitter()
  }
  return testOutbound
}

const getAssertionRequestEmitter = () => {
  if (!assertionRequest) {
    assertionRequest = new MyEmitter()
  }
  return assertionRequest
}

const getAssertionCallbackEmitter = () => {
  if (!assertionCallback) {
    assertionCallback = new MyEmitter()
  }
  return assertionCallback
}

module.exports = {
  getTestOutboundEmitter,
  getAssertionRequestEmitter,
  getAssertionCallbackEmitter
}
