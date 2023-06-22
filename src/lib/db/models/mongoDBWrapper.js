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
 * Georgi Logodazhki <georgi.logodazhki@modusbox.com> (Original Author)
 --------------
 ******/

'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const models = {
  common: new Schema({
    _id: String,
    data: { type: Schema.Types.Mixed }
  }),
  logs: new Schema({
    _id: mongoose.Types.ObjectId,
    uniqueId: {
      type: String,
      required: false
    },
    traceID: {
      type: String,
      required: false
    },
    resource: Object,
    messageType: String,
    notificationType: String,
    verbosity: String,
    message: String,
    additionalData: Schema.Types.Mixed,
    logTime: Date
  }, { _id: false }),
  reports: new Schema({
    _id: String,
    name: String,
    inputValues: Object,
    test_cases: [],
    runtimeInformation: Object
  })
}

process.on('SIGINT', async () => {
  await mongoose.connection.close()
  process.exit(0)
})

module.exports = {
  models,
  connect: mongoose.connect,
  Types: mongoose.Types
}
