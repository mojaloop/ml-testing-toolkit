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
const loadSamples = require('../loadSamples')

const router = new express.Router()

// Route to load a sample
// query param 'collections': list of filenames
// query param 'environment': filename
router.get('/load', async (req, res, next) => {
  try {
    const files = await loadSamples.getSample(req.query)
    return res.status(200).json({ status: 'OK', body: files })
  } catch (err) {
    next(err)
  }
})

// Route to get root filenames
// uri param 'exampleType': supported values: 'collections', 'environments'
// query param 'type': examples: 'hub', 'dfsp'
router.get('/load/:exampleType', async (req, res, next) => {
  try {
    const filenames = await loadSamples.getCollectionsOrEnvironments(req.params.exampleType, req.query.type)
    return res.status(200).json({ status: 'OK', body: filenames })
  } catch (err) {
    next(err)
  }
})

// Route to get root filenames with file size
// uri param 'exampleType': supported values: 'collections', 'environments'
// query param 'type': examples: 'hub', 'dfsp'
router.get('/list/:exampleType', async (req, res, next) => {
  try {
    const fileList = await loadSamples.getCollectionsOrEnvironmentsWithFileSize(req.params.exampleType, req.query.type)
    return res.status(200).json({ status: 'OK', body: fileList })
  } catch (err) {
    next(err)
  }
})

module.exports = router
