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
let Config
const fs = require('fs')
const path = require('path')

function cookieExtractor (req) {
  const Constants = Config.getSystemConfig()
  const cookies = new Cookies(req)
  const token = cookies.get(Constants.OAUTH.JWT_COOKIE_NAME)
  return token
}

/**
 * Creates a JWTStrategy to use with passport
 * @see http://www.passportjs.org/packages/passport-jwt/
 */
function createJwtStrategy (extraExtractors) {
  const Constants = Config.getSystemConfig()
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
  if (Constants.OAUTH.EMBEDDED_CERTIFICATE) {
    console.log('Setting Token Issuer certificate from Constants.OAUTH.EMBEDDED_CERTIFICATE')
    certContent = Constants.OAUTH.EMBEDDED_CERTIFICATE
  } else if (Constants.OAUTH.CERTIFICATE_FILE_NAME) {
    console.log(`Setting Token Issuer certificate from Constants.OAUTH.CERTIFICATE_FILE_NAME: ${Constants.OAUTH.CERTIFICATE_FILE_NAME}`)
    if (Constants.OAUTH.CERTIFICATE_FILE_NAME.startsWith('/')) {
      console.log('Token Issuer Constants.OAUTH.CERTIFICATE_FILE_NAME absolute path')
      certContent = fs.readFileSync(Constants.OAUTH.CERTIFICATE_FILE_NAME, 'utf8')
    } else {
      console.log('Token Issuer Constants.OAUTH.CERTIFICATE_FILE_NAME relative path')
      certContent = fs.readFileSync(path.join(__dirname, '..', Constants.OAUTH.CERTIFICATE_FILE_NAME), 'utf8')
    }
  } else {
    console.warn('No value specified for Constants.OAUTH.CERTIFICATE_FILE_NAME or Constants.OAUTH.EMBEDDED_CERTIFICATE. Auth will probably fail to validate the tokens')
  }
  console.log(`Token Issuer loaded: ${certContent}`)

  jwtStrategyOpts.secretOrKeyProvider = (request, rawJwtToken, done) => {
    done(null, certContent)
  }
  // jwtStrategyOpts.issuer = 'accounts.examplesoft.com'
  jwtStrategyOpts.audience = Constants.OAUTH.APP_OAUTH_CLIENT_KEY // audience: If defined, the token audience (aud) will be verified against this value.
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
    console.log(`OAuthHelper.verifyCallback received ${jwtPayload}. Verification failed because ${message}`)
    return done(null, false, message)
  }
  if (!jwtPayload.iss) {
    const message = 'Invalid Authentication info: no iss'
    console.log(`OAuthHelper.verifyCallback received ${jwtPayload}. Verification failed because ${message}`)
    return done(null, false, message)
  }
  const issuer = jwtPayload.iss
  const Constants = Config.getSystemConfig()
  if (issuer !== Constants.OAUTH.OAUTH2_ISSUER && issuer !== Constants.OAUTH.OAUTH2_TOKEN_ISS) {
    const message = `Invalid Authentication: wrong issuer ${issuer}, expecting: ${Constants.OAUTH.OAUTH2_ISSUER} or ${Constants.OAUTH.OAUTH2_TOKEN_ISS}`
    console.log(`OAuthHelper.verifyCallback received ${jwtPayload}. Verification failed because ${message}`)
    return done(null, false, message)
  }
  if (!jwtPayload.groups) {
    const message = 'Invalid Authentication info: no groups'
    console.log(`OAuthHelper.verifyCallback received ${jwtPayload}. Verification failed because ${message}`)
    return done(null, false, message)
  }
  const foundMTA = jwtPayload.groups.includes(Constants.OAUTH.MTA_ROLE)
  const foundPTA = jwtPayload.groups.includes(Constants.OAUTH.PTA_ROLE)
  const foundEveryone = jwtPayload.groups.includes(Constants.OAUTH.EVERYONE_ROLE)
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
  Config = require('../config')
  if (Object.keys(Config.getSystemConfig()).length === 0) {
    Config.loadSystemConfigMiddleware()
  }
  const Constants = Config.getSystemConfig()
  if (Constants.OAUTH.AUTH_ENABLED) {
    console.log(`Enabling OAUTH. Constants.OAUTH.AUTH_ENABLED = ${Constants.OAUTH.AUTH_ENABLED}`)
    getOAuth2Middleware()
  } else {
    console.log(`NOT enabling OAUTH. Constants.OAUTH.AUTH_ENABLED = ${Constants.OAUTH.AUTH_ENABLED}`)
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
