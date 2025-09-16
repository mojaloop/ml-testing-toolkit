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
 * Vijaya Kumar <vijaya.guthi@modusbox.com> (Original Author)
 --------------
 ******/

// Ignore temporarily to get the snapshot release done
/* istanbul ignore file */

const MyEventEmitter = require('../MyEventEmitter')
const EventEmitter = require('events')
class MyEmitter extends EventEmitter {}

const Config = require('../config')
class InboundEventListener {
  constructor (consoleFn) {
    this.eventListeners = {}
    this.transformer = {}
    this.userConfig = {}
    if (consoleFn) {
      this.consoleFn = consoleFn
    } else {
      this.consoleFn = console
    }
    this.emitter = MyEventEmitter.getEmitter('inboundRequest')
    this.newInboundHandler = null
  }

  async init () {
    this.userConfig = await Config.getStoredUserConfig()

    // Fixes the MyEmitter listener leak issue
    if (this.newInboundHandler || this.emitter.listenerCount('newInbound') > 0) {
      this.emitter.removeAllListeners('newInbound')
      this.newInboundHandler = null
    }

    this.newInboundHandler = (data) => {
      for (const [, eventListener] of Object.entries(this.eventListeners)) {
        // Match method, path and condition for each inbound request
        if (eventListener.method === data.method && eventListener.path === data.path) {
          // Check for condition function
          if (eventListener.conditionFn) {
            if (eventListener.conditionFn(data.headers, data.body)) {
              eventListener.eventEmitter.emit('newMessage', data)
            }
          } else {
            eventListener.eventEmitter.emit('newMessage', data)
          }
        }
      }
    }

    this.emitter.on('newInbound', this.newInboundHandler)
  }

  customLog (logMessage) {
    this.consoleFn.log(logMessage)
  }

  setTransformer (transformerObj) {
    this.transformer = transformerObj?.transformer || {}
  }

  addListener (clientName, method, path, conditionFn, timeout = 15000) {
    if (this.eventListeners[clientName]) {
      this.customLog('Event listener already exists with that name')
    } else {
      this.eventListeners[clientName] = {
        method,
        path,
        conditionFn,
        message: null
      }

      this.customLog('Event listener started')
      this.eventListeners[clientName].eventEmitter = new MyEmitter()
      setTimeout(() => {
        // Auto destroy the event listener after timeout
        this.destroy(clientName)
      }, timeout)

      this.eventListeners[clientName].eventEmitter.once('newMessage', (message) => {
        this.eventListeners[clientName].message = message
      })
    }
  }

  getMessage (clientName, timeout = 5000) {
    return new Promise((resolve, reject) => {
      let timer = null

      const cleanup = () => {
        if (timer) {
          clearTimeout(timer)
          timer = null
        }
        if (this.eventListeners[clientName] && this.eventListeners[clientName].eventEmitter) {
          this.eventListeners[clientName].eventEmitter.removeAllListeners('newMessage')
        }
      }

      if (!this.eventListeners[clientName]) {
        resolve(null)
        return
      }

      // Check for the message received already
      if (this.eventListeners[clientName].message !== null) {
        // Store the message somewhere
        const retMessage = this.parseMessage(this.eventListeners[clientName].message)
        // Destroy the event listener
        this.destroy(clientName)
        // Return the stored message
        // this.customLog('Returning stored message...')
        if (this.transformer.reverseTransform) {
          this.transformer.reverseTransform(retMessage).then((result) => {
            resolve(result)
          }).catch((err) => {
            this.customLog('Error transforming message: ' + err)
            resolve(retMessage)
          })
        } else {
          resolve(retMessage)
        }
        return
      }

      // Listen for the new message for some time
      // Set the timer
      timer = setTimeout(() => {
        try {
          this.customLog('Error: Timeout')
          // Destroy the event listener
          this.destroy(clientName)
          resolve(null)
        } catch (err) {
          reject(err)
        }
      }, timeout)

      // Listen for message
      this.eventListeners[clientName].eventEmitter.once('newMessage', (message) => {
        cleanup()
        this.destroy(clientName)
        const retMessage = this.parseMessage(message)

        if (this.transformer.reverseTransform) {
          this.transformer.reverseTransform(retMessage).then((result) => {
            resolve(result)
          }).catch((err) => {
            this.customLog('Error transforming message: ' + err)
            resolve(retMessage)
          })
        } else {
          resolve(retMessage)
        }
      })
    })
  }

  parseMessage (message) {
    let parsedMessage = message
    try {
      parsedMessage = JSON.parse(message)
    } catch (err) {}
    return parsedMessage
  }

  destroy (clientName) {
    if (this.eventListeners[clientName]) {
      this.eventListeners[clientName].eventEmitter.removeAllListeners('newMessage')
      delete this.eventListeners[clientName]
    }
    return true
  }

  // Add a new cleanup method
  cleanup () {
    // Remove the newInbound listener
    if (this.newInboundHandler) {
      this.emitter.removeListener('newInbound', this.newInboundHandler)
      this.newInboundHandler = null
    }

    // Clean up all event listeners
    Object.keys(this.eventListeners).forEach(clientName => {
      this.destroy(clientName)
    })
  }
}

module.exports = {
  InboundEventListener
}
