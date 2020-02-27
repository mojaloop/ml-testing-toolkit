const express = require('express')
const rulesEngineModel = require('../rulesEngineModel')

const router = new express.Router()

// Validation Rules
// Get all validation rules files
router.get('/files/validation', async (req, res, next) => {
  try {
    const result = await rulesEngineModel.getValidationRulesFiles()
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
})

// Route to get content of a validation rule file
router.get('/files/validation/:fileName', async (req, res, next) => {
  const fileName = req.params.fileName

  try {
    const result = await rulesEngineModel.getValidationRulesFileContent(fileName)
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
})

// Route to edit a validation rule file
router.put('/files/validation/:fileName', async (req, res, next) => {
  const fileName = req.params.fileName

  try {
    await rulesEngineModel.setValidationRulesFileContent(fileName, req.body)
    res.status(200).json({ status: 'OK' })
  } catch (err) {
    next(err)
  }
})

// Route to delete a validation rule file
router.delete('/files/validation/:fileName', async (req, res, next) => {
  const fileName = req.params.fileName

  try {
    await rulesEngineModel.deleteValidationRulesFile(fileName)
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
        await rulesEngineModel.setActiveValidationRulesFile(req.body.fileName)
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
    const result = await rulesEngineModel.getCallbackRulesFiles()
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
})

// Route to get content of a callback rule file
router.get('/files/callback/:fileName', async (req, res, next) => {
  const fileName = req.params.fileName

  try {
    const result = await rulesEngineModel.getCallbackRulesFileContent(fileName)
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
})

// Route to edit a callback rule file
router.put('/files/callback/:fileName', async (req, res, next) => {
  const fileName = req.params.fileName

  try {
    await rulesEngineModel.setCallbackRulesFileContent(fileName, req.body)
    res.status(200).json({ status: 'OK' })
  } catch (err) {
    next(err)
  }
})

// Route to delete a callback rule file
router.delete('/files/callback/:fileName', async (req, res, next) => {
  const fileName = req.params.fileName

  try {
    await rulesEngineModel.deleteCallbackRulesFile(fileName)
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
        await rulesEngineModel.setActiveCallbackRulesFile(req.body.fileName)
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
    const result = await rulesEngineModel.getResponseRulesFiles()
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
})

// Route to get content of a response rule file
router.get('/files/response/:fileName', async (req, res, next) => {
  const fileName = req.params.fileName

  try {
    const result = await rulesEngineModel.getResponseRulesFileContent(fileName)
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
})

// Route to edit a response rule file
router.put('/files/response/:fileName', async (req, res, next) => {
  const fileName = req.params.fileName

  try {
    await rulesEngineModel.setResponseRulesFileContent(fileName, req.body)
    res.status(200).json({ status: 'OK' })
  } catch (err) {
    next(err)
  }
})

// Route to delete a response rule file
router.delete('/files/response/:fileName', async (req, res, next) => {
  const fileName = req.params.fileName

  try {
    await rulesEngineModel.deleteResponseRulesFile(fileName)
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
        await rulesEngineModel.setActiveResponseRulesFile(req.body.fileName)
        res.status(200).json({ status: 'OK' })
        break
      default:
        throw (new Error('Unknown update type'))
    }
  } catch (err) {
    next(err)
  }
})

// Old methods
router.get('/validation', async (req, res, next) => {
  try {
    const result = await rulesEngineModel.getValidationRules()
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
})

router.put('/validation', async (req, res, next) => {
  try {
    await rulesEngineModel.setValidationRules(req.body)
    res.status(200).json({ status: 'OK' })
  } catch (err) {
    next(err)
  }
})

router.get('/callback', async (req, res, next) => {
  try {
    const result = await rulesEngineModel.getCallbackRules()
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
})

// router.put('/callback', async (req, res, next) => {
//   try {
//     await rulesEngineModel.setCallbackRules(req.body)
//     res.status(200).json({ status: 'OK'})
//   } catch (err) {
//     next(err)
//   }
// })

module.exports = router
