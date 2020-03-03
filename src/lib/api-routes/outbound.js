const express = require('express')

const router = new express.Router()
const axios = require('axios').default
const Config = require('../config')
const customLogger = require('../requestLogger')
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
      url: Config.getUserConfig().CALLBACK_ENDPOINT + req.body.path,
      headers: req.body.headers,
      data: req.body.body,
      timeout: 3000,
      validateStatus: function (status) {
        return status < 900 // Reject only if the status code is greater than or equal to 900
      }
    }).then((result) => {
      customLogger.logMessage('info', 'Received response ' + result.status + ' ' + result.statusText, result.data, false)
    }, (err) => {
      customLogger.logMessage('info', 'Failed to send request ' + req.body.method + ' ' + req.body.path, err, false)
    })
    res.status(200).json({ status: 'OK' })
  } catch (err) {
    next(err)
  }
})

// Route to send series of outbound requests based on the given template
router.post('/template/:outboundID', async (req, res, next) => {
  try {
    const outboundID = req.params.outboundID
    const inputJson = JSON.parse(JSON.stringify(req.body))
    // Validate the template format
    if (!inputJson.name) {
      return res.status(422).json({ errors: 'Template name is missing' })
    }
    if (!inputJson.requests) {
      return res.status(422).json({ errors: 'Template requests are missing' })
    }
    const outbound = require('../test-outbound/outbound-initiator')
    outbound.OutboundSend(inputJson, outboundID)

    res.status(200).json({ status: 'OK' })
  } catch (err) {
    next(err)
  }
})

module.exports = router
