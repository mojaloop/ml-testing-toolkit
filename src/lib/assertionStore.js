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
  // Search for the path
  if (Object.prototype.hasOwnProperty.call(storedObject.requests, path)) {
    const foundData = JSON.parse(JSON.stringify(storedObject.requests[path].data))
    delete storedObject.requests[path]
    return foundData
  } else {
    return null
  }
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
  // Search for the path
  if (Object.prototype.hasOwnProperty.call(storedObject.callbacks, path)) {
    const foundData = JSON.parse(JSON.stringify(storedObject.callbacks[path].data))
    delete storedObject.callbacks[path]
    return foundData
  } else {
    return null
  }
}

const clearOldAssertions = () => {
  for (const path in storedObject.requests) {
    const timeDiff = Date.now() - storedObject.requests[path].insertedDate
    if (timeDiff > 10 * 60 * 1000) { // Remove the old requests greater than 10min
      delete storedObject.requests[path]
    }
  }
  for (const path in storedObject.callbacks) {
    const timeDiff = Date.now() - storedObject.callbacks[path].insertedDate
    if (timeDiff > 10 * 60 * 1000) { // Remove the old callbacks greater than 10min
      delete storedObject.callbacks[path]
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
  initAssertionStore
}
