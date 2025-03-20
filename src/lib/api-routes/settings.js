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
const router = new express.Router()
const Config = require('../config')
const importExport = require('../importExport')
const RulesEngineModel = require('../rulesEngineModel')

// export and import from spec files

router.get('/export', async (req, res, next) => {
  try {
    if (!req.query || !req.query.options) {
      res.status(400).send('options query param is required')
    } else {
      const resp = await importExport.exportSpecFiles(req.query.options, req.user)
      res.status(200).json({ status: 'OK', body: resp })
    }
  } catch (err) {
    // next(err)
    res.status(404).json({ error: err && err.message })
  }
})

router.post('/import', async (req, res, next) => {
  try {
    const options = req.query.options
    await importExport.importSpecFiles(req.body.buffer, options, req.user)
    for (const index in options) {
      switch (options[index]) {
        case 'rules_response': await RulesEngineModel.reloadResponseRules(req.user); break
        case 'rules_callback': await RulesEngineModel.reloadCallbackRules(req.user); break
        case 'rules_validation': await RulesEngineModel.reloadValidationRules(req.user); break
        case 'user_config.json': await Config.loadUserConfig(req.user); break
      }
    }
    res.status(200).json({ status: 'OK' })
  } catch (err) {
    res.status(400).send(err.message)
    // next(err)
  }
})

module.exports = router
