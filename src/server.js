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

 * Rajiv Mothilal <rajiv.mothilal@modusbox.com>

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
  const server = await new Hapi.Server({
    port
    // routes: {
    //   payload: {
    //     parse: true,
    //     output: 'stream'
    //   }
    // }
  })
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
        RequestLogger.logRequest(request)
        return h.continue
      }
    },   
    {
      type: 'onPreResponse',
      method: (request, h) => {
        RequestLogger.logResponse(request)
        if (request.plugins.negotiatedContentType) {
          request.response.header('content-type', request.plugins.negotiatedContentType)
        }
        return h.continue
      }
    }
  ])
  await server.start()
  return server
}

const initialize = async (port = Config.API_PORT) => {
  await OpenApiMockHandler.initilizeMockHandler()
  const server = await createServer(port)
  // server.plugins.openapi.setHost(server.info.host + ':' + server.info.port)
  // Logger.info(`Server running on ${server.info.host}:${server.info.port}`)
  console.log(`Server running on ${server.info.host}:${server.info.port}`)
  return server
}

module.exports = {
  initialize
}
