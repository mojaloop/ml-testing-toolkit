/*****
 License
 --------------
 Copyright © 2017 Bill & Melinda Gates Foundation
 The Mojaloop files are made available by the Bill & Melinda Gates Foundation under the Apache License, Version 2.0 (the "License") and you may not use these files except in compliance with the License. You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, the Mojaloop files are distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 Contributors
 --------------
 This is the official list of the Mojaloop project contributors for this file.
 Names of the original copyright holders (individuals or organizations)
 should be listed with a '*' in the first column. People who have
 contributed from an organization can be listed under the organization
 that actually holds the copyright for their contributions (see the
 Gates Foundation organization for an example). Those individuals should have
 their names indented and be marked with a '-'. Email address can be added
 optionally within square brackets <email>.
 * Gates Foundation

 * ModusBox
 * Vijaya Kumar Guthi <vijaya.guthi@modusbox.com> (Original Author)
 --------------
 ******/

const customLogger = require('../requestLogger')
// eslint-disable-next-line
const acceptHeaderRE = new RegExp('^application/vnd.interoperability\\.([a-zA-Z0-9\\*]+)?\\.?([a-zA-Z0-9\\*]+)?(\\+json)?(;)?(version=(([0-9]+)(\\.([0-9]+))?)?)?$')

module.exports.validateAcceptHeader = (acceptHeader) => {
  const validationFailed = !acceptHeaderRE.test(acceptHeader)
  if (validationFailed) {
    customLogger.logMessage('debug', 'Invalid accept header ' + acceptHeader)
  }
  return {
    validationFailed,
    message: validationFailed ? 'Unknown Accept header format' : 'OK'
  }
}

module.exports.validateContentTypeHeader = (contentTypeHeader) => {
  const validationFailed = !acceptHeaderRE.test(contentTypeHeader)
  if (validationFailed) {
    customLogger.logMessage('debug', 'Invalid content-type header ' + contentTypeHeader)
  }
  return {
    validationFailed,
    message: validationFailed ? 'Unknown Content-Type header format' : 'OK'
  }
}

module.exports.negotiateVersion = (req, apis) => {
  let acceptHeader = req.headers['content-type']
  if (req.method === 'post' || req.method === 'get') {
    acceptHeader = req.headers.accept
  }
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
        if (temp !== null) {
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
      if (temp !== null) {
        negotiatedIndex = temp
        negotiationFailed = false
      }
    }
    if (!negotiationFailed) {
      responseContentTypeHeader = `application/vnd.interoperability.${parsedAcceptHeader.resource}+json;version=${apis[negotiatedIndex].majorVersion}.${apis[negotiatedIndex].minorVersion}`
    }
  }
  customLogger.logMessage('debug', negotiationFailed ? 'Version negotiation failed for the Accept / Content-Type header ' + acceptHeader : 'Version negotiation succeeded, picked up the version ' + apis[negotiatedIndex].majorVersion + '.' + apis[negotiatedIndex].minorVersion, { request: req })
  return {
    negotiationFailed,
    message: negotiationFailed ? 'Version negotiation failed for the Accept / Content-Type header ' + acceptHeader : 'OK',
    negotiatedIndex,
    responseContentTypeHeader
  }
}

const parseAcceptHeader = (acceptHeader) => {
  const parsedArray = acceptHeaderRE.exec(acceptHeader)
  if (!parsedArray) {
    return null
  }
  return {
    apiType: parsedArray[2] ? parsedArray[1] : 'fspiop',
    resource: parsedArray[2] ? parsedArray[2] : parsedArray[1],
    majorVersion: +parsedArray[7],
    minorVersion: +parsedArray[9]
  }
}

module.exports.parseAcceptHeader = parseAcceptHeader
