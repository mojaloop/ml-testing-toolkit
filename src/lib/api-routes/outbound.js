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
 * Georgi Logodazhki <georgi.logodazhki@modusbox.com>
 * Vijaya Kumar Guthi <vijaya.guthi@modusbox.com> (Original Author)
 --------------
 ******/

const express = require('express')

const router = new express.Router()
const axios = require('axios').default
const Config = require('../config')
const customLogger = require('../requestLogger')
const { check, validationResult } = require('express-validator')

// Route to send a single outbound request
router.post('/request', [
  check('method').notEmpty(),
  check('path').notEmpty()
],
async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  try {
    axios({
      method: req.body.method,
      url: Config.getUserConfig().CALLBACK_ENDPOINT + req.body.path,
      headers: req.body.headers,
      data: req.body.body,
      timeout: 3000,
      validateStatus: function (status) {
        return status < 900 // Reject only if the status code is greater than or equal to 900
      }
    }).then((result) => {
      customLogger.logMessage('info', 'Received response ' + result.status + ' ' + result.statusText, result.data, false)
    }, (err) => {
      customLogger.logMessage('info', 'Failed to send request ' + req.body.method + ' ' + req.body.path, err, false)
    })
    res.status(200).json({ status: 'OK' })
  } catch (err) {
    next(err)
  }
})

// Route to send series of outbound requests based on the given template
router.post('/template/:traceID', async (req, res, next) => {
  try {
    const traceID = req.params.traceID
    const inputJson = JSON.parse(JSON.stringify(req.body))
    // Validate the template format
    if (!inputJson.name) {
      return res.status(422).json({ errors: 'Template name is missing' })
    }
    if (!inputJson.test_cases) {
      return res.status(422).json({ errors: 'Template test cases are missing' })
    }
    const outbound = require('../test-outbound/outbound-initiator')
    outbound.OutboundSend(inputJson, traceID)

    return res.status(200).json({ status: 'OK' })
  } catch (err) {
    next(err)
  }
})

// Route to terminate the given execution
router.delete('/template/:traceID', async (req, res, next) => {
  try {
    const traceID = req.params.traceID
    const outbound = require('../test-outbound/outbound-initiator')
    outbound.terminateOutbound(traceID)

    return res.status(200).json({ status: 'OK' })
  } catch (err) {
    next(err)
  }
})

// Route to get all collections and environments filenames
// query param 'type': supported values: 'hub', 'dfsp'
router.get('/samples', async (req, res, next) => {
  try {
    const outbound = require('../test-outbound/outbound-initiator')
    const filenames = await outbound.loadSamplesFilenames(req.query.type)
    if (filenames.environments.length === 0) {
      return res.status(404).json({ errors: 'environment not found' })
    }
    if (filenames.collections.length === 0) {
      return res.status(404).json({ errors: 'collections not found' })
    }
    return res.status(200).json({ status: 'OK', body: filenames })
  } catch (err) {
    next(err)
  }
})

// Route to load a sample
// query param 'collections' should have at least 1 object
router.get('/samples/data', async (req, res, next) => {
  try {
    const outbound = require('../test-outbound/outbound-initiator')
    if (!req.query.collections || req.query.collections.length === 0) {
      return res.status(400).send('collections is empty')
    }
    const files = await outbound.loadSamplesContent(req.query)
    return res.status(200).json({ status: 'OK', body: files })
  } catch (err) {
    next(err)
  }
})

module.exports = router
