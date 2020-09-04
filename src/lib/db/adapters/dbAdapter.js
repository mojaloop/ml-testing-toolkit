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
let Config
let conn
const getConnection = async () => {
  if (!conn) {
    Config = require('../../config')
    conn = await mongoose.connect(Config.getSystemConfig().DB.URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
  }
  return conn
}

const read = async (id, user, additionalData) => {
  const conn = await getConnection()
  let documents
  if (id === 'logs') {
    const MyModel = conn.model(`${user.dfspId}_${id}`, mongoDBModels.logsModel)
    const query = {
      logTime: {
        $gte: additionalData && additionalData.query && additionalData.query.gte ? new Date(additionalData.query.gte) : new Date(Date.now() - (60 * 60 * 1000)),
        $lt: additionalData && additionalData.query && additionalData.query.lt ? new Date(additionalData.query.lt) : new Date()
      }
    }
    documents = await MyModel.find(query)
  } else if (id === 'reports') {
    const MyModel = conn.model(`${user.dfspId}_${id}`, mongoDBModels.reportsModel)
    const query = (additionalData && additionalData.query && (additionalData.query.gte || additionalData.query.lt)) ? {
      'runtimeInformation.completedTimeISO': {
        $gte: additionalData && additionalData.query && additionalData.query.gte ? new Date(additionalData.query.gte) : new Date(Date.now() - (24 * 60 * 60 * 1000)),
        $lt: additionalData && additionalData.query && additionalData.query.lt ? new Date(additionalData.query.lt) : new Date()
      }
    } : {}
    documents = await MyModel.find(query)
  } else {
    const MyModel = conn.model(user.dfspId, mongoDBModels.commonModel)
    documents = await MyModel.findById(id)
    if (!documents) {
      documents = await MyModel.create({
        _id: id,
        data: {}
      })
    }
  }
  return documents
}

const find = async (id, user) => {
  const conn = await getConnection()
  const MyModel = conn.model(user.dfspId, mongoDBModels.commonModel)
  const documents = await MyModel.find({ _id: { $regex: `${id}`, $options: 'i' } }, '_id')
  documents.forEach((item, i) => { documents[i] = item._id })
  return documents
}

const upsert = async (id, data, user) => {
  const conn = await getConnection()
  if (id === 'logs') {
    const collectionId = `${user.dfspId}_${id}`
    const MyModel = conn.model(collectionId, mongoDBModels.logsModel)
    data._id = new mongoose.Types.ObjectId()
    await MyModel.create(data)
  } else if (id === 'reports') {
    const collectionId = `${user.dfspId}_${id}`
    const MyModel = conn.model(collectionId, mongoDBModels.reportsModel)
    data._id = `${data.name}_${data.runtimeInformation.completedTimeISO.toISOString()}`
    await MyModel.create(data)
  } else {
    const MyModel = conn.model(user.dfspId, mongoDBModels.commonModel)
    const document = await MyModel.findOneAndUpdate({ _id: id }, { $set: { data } }, { new: true, upsert: true })
    return document
  }
}

const remove = async (id, user) => {
  const conn = await getConnection()
  const MyModel = conn.model(user.dfspId, mongoDBModels.commonModel)
  await MyModel.findOneAndRemove({ _id: id })
}

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    customLogger.logMessage('info', 'Mongoose default connection is disconnected due to application termination', { notification: false })
    process.exit(0)
  })
})

module.exports = {
  read,
  find,
  upsert,
  remove
}
