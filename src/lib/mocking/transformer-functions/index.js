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

 * Infitx
 * Vijaya Kumar Guthi <vijaya.guthi@infitx.com> (Original Author)
 --------------
 ******/

 const fspiopToISO20022 = {
    requestTransform: (requestOptions) => {
      // Iterate through requestOptions.body object and remove the prefix 'TEST_' from top level keys
      const body = {}
      for (const key in requestOptions.body) {
        if (key.startsWith('TEST_')) {
          body[key.substring(5)] = requestOptions.body[key]
        } else {
          body[key] = requestOptions.body[key]
        }
      }
      return {
        ...requestOptions,
        body
      }
    },

    callbackTransform: (callbackOptions) => {
      // Iterate through callbackOptions.body object and add the prefix 'TEST_' to top level keys
      const body = {}
      for (const key in callbackOptions.body) {
        body[`TEST_${key}`] = callbackOptions.body[key]
      }
      return {
        ...callbackOptions,
        body
      }
    }
  }
  
  module.exports = {
    fspiopToISO20022,
  }
  