/*****
 License
 --------------
 Copyright © 2020-2025 Mojaloop Foundation
 The Mojaloop files are made available by the Mojaloop Foundation under the Apache License, Version 2.0 (the "License") and you may not use these files except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, the Mojaloop files are distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

 Contributors
 --------------
 This is the official list of the Mojaloop project contributors for this file.
 Names of the original copyright holders (individuals or organizations)
 should be listed with a '*' in the first column. People who have
 contributed from an organization can be listed under the organization
 that actually holds the copyright for their contributions (see the
 Mojaloop Foundation for an example). Those individuals should have
 their names indented and be marked with a '-'. Email address can be added
 optionally within square brackets <email>.

 * Mojaloop Foundation
 - Name Surname <name.surname@mojaloop.io>

 * ModusBox
 * Vijaya Kumar Guthi <vijaya.guthi@modusbox.com> (Original Author)
 --------------
 ******/

// const config = {}

const Config = require('../config')
const { Jws } = require('@mojaloop/sdk-standard-components')
const ConnectionProvider = require('../configuration-providers/mb-connection-manager')
const atob = require('atob')

const validate = async (req) => {
  const userConfig = await Config.getUserConfig()
  if (userConfig.VALIDATE_INBOUND_JWS) {
    if (req.method === 'get') {
      return false
    }
    if (req.method === 'put' && req.path.startsWith('/parties/') && !userConfig.VALIDATE_INBOUND_PUT_PARTIES_JWS) {
      return false
    }

    const certificate = await ConnectionProvider.getUserDfspJWSCerts(req.headers['fspiop-source'])
    return validateWithCert(req.headers, req.payload, certificate)
  }
}

const validateWithCert = (headers, body, certificate) => {
  const reqOpts = {
    headers,
    body,
    resolveWithFullResponse: true,
    simple: false
  }
  const keys = {}
  keys[headers['fspiop-source']] = certificate

  const jwsValidator = new Jws.validator({ // eslint-disable-line
    validationKeys: keys
  })

  try {
    jwsValidator.validate(reqOpts)
    return true
  } catch (err) {
    throw new Error(err.toString())
  }
}

const validateProtectedHeaders = (headers) => {
  if (!headers['fspiop-signature']) {
    throw new Error('fspiop-signature is missing in the headers')
  }
  const { protectedHeader } = JSON.parse(headers['fspiop-signature'])
  const decodedProtectedHeader = JSON.parse(atob(protectedHeader))
  const jwsValidator = new Jws.validator({ // eslint-disable-line
    validationKeys: []
  })
  jwsValidator._validateProtectedHeader(headers, decodedProtectedHeader)
  return true
}

const sign = async (req) => {
  const userConfig = await Config.getUserConfig()
  if (userConfig.JWS_SIGN) {
    if (req.method === 'get') {
      return false
    }

    if (req.method === 'put' && req.path.startsWith('/parties/') && !userConfig.JWS_SIGN_PUT_PARTIES) {
      return false
    }
    const jwsSigningKey = await ConnectionProvider.getTestingToolkitDfspJWSPrivateKey()
    return signWithKey(req, jwsSigningKey)
  }
}

const signWithKey = (req, jwsSigningKey) => {
  const jwsSigner = new Jws.signer({ // eslint-disable-line
    signingKey: jwsSigningKey
  })
  const reqOpts = {
    method: req.method,
    uri: req.url,
    headers: req.headers,
    body: JSON.stringify(req.data),
    agent: 'testingtoolkit',
    resolveWithFullResponse: true,
    simple: false
  }
  if (reqOpts.headers['FSPIOP-Source']) {
    reqOpts.headers['fspiop-source'] = reqOpts.headers['FSPIOP-Source']
    delete reqOpts.headers['FSPIOP-Source']
  }
  if (reqOpts.headers['FSPIOP-Destination']) {
    reqOpts.headers['fspiop-destination'] = reqOpts.headers['FSPIOP-Destination']
    delete reqOpts.headers['FSPIOP-Destination']
  }
  delete reqOpts.headers['FSPIOP-Signature']
  delete reqOpts.headers['FSPIOP-URI']
  delete reqOpts.headers['FSPIOP-HTTP-Method']

  try {
    jwsSigner.sign(reqOpts)
    return true
  } catch (err) {
    throw new Error(err.toString())
  }
}

module.exports = {
  validate,
  validateWithCert,
  validateProtectedHeaders,
  sign,
  signWithKey
}
