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
const router = new express.Router()
const utils = require('../utils')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const APIManagement = require('../api-management')

router.get('/api_versions', async (req, res, next) => {
  try {
    const apiDefinitions = await require('../mocking/openApiDefinitionsModel').getApiDefinitions()

    if (apiDefinitions) {
      res.status(200).json(apiDefinitions.map(item => {
        return {
          minorVersion: item.minorVersion,
          majorVersion: item.majorVersion,
          type: item.type,
          asynchronous: item.asynchronous,
          additionalApi: item.additionalApi
        }
      }))
    } else {
      res.status(404).json({ error: 'Can not read API versions' })
    }
  } catch (err) {
    next(err)
  }
})

router.get('/definition/:type/:version', async (req, res, next) => {
  try {
    const openApiObjects = require('../mocking/openApiMockHandler').getOpenApiObjects()
    const reqVersionArr = req.params.version.split('.')
    const apiType = req.params.type

    const reqOpenApiObject = openApiObjects.find((item) => {
      if (item.majorVersion === +reqVersionArr[0] && item.minorVersion === +reqVersionArr[1] && item.type === apiType) {
        return true
      } else {
        return false
      }
    })
    if (reqOpenApiObject) {
      res.status(200).json(reqOpenApiObject.openApiBackendObject.definition)
    } else {
      res.status(404).json({ error: 'Unknown Version' })
    }
  } catch (err) {
    next(err)
  }
})

router.post('/definition', upload.single('file'), async (req, res, next) => {
  if (req.file) {
    try {
      await APIManagement.addDefinition(req.file.path, req.body.name, req.body.version, req.body.asynchronous)
      // Remove temporary file
      try { await utils.deleteFileAsync(req.file.path) } catch (err2) {}
      res.status(200).json({ message: 'API has been added successfully', fileName: req.file })
    } catch (err) {
      try { await utils.deleteFileAsync(req.file.path) } catch (err2) {}
      res.status(404).json({ error: 'Unknown format', message: err.message })
    }
  } else {
    res.status(404).json({ error: 'File not found' })
  }
})

router.delete('/definition/:type/:version', async (req, res, next) => {
  const apiType = req.params.type
  const apiVersion = req.params.version
  try {
    await APIManagement.deleteDefinition(apiType, apiVersion)
    res.status(200).json({ message: 'API has been removed successfully' })
  } catch (err) {
    console.log(err)
    res.status(404).json({ error: 'Unknown format', message: err.message })
  }
})

router.post('/validate_definition', upload.single('file'), async (req, res, next) => {
  if (req.file) {
    try {
      const document = await APIManagement.validateDefinition(req.file.path)
      // Remove temporary file
      try { await utils.deleteFileAsync(req.file.path) } catch (err2) {}
      res.status(200).json({ apiDefinition: document, fileName: req.file })
    } catch (err) {
      try { await utils.deleteFileAsync(req.file.path) } catch (err2) {}
      res.status(404).json({ error: 'Unknown format', message: err.message })
    }
  } else {
    res.status(404).json({ error: 'File not found' })
  }
})

router.get('/callback_map/:type/:version', async (req, res, next) => {
  try {
    const apiDefinitions = await require('../mocking/openApiDefinitionsModel').getApiDefinitions()
    const reqVersionArr = req.params.version.split('.')
    const apiType = req.params.type

    const reqApiDefinition = apiDefinitions.find((item) => {
      if (item.majorVersion === +reqVersionArr[0] && item.minorVersion === +reqVersionArr[1] && item.type === apiType) {
        return true
      } else {
        return false
      }
    })
    if (reqApiDefinition) {
      try {
        const rawdata = await utils.readFileAsync(reqApiDefinition.callbackMapFile)
        const reqCallbackMap = JSON.parse(rawdata)

        res.status(200).json(reqCallbackMap)
      } catch (err) {
        res.status(404).json({ error: 'Unknown Version' })
      }
    } else {
      res.status(404).json({ error: 'Unknown Version' })
    }
  } catch (err) {
    next(err)
  }
})

router.get('/response_map/:type/:version', async (req, res, next) => {
  try {
    const apiDefinitions = await require('../mocking/openApiDefinitionsModel').getApiDefinitions()
    const reqVersionArr = req.params.version.split('.')
    const apiType = req.params.type

    const reqApiDefinition = apiDefinitions.find((item) => {
      if (item.majorVersion === +reqVersionArr[0] && item.minorVersion === +reqVersionArr[1] && item.type === apiType) {
        return true
      } else {
        return false
      }
    })
    if (reqApiDefinition) {
      try {
        const rawdata = await utils.readFileAsync(reqApiDefinition.responseMapFile)
        const reqResponseMap = JSON.parse(rawdata)
        res.status(200).json(reqResponseMap)
      } catch (err) {
        res.status(404).json({ error: 'Unknown Version' })
      }
    } else {
      res.status(404).json({ error: 'Unknown Version' })
    }
  } catch (err) {
    next(err)
  }
})

module.exports = router
