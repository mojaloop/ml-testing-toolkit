/*****
 License
 --------------
 Copyright © 2020-2025 Mojaloop Foundation
 The Mojaloop files are made available by the Mojaloop Foundation under the Apache License, Version 2.0 (the "License") and you may not use these files except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, the Mojaloop files are distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

 Contributors
 --------------
 This is the official list of the Mojaloop project contributors for this file.
 Names of the original copyright holders (individuals or organizations)
 should be listed with a '*' in the first column. People who have
 contributed from an organization can be listed under the organization
 that actually holds the copyright for their contributions (see the
 Mojaloop Foundation for an example). Those individuals should have
 their names indented and be marked with a '-'. Email address can be added
 optionally within square brackets <email>.

 * Mojaloop Foundation
 - Name Surname <name.surname@mojaloop.io>

 * ModusBox
 * Georgi Logodazhki <georgi.logodazhki@modusbox.com> (Original Author)
 --------------
 ******/

'use strict'

const mongoDBWrapper = require('../models/mongoDBWrapper')
const MongoUriBuilder = require('mongo-uri-builder')

let conn
const getConnection = async () => {
  if (!conn) {
    const Config = require('../../config')
    const systemConfig = Config.getSystemConfig()
    const params = systemConfig.DB.PARAMS || {}
    const connectionString = systemConfig.DB.CONNECTION_STRING || MongoUriBuilder({
      username: encodeURIComponent(systemConfig.DB.USER),
      password: encodeURIComponent(systemConfig.DB.PASSWORD),
      host: systemConfig.DB.HOST,
      port: systemConfig.DB.PORT,
      database: systemConfig.DB.DATABASE,
      params
    })

    conn = await mongoDBWrapper.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  }
  return conn
}

const read = async (id, user, additionalData) => {
  const conn = await getConnection()
  let documents
  if (id === 'logs') {
    const MyModel = conn.model(`${user.dfspId}_${id}`, mongoDBWrapper.models.logs)
    // by default is taking the logs from the last hour
    const query = {
      logTime: {
        $gte: additionalData && additionalData.query && additionalData.query.gte ? new Date(additionalData.query.gte) : new Date(Date.now() - (60 * 60 * 1000)),
        $lt: additionalData && additionalData.query && additionalData.query.lt ? new Date(additionalData.query.lt) : new Date()
      }
    }
    documents = await MyModel.find(query).select('-_id -__v').sort('logTime')
  } else if (id === 'reports') {
    const MyModel = conn.model(`${user.dfspId}_${id}`, mongoDBWrapper.models.reports)
    // by default is taking the reports from the last 30 days
    const query = {
      'runtimeInformation.completedTimeISO': {
        $gte: additionalData && additionalData.query && additionalData.query.gte ? new Date(additionalData.query.gte) : new Date(Date.now() - (30 * 24 * 60 * 60 * 1000)),
        $lt: additionalData && additionalData.query && additionalData.query.lt ? new Date(additionalData.query.lt) : new Date()
      }
    }
    documents = await MyModel.find(query).select('-_id -__v').sort('-runtimeInformation.completedTimeISO')
  } else {
    const MyModel = conn.model(user.dfspId, mongoDBWrapper.models.common)
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
  const MyModel = conn.model(user.dfspId, mongoDBWrapper.models.commonModel)
  const documents = await MyModel.find({ _id: { $regex: `${id}`, $options: 'i' } }).select('_id')
  documents.forEach((item, i) => { documents[i] = item._id })
  return documents
}

const upsert = async (id, data, user) => {
  const conn = await getConnection()
  if (id === 'logs') {
    const collectionId = `${user.dfspId}_${id}`
    const MyModel = conn.model(collectionId, mongoDBWrapper.models.logs)
    data._id = new mongoDBWrapper.Types.ObjectId()
    await MyModel.create(data)
  } else if (id === 'reports') {
    const collectionId = `${user.dfspId}_${id}`
    const MyModel = conn.model(collectionId, mongoDBWrapper.models.reports)
    data._id = `${data.name}_${data.runtimeInformation.completedTimeISO}`
    await MyModel.create(data)
  } else {
    const MyModel = conn.model(user.dfspId, mongoDBWrapper.models.common)
    const document = await MyModel.findOneAndUpdate({ _id: id }, { $set: { data } }, { new: true, upsert: true })
    return document
  }
}

const remove = async (id, user) => {
  const conn = await getConnection()
  const MyModel = conn.model(user.dfspId, mongoDBWrapper.models.common)
  await MyModel.findOneAndRemove({ _id: id })
}

// The following are the functions added for saving test reports in non HOSTED mode
const upsertReport = async (reportData) => {
  const conn = await getConnection()
  const MyModel = conn.model('reports', mongoDBWrapper.models.reports)
  reportData._id = `${reportData.runtimeInformation.testReportId}`
  await MyModel.create(reportData)
}

const listReports = async (queryParams) => {
  const conn = await getConnection()
  const MyModel = conn.model('reports', mongoDBWrapper.models.reports)
  const query = {}
  if (queryParams?.filterDateRangeStart || queryParams?.filterDateRangeEnd) {
    query['runtimeInformation.completedTime'] = {}
    if (queryParams?.filterDateRangeStart) {
      query['runtimeInformation.completedTime'].$gte = new Date(queryParams?.filterDateRangeStart)
    }
    if (queryParams?.filterDateRangeEnd) {
      query['runtimeInformation.completedTime'].$lte = new Date(queryParams?.filterDateRangeEnd)
    }
  }

  if (queryParams?.filterStatus === 'passed') {
    query['runtimeInformation.isPassed'] = true
  } else if (queryParams?.filterStatus === 'failed') {
    query['runtimeInformation.isPassed'] = false
  }

  // General Query Options like skip and limit
  const generalQueryOptions = {}
  if (queryParams?.skip) {
    generalQueryOptions.skip = queryParams.skip
  }
  if (queryParams?.limit) {
    generalQueryOptions.limit = queryParams.limit
  }

  const documents = await MyModel.find(query, {}, generalQueryOptions).sort('-runtimeInformation.completedTime').select('_id name runtimeInformation')
  const count = await MyModel.countDocuments(query)

  return {
    count,
    documents
  }
}

const getReport = async (reportId) => {
  const conn = await getConnection()
  const MyModel = conn.model('reports', mongoDBWrapper.models.reports)
  return await MyModel.findById(reportId)
}

module.exports = {
  read,
  find,
  upsert,
  remove,
  upsertReport,
  listReports,
  getReport
}
