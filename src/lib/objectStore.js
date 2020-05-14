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
  transactions: {}
}

const set = (key, value) => {
  storedObject[key] = { ...value }
}

const get = (key) => {
  return { ...storedObject[key] }
}

const saveTransaction = (transactionId, fulfilment) => {
  // Append the current transaction to transactions
  const curDateMillis = Date.now()
  storedObject.transactions[transactionId] = {
    transactionDate: curDateMillis,
    fulfilment: fulfilment
  }
}

const searchTransaction = (transactionId) => {
  // Search for the transactionId
  return Object.prototype.hasOwnProperty.call(storedObject.transactions, transactionId)
}

const getTransaction = (transactionId) => {
  // get the transaction for the transactionId
  if (searchTransaction(transactionId)) {
    return storedObject.transactions[transactionId]
  } else {
    return null
  }
}

const deleteTransaction = (transactionId) => {
  delete storedObject.transactions[transactionId]
}

const clearOldTransactions = () => {
  for (const transactionId in storedObject.transactions) {
    const timeDiff = Date.now() - storedObject.transactions[transactionId].transactionDate
    if (timeDiff > 10 * 60 * 1000) { // Remove the old transactions greater than 10min
      delete storedObject.transactions[transactionId]
    }
  }
}

const initObjectStore = () => {
  setInterval(clearOldTransactions, 1000)
}

module.exports = {
  set,
  get,
  saveTransaction,
  searchTransaction,
  getTransaction,
  deleteTransaction,
  initObjectStore
}
