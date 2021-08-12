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

const Cookies = require('cookies')
const passport = require('passport')
const Config = require('../config')
const fs = require('fs')
const path = require('path')
const customLogger = require('../requestLogger')

function cookieExtractor (req) {
  const cookies = new Cookies(req)
  const token = cookies.get('TTK-API_ACCESS_TOKEN')
  return token
}

/**
 * Creates a JWTStrategy to use with passport
 * @see http://www.passportjs.org/packages/passport-jwt/
 */
function createJwtStrategy (extraExtractors) {
  const systemConfig = Config.getSystemConfig()
  const JwtStrategy = require('passport-jwt').Strategy
  const ExtractJwt = require('passport-jwt').ExtractJwt

  const jwtStrategyOpts = {}
  let extractors = []
  if (extraExtractors) {
    if (Array.isArray(extraExtractors)) {
      extractors = extractors.concat(extraExtractors)
    } else {
      extractors.push(extraExtractors)
    }
  }
  extractors = extractors.concat([ExtractJwt.fromAuthHeaderAsBearerToken(), cookieExtractor])

  jwtStrategyOpts.jwtFromRequest = ExtractJwt.fromExtractors(extractors)

  jwtStrategyOpts.passReqToCallback = true // passReqToCallback: If true the request will be passed to the verify callback. i.e. verify(request, jwt_payload, done_callback).
  jwtStrategyOpts.jsonWebTokenOptions = {}
  let certContent
  if (systemConfig.OAUTH.EMBEDDED_CERTIFICATE) {
    customLogger.logMessage('info', 'Setting Token Issuer certificate from Constants.OAUTH.EMBEDDED_CERTIFICATE', { notification: false })
    certContent = systemConfig.OAUTH.EMBEDDED_CERTIFICATE
  } else if (systemConfig.OAUTH.CERTIFICATE_FILE_NAME) {
    customLogger.logMessage('info', `Setting Token Issuer certificate from Constants.OAUTH.CERTIFICATE_FILE_NAME: ${systemConfig.OAUTH.CERTIFICATE_FILE_NAME}`, { notification: false })
    if (systemConfig.OAUTH.CERTIFICATE_FILE_NAME.startsWith('/')) {
      customLogger.logMessage('info', 'Token Issuer Constants.OAUTH.CERTIFICATE_FILE_NAME absolute path', { notification: false })
      certContent = fs.readFileSync(systemConfig.OAUTH.CERTIFICATE_FILE_NAME, 'utf8')
    } else {
      customLogger.logMessage('info', 'Token Issuer Constants.OAUTH.CERTIFICATE_FILE_NAME relative path', { notification: false })
      certContent = fs.readFileSync(path.join(__dirname, '..', systemConfig.OAUTH.CERTIFICATE_FILE_NAME), 'utf8')
    }
  } else {
    customLogger.logMessage('warn', 'No value specified for Constants.OAUTH.CERTIFICATE_FILE_NAME or Constants.OAUTH.EMBEDDED_CERTIFICATE. Auth will probably fail to validate the tokens', { notification: false })
  }
  customLogger.logMessage('info', `Token Issuer loaded: ${certContent}`, { notification: false })

  jwtStrategyOpts.secretOrKeyProvider = (request, rawJwtToken, done) => {
    done(null, certContent)
  }
  // jwtStrategyOpts.issuer = 'accounts.examplesoft.com'
  jwtStrategyOpts.audience = systemConfig.OAUTH.APP_OAUTH_CLIENT_KEY // audience: If defined, the token audience (aud) will be verified against this value.
  const jwtStrategy = new JwtStrategy(jwtStrategyOpts, verifyCallback)
  return jwtStrategy
}

/**
 * Verifies the basic jwtPayload parameters, whatever it is needed before checking for the specific permissions
 * requested by the req
 *
 * This validates the issuer, sub, that the jwt has groups, and the creates a client and authInfo and calls the callback
 *
 * @param {Request} req http request
 * @param {Object} jwtPayload JWT Payload as an Object
 * @param {function(err, client|false, authInfo)} done callback called with the verification results
 */
function verifyCallback (req, jwtPayload, done) {
  if (!jwtPayload.sub) {
    const message = 'Invalid Authentication info: no sub'
    customLogger.logMessage('error', `OAuthHelper.verifyCallback received ${jwtPayload}. Verification failed because ${message}`, { notification: false })
    return done(null, false, message)
  }
  if (!jwtPayload.iss) {
    const message = 'Invalid Authentication info: no iss'
    customLogger.logMessage('error', `OAuthHelper.verifyCallback received ${jwtPayload}. Verification failed because ${message}`, { notification: false })
    return done(null, false, message)
  }
  const systemConfig = Config.getSystemConfig()
  if (jwtPayload.iss !== systemConfig.OAUTH.OAUTH2_ISSUER && jwtPayload.iss !== systemConfig.OAUTH.OAUTH2_TOKEN_ISS) {
    const message = `Invalid Authentication: wrong issuer ${jwtPayload.iss}, expecting: ${systemConfig.OAUTH.OAUTH2_ISSUER} or ${systemConfig.OAUTH.OAUTH2_TOKEN_ISS}`
    customLogger.logMessage('error', `OAuthHelper.verifyCallback received ${jwtPayload}. Verification failed because ${message}`, { notification: false })
    return done(null, false, message)
  }
  if (!jwtPayload.groups) {
    const message = 'Invalid Authentication info: no groups'
    customLogger.logMessage('error', `OAuthHelper.verifyCallback received ${jwtPayload}. Verification failed because ${message}`, { notification: false })
    return done(null, false, message)
  }
  const foundMTA = jwtPayload.groups.includes(systemConfig.OAUTH.MTA_ROLE)
  const foundPTA = jwtPayload.groups.includes(systemConfig.OAUTH.PTA_ROLE)
  const foundEveryone = jwtPayload.groups.includes(systemConfig.OAUTH.EVERYONE_ROLE)
  const client = { name: jwtPayload.sub, dfspId: jwtPayload.dfspId }
  const roles = { mta: foundMTA, pta: foundPTA, everyone: foundEveryone }
  for (const group of jwtPayload.groups) {
    roles[group] = true
  }
  const authInfo = { roles: roles }
  return done(null, client, authInfo)
}

/**
 * Creates a passport OAUth2 authenticating middleware
 *
 * @returns a connect middleware that handles OAuth2
 */
function getOAuth2Middleware () {
  const jwtStrategy = createJwtStrategy()
  passport.use(jwtStrategy)
}

const handleMiddleware = () => {
  if (Config.getSystemConfig().OAUTH.AUTH_ENABLED) {
    customLogger.logMessage('info', 'Enabling OAUTH', { notification: false })
    getOAuth2Middleware()
  } else {
    customLogger.logMessage('info', 'NOT enabling OAUTH', { notification: false })
  }
}

/**
 * Validates that the user has the required permissions to execute the operation.
 *
 * callback accepts one
 * argument - an Error if unauthorized. The Error may include "message",
 * "state", and "code" fields to be conveyed to the client in the response
 * body and a "headers" field containing an object representing headers
 * to be set on the response to the client. In addition, if the Error has
 * a statusCode field, the response statusCode will be set to match -
 * otherwise, the statusCode will be set to 403.
 *
 * @param {Request} req HTTP request. req.user and req.authInfo come from the passport verify callback (`return done(null, client, authInfo)`)
 * @param {SecurityDefiniton} securityDefinition SecurityDefiniton from the swagger doc
 * @param {String} scopes scopes required for this operation from the operation definition in the Swagger doc. Same as req.swagger.security[0].OAuth2
 * @param {(error)} callback function to call with the result. If unauthorized, send the error.
 */

module.exports = {
  getOAuth2Middleware,
  handleMiddleware,
  cookieExtractor,
  createJwtStrategy,
  verifyCallback
}
