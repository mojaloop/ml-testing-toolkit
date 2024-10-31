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
const customLogger = require('../../requestLogger')

const _replaceHeaders = (newHeaders, headers) => {
  // Replace headers considering the case sensitivity
  const clonedHeaders = {
    ...headers
  }
  Object.keys(newHeaders).forEach((key) => {
    const newKey = Object.keys(clonedHeaders).find((k) => k.toLowerCase() === key.toLowerCase())
    clonedHeaders[newKey] = newHeaders[key]
  })
  return clonedHeaders
}

const _replaceISO20022Headers = (headers, resource) => {
  return _replaceHeaders({
    accept: `application/vnd.interoperability.iso20022.${resource}+json;version=2.0`,
    'content-type': `application/vnd.interoperability.iso20022.${resource}+json;version=2.0`
  }, headers)
}

const _transformGetResource = (resource, requestOptions) => {
  const headers = _replaceISO20022Headers(requestOptions.headers, resource)
  return {
    ...requestOptions,
    headers
  }
}

const _transformPostResource = async (resource, requestOptions) => {
  const headers = _replaceISO20022Headers(requestOptions.headers, resource)
  TransformFacades.FSPIOP.configure({ isTestingMode: true, logger: customLogger })
  const result = await TransformFacades.FSPIOP[resource].post({ body: requestOptions.body, headers: requestOptions.headers })
  return {
    ...requestOptions,
    headers,
    body: result?.body
  }
}

const headersToLowerCase = (headers) => Object.fromEntries(
  Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v])
)

const _transformFSPIOPToISO20022PutResource = async (resource, requestOptions, isError) => {
  const headers = _replaceISO20022Headers(requestOptions.headers, resource)
  const ID = requestOptions.path.split('/')[2]
  TransformFacades.FSPIOP.configure({ isTestingMode: true, logger: customLogger })
  const result = await TransformFacades.FSPIOP[resource][isError ? 'putError' : 'put']({
    body: requestOptions.body,
    headers: headersToLowerCase(headers),
    params: { ID }
  })
  return {
    ...requestOptions,
    headers,
    body: result?.body
  }
}

const _transformPutResource = async (resource, callbackOptions, isError) => {
  const headers = _replaceHeaders({
    'content-type': `application/vnd.interoperability.${resource}+json;version=2.0`
  }, callbackOptions.headers)
  TransformFacades.FSPIOPISO20022.configure({ isTestingMode: true, logger: customLogger })
  const result = await TransformFacades.FSPIOPISO20022[resource][isError ? 'putError' : 'put']({ body: callbackOptions.body, headers: callbackOptions.headers })
  return {
    ...callbackOptions,
    headers,
    body: result?.body
  }
}

const _getHeader = (headers, name) => {
  return Object.entries(headers).find(
    ([key]) => key.toLowerCase() === name.toLowerCase()
  )?.[1]
}

const requestTransform = async (requestOptions) => {
  if (!_getHeader(requestOptions.headers, 'content-type')?.startsWith('application/vnd.interoperability.')) {
    return requestOptions
  }
  try {
    let isError = false
    switch (requestOptions.method) {
      case 'get':
        if (requestOptions.path.startsWith('/parties')) {
          return _transformGetResource('parties', requestOptions)
        } else if (requestOptions.path.startsWith('/quotes')) {
          return _transformGetResource('quotes', requestOptions)
        } else if (requestOptions.path.startsWith('/transfers')) {
          return _transformGetResource('transfers', requestOptions)
        } else if (requestOptions.path.startsWith('/fxQuotes')) {
          return _transformGetResource('fxQuotes', requestOptions)
        } else if (requestOptions.path.startsWith('/fxTransfers')) {
          return _transformGetResource('fxTransfers', requestOptions)
        } else if (requestOptions.path.startsWith('/participants')) {
          return _transformGetResource('participants', requestOptions)
        }
        break
      case 'post':
        if (requestOptions.path.startsWith('/quotes')) {
          return await _transformPostResource('quotes', requestOptions)
        } else if (requestOptions.path.startsWith('/transfers')) {
          return await _transformPostResource('transfers', requestOptions)
        } else if (requestOptions.path.startsWith('/fxQuotes')) {
          return await _transformPostResource('fxQuotes', requestOptions)
        } else if (requestOptions.path.startsWith('/fxTransfers')) {
          return await _transformPostResource('fxTransfers', requestOptions)
        } else if (requestOptions.path.startsWith('/participants')) {
          // POST /participants - Only the headers need to be transformed
          const headers = _replaceISO20022Headers(requestOptions.headers, 'participants')
          return {
            ...requestOptions,
            headers
          }
        }
        break
      case 'put':
        if (requestOptions.path.endsWith('/error')) {
          isError = true
        }
        if (requestOptions.path.startsWith('/quotes')) {
          return await _transformFSPIOPToISO20022PutResource('quotes', requestOptions, isError)
        } else if (requestOptions.path.startsWith('/transfers')) {
          return await _transformFSPIOPToISO20022PutResource('transfers', requestOptions, isError)
        } else if (requestOptions.path.startsWith('/fxQuotes')) {
          return await _transformFSPIOPToISO20022PutResource('fxQuotes', requestOptions, isError)
        } else if (requestOptions.path.startsWith('/fxTransfers')) {
          return await _transformFSPIOPToISO20022PutResource('fxTransfers', requestOptions, isError)
        }
        break
    }
  } catch (err) {
    console.log('Error transforming request', err)
  }
  return requestOptions
}

const callbackTransform = async (callbackOptions) => {
  if (!_getHeader(callbackOptions.headers, 'content-type')?.startsWith('application/vnd.interoperability.iso20022.')) {
    return callbackOptions
  }
  try {
    let isError = false
    switch (callbackOptions.method) {
      case 'put':
        if (callbackOptions.path.endsWith('/error')) {
          isError = true
        }
        if (callbackOptions.path.startsWith('/parties')) {
          return await _transformPutResource('parties', callbackOptions, isError)
        } else if (callbackOptions.path.startsWith('/quotes')) {
          return await _transformPutResource('quotes', callbackOptions, isError)
        } else if (callbackOptions.path.startsWith('/transfers')) {
          return await _transformPutResource('transfers', callbackOptions, isError)
        } else if (callbackOptions.path.startsWith('/fxQuotes')) {
          return await _transformPutResource('fxQuotes', callbackOptions, isError)
        } else if (callbackOptions.path.startsWith('/fxTransfers')) {
          return await _transformPutResource('fxTransfers', callbackOptions, isError)
        } else if (callbackOptions.path.startsWith('/participants')) {
          // PUT /participants - Only the headers need to be transformed
          const headers = _replaceHeaders({
            'content-type': 'application/vnd.interoperability.participants+json;version=2.0'
          }, callbackOptions.headers)
          return {
            ...callbackOptions,
            headers
          }
        }
        break
    }
  } catch (err) {
    console.log('Error transforming callback', err)
  }
  return callbackOptions
}

module.exports = {
  requestTransform,
  callbackTransform
}
