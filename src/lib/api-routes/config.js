const express = require('express')
const Config = require('../config')

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
    await Config.loadUserConfig()
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
