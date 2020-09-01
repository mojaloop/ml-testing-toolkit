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
const mongoDBModels = require('../models/mongoDBModels')
const customLogger = require('../../requestLogger')
const Config = require('../../config')
let conn

const getConnection = async () => {
  if (!conn) {
    conn = await mongoose.connect(Config.getSystemConfig().DB.URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
  }
  return conn
}

const read = async (id, user) => {
  const conn = await getConnection()
  const MyModel = conn.model(user.dfspId, mongoDBModels.commonModel)
  let document = await MyModel.findById(id)
  if (!document) {
    document = await MyModel.create({
      _id: id,
      data: {}
    })
  }
  return document
}

const find = async (id, user) => {
  const conn = await getConnection()
  const MyModel = conn.model(user.dfspId, mongoDBModels.commonModel)
  const documents = await MyModel.find({ _id: { $regex: `${id}`, $options: 'i' } }, '_id')
  documents.forEach((item, i) => { documents[i] = item._id })
  return documents
}

const upsert = async (id, data, user, append) => {
  const conn = await getConnection()
  const MyModel = conn.model(user.dfspId, mongoDBModels.commonModel)
  const update = append ? { $push: { data } } : { $set: { data } }
  const document = await MyModel.findOneAndUpdate({ _id: id }, update, { new: true, upsert: true })
  return document
}

const remove = async (id, user) => {
  const conn = await getConnection()
  const MyModel = conn.model(user.dfspId, mongoDBModels.commonModel)
  await MyModel.findOneAndRemove({ _id: id })
}

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    customLogger.logMessage('info', 'Mongoose default connection is disconnected due to application termination')
    process.exit(0)
  })
})

module.exports = {
  read,
  find,
  upsert,
  remove
}
