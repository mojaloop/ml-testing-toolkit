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
  requests: {},
  callbacks: {}
}

const pushRequest = (path, data) => {
  // Append the current assertion to requests
  const curDateMillis = Date.now()
  storedObject.requests[path] = {
    insertedDate: curDateMillis,
    data: JSON.parse(JSON.stringify(data))
  }
}

const popRequest = (path) => {
  return pop('requests', path)
}

const pushCallback = (path, data) => {
  // Append the current assertion to callbacks
  const curDateMillis = Date.now()
  storedObject.callbacks[path] = {
    insertedDate: curDateMillis,
    data: JSON.parse(JSON.stringify(data))
  }
}

const popCallback = (path) => {
  return pop('callbacks', path)
}

const clearOldAssertions = () => {
  clear('requests', 10 * 60 * 1000)
  clear('callbacks', 10 * 60 * 1000)
}

const pop = (object, path) => {
  // Search for the path
  if (Object.prototype.hasOwnProperty.call(storedObject[object], path)) {
    const foundData = JSON.parse(JSON.stringify(storedObject[object][path].data))
    delete storedObject[object][path]
    return foundData
  } else {
    return null
  }
}

const clear = (object, interval) => {
  for (const objectId in storedObject[object]) {
    const timeDiff = Date.now() - storedObject[object][objectId].insertedDate
    if (timeDiff > interval) { // Remove the old transactions greater than 10min
      delete storedObject[object][objectId]
    }
  }
}

const initAssertionStore = () => {
  setInterval(clearOldAssertions, 1000)
}

module.exports = {
  pushRequest,
  popRequest,
  pushCallback,
  popCallback,
  initAssertionStore,
  pop,
  clear
}
