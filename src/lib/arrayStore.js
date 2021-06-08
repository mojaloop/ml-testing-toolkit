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

var storedObject = {
  data: {
    requestsHistory: [],
    callbacksHistory: []
  }
}

const init = (key, user) => {
  const context = user ? user.dfspId : 'data'
  if (!storedObject[context]) {
    storedObject[context] = {}
  }
  if (!storedObject[context][key]) {
    storedObject[context][key] = []
  }
  return context
}

const get = (key, user) => {
  const context = init(key, user)
  return [...storedObject[context][key]]
}

const push = (key, value, user) => {
  const context = init(key, user)
  storedObject[context][key].push({
    insertedDate: Date.now(),
    data: JSON.parse(JSON.stringify(value))
  })
}

const clear = (arrName, interval) => {
  for (const context in storedObject) {
    if (storedObject[context][arrName]) {
      let delEndIndex = -1
      for (let i = 0; i < storedObject[context][arrName].length; i++) {
        const timeDiff = Date.now() - storedObject[context][arrName][i].insertedDate
        if (timeDiff > interval) {
          delEndIndex = i
        } else {
          break
        }
      }
      if (delEndIndex >= 0) {
        storedObject[context][arrName].splice(0, delEndIndex + 1)
      }
    }
  }
}

const clearOldObjects = () => {
  const interval = 10 * 60 * 1000
  clear('requestsHistory', interval)
  clear('callbacksHistory', interval)
}

const initArrayStore = () => {
  setInterval(clearOldObjects, 1000)
}

module.exports = {
  get,
  initArrayStore,
  push,
  clear
}
