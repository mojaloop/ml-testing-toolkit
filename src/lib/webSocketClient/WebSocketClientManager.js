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
 * Vijaya Kumar <vijaya.guthi@modusbox.com> (Original Author)
 * Shashikant Hirugade <shashikant.hirugade@modusbox.com>
 --------------
 ******/

const WebSocket = require('ws')
const EventEmitter = require('events')
class MyEmitter extends EventEmitter {}
const Config = require('../config')
class WebSocketClientManager {
  constructor (consoleFn) {
    this.ws = {}
    this.userConfig = {}
    if (consoleFn) {
      this.consoleFn = consoleFn
    } else {
      this.consoleFn = console
    }
  }

  async init () {
    this.userConfig = await Config.getStoredUserConfig()
  }

  customLog (logMessage) {
    this.consoleFn.log(logMessage)
  }

  connect (url, clientName, timeout = 15000) {
    const tlsOptions = { rejectUnauthorized: false }
    const urlObject = new URL(url)
    if (this.userConfig.CLIENT_MUTUAL_TLS_ENABLED) {
      const cred = this.userConfig.CLIENT_TLS_CREDS.filter(item => item.HOST === urlObject.host)
      if (Array.isArray(cred) && cred.length === 1) {
        this.customLog(`Found the Client certificate for ${urlObject.host}`)
        tlsOptions.cert = cred[0].CERT
        tlsOptions.key = cred[0].KEY
      } else {
        this.customLog(`Client certificate not found for ${urlObject.host}`)
      }
    }

    return new Promise(resolve => {
      if (this.ws[clientName]) {
        this.customLog('WebSocket Client Already exists with that name')
        resolve(false)
      } else {
        this.ws[clientName] = {
          client: null,
          message: null,
          eventEmitter: null
        }
        this.ws[clientName].client = new WebSocket(url, tlsOptions)
        this.ws[clientName].client.on('open', () => {
          this.customLog('WebSocket Client Connected')
          this.ws[clientName].eventEmitter = new MyEmitter()
          setTimeout(() => {
            // Auto destroy the connection after timeout
            this.disconnect(clientName)
          }, timeout)
          resolve(true)
        })
        this.ws[clientName].client.on('close', () => {
          this.customLog('WebSocket Client Disconnected')
          resolve(false)
        })
        this.ws[clientName].client.on('error', (err) => {
          this.customLog('WebSocket Client Error Connection')
          this.customLog(JSON.stringify(err))
          delete this.ws[clientName]
          resolve(false)
        })
        this.ws[clientName].client.on('message', (data) => {
          this.ws[clientName].message = data
          this.ws[clientName].client.close()
          this.ws[clientName].eventEmitter.emit('newMessage', data)
        })
      }
    })
  }

  getMessage (clientName, timeout = 5000) {
    return new Promise((resolve, reject) => {
      if (!this.ws[clientName]) {
        resolve(null)
      } else {
        // Check for the message received already
        if (this.ws[clientName].message !== null) {
          // Store the message somewhere
          const retMessage = this.parseMessage(this.ws[clientName].message)
          // Disconnect the websocket connection
          this.disconnect(clientName)
          // Return the stored message
          // this.customLog('Returning stored message...')
          resolve(retMessage)
        } else {
          // Listen for the new message for some time
          var timer = null
          // Set the timer
          timer = setTimeout(() => {
            try {
              this.ws[clientName].eventEmitter.removeAllListeners('newMessage')
              // Disconnect the websocket connection
              this.disconnect(clientName)
              resolve(null)
            } catch (err) {
              reject(err)
            }
          }, timeout)
          // Listen for message
          this.ws[clientName].eventEmitter.once('newMessage', (message) => {
            clearTimeout(timer)
            this.ws[clientName].eventEmitter.removeAllListeners('newMessage')
            this.disconnect(clientName)
            resolve(this.parseMessage(message))
          })
        }
      }
    })
  }

  parseMessage (message) {
    let parsedMessage = message
    try {
      parsedMessage = JSON.parse(message)
    } catch (err) {}
    return parsedMessage
  }

  disconnect (clientName) {
    if (this.ws[clientName]) {
      this.ws[clientName].client.close()
      delete this.ws[clientName]
    }
    return true
  }

  disconnectAll () {
    for (const clientName in this.ws) {
      this.ws[clientName].client.close()
      delete this.ws[clientName]
      this.customLog(`${clientName}: Deleted`)
    }
    return true
  }
}

module.exports = {
  WebSocketClientManager
}
