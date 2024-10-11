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

const _transformPostResource = async (resource, requestOptions) => {
  const headers = _replaceHeaders({
    accept: `application/vnd.interoperability.iso20022.${resource}+json;version=2.0`,
    'content-type': `application/vnd.interoperability.iso20022.${resource}+json;version=2.0`
  }, requestOptions.headers)
  const result = await TransformFacades.FSPIOP[resource].post({ body: requestOptions.body, headers: requestOptions.headers })
  return {
    ...requestOptions,
    headers,
    body: result.body
  }
}

const _transformPutResource = async (resource, callbackOptions) => {
  const headers = _replaceHeaders({
    'content-type': `application/vnd.interoperability.${resource}+json;version=2.0`
  }, callbackOptions.headers)
  const result = await TransformFacades.FSPIOPISO20022[resource].put({ body: callbackOptions.body, headers: callbackOptions.headers })
  return {
    ...callbackOptions,
    headers,
    body: result.body
  }
}

const requestTransform = async (requestOptions) => {
  try {
    switch (requestOptions.method) {
      case 'get':
        // GET /parties
        if (requestOptions.path.startsWith('/parties')) {
          const headers = _replaceHeaders({
            accept: 'application/vnd.interoperability.iso20022.parties+json;version=2.0'
          }, requestOptions.headers)
          return {
            ...requestOptions,
            headers
          }
        }
        break
      case 'post':
        if (requestOptions.path.startsWith('/quotes')) {
          return _transformPostResource('quotes', requestOptions)
        } else if (requestOptions.path.startsWith('/transfers')) {
          return _transformPostResource('transfers', requestOptions)
        } else if (requestOptions.path.startsWith('/fxQuotes')) {
          return _transformPostResource('fxQuotes', requestOptions)
        } else if (requestOptions.path.startsWith('/fxTransfers')) {
          return _transformPostResource('fxTransfers', requestOptions)
        }
        break
    }
  } catch (err) {
    console.log('Error transforming request', err)
  }
  return requestOptions
}

const callbackTransform = async (callbackOptions) => {
  try {
    switch (callbackOptions.method) {
      case 'put':
        if (callbackOptions.path.startsWith('/parties')) {
          return _transformPutResource('parties', callbackOptions)
        } else if (callbackOptions.path.startsWith('/quotes')) {
          return _transformPutResource('quotes', callbackOptions)
        } else if (callbackOptions.path.startsWith('/transfers')) {
          return _transformPutResource('transfers', callbackOptions)
        } else if (callbackOptions.path.startsWith('/fxQuotes')) {
          return _transformPutResource('fxQuotes', callbackOptions)
        } else if (callbackOptions.path.startsWith('/fxTransfers')) {
          return _transformPutResource('fxTransfers', callbackOptions)
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
