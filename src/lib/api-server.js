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
const app = express()
const http = require('http').Server(app)
const socketIO = require('socket.io')(http)
const OAuthHelper = require('./oauth/OAuthHelper')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const util = require('util')

const initServer = () => {
  const Config = require('./config')
  if (Object.keys(Config.getSystemConfig()).length === 0) {
    Config.loadSystemConfigMiddleware()
  }

  // For CORS policy
  app.use((req, res, next) => {
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )
    res.setHeader(
      'Access-Control-Expose-Headers',
      'Content-Disposition'
    )
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PATCH, PUT, DELETE, OPTIONS'
    )
    setOriginHeader(req, res)
    next()
  })

  // For parsing incoming JSON requests
  app.use(express.json({ limit: '50mb' }))
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser())
  // For oauth
  OAuthHelper.handleMiddleware()

  // For admin API
  app.use('/api/rules', verifyUser(), require('./api-routes/rules'))
  app.use('/api/openapi', verifyUser(), require('./api-routes/openapi'))
  app.use('/api/outbound', verifyUser(), require('./api-routes/outbound'))
  app.use('/api/config', verifyUser(), require('./api-routes/config'))
  app.use('/longpolling', verifyUser(), require('./api-routes/longpolling'))
  app.use('/api/oauth2', require('./api-routes/oauth2'))
  app.use('/api/reports', verifyUser(), require('./api-routes/reports'))
  app.use('/api/settings', verifyUser(), require('./api-routes/settings'))
  app.use('/api/samples', verifyUser(), require('./api-routes/samples'))
  app.use('/api/objectstore', verifyUser(), require('./api-routes/objectstore'))

  // // For front-end UI
  // app.use('/ui', express.static(path.join('client/build')))

  // app.get('*', (req, res) => {
  //   res.sendFile(process.cwd() + '/client/build/index.html')
  // })
}

const startServer = port => {
  initServer()
  http.listen(port)
  console.log('API Server started on port ' + port)
}

const getApp = () => {
  if (!Object.prototype.hasOwnProperty.call(app, '_router')) { // To check whether app is initialized or not
    initServer()
  }
  return app
}

const verifyUser = () => {
  const Config = require('./config')
  if (Config.getSystemConfig().OAUTH.AUTH_ENABLED) {
    return (req, res, next) => {
      req.session = {}
      passport.authenticate('jwt', { session: false, failureMessage: true })(req, res, next)
      // failWithError: true returns awful html error. , failureMessage: True to store failure message in req.session.messages, or a string to use as override message for failure.
      if (res.statusCode === 401) {
        const customLogger = require('./requestLogger')
        customLogger.logMessage('error', `Unable to authenticate with passport.authenticate - ${util.inspect(req.session.messages)}`, req.session.messages, false)
      }
    }
    // return passport.authenticate('jwt', { session: false, failWithError: true })
  }
  return (req, res, next) => { next() }
}

const setOriginHeader = (req, res) => {
  const Config = require('./config')
  if (Config.getSystemConfig().OAUTH.AUTH_ENABLED) {
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Origin', Config.getSystemConfig().OAUTH.ORIGIN)
    if (req.method === 'OPTIONS') {
      res.send(200)
    }
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*')
  }
}
module.exports = {
  startServer,
  socketIO,
  getApp,
  verifyUser,
  setOriginHeader
}
