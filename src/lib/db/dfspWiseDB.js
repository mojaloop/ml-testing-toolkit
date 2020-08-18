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

let db
const dbInit = require('../../../spec_files/db-init.json')
const customLogger = require('../requestLogger')

const create = async (id, data) => {
  try {
    const doc = (await getDB().get(id))
    if (doc.data) {
      customLogger.logMessage('info', `${id} document already set`, null, false)
      return
    }
    doc._id = id
    doc.data = data
    await getDB().put(doc)
  } catch (err) {
    if (err.status === 404) {
      await getDB().put({
        _id: id,
        data
      })
    } else {
      customLogger.logMessage('error', `${id} document was not created`, err, false)
      return
    }
  }
  customLogger.logMessage('info', `${id} document was created`, null, false)
}

const update = async (id, data, dfspId = 'data') => {
  try {
    const doc = (await getDB().get(id))
    doc[dfspId] = data
    await getDB().put(doc)
  } catch (err) {
    console.log(err)
  }
}

const getDB = () => {
  return db
}

const setDB = (newDB) => {
  db = newDB
}

const initDB = async () => {
  for (const index in dbInit) {
    const document = dbInit[index]
    await create(document._id, document.data)
  }
}

module.exports = {
  initDB,
  getDB,
  update,
  setDB
}
