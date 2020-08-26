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
 * Georgi Logodazhki <georgi.logodazhki@modusbox.com>
 * Vijaya Kumar Guthi <vijaya.guthi@modusbox.com> (Original Author)
 --------------
 ******/

const express = require('express')
const router = new express.Router()
const jwt = require('jsonwebtoken')
const Config = require('../config')
const LoginService = require('../oauth/LoginService')
const { verifyUser } = require('../api-server')

router.post('/login', async (req, res, next) => {
  try {
    const response = await LoginService.loginUser(req.body.username, req.body.password, req, res)
    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
})

router.get('/logout', verifyUser(), async (req, res, next) => {
  try {
    await LoginService.logoutUser(req, res)
    res.status(200).json({ message: 'logout successful' })
  } catch (err) {
    next(err)
  }
})

router.post('/token', async (req, res, next) => {
  try {
    const plainIdToken = {
      username: req.body.username,
      userguid: 'userguid'
    }
    let groupsData = [
      'Application/MTA',
      'Application/DFSP:' + req.body.username,
      'Internal/everyone'
    ]
    const systemConfig = Config.getSystemConfig()
    const userConfig = await Config.getUserConfig()
    if (req.body.username === userConfig.CONNECTION_MANAGER_HUB_USERNAME) {
      plainIdToken.dfspId = req.body.username
      groupsData = [
        'Application/PTA',
        'Internal/everyone'
      ]
    } else if (systemConfig.HOSTING_ENABLED) {
      // Check whether the DFSP exists in mock list
      const dfspDB = require('../db/dfspMockUsers')
      const dfspValid = await dfspDB.checkDFSP(req.body.username)
      if (!dfspValid) {
        throw (new Error('Invalid DFSP ID'))
      }
      plainIdToken.dfspId = req.body.username
    }
    const expiresIn = 3600
    const iat = Date.now() / 1000
    const plainAccessToken = {
      exp: iat + expiresIn,
      iat: iat,
      aud: systemConfig.OAUTH.APP_OAUTH_CLIENT_KEY,
      sub: plainIdToken.username,
      iss: systemConfig.OAUTH.OAUTH2_ISSUER,
      groups: groupsData,
      dfspId: plainIdToken.dfspId,
      userguid: plainIdToken.userguid
    }
    res.status(200).json({
      expires_in: expiresIn,
      access_token: jwt.sign(plainAccessToken, systemConfig.OAUTH.EMBEDDED_CERTIFICATE),
      id_token: jwt.sign(plainIdToken, systemConfig.OAUTH.EMBEDDED_CERTIFICATE)
    })
  } catch (err) {
    next(err)
  }
})

// router.post('/token', async (req, res, next) => {
//   try {
//     let userDfspId = 'userdfsp'
//     if (Config.getSystemConfig().HOSTING_ENABLED) {
//       // Check whether the DFSP exists in mock list
//       const dfspDB = require('../db/dfspMockUsers')
//       const dfspValid = await dfspDB.checkDFSP(req.body.username)
//       if (!dfspValid) {
//         throw (new Error('Invalid DFSP ID'))
//       }
//       userDfspId = req.body.username
//     }
//     const idToken = jwt.sign(
//       {
//         at_hash: 'bJi28CeD9HLPf1ouOVkQTA',
//         aud: 'CLIENT_KEY',
//         sub: 'dfsp1',
//         nbf: 1558709500,
//         azp: 'CLIENT_KEY',
//         amr: [
//           'password'
//         ],
//         iss: 'https://SERVERIP:9443/oauth2/token',
//         groups: [
//           'Application/MTA',
//           'Application/DFSP:DFSP1',
//           'Internal/everyone'
//         ],
//         exp: 1558713100,
//         iat: 1558709500,
//         dfspId: userDfspId,
//         userguid: 'userguid'
//       }
//       , 'password')
//     res.status(200).json(
//       {
//         access_token: 'sometoken',
//         id_token: idToken
//       }
//     )
//   } catch (err) {
//     next(err)
//   }
// })

module.exports = router
