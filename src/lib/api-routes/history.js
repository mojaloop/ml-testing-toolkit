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

const express = require('express')
const router = new express.Router()
const dbAdapter = require('../db/adapters/dbAdapter')
const arrayStore = require('../arrayStore')
const reportGenerator = require('../report-generator/generator')

router.get('/reports', async (req, res, next) => {
  try {
    const reports = (await dbAdapter.read('reports', req.user, { query: req.query }))
    res.status(200).send(reports)
  } catch (err) {
    res.status(500).json({ error: err && err.message })
  }
})

router.post('/reports', async (req, res, next) => {
  try {
    await dbAdapter.upsert('reports', req.body, req.user)
    res.status(200).send()
  } catch (err) {
    res.status(500).json({ error: err && err.message })
  }
})

router.get('/logs', async (req, res, next) => {
  try {
    const logs = (await dbAdapter.read('logs', req.user, { query: req.query }))
    res.status(200).send(logs)
  } catch (err) {
    res.status(500).json({ error: err && err.message })
  }
})

// Endpoints for getting the requests to TTK and callbacks from TTK
router.get('/requests', async (req, res, next) => {
  try {
    const requestsHistoryData = arrayStore.get('requestsHistory', undefined, req.user)
    res.status(200).json((requestsHistoryData && requestsHistoryData.map(item => item.data)) || [])
  } catch (err) {
    res.status(500).json({ error: err && err.message })
  }
})

router.delete('/requests', async (req, res, next) => {
  try {
    arrayStore.reset('requestsHistory', req.user)
    res.status(200).send()
  } catch (err) {
    res.status(500).json({ error: err && err.message })
  }
})

router.get('/callbacks', async (req, res, next) => {
  try {
    const callbacksHistoryData = arrayStore.get('callbacksHistory', undefined, req.user)
    res.status(200).json((callbacksHistoryData && callbacksHistoryData.map(item => item.data)) || [])
  } catch (err) {
    res.status(500).json({ error: err && err.message })
  }
})

router.delete('/callbacks', async (req, res, next) => {
  try {
    arrayStore.reset('callbacksHistory', req.user)
    res.status(200).send()
  } catch (err) {
    res.status(500).json({ error: err && err.message })
  }
})

router.get('/test-reports', async (req, res, next) => {
  try {
    const result = await dbAdapter.listReports(req.query)
    res.status(200).send(result)
  } catch (err) {
    res.status(500).json({ error: err && err.message })
  }
})

router.get('/test-reports/:reportId', async (req, res, next) => {
  try {
    let finalReport
    const dbResult = await dbAdapter.getReport(req.params.reportId)
    if (!dbResult) {
      return res.status(404).json({ error: 'Report Not Found' })
    }
    const jsonReport = dbResult._doc
    if (req.query.format === 'html' || req.query.format === 'printhtml') {
      finalReport = await reportGenerator.generateReport(jsonReport, req.query.format)
      if (req.query.download) {
        const downloadFileSuffix = '-' + req.params.reportId + '.html'
        res.setHeader('Content-disposition', 'attachment; filename=TTK-Assertion-Report' + downloadFileSuffix)
        res.setHeader('TTK-FileName', 'TTK-Assertion-Report' + downloadFileSuffix)
      }
    } else {
      finalReport = jsonReport
      if (req.query.download) {
        const downloadFileSuffix = '-' + req.params.reportId + '.json'
        res.setHeader('Content-disposition', 'attachment; filename=TTK-Assertion-Report' + downloadFileSuffix)
        res.setHeader('TTK-FileName', 'TTK-Assertion-Report' + downloadFileSuffix)
      }
    }

    res.status(200).send(finalReport)
  } catch (err) {
    res.status(500).json({ error: err && err.message })
  }
})

module.exports = router
