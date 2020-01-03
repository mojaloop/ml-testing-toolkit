const express = require('express')
const rulesEngineModel = require('../rulesEngineModel')


const router = new express.Router()

// Get rules files
router.get('/files/callback', async (req, res, next) => {
  try {
    const result = await rulesEngineModel.getCallbackRulesFiles()
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
})

router.get('/files/callback/:fileName', async (req, res, next) => {
  const fileName = req.params.fileName

  try {
    const result = await rulesEngineModel.getCallbackRulesFileContent(fileName)
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
})

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
    res.status(200).json({ status: 'OK'})
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

router.put('/callback', async (req, res, next) => {
  try {
    await rulesEngineModel.setCallbackRules(req.body)
    res.status(200).json({ status: 'OK'})
  } catch (err) {
    next(err)
  }
})

module.exports = router
