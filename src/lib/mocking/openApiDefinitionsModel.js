// TODO: Implement a logger and log the messages with different verbosity
// TODO: Write unit tests

const Config = require('../config.js')

var apiDefinitions = null

module.exports.getApiDefinitions = async () => {
  if (!apiDefinitions) {
    apiDefinitions = Config.FSPIOP_API_DEFINITIONS.map(item => {
      return {
        minorVersion: +item.version.split('.')[1],
        majorVersion: +item.version.split('.')[0],
        specFile: item.spec_file,
        callbackMapFile: item.callback_map_file
      }
    })
  }

  return apiDefinitions
}
