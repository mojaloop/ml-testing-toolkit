const EventEmitter = require('events')
class MyEmitter extends EventEmitter {}
var testOutbound = null

const getTestOutboundEmitter = () => {
  if (!testOutbound) {
    testOutbound = new MyEmitter()
  }
  return testOutbound
}

module.exports = {
  getTestOutboundEmitter
}
