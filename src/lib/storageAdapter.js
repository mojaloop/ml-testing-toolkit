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

const dbAdapter = require('./db/adapters/dbAdapter')
const fileAdapter = require('./fileAdapter')
const axios = require('axios').default

const cache = {} // make sure we return the same data after the first fetch
const fetch = async objectOrUrl => {
  if (!/^https?:\/\//.test(objectOrUrl)) return objectOrUrl
  if (!cache[objectOrUrl]) cache[objectOrUrl] = (await axios.get(objectOrUrl)).data
  return cache[objectOrUrl]
}

const read = async (id, user) => {
  let document
  const Config = require('./config')
  if (user && Config.getSystemConfig().HOSTING_ENABLED) {
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
      document = { data: await fetch(await fileAdapter.read(id)) }
    }
  }
  return document
}

const upsert = async (id, data, user) => {
  const Config = require('./config')
  if (user && Config.getSystemConfig().HOSTING_ENABLED) {
    await dbAdapter.upsert(id, data, user)
  } else {
    await fileAdapter.upsert(id, data)
  }
}

const remove = async (id, user) => {
  const Config = require('./config')
  if (user && Config.getSystemConfig().HOSTING_ENABLED) {
    await dbAdapter.remove(id, user)
  } else {
    await fileAdapter.remove(id)
  }
}

const find = async (id, user) => {
  let files
  const Config = require('./config')
  if (user && Config.getSystemConfig().HOSTING_ENABLED) {
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
