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
 * Georgi Logodazhki <georgi.logodazhki@modusbox.com> (Original Author)
 --------------
 ******/

'use strict'
const Config = require('../config')
const Cookies = require('cookies')
const jwt = require('jsonwebtoken')
const wso2Client = require('./Wso2Client')
const customLogger = require('../requestLogger')

/**
 * Logs the user in.
 * If successful, sets the JWT token in a cookie and returns the token payload
 */
exports.loginUser = async function (username, password, req, res) {
  if (!Config.getSystemConfig().OAUTH.AUTH_ENABLED) {
    return {
      ok: false,
      token: {
        payload: {
          at_hash: null,
          aud: null,
          sub: null,
          nbf: 0,
          azp: null,
          amr: [],
          iss: null,
          groups: [],
          exp: 0,
          iat: 0,
          dfspId: null
        }
      }
    }
  }
  try {
    const loginResponseObj = await wso2Client.getToken(username, password)

    const decodedIdToken = jwt.decode(loginResponseObj.id_token)

    const response = buildJWTResponse(decodedIdToken, loginResponseObj.access_token, loginResponseObj.expires_in, req, res)

    return response
  } catch (error) {
    customLogger.logMessage('error', 'login user failed', error)
    if (error && error.statusCode === 400 && error.message.includes('Authentication failed')) {
      throw new Error(`Authentication failed for user ${username}`, error.error)
    }
    throw error
  }
}

const buildJWTResponse = (decodedIdToken, accessToken, expiresIn, req, res) => {
  // If the user is a DFSP admin, set the dfspId so the UI can send it
  let dfspId = null
  if (decodedIdToken.dfspId != null) {
    dfspId = decodedIdToken.dfspId
  } else {
    // Get the DFSP id from the Application/DFSP: group
    const groups = decodedIdToken.groups
    for (const group of groups) {
      const groupMatchResult = group.match(/^Application\/DFSP:(.*)$/)
      if (groupMatchResult == null || !Array.isArray(groupMatchResult)) {
        continue
      }
      dfspId = groupMatchResult[1]
      customLogger.logMessage('info', `${dfspId} found in ${group} group`)
      break // FIXME only returns the first ( there should be only one ). May report an error if there's more than one Application/DFSP group ?
    }
  }

  decodedIdToken.dfspId = dfspId

  const cookies = new Cookies(req, res)
  const cookieOptions = { maxAge: expiresIn * 1000, httpOnly: true, sameSite: 'strict' } // secure is automatic based on HTTP or HTTPS used
  cookies.set(Config.getSystemConfig().OAUTH.JWT_COOKIE_NAME, accessToken, cookieOptions)
  return {
    ok: true,
    token: {
      payload: {
        maxAge: expiresIn,
        ...decodedIdToken
      }
    }
  }
}

/**
 * Logs the user out.
 */
exports.logoutUser = async function (req, res) {
  const cookies = new Cookies(req, res)
  cookies.set(Config.getSystemConfig().OAUTH.JWT_COOKIE_NAME)
}
