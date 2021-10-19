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
const objectStore = require('../objectStore')
const longpollingEmitter = require('../longpollingEmitter')
// const Config = require('../config')

const router = new express.Router()
// const { check, validationResult } = require('express-validator')

// Method to monitor requests came to toolkit
router.get('/requests/*', async (req, res, next) => {
  const eventPath = req.path.replace('/requests', '')
  try {
    // Check if the required path is already in the assertion store
    const storedAssertion = objectStore.popObject('requests', eventPath, req.user)
    if (storedAssertion) {
      res.status(200).json({ headers: storedAssertion.headers, data: storedAssertion.body })
    } else {
      longpollingEmitter.setAssertionStoreEmitter('requests', eventPath, res, req.user)
    }
  } catch (err) {
    res.status(500).json({ error: err && err.message })
  }
})

// Method to monitor callbacks generated by toolkit
router.get('/callbacks/*', async (req, res, next) => {
  const eventPath = req.path.replace('/callbacks', '')
  try {
    // Check if the required path is already in the assertion store
    const storedAssertion = objectStore.popObject('callbacks', eventPath)
    if (storedAssertion) {
      res.status(200).json({ headers: storedAssertion.headers, data: storedAssertion.body })
    } else {
      longpollingEmitter.setAssertionStoreEmitter('callbacks', eventPath, res, req.user)
    }
  } catch (err) {
    res.status(500).json({ error: err && err.message })
  }
})

module.exports = router
