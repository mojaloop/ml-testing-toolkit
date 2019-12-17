const express = require('express')
const rulesEngineModel = require('../rulesEngineModel')


const router = new express.Router()

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
