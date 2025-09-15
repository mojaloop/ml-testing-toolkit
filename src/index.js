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
 * Vijaya Kumar Guthi <vijaya.guthi@modusbox.com> (Original Author)
 --------------
 ******/

'use strict'
const RequestLogger = require('./lib/requestLogger')
const apiServer = require('./lib/api-server')
const socketServer = require('./lib/socket-server')
const Config = require('./lib/config')
const server = require('./server')
const mbConnectionManager = require('./lib/configuration-providers/mb-connection-manager')
const reportGenerator = require('./lib/report-generator/generator')

const welcomeMessage = `
-------------------------------------------------------------------------------------
                  Welcome to Mojaloop Testing Toolkit
-------------------------------------------------------------------------------------
You can start using the testing toolkit by opening the following URL in your browser

http://localhost:5050

And you can send mojaloop requests to http://localhost:4040

-------------------------------------------------------------------------------------
`

const init = async () => {
  RequestLogger.logMessage('info', 'Toolkit Initialization started...', { notification: false })

  // Set higher max listeners to prevent memory leak warnings
  process.setMaxListeners(20)

  // Set max listeners for HTTP modules to prevent socket listener warnings
  const http = require('http')
  const https = require('https')
  if (http.Server && http.Server.prototype.setMaxListeners) {
    http.Server.prototype.setMaxListeners(20)
  }
  if (https.Server && https.Server.prototype.setMaxListeners) {
    https.Server.prototype.setMaxListeners(20)
  }

  await Config.loadSystemConfig()
  await Config.loadUserConfig()
  apiServer.startServer(5050)
  socketServer.initServer(apiServer.getHttp())
  const systemConfig = Config.getSystemConfig()
  if (systemConfig.CONNECTION_MANAGER.ENABLED) {
    await mbConnectionManager.initialize()
  }
  await reportGenerator.initialize()
  await server.initialize()
  RequestLogger.logMessage('info', 'Toolkit Initialization completed.', { notification: false, additionalData: welcomeMessage })
}

init()
