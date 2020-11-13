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
const outbound = require('../test-outbound/outbound-initiator')
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
      url: req.body.url ? req.body.url : (await Config.getUserConfig(req.user)).CALLBACK_ENDPOINT + req.body.path,
      headers: req.body.headers,
      data: req.body.body,
      timeout: 3000,
      validateStatus: (status) => {
        return status < 900 // Reject only if the status code is greater than or equal to 900
      }
    }).then((result) => {
      customLogger.logMessage('info', 'Received response ' + result.status + ' ' + result.statusText, { additionalData: result.data, notification: false, user: req.user })
    }, (err) => {
      customLogger.logMessage('info', 'Failed to send request ' + req.body.method + ' ' + req.body.path, { additionalData: err, notification: false, user: req.user })
    })
    res.status(200).json({ status: 'OK' })
  } catch (err) {
    next(err)
  }
})

// Route to send series of outbound requests based on the given template
router.post('/template/:traceID', [
  check('name').notEmpty(),
  check('test_cases').notEmpty()
], async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const traceID = req.params.traceID
    const inputJson = JSON.parse(JSON.stringify(req.body))
    // TODO: Change the following value to the dfspId based ont he login incase HOSTING_ENABLED
    const dfspId = req.user ? req.user.dfspId : Config.getUserConfig().DEFAULT_USER_FSPID
    outbound.OutboundSend(inputJson, traceID, dfspId)

    return res.status(200).json({ status: 'OK' })
  } catch (err) {
    next(err)
  }
})

// TODO: Refactor the following. Decision to be taken whether to mix it up with actual template endpoint using query params for iternations
router.post('/template_iterations/:traceID', [
  check('name').notEmpty(),
  check('test_cases').notEmpty()
], async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const traceID = req.params.traceID
    const inputJson = JSON.parse(JSON.stringify(req.body))
    // TODO: Change the following value to the dfspId based ont he login incase HOSTING_ENABLED
    const dfspId = req.user ? req.user.dfspId : Config.getUserConfig().DEFAULT_USER_FSPID
    outbound.OutboundSendLoop(inputJson, traceID, dfspId, 100)

    return res.status(200).json({ status: 'OK' })
  } catch (err) {
    next(err)
  }
})

// Route to terminate the given execution
router.delete('/template/:traceID', async (req, res, next) => {
  try {
    const traceID = req.params.traceID
    outbound.terminateOutbound(traceID)

    return res.status(200).json({ status: 'OK' })
  } catch (err) {
    next(err)
  }
})

module.exports = router
