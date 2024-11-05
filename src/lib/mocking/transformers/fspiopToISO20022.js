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

 * Infitx
 * Vijaya Kumar Guthi <vijaya.guthi@infitx.com> (Original Author)
 --------------
 ******/

const { TransformFacades } = require('@mojaloop/ml-schema-transformer-lib')
const { getHeader, headersToLowerCase } = require('../../utils')
const customLogger = require('../../requestLogger')

const _replaceAcceptOrContentTypeHeader = (inputStr, isReverse) => {
  if (isReverse) {
    return inputStr.replace('application/vnd.interoperability.iso20022.', 'application/vnd.interoperability.')
  } else {
    return inputStr.replace('application/vnd.interoperability.', 'application/vnd.interoperability.iso20022.')
  }
}
const _replaceHeaders = (headers, isReverse) => {
  // Replace headers considering the case sensitivity
  const newHeaders = {
    ...headers
  }
  Object.keys(headers).forEach((key) => {
    if (key.toLowerCase() === 'content-type' || key.toLowerCase() === 'accept') {
      newHeaders[key] = _replaceAcceptOrContentTypeHeader(headers[key], isReverse)
    } else {
      newHeaders[key] = headers[key]
    }
  })
  return newHeaders
}

const _transformGetResource = (_resource, options, isReverse) => {
  const headers = _replaceHeaders(options.headers, isReverse)

  return {
    ...options,
    headers
  }
}

const _transformPostResource = async (resource, options, isReverse) => {
  const headers = _replaceHeaders(options.headers, isReverse)
  let result
  if (isReverse) {
    TransformFacades.FSPIOPISO20022.configure({ isTestingMode: true, logger: customLogger })
    result = await TransformFacades.FSPIOPISO20022[resource].post({ body: options.body, headers: options.headers })
  } else {
    TransformFacades.FSPIOP.configure({ isTestingMode: true, logger: customLogger })
    result = await TransformFacades.FSPIOP[resource].post({ body: options.body, headers: options.headers })
  }

  return {
    ...options,
    headers,
    body: result?.body
  }
}

const _transformPutResource = async (resource, options, isError, isReverse) => {
  const headers = _replaceHeaders(options.headers, isReverse)
  let result
  if (isReverse) {
    TransformFacades.FSPIOPISO20022.configure({ isTestingMode: true, logger: customLogger })
    result = await TransformFacades.FSPIOPISO20022[resource][isError ? 'putError' : 'put']({
      body: options.body,
      headers: headersToLowerCase(headers),
      params: options.params
    })
  } else {
    TransformFacades.FSPIOP.configure({ isTestingMode: true, logger: customLogger })
    result = await TransformFacades.FSPIOP[resource][isError ? 'putError' : 'put']({
      body: options.body,
      headers: headersToLowerCase(headers),
      params: options.params
    })
  }

  return {
    ...options,
    headers,
    body: result?.body
  }
}

const _transformPatchResource = async (resource, options, isReverse) => {
  const headers = _replaceHeaders(options.headers, isReverse)
  let result
  if (isReverse) {
    TransformFacades.FSPIOPISO20022.configure({ isTestingMode: true, logger: customLogger })
    result = await TransformFacades.FSPIOPISO20022[resource].patch({
      body: options.body,
      headers: headersToLowerCase(headers),
      params: options.params
    })
  } else {
    TransformFacades.FSPIOP.configure({ isTestingMode: true, logger: customLogger })
    result = await TransformFacades.FSPIOP[resource].patch({
      body: options.body,
      headers: headersToLowerCase(headers),
      params: options.params
    })
  }

  return {
    ...options,
    headers,
    body: result?.body
  }
}

const _transform = async (options, isReverse = false) => {
  if (isReverse) {
    if (!getHeader(options.headers, 'content-type')?.startsWith('application/vnd.interoperability.iso20022.')) {
      return options
    }
  } else {
    if (!getHeader(options.headers, 'content-type')?.startsWith('application/vnd.interoperability.')) {
      return options
    }
  }
  try {
    switch (options.method) {
      case 'get':
        if (options.path.startsWith('/parties')) {
          return _transformGetResource('parties', options, isReverse)
        } else if (options.path.startsWith('/quotes')) {
          return _transformGetResource('quotes', options, isReverse)
        } else if (options.path.startsWith('/transfers')) {
          return _transformGetResource('transfers', options, isReverse)
        } else if (options.path.startsWith('/fxQuotes')) {
          return _transformGetResource('fxQuotes', options, isReverse)
        } else if (options.path.startsWith('/fxTransfers')) {
          return _transformGetResource('fxTransfers', options, isReverse)
        } else if (options.path.startsWith('/participants')) {
          return _transformGetResource('participants', options, isReverse)
        }
        break
      case 'post':
        if (options.path.startsWith('/quotes')) {
          return await _transformPostResource('quotes', options, isReverse)
        } else if (options.path.startsWith('/transfers')) {
          return await _transformPostResource('transfers', options, isReverse)
        } else if (options.path.startsWith('/fxQuotes')) {
          return await _transformPostResource('fxQuotes', options, isReverse)
        } else if (options.path.startsWith('/fxTransfers')) {
          return await _transformPostResource('fxTransfers', options, isReverse)
        } else if (options.path.startsWith('/participants')) {
          // POST /participants - Only the headers need to be transformed
          const headers = _replaceHeaders(options.headers, isReverse)
          return {
            ...options,
            headers
          }
        }
        break
      case 'put': {
        let isError = false
        if (options.path.endsWith('/error')) {
          isError = true
        }
        if (options.path.startsWith('/parties')) {
          return await _transformPutResource('parties', options, isError, isReverse)
        } else if (options.path.startsWith('/quotes')) {
          return await _transformPutResource('quotes', options, isError, isReverse)
        } else if (options.path.startsWith('/transfers')) {
          return await _transformPutResource('transfers', options, isError, isReverse)
        } else if (options.path.startsWith('/fxQuotes')) {
          return await _transformPutResource('fxQuotes', options, isError, isReverse)
        } else if (options.path.startsWith('/fxTransfers')) {
          return await _transformPutResource('fxTransfers', options, isError, isReverse)
        } else if (options.path.startsWith('/participants')) {
          // PUT /participants - Only the headers need to be transformed
          const headers = _replaceHeaders(options.headers, isReverse)
          return {
            ...options,
            headers
          }
        }
        break
      }
      case 'patch': {
        if (options.path.startsWith('/transfers')) {
          return await _transformPatchResource('transfers', options, isReverse)
        } else if (options.path.startsWith('/fxTransfers')) {
          return await _transformPatchResource('fxTransfers', options, isReverse)
        }
        break
      }
    }
  } catch (err) {
    console.log('Error transforming request', err)
  }
  return options
}

const forwardTransform = async (options) => {
  return _transform(options)
}

const reverseTransform = async (options) => {
  return _transform(options, true)
}

module.exports = {
  forwardTransform,
  reverseTransform
}
