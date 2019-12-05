// TODO: Implement a logger and log the messages with different verbosity
// TODO: Write unit tests

const Config = require('../config.js')

var apiDefinitions = null
const specFilePrefix = 'spec_files/fspiop_versions/'

module.exports.getApiDefinitions = async () => {
  if (!apiDefinitions) {
    apiDefinitions = Config.FSPIOP_API_DEFINITIONS.map(item => {
      return {
        minorVersion: +item.version.split('.')[1],
        majorVersion: +item.version.split('.')[0],
        specFile: specFilePrefix + item.version + '/api_spec.yaml',
        callbackMapFile: specFilePrefix + item.version + '/callback_map.json'
      }
    })
  }

  return apiDefinitions
}
