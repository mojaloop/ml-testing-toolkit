var storedObject = {
  transactions: {}
}

const set = (key, value) => {
  storedObject[key] = { ...value }
}

const get = (key) => {
  return { ...storedObject[key] }
}

const saveTransaction = (transactionId) => {
  // Append the current transaction to transactions
  const curDateMillis = Date.now()
  storedObject.transactions[transactionId] = {
    transactionDate: curDateMillis
  }
}

const searchTransaction = (transactionId) => {
  // Search for the transactionId
  return Object.prototype.hasOwnProperty.call(storedObject.transactions, transactionId)
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
  deleteTransaction,
  initObjectStore
}
