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
const Config = require('../config')
const router = new express.Router()
const { check, validationResult } = require('express-validator')

const userConfigView = (obj) => {
  if (!Config.getSystemConfig().HOSTING_ENABLED) {
    return obj
  }

  const hiddenProperties = [
    'HUB_ONLY_MODE',
    'ENDPOINTS_DFSP_WISE'
  ]
  const newConfig = {}
  Object.keys(obj).forEach(key => {
    if (!hiddenProperties.includes(key)) {
      newConfig[key] = obj[key]
    }
  })
  return newConfig
}

// Get runtime and stored user config
router.get('/user', async (req, res, next) => {
  try {
    const runtime = userConfigView(await Config.getUserConfig(req.user))
    const stored = userConfigView(await Config.getStoredUserConfig(req.user))
    res.status(200).json({ runtime, stored })
  } catch (err) {
    // next(err)
    res.status(404).json({ error: err && err.message })
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
    await Config.loadUserConfig(req.user)
    res.status(200).json({ status: 'OK' })
  } catch (err) {
    // next(err)
    res.status(404).json({ error: err && err.message })
  }
})

module.exports = router
