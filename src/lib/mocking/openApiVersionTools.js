const customLogger = require('../requestLogger')

const acceptHeaderRE = new RegExp('^application/vnd.interoperability\\.([a-zA-Z0-9\\*]+)?(\\+json)?(;)?(version=(([0-9]+)(\\.([0-9]+))?)?)?$')

module.exports.validateAcceptHeader = (acceptHeader) => {
  const validationFailed = !acceptHeaderRE.test(acceptHeader)
  if(validationFailed) {
    customLogger.logMessage('debug', 'Invalid accept header ' + acceptHeader)
  }
  return {
    validationFailed: validationFailed,
    message: validationFailed ? 'Unknown Accept header format' : 'OK'
  }
}

module.exports.negotiateVersion = (req, apis) => {
  const acceptHeader = req.headers.accept
  let negotiatedIndex = null
  let negotiationFailed = true
  let responseContentTypeHeader = null

  const parsedAcceptHeader = parseAcceptHeader(acceptHeader)
  if (parsedAcceptHeader) {
    if (parsedAcceptHeader.majorVersion >= 0) {
      if (parsedAcceptHeader.minorVersion >= 0) { // Major version and Minor version are supplied, so find the exact match
        const matchedApiIndex = apis.findIndex(item => {
          return item.majorVersion === parsedAcceptHeader.majorVersion && item.minorVersion === parsedAcceptHeader.minorVersion
        })
        if (matchedApiIndex >= 0) { // Exact match found
          negotiatedIndex = matchedApiIndex
          negotiationFailed = false
        }
      } else { // No Minor version, so find out the highest minor version in this major version
        const temp = apis.reduce((accumulatorIndex, currentValue, currentIndex) => {
          let compareValue = -1
          if (accumulatorIndex) {
            compareValue = apis[accumulatorIndex].minorVersion
          }

          if (currentValue.majorVersion === parsedAcceptHeader.majorVersion && currentValue.minorVersion > compareValue) {
            return currentIndex
          } else {
            return accumulatorIndex
          }
        }, null)
        if (temp) {
          negotiatedIndex = temp
          negotiationFailed = false
        }
      }
    } else { // No Major version, find out the highest version of all the APIs
      const temp = apis.reduce((accumulatorIndex, currentValue, currentIndex) => {
        let compareValue = -1
        if (accumulatorIndex) {
          compareValue = apis[accumulatorIndex].majorVersion * 10 + apis[accumulatorIndex].minorVersion
        }

        if ((currentValue.majorVersion * 10 + currentValue.minorVersion) > compareValue) {
          return currentIndex
        } else {
          return accumulatorIndex
        }
      }, null)
      if (temp) {
        negotiatedIndex = temp
        negotiationFailed = false
      }
    }
    if (!negotiationFailed) {
      responseContentTypeHeader = 'application/vnd.interoperability.' + parsedAcceptHeader.resource +
      '+json;version=' + apis[negotiatedIndex].majorVersion +
      '.' + apis[negotiatedIndex].minorVersion
    }
  }
  customLogger.logMessage('debug', negotiationFailed ? 'Version negotiation failed for the Accept header ' + acceptHeader : 'Version negotiation succeeded, picked up the version ' + apis[negotiatedIndex].majorVersion + '.' + apis[negotiatedIndex].minorVersion, null, true, req)
  return {
    negotiationFailed: negotiationFailed,
    message: negotiationFailed ? 'Version negotiation failed for the Accept header ' + acceptHeader : 'OK',
    negotiatedIndex: negotiatedIndex,
    responseContentTypeHeader: responseContentTypeHeader
  }
}

const parseAcceptHeader = (acceptHeader) => {
  const parsedArray = acceptHeaderRE.exec(acceptHeader)
  if (!parsedArray) {
    return null
  }
  const resource = parsedArray[1]
  const majorVersion = +parsedArray[6]
  const minorVersion = +parsedArray[8]
  return {
    resource,
    majorVersion,
    minorVersion
  }
}

module.exports.parseAcceptHeader = parseAcceptHeader
