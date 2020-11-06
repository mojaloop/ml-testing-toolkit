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
 * Vijaya Kumar Guthi <vijaya.guthi@modusbox.com> (Original Author)
 --------------
 ******/

const express = require('express')
const router = new express.Router()
// const { check, validationResult } = require('express-validator')
const reportGenerator = require('../report-generator/generator')

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
    next(err)
  }
})

module.exports = router
