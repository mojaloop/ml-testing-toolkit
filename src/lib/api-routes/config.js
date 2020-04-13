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
    const runtime = await Config.getUserConfig()
    const stored = await Config.getStoredUserConfig()
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
    await Config.setStoredUserConfig(req.body)
    const runtime = await Config.getUserConfig()
    const stored = await Config.getStoredUserConfig()
    let reloadServer = false
    if (runtime.INBOUND_MUTUAL_TLS_ENABLED !== stored.INBOUND_MUTUAL_TLS_ENABLED) {
      reloadServer = true
    }
    await Config.loadUserConfig()
    if (reloadServer) {
      Server.restartServer()
    }
    res.status(200).json({ status: 'OK' })
  } catch (err) {
    next(err)
  }
})

// // Route to delete a validation rule file
// router.delete('/files/validation/:fileName', async (req, res, next) => {
//   const fileName = req.params.fileName

//   try {
//     await rulesEngineModel.deleteValidationRulesFile(fileName)
//     res.status(200).json({ status: 'OK' })
//   } catch (err) {
//     next(err)
//   }
// })

// // Route to modify configuration in validation rules
// router.put('/files/validation', async (req, res, next) => {
//   const reqType = req.body.type
//   try {
//     switch (reqType) {
//       case 'activeRulesFile':
//         await rulesEngineModel.setActiveValidationRulesFile(req.body.fileName)
//         res.status(200).json({ status: 'OK' })
//         break
//       default:
//         throw (new Error('Unknown update type'))
//     }
//   } catch (err) {
//     next(err)
//   }
// })

module.exports = router
