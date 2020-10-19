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

const express = require('express')
const router = new express.Router()
const dbAdapter = require('../db/adapters/dbAdapter')

router.get('/reports', async (req, res, next) => {
  try {
    const reports = (await dbAdapter.read('reports', req.user, { query: req.query }))
    res.status(200).send(reports)
  } catch (err) {
    next(err)
  }
})

router.post('/reports', async (req, res, next) => {
  try {
    await dbAdapter.upsert('reports', req.body, req.user)
    res.status(200).send()
  } catch (err) {
    next(err)
  }
})

router.get('/logs', async (req, res, next) => {
  try {
    const logs = (await dbAdapter.read('newLog', req.user, { query: req.query }))
    res.status(200).send(logs)
  } catch (err) {
    next(err)
  }
})

module.exports = router
