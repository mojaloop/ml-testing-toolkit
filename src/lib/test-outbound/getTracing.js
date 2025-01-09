const { TraceHeaderUtils } = require('@mojaloop/ml-testing-toolkit-shared-lib')
const Config = require('../config')

const getTracing = (traceID, dfspId) => {
  const tracing = {
    outboundID: traceID,
    sessionID: null
  }
  if (traceID && TraceHeaderUtils.isCustomTraceID(traceID)) {
    tracing.outboundID = TraceHeaderUtils.getEndToEndID(traceID)
    tracing.sessionID = TraceHeaderUtils.getSessionID(traceID)
  }
  if (Config.getSystemConfig().HOSTING_ENABLED) {
    tracing.sessionID = dfspId
  }
  return tracing
}

module.exports = getTracing
