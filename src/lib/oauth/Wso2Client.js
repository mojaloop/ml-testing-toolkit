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
const rp = require('request-promise-native')
const customLogger = require('../requestLogger')

exports.getToken = async (username, password) => {
  const form = {
    username: username,
    password: password,
    scope: 'openid',
    grant_type: 'password'
  }

  try {
    const Constants = Config.getSystemConfig()
    const url = Constants.OAUTH.OAUTH2_ISSUER
    const loginResponse = await rp.post(url).form(form).auth(Constants.OAUTH.APP_OAUTH_CLIENT_KEY, Constants.OAUTH.APP_OAUTH_CLIENT_SECRET) // MP-757
    customLogger.logMessage('info', `Wso2Client.getToken received ${loginResponse}`, { notification: false })
    const loginResponseObj = JSON.parse(loginResponse)
    return loginResponseObj
  } catch (error) {
    if (error && error.statusCode === 400 && error.message.includes('Authentication failed')) {
      throw new Error(`Authentication failed for user ${username}`, error.error)
    }
    throw error
  }
}
