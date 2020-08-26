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
const rulesEngineModel = require('../rulesEngineModel')

const router = new express.Router()
const { body, validationResult } = require('express-validator')

// Validation Rules
// Get all validation rules files
router.get('/files/validation', async (req, res, next) => {
  try {
    const result = await rulesEngineModel.getValidationRulesFiles(req.user)
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
})

// Route to get content of a validation rule file
router.get('/files/validation/:fileName', async (req, res, next) => {
  const fileName = req.params.fileName
  try {
    const result = await rulesEngineModel.getValidationRulesFileContent(fileName, req.user)
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
})

// Route to edit a validation rule file
router.put('/files/validation/:fileName', [
  body().isArray()
], async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }

  const fileName = req.params.fileName

  try {
    await rulesEngineModel.setValidationRulesFileContent(fileName, req.body, req.user)
    res.status(200).json({ status: 'OK' })
  } catch (err) {
    next(err)
  }
})

// Route to delete a validation rule file
router.delete('/files/validation/:fileName', async (req, res, next) => {
  const fileName = req.params.fileName

  try {
    await rulesEngineModel.deleteValidationRulesFile(fileName, req.user)
    res.status(200).json({ status: 'OK' })
  } catch (err) {
    next(err)
  }
})

// Route to modify configuration in validation rules
router.put('/files/validation', async (req, res, next) => {
  const reqType = req.body.type
  try {
    switch (reqType) {
      case 'activeRulesFile':
        await rulesEngineModel.setActiveValidationRulesFile(req.body.fileName, req.user)
        res.status(200).json({ status: 'OK' })
        break
      default:
        throw (new Error('Unknown update type'))
    }
  } catch (err) {
    next(err)
  }
})

// Callback Rules
// Get all callback rules files
router.get('/files/callback', async (req, res, next) => {
  try {
    const result = await rulesEngineModel.getCallbackRulesFiles(req.user)
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
})

// Route to get content of a callback rule file
router.get('/files/callback/:fileName', async (req, res, next) => {
  const fileName = req.params.fileName

  try {
    const result = await rulesEngineModel.getCallbackRulesFileContent(fileName, req.user)
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
})

// Route to edit a callback rule file
router.put('/files/callback/:fileName', async (req, res, next) => {
  const fileName = req.params.fileName

  try {
    await rulesEngineModel.setCallbackRulesFileContent(fileName, req.body, req.user)
    res.status(200).json({ status: 'OK' })
  } catch (err) {
    next(err)
  }
})

// Route to delete a callback rule file
router.delete('/files/callback/:fileName', async (req, res, next) => {
  const fileName = req.params.fileName

  try {
    await rulesEngineModel.deleteCallbackRulesFile(fileName, req.user)
    res.status(200).json({ status: 'OK' })
  } catch (err) {
    next(err)
  }
})

// Route to modify configuration in callback rules
router.put('/files/callback', async (req, res, next) => {
  const reqType = req.body.type
  try {
    switch (reqType) {
      case 'activeRulesFile':
        await rulesEngineModel.setActiveCallbackRulesFile(req.body.fileName, req.user)
        res.status(200).json({ status: 'OK' })
        break
      default:
        throw (new Error('Unknown update type'))
    }
  } catch (err) {
    next(err)
  }
})

// Response Rules
// Get all response rules files
router.get('/files/response', async (req, res, next) => {
  try {
    const result = await rulesEngineModel.getResponseRulesFiles(req.user)
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
})

// Route to get content of a response rule file
router.get('/files/response/:fileName', async (req, res, next) => {
  const fileName = req.params.fileName

  try {
    const result = await rulesEngineModel.getResponseRulesFileContent(fileName, req.user)
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
})

// Route to edit a response rule file
router.put('/files/response/:fileName', async (req, res, next) => {
  const fileName = req.params.fileName

  try {
    await rulesEngineModel.setResponseRulesFileContent(fileName, req.body, req.user)
    res.status(200).json({ status: 'OK' })
  } catch (err) {
    next(err)
  }
})

// Route to delete a response rule file
router.delete('/files/response/:fileName', async (req, res, next) => {
  const fileName = req.params.fileName

  try {
    await rulesEngineModel.deleteResponseRulesFile(fileName, req.user)
    res.status(200).json({ status: 'OK' })
  } catch (err) {
    next(err)
  }
})

// Route to modify configuration in response rules
router.put('/files/response', async (req, res, next) => {
  const reqType = req.body.type
  try {
    switch (reqType) {
      case 'activeRulesFile':
        await rulesEngineModel.setActiveResponseRulesFile(req.body.fileName, req.user)
        res.status(200).json({ status: 'OK' })
        break
      default:
        throw (new Error('Unknown update type'))
    }
  } catch (err) {
    next(err)
  }
})

// Forward Rules
// Get all forward rules files
router.get('/files/forward', async (req, res, next) => {
  try {
    const result = await rulesEngineModel.getForwardRulesFiles(req.user)
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
})

// Route to get content of a forward rule file
router.get('/files/forward/:fileName', async (req, res, next) => {
  const fileName = req.params.fileName
  try {
    const result = await rulesEngineModel.getForwardRulesFileContent(fileName, req.user)
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
})

// Route to edit a forward rule file
router.put('/files/forward/:fileName', async (req, res, next) => {
  const fileName = req.params.fileName

  try {
    await rulesEngineModel.setForwardRulesFileContent(fileName, req.body, req.user)
    res.status(200).json({ status: 'OK' })
  } catch (err) {
    next(err)
  }
})

// Route to delete a callback rule file
router.delete('/files/forward/:fileName', async (req, res, next) => {
  const fileName = req.params.fileName

  try {
    await rulesEngineModel.deleteForwardRulesFile(fileName, req.user)
    res.status(200).json({ status: 'OK' })
  } catch (err) {
    next(err)
  }
})

// Route to modify configuration in forward rules
router.put('/files/forward', async (req, res, next) => {
  const reqType = req.body.type
  try {
    switch (reqType) {
      case 'activeRulesFile':
        await rulesEngineModel.setActiveForwardRulesFile(req.body.fileName, req.user)
        res.status(200).json({ status: 'OK' })
        break
      default:
        throw (new Error('Unknown update type'))
    }
  } catch (err) {
    next(err)
  }
})

module.exports = router
