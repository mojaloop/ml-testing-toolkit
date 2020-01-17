const generateUUID = () => {
  const uuid = require('uuid')
  return uuid.v4()
}

const curDate = () => {
  return (new Date()).toUTCString()
}

module.exports.generateUUID = generateUUID
module.exports.curDate = curDate
