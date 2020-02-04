const ObjectStore = require('../../objectStore')

const handleQuotes = (context, request) => {
  // Check whether the request is POST /quotes
  if (request.method === 'post' && request.path === '/quotes') {
    // Save the Transaction ID in object store
    ObjectStore.saveTransaction(request.payload.transactionId)
  }
}

const handleTransfers = (context, request) => {
  // Check whether the request is POST /transfers
  if (request.method === 'post' && request.path === '/transfers') {
    // Search for the Transaction ID in object store
    if (ObjectStore.searchTransaction(request.payload.transferId)) {
      // Transaction Found, delete it in objectStore
      ObjectStore.deleteTransaction(request.payload.transferId)
    } else {
      // Transaction not found, throw error callback
      return false
    }
    // console.log(ObjectStore.get('transactions'))
  }

  return true
}

module.exports = {
  handleQuotes,
  handleTransfers
}
