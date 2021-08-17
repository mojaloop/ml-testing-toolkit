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
 * Vijay Kumar Guthi <vijaya.guthi@modusbox.com> (Original Author)
 --------------
 ******/

const Config = require('../config')
const fs = require('fs')
const path = require('path')
const customLogger = require('../requestLogger')
const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const readFileAsync = promisify(fs.readFile)

const verifyToken = async (token) => {
  const systemConfig = Config.getSystemConfig()

  let certContent
  if (systemConfig.OAUTH.EMBEDDED_CERTIFICATE) {
    customLogger.logMessage('info', 'Setting Token Issuer certificate from Constants.OAUTH.EMBEDDED_CERTIFICATE', { notification: false })
    certContent = systemConfig.OAUTH.EMBEDDED_CERTIFICATE
  } else if (systemConfig.OAUTH.CERTIFICATE_FILE_NAME) {
    customLogger.logMessage('info', `Setting Token Issuer certificate from Constants.OAUTH.CERTIFICATE_FILE_NAME: ${systemConfig.OAUTH.CERTIFICATE_FILE_NAME}`, { notification: false })
    if (systemConfig.OAUTH.CERTIFICATE_FILE_NAME.startsWith('/')) {
      customLogger.logMessage('info', 'Token Issuer Constants.OAUTH.CERTIFICATE_FILE_NAME absolute path', { notification: false })
      certContent = await readFileAsync(systemConfig.OAUTH.CERTIFICATE_FILE_NAME, 'utf8')
    } else {
      customLogger.logMessage('info', 'Token Issuer Constants.OAUTH.CERTIFICATE_FILE_NAME relative path', { notification: false })
      certContent = await readFileAsync(path.join(__dirname, '..', systemConfig.OAUTH.CERTIFICATE_FILE_NAME), 'utf8')
    }
  } else {
    customLogger.logMessage('warn', 'No value specified for Constants.OAUTH.CERTIFICATE_FILE_NAME or Constants.OAUTH.EMBEDDED_CERTIFICATE. Auth will probably fail to validate the tokens', { notification: false })
  }
  customLogger.logMessage('info', `Token Issuer loaded: ${certContent}`, { notification: false })

  const jwtOpts = {}
  // jwtOpts.audience = systemConfig.OAUTH.APP_OAUTH_CLIENT_KEY // audience: If defined, the token audience (aud) will be verified against this value.
  // const jwtStrategy = new JwtStrategy(jwtOpts, verifyCallback)
  const jwtPayload = await promisify(jwt.verify)(token, certContent, jwtOpts)
  additionalVerification(jwtPayload)
  const dfspId = getDfspIdFromClientToken(jwtPayload)
  return {
    dfspId,
    decodedToken: jwtPayload
  }
}

// function getDfspIdFromUserToken (jwtPayload) {
//   let dfspId = null
//   if (jwtPayload.dfspId) {
//     dfspId = jwtPayload.dfspId
//   } else {
//     const dfspGroup = jwtPayload.groups.find(groupName => groupName.startsWith('Application/DFSP:'))
//     if (dfspGroup) {
//       dfspId = dfspGroup.replace('Application/DFSP:', '')
//     }
//   }
//   return dfspId
// }

function getDfspIdFromClientToken (jwtPayload) {
  return jwtPayload.clientId
}

function additionalVerification (jwtPayload) {
  if (!jwtPayload.sub) {
    const message = 'Invalid Authentication info: no sub'
    customLogger.logMessage('error', `OAuthHelper.verifyCallback received ${jwtPayload}. Verification failed because ${message}`, { notification: false })
    throw (new Error(message))
  }
  if (!jwtPayload.iss) {
    const message = 'Invalid Authentication info: no iss'
    customLogger.logMessage('error', `OAuthHelper.verifyCallback received ${jwtPayload}. Verification failed because ${message}`, { notification: false })
    throw (new Error(message))
  }
  // const systemConfig = Config.getSystemConfig()
  // if (jwtPayload.iss !== systemConfig.OAUTH.OAUTH2_ISSUER && jwtPayload.iss !== systemConfig.OAUTH.OAUTH2_TOKEN_ISS) {
  //   const message = `Invalid Authentication: wrong issuer ${jwtPayload.iss}, expecting: ${systemConfig.OAUTH.OAUTH2_ISSUER} or ${systemConfig.OAUTH.OAUTH2_TOKEN_ISS}`
  //   customLogger.logMessage('error', `OAuthHelper.verifyCallback received ${jwtPayload}. Verification failed because ${message}`, { notification: false })
  //   throw (new Error(message))
  // }
  // if (!jwtPayload.groups) {
  //   const message = 'Invalid Authentication info: no groups'
  //   customLogger.logMessage('error', `OAuthHelper.verifyCallback received ${jwtPayload}. Verification failed because ${message}`, { notification: false })
  //   throw (new Error(message))
  // }
  if (!jwtPayload.clientId) {
    const message = 'There is no clientId specified'
    customLogger.logMessage('error', `OAuthHelper.verifyCallback received ${jwtPayload}. Verification failed because ${message}`, { notification: false })
    throw (new Error(message))
  }
}

module.exports = {
  verifyToken
}
