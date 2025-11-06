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
 * Vijaya Kumar Guthi <vijaya.guthi@modusbox.com> (Original Author)
 --------------
 ******/

const express = require('express')
const router = new express.Router()
// const { check, validationResult } = require('express-validator')
const reportGenerator = require('../report-generator/generator')
const { logger } = require('../logger')

const log = logger.child({ component: 'api-routes::reports' })

// Generate report
router.post('/testcase/:format', async (req, res, next) => {
  const jsonReport = req.body
  const format = req.params.format
  let downloadFileSuffix = '.html'

  if (jsonReport.runtimeInformation) {
    downloadFileSuffix = '-' + jsonReport.runtimeInformation.completedTimeISO + downloadFileSuffix
  }
  downloadFileSuffix = '-' + jsonReport.name + downloadFileSuffix
  try {
    const result = await reportGenerator.generateReport(jsonReport, format)
    res.setHeader('Content-disposition', 'attachment; filename=TTK-Assertion-Report' + downloadFileSuffix)
    res.setHeader('TTK-FileName', 'TTK-Assertion-Report' + downloadFileSuffix)
    res.status(200).send(result)
  } catch (err) {
    log.child({ format }).error('error in POST /testcase/:format - ', err)
    res.status(500).json({ error: err && err.message })
  }
})

// Generate report
router.post('/testcase_definition/:format', async (req, res, next) => {
  const template = req.body
  const format = req.params.format
  let downloadFileSuffix = '.html'

  downloadFileSuffix = '-' + template.name + downloadFileSuffix
  try {
    const result = await reportGenerator.generateTestcaseDefinition(template, format)
    res.setHeader('Content-disposition', 'attachment; filename=TTK-Testcase-Definition' + downloadFileSuffix)
    res.setHeader('TTK-FileName', 'TTK-Testcase-Definition' + downloadFileSuffix)
    res.status(200).send(result)
  } catch (err) {
    log.child({ format }).error('error in POST /testcase_definition/:format - ', err)
    res.status(500).json({ error: err && err.message })
  }
})

module.exports = router
