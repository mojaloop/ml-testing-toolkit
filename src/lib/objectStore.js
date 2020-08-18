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

const storedObject = {
  transactions: {},
  inboundEnvironment: {},
  emitters: {},
  rulesEngineModel: {
    response: {
      rulesFilePathPrefix: 'spec_files/rules_response/',
      rules: null,
      rulesEngine: null,
      activeRulesFile: 'default.json',
      ruleType: 'response'
    },
    validation: {
      rulesFilePathPrefix: 'spec_files/rules_validation/',
      rules: null,
      rulesEngine: null,
      activeRulesFile: 'default.json',
      ruleType: 'validation'
    },
    callback: {
      rulesFilePathPrefix: 'spec_files/rules_callback/',
      rules: null,
      rulesEngine: null,
      activeRulesFile: 'default.json',
      ruleType: 'callback'
    },
    forward: {
      rulesFilePathPrefix: 'spec_files/rules_forward/',
      rules: null,
      rulesEngine: null,
      activeRulesFile: 'default.json',
      ruleType: 'forward'
    }
  }
}

const set = (key, value, property) => {
  if (property) {
    storedObject[key][property] = { ...value }
  } else {
    storedObject[key] = { ...value }
  }
}

const get = (key) => {
  return { ...storedObject[key] }
}

const push = (object, objectId, data) => {
  const curDateMillis = Date.now()
  storedObject[object][objectId] = {
    insertedDate: curDateMillis,
    ...data
  }
}

const getObject = (object, objectId) => {
  return storedObject[object][objectId] || null
}

const clear = (object, interval) => {
  for (const objectId in storedObject[object]) {
    const timeDiff = Date.now() - storedObject[object][objectId].insertedDate
    if (timeDiff > interval) { // Remove the old transactions greater than 10min
      delete storedObject[object][objectId]
    }
  }
}

const saveTransaction = (transactionId, fulfilment) => {
  // Append the current transaction to transactions
  push('transactions', transactionId, { fulfilment })
}

const searchTransaction = (transactionId) => {
  // Search for the transactionId
  return Object.prototype.hasOwnProperty.call(storedObject.transactions, transactionId)
}

const getTransaction = (transactionId) => {
  // get the transaction for the transactionId
  return getObject('transactions', transactionId)
}

const deleteTransaction = (transactionId) => {
  delete storedObject.transactions[transactionId]
}

const clearOldObjects = () => {
  clear('transactions', 10 * 60 * 1000)
}

const initObjectStore = () => {
  setInterval(clearOldObjects, 1000)
}

module.exports = {
  set,
  get,
  saveTransaction,
  searchTransaction,
  getTransaction,
  deleteTransaction,
  initObjectStore,
  push,
  getObject,
  clear
}
