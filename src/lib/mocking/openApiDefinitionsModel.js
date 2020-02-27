// TODO: Implement a logger and log the messages with different verbosity
// TODO: Write unit tests

const Config = require('../config.js')

var apiDefinitions = null
const specFilePrefix = 'spec_files/api_definitions/'

module.exports.getApiDefinitions = async () => {
  if (!apiDefinitions) {
    apiDefinitions = Config.API_DEFINITIONS.map(item => {
      return {
        minorVersion: +item.version.split('.')[1],
        majorVersion: +item.version.split('.')[0],
        type: item.type,
        asynchronous: item.asynchronous,
        specFile: specFilePrefix + item.folderPath + '/api_spec.yaml',
        callbackMapFile: specFilePrefix + item.folderPath + '/callback_map.json',
        responseMapFile: specFilePrefix + item.folderPath + '/response_map.json',
        jsfRefFile: specFilePrefix + item.folderPath + '/mockRef.json'
      }
    })
  }

  return apiDefinitions
}
