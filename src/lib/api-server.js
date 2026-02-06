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
 * Georgi Logodazhki <georgi.logodazhki@modusbox.com>
 * Vijaya Kumar Guthi <vijaya.guthi@modusbox.com> (Original Author)
 --------------
 ******/
const express = require('express')
const app = express()
const http = require('http').Server(app)
const customLogger = require('./requestLogger')
const Config = require('./config')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const util = require('util')
const path = require('path')
const fs = require('fs')
const cors = require('cors')
const OAuthHelper = require('./oauth/OAuthHelper')

const initServer = () => {
  // For CORS policy
  app.use(cors({
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    exposedHeaders: ['Content-Disposition'],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    origin: true,
    credentials: true
  }))

  // For parsing incoming JSON requests
  app.use(express.json({ limit: '50mb' }))
  app.use(express.urlencoded({ extended: true }))

  // For oauth
  app.use(cookieParser())
  OAuthHelper.handleMiddleware()

  // Metrics
  app.use(require('./metrics')(Config.getSystemConfig().METRICS))

  const verifyUserMiddleware = verifyUser()
  // For admin API
  app.use('/api/rules', verifyUserMiddleware, require('./api-routes/rules'))
  app.use('/api/openapi', verifyUserMiddleware, require('./api-routes/openapi'))
  app.use('/api/outbound', verifyUserMiddleware, require('./api-routes/outbound'))
  app.use('/api/config', verifyUserMiddleware, require('./api-routes/config'))
  app.use('/longpolling', verifyUserMiddleware, require('./api-routes/longpolling'))
  app.use('/api/oauth2', require('./api-routes/oauth2'))
  app.use('/api/keycloak', verifyUserMiddleware, require('./api-routes/keycloak'))
  app.use('/api/reports', verifyUserMiddleware, require('./api-routes/reports'))
  app.use('/api/settings', verifyUserMiddleware, require('./api-routes/settings'))
  app.use('/api/samples', verifyUserMiddleware, require('./api-routes/samples'))
  app.use('/api/objectstore', verifyUserMiddleware, require('./api-routes/objectstore'))
  app.use('/api/history', verifyUserMiddleware, require('./api-routes/history'))
  app.use('/api/serverlogs', verifyUserMiddleware, require('./api-routes/server-logs'))

  // For front-end UI
  if (fs.existsSync(path.join('public_html'))) {
    customLogger.logMessage('info', 'Folder public_html found: Serving Static Web UI', { notification: false })
    // app.use('*.(jpg|jpeg|gif|png|ico|cur|gz|svg|svgz|mp4|ogg|ogv|webm|htc|css|js)', express.static(path.join('public_html')))
    app.use(express.static(path.join('public_html')))
    app.get('*', (req, res) => {
      res.sendFile(process.cwd() + '/public_html/index.html')
    })
  } else {
    customLogger.logMessage('warn', 'Folder public_html not found', { notification: false })
  }
}

const startServer = port => {
  initServer()
  http.listen(port)
  customLogger.logMessage('info', 'API Server started on port ' + port, { notification: false })
}

const stopServer = port => {
  // Clean up performance caches and context pools
  try {
    const perfOptimizer = require('./performanceOptimizer')
    perfOptimizer.clearAllCaches()

    // Clean up context pools
    const postmanContext = require('./scripting-engines/postman-sandbox')
    if (postmanContext.cleanupContextPool) {
      postmanContext.cleanupContextPool()
    }

    const javascriptContext = require('./scripting-engines/vm-javascript-sandbox')
    if (javascriptContext.cleanupContextPool) {
      javascriptContext.cleanupContextPool()
    }

    // Stop interval timers
    const arrayStore = require('./arrayStore')
    if (arrayStore.stopArrayStore) {
      arrayStore.stopArrayStore()
    }

    const objectStore = require('./objectStore')
    if (objectStore.stopObjectStore) {
      objectStore.stopObjectStore()
    }

    const httpAgentStore = require('./httpAgentStore')
    if (httpAgentStore.stop) {
      httpAgentStore.stop()
    }
  } catch (err) {
    customLogger.logMessage('warn', 'Error during cleanup', { additionalData: err.message })
  }

  http.close()
  customLogger.logMessage('info', 'API Server stopped', { notification: false })
}

const getApp = () => {
  if (!Object.prototype.hasOwnProperty.call(app, '_router')) { // To check whether app is initialized or not
    initServer()
  }
  return app
}
const getHttp = () => {
  return http
}

const verifyUser = () => {
  if (Config.getSystemConfig().OAUTH.AUTH_ENABLED) {
    return (req, res, next) => {
      req.session = {}
      passport.authenticate('jwt', { session: false, failureMessage: true })(req, res, next)
      // failWithError: true returns awful html error. , failureMessage: True to store failure message in req.session.messages, or a string to use as override message for failure.
      if (res.statusCode === 401) {
        customLogger.logMessage('error', `Unable to authenticate with passport.authenticate - ${util.inspect(req.session.messages)}`, { additionalData: req.session.messages, notification: false })
      }
    }
    // return passport.authenticate('jwt', { session: false, failWithError: true })
  }
  return (req, res, next) => { next() }
}

module.exports = {
  startServer,
  stopServer,
  getHttp,
  getApp,
  verifyUser
}
