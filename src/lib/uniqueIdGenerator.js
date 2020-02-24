const generateUniqueId = (request) => {
  const r = Math.random().toString(36).substring(7)
  return Date.now() + r
}

module.exports.generateUniqueId = generateUniqueId
