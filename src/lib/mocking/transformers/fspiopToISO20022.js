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

const requestTransform = async (requestOptions) => {
  try {
    switch(requestOptions.method) {
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
        // POST /quotes
        if (requestOptions.path.startsWith('/quotes')) {
          const headers = _replaceHeaders({
            'accept': 'application/vnd.interoperability.iso20022.quotes+json;version=2.0',
            'content-type': 'application/vnd.interoperability.iso20022.quotes+json;version=2.0'
          }, requestOptions.headers)
          const body = await TransformFacades.FSPIOP.quotes.post(requestOptions.body)
          return {
            ...requestOptions,
            headers,
            body
          }
        }
        break
    }
  } catch(err) {
    console.log('Error transforming request', err)
  }
  return requestOptions
}

const callbackTransform = async (callbackOptions) => {
  try {
    switch(callbackOptions.method) {
      case 'put':
        // PUT /parties
        if (callbackOptions.path.startsWith('/parties')) {
          const headers = _replaceHeaders({
            'content-type': 'application/vnd.interoperability.parties+json;version=2.0'
          }, callbackOptions.headers)
          const body = await TransformFacades.FSPIOPISO20022.parties.put(callbackOptions.body)
          return {
            ...callbackOptions,
            body,
            headers
          }
        }
        break
    }
  } catch(err) {
    console.log('Error transforming callback', err)
  }
  return callbackOptions
}

module.exports = {
  requestTransform,
  callbackTransform
}
