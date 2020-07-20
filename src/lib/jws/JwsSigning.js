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

// const config = {}

const Config = require('../config')
const { Jws } = require('@mojaloop/sdk-standard-components')
const ConnectionProvider = require('../configuration-providers/mb-connection-manager')

const validate = async (req) => {
  if (Config.getUserConfig().VALIDATE_INBOUND_JWS) {
    if (req.method === 'get') {
      return false
    }
    if (req.method === 'put' && req.path.startsWith('/parties/') && !Config.getUserConfig().VALIDATE_INBOUND_PUT_PARTIES_JWS) {
      return false
    }
    const reqOpts = {
      method: req.method,
      headers: req.headers,
      body: req.payload,
      resolveWithFullResponse: true,
      simple: false
    }
    const keys = {}
    keys[req.headers['fspiop-source']] = await ConnectionProvider.getUserDfspJWSCerts(req.headers['fspiop-source'])
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
}

const sign = async (req) => {
  if (Config.getUserConfig().JWS_SIGN) {
    if (req.method === 'get') {
      return false
    }

    if (req.method === 'put' && req.path.startsWith('/parties/') && !Config.getUserConfig().JWS_SIGN_PUT_PARTIES) {
      return false
    }
    const jwsSigningKey = await ConnectionProvider.getTestingToolkitDfspJWSPrivateKey()
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
    reqOpts.headers['fspiop-source'] = reqOpts.headers['FSPIOP-Source']
    if (reqOpts.headers['FSPIOP-Destination']) {
      reqOpts.headers['fspiop-destination'] = reqOpts.headers['FSPIOP-Destination']
      delete reqOpts.headers['FSPIOP-Destination']
    }
    delete reqOpts.headers['FSPIOP-Source']
    delete reqOpts.headers['FSPIOP-Signature']
    delete reqOpts.headers['FSPIOP-URI']
    delete reqOpts.headers['FSPIOP-HTTP-Method']

    try {
      jwsSigner.sign(reqOpts)
      return true
    } catch (err) {
      // console.log(err.message)
      throw new Error(err.toString())
    }
  }
}

module.exports = {
  validate,
  sign
}
