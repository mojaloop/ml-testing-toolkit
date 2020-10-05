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
const jsreportCore = require('jsreport-core')
const { readFileAsync } = require('../utils')
const BASE_TEMPLATE_PATH = 'spec_files/reports/templates/newman'

// Generate report
router.post('/testcase/:format', async (req, res, next) => {
  const jsonReport = req.body
  const format = req.params.format
  const recipe = 'html'
  let templateFile = 'html_template.html'
  let downloadFileSuffix = '.html'
  if (format === 'pdf' || format === 'printhtml') {
    // recipe = 'chrome-pdf'
    templateFile = 'pdf_template.html'
    // downloadFileSuffix = '.pdf'
  }

  if (jsonReport.runtimeInformation) {
    downloadFileSuffix = '-' + jsonReport.runtimeInformation.completedTimeISO + downloadFileSuffix
  }
  downloadFileSuffix = '-' + jsonReport.name + downloadFileSuffix
  try {
    const templateContent = await readFileAsync(BASE_TEMPLATE_PATH + '/' + templateFile)
    const scriptContent = await readFileAsync(BASE_TEMPLATE_PATH + '/script.js')
    const jsreport = jsreportCore()
    await jsreport.init()
    const result = await jsreport.render({
      template: {
        content: templateContent.toString(),
        engine: 'handlebars',
        recipe: recipe,
        helpers: scriptContent.toString()
      },
      data: jsonReport
    })
    res.setHeader('Content-disposition', 'attachment; filename=TTK-Assertion-Report' + downloadFileSuffix)
    res.setHeader('TTK-FileName', 'TTK-Assertion-Report' + downloadFileSuffix)
    res.status(200).send(result.content)
  } catch (err) {
    next(err)
  }
})

module.exports = router
