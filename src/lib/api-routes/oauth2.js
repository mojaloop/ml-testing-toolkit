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

const express = require('express')
const router = new express.Router()
const jwt = require('jsonwebtoken')
const Config = require('../config')

router.post('/token', async (req, res, next) => {
  try {
    let userDfspId = 'userdfsp'
    if (Config.getSystemConfig().HOSTING_ENABLED) {
      // Check whether the DFSP exists in mock list
      const dfspDB = require('../db/dfspMockUsers')
      const dfspValid = await dfspDB.checkDFSP(req.body.username)
      if (!dfspValid) {
        throw (new Error('Invalid DFSP ID'))
      }
      userDfspId = req.body.username
    }
    const idToken = jwt.sign(
      {
        at_hash: 'bJi28CeD9HLPf1ouOVkQTA',
        aud: 'CLIENT_KEY',
        sub: 'dfsp1',
        nbf: 1558709500,
        azp: 'CLIENT_KEY',
        amr: [
          'password'
        ],
        iss: 'https://SERVERIP:9443/oauth2/token',
        groups: [
          'Application/MTA',
          'Application/DFSP:DFSP1',
          'Internal/everyone'
        ],
        exp: 1558713100,
        iat: 1558709500,
        dfspId: userDfspId,
        userguid: 'userguid'
      }
      , 'password')
    res.status(200).json(
      {
        access_token: 'sometoken',
        id_token: idToken
      }
    )
  } catch (err) {
    next(err)
  }
})

module.exports = router
