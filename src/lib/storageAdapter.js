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

const dbAdapter = require('./db/adapters/dbAdapter')
const fileAdapter = require('./fileAdapter')

const read = async (id, user) => {
  let document
  if (user) {
    if (id.endsWith('/')) {
      document = { data: await find(id, user) }
    } else {
      document = await dbAdapter.read(id, user)
      if (Object.keys(document.data).length === 0) {
        let content
        try {
          content = await fileAdapter.read(id)
        } catch (err) {
          content = {}
        }
        document = await dbAdapter.upsert(id, content, user)
      }
    }
  } else {
    if (id.endsWith('/')) {
      document = { data: await find(id) }
    } else {
      document = { data: await fileAdapter.read(id) }
    }
  }
  return document
}

const upsert = async (id, data, user) => {
  if (user) {
    await dbAdapter.upsert(id, data, user)
  } else {
    await fileAdapter.upsert(id, data)
  }
}

const remove = async (id, user) => {
  if (user) {
    await dbAdapter.remove(id, user)
  } else {
    await fileAdapter.remove(id)
  }
}

const find = async (id, user) => {
  let files
  if (user) {
    files = await dbAdapter.find(id, user)
    if (files.length === 0) {
      files = await fileAdapter.readDir(id)
      for (const index in files) {
        const newId = id + files[index]
        const fileRead = await fileAdapter.read(newId)
        await dbAdapter.upsert(newId, fileRead, user)
      }
    } else {
      files.forEach((item, i) => {
        const splitted = item.split('/')
        files[i] = splitted[splitted.length - 1]
      })
    }
  } else {
    files = await fileAdapter.readDir(id)
  }
  return files
}

module.exports = {
  read,
  upsert,
  remove
}
