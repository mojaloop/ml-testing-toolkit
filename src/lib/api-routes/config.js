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
const Config = require('../config')
const Server = require('../../server')
const router = new express.Router()
const { check, validationResult } = require('express-validator')

// Get runtime and stored user config
router.get('/user', async (req, res, next) => {
  try {
    const runtime = await Config.getUserConfig(req.user)
    const stored = await Config.getStoredUserConfig(req.user)
    res.status(200).json({ runtime, stored })
  } catch (err) {
    next(err)
  }
})

// Route to edit the user configuration
router.put('/user', [
  check('CALLBACK_ENDPOINT').notEmpty()
], async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  try {
    await Config.setStoredUserConfig(req.body, req.user)
    const runtime = await Config.getUserConfig(req.user)
    const stored = await Config.getStoredUserConfig(req.user)
    let reloadServer = false
    if (runtime.INBOUND_MUTUAL_TLS_ENABLED !== stored.INBOUND_MUTUAL_TLS_ENABLED) {
      reloadServer = true
    }
    await Config.loadUserConfig(req.user)
    if (reloadServer) {
      Server.restartServer(req.user)
    }
    res.status(200).json({ status: 'OK' })
  } catch (err) {
    next(err)
  }
})

module.exports = router
