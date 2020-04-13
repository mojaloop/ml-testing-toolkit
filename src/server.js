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

// TODO: Implement a logger and log the messages with different verbosity
// TODO: Write unit tests

'use strict'

const Hapi = require('@hapi/hapi')
// const Path = require('path')
const Config = require('./lib/config.js')
// const Plugins = require('./plugins')
const RequestLogger = require('./lib/requestLogger')
const OpenApiMockHandler = require('./lib/mocking/openApiMockHandler')
const UniqueIdGenerator = require('./lib/uniqueIdGenerator')
const objectStore = require('./lib/objectStore')
const assertionStore = require('./lib/assertionStore')
const ConnectionProvider = require('./lib/configuration-providers/mb-connection-manager')

var serverInstance = null
// const openAPIOptions = {
//   api: Path.resolve(__dirname, './interface/api_swagger.json'),
//   handlers: Path.resolve(__dirname, './handlers')
// }

/**
 * @function createServer
 *
 * @description Create HTTP Server
 *
 * @param {number} port Port to register the Server against
 * @returns {Promise<Server>} Returns the Server object
 */
const createServer = async (port) => {
  let server
  if (Config.getUserConfig().INBOUND_MUTUAL_TLS_ENABLED) {
    // Make sure hub server certificates are set in connection provider
    try {
      await ConnectionProvider.waitForTlsHubCerts()
    } catch (err) {
      console.log('Tls certificates initiation failed.')
      return null
    }
    const tlsConfig = ConnectionProvider.getTlsConfig()
    server = await new Hapi.Server({
      port,
      tls: {
        cert: tlsConfig.hubServerCert,
        key: tlsConfig.hubServerKey,
        ca: [tlsConfig.hubCaCert],
        rejectUnauthorized: true,
        requestCert: false
      }
    })
  } else {
    server = await new Hapi.Server({
      port
      // routes: {
      //   payload: {
      //     parse: true,
      //     output: 'stream'
      //   }
      // }
    })
  }
  // console.log(server)
  // await Plugins.registerPlugins(server)
  // await server.register([
  //   {
  //     plugin: HapiOpenAPI,
  //     options:  openAPIOptions
  //   },
  //   {
  //     plugin: HeaderValidator
  //   }
  // ])

  await server.route({
    method: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    path: '/{path*}',
    handler: (req, h) => OpenApiMockHandler.handleRequest(req, h)
  })

  // await server.ext([
  //   {
  //     type: 'onRequest',
  //     method: (request, h) => {
  //       RequestLogger.logRequest(request)
  //       return h.continue
  //     }
  //   },
  //   {
  //     type: 'onPreResponse',
  //     method: (request, h) => {
  //       RequestLogger.logResponse(request.response)
  //       return h.continue
  //     }
  //   }
  // ])

  await server.ext([
    {
      type: 'onPreHandler',
      method: (request, h) => {
        // Generate UniqueID
        request.customInfo = {}
        request.customInfo.uniqueId = UniqueIdGenerator.generateUniqueId(request)
        RequestLogger.logRequest(request)
        return h.continue
      }
    },
    {
      type: 'onPreResponse',
      method: (request, h) => {
        RequestLogger.logResponse(request)
        if (request.customInfo.negotiatedContentType) {
          request.response.header('content-type', request.customInfo.negotiatedContentType)
        }
        return h.continue
      }
    }
  ])
  await server.start()
  return server
}

const initialize = async () => {
  await OpenApiMockHandler.initilizeMockHandler()
  serverInstance = await createServer(Config.API_PORT)
  // serverInstance.plugins.openapi.setHost(serverInstance.info.host + ':' + serverInstance.info.port)
  // Logger.info(`serverInstance running on ${serverInstance.info.host}:${serverInstance.info.port}`)

  objectStore.initObjectStore()
  assertionStore.initAssertionStore()

  console.log(`Toolkit Server running on port ${serverInstance.info.port}`)
  return serverInstance
}

const restartServer = async () => {
  console.log(`Toolkit Server restarted on port ${serverInstance.info.port}`)
  serverInstance.stop()
  serverInstance = await createServer(Config.API_PORT)
}

module.exports = {
  initialize,
  restartServer
}
