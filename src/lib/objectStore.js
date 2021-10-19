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

const _ = require('lodash')

const storedObject = {
  data: {
    transactions: {},
    inboundEnvironment: {},
    requests: {},
    callbacks: {}
  }
}

const init = (key, user) => {
  const context = user ? user.dfspId : 'data'
  if (!storedObject[context]) {
    storedObject[context] = {}
  }
  if (!storedObject[context][key]) {
    storedObject[context][key] = {}
  }
  return context
}

const set = (key, value, user) => {
  const context = init(key, user)
  storedObject[context][key] = { ...value }
}

const get = (key, item, user) => {
  const context = init(key, user)
  if (item) {
    if (storedObject[context][key][item]) {
      return { ...storedObject[context][key][item] }
    }
    return null
  } else {
    return { ...storedObject[context][key] }
  }
}

const push = (key, item, value, user) => {
  const context = init(key, user)
  storedObject[context][key][item] = {
    insertedDate: Date.now(),
    data: JSON.parse(JSON.stringify(value))
  }
}

const clear = (object, interval) => {
  for (const context in storedObject) {
    for (const item in storedObject[context][object]) {
      const timeDiff = Date.now() - storedObject[context][object][item].insertedDate
      if (timeDiff > interval) {
        delete storedObject[context][object][item]
      }
    }
  }
}

const popObject = (key, item, user) => {
  const context = init(key, user)
  if (Object.prototype.hasOwnProperty.call(storedObject[context][key], item)) {
    const foundData = JSON.parse(JSON.stringify(storedObject[context][key][item].data))
    delete storedObject[context][key][item]
    return foundData
  }
  return null
}

const clearOldObjects = () => {
  const interval = 10 * 60 * 1000
  clear('transactions', interval)
  clear('requests', interval)
  clear('callbacks', interval)
  clear('requestsHistory', interval)
  clear('callbacksHistory', interval)
}

const initObjectStore = (initConfig = null) => {
  if (initConfig) {
    _.merge(storedObject.data, initConfig)
  }
  setInterval(clearOldObjects, 1000)
}

module.exports = {
  set,
  get,
  initObjectStore,
  push,
  clear,
  popObject
}
