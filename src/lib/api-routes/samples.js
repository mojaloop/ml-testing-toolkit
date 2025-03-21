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
const loadSamples = require('../loadSamples')
const Config = require('../config')

const router = new express.Router()

const filterDFSPSamples = (files) => {
  if (Config.getSystemConfig().HOSTING_ENABLED) {
    return files.filter(file => file.name.startsWith('examples/collections/dfsp') || file.name.startsWith('examples/environments/dfsp'))
  }
  return files
}

// Route to load a sample
// query param 'collections': list of filenames
// query param 'environment': filename
router.get('/load', async (req, res, next) => {
  try {
    const files = await loadSamples.getSample(req.query)
    return res.status(200).json({ status: 'OK', body: files })
  } catch (err) {
    res.status(500).json({ error: err && err.message })
  }
})

// Route to load a sample in folder structure format
// query param 'collections': list of filenames
router.get('/loadFolderWise', async (req, res, next) => {
  try {
    const files = await loadSamples.getSampleWithFolderWise(req.query)
    console.log('/loadFolderWise', files)
    return res.status(200).json({ status: 'OK', body: files })
  } catch (err) {
    res.status(500).json({ error: err && err.message })
  }
})

// Route to get root filenames
// uri param 'exampleType': supported values: 'collections', 'environments'
// query param 'type': examples: 'hub', 'dfsp'
router.get('/load/:exampleType', async (req, res, next) => {
  try {
    const filenames = await loadSamples.getCollectionsOrEnvironments(req.params.exampleType, req.query.type)
    console.log('/load/:exampleType', filenames)
    return res.status(200).json({ status: 'OK', body: filenames })
  } catch (err) {
    res.status(500).json({ error: err && err.message })
  }
})

// Route to get root filenames with file size
// uri param 'exampleType': supported values: 'collections', 'environments'
// query param 'type': examples: 'hub', 'dfsp'
router.get('/list/:exampleType', async (req, res, next) => {
  try {
    const fileList = filterDFSPSamples(await loadSamples.getCollectionsOrEnvironmentsWithFileSize(req.params.exampleType, req.query.type))
    return res.status(200).json({ status: 'OK', body: fileList })
  } catch (err) {
    res.status(500).json({ error: err && err.message })
  }
})

module.exports = router
