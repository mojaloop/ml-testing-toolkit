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
const app = express()
const http = require('http').Server(app)
const socketIO = require('socket.io')(http)

const initServer = () => {
  // For CORS policy
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PATCH, PUT, DELETE, OPTIONS'
    )
    next()
  })

  // For parsing incoming JSON requests
  app.use(express.json())

  // For admin API
  app.use('/api/rules', require('./api-routes/rules'))
  app.use('/api/openapi', require('./api-routes/openapi'))
  app.use('/api/outbound', require('./api-routes/outbound'))
  app.use('/api/config', require('./api-routes/config'))
  app.use('/longpolling', require('./api-routes/longpolling'))

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

module.exports = {
  startServer,
  socketIO,
  getApp
}
