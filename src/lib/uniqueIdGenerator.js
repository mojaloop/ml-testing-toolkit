const generateUniqueId = (request) => {
  return Date.parse(request.headers.date)
}

module.exports.generateUniqueId = generateUniqueId
