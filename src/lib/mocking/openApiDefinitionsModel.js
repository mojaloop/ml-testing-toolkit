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

const Config = require('../config')
var apiDefinitions = null
const specFilePrefix = 'spec_files/api_definitions/'

module.exports.getApiDefinitions = async () => {
  if (!apiDefinitions) {
    apiDefinitions = Config.getSystemConfig().API_DEFINITIONS.map(item => {
      return {
        minorVersion: +item.version.split('.')[1],
        majorVersion: +item.version.split('.')[0],
        type: item.type,
        asynchronous: item.asynchronous,
        specFile: specFilePrefix + item.folderPath + '/api_spec.yaml',
        callbackMapFile: specFilePrefix + item.folderPath + '/callback_map.json',
        responseMapFile: specFilePrefix + item.folderPath + '/response_map.json',
        jsfRefFile: specFilePrefix + item.folderPath + '/mockRef.json',
        triggerTemplatesFolder: specFilePrefix + item.folderPath + '/trigger_templates'
      }
    })
  }

  return apiDefinitions
}
