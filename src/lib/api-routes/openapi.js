const express = require('express')
const router = new express.Router()
const fs = require('fs')
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile)

router.get('/api_versions', async (req, res, next) => {
  try {
    const apiDefinitions = await require('../mocking/openApiDefinitionsModel').getApiDefinitions()

    if (apiDefinitions) {
      res.status(200).json(apiDefinitions.map(item => {
        return {
          minorVersion: item.minorVersion,
          majorVersion: item.majorVersion,
          type: item.type,
          asynchronous: item.asynchronous
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
      if ( item.majorVersion == reqVersionArr[0] && item.minorVersion == reqVersionArr[1] && item.type == apiType ) {
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

router.get('/callback_map/:type/:version', async (req, res, next) => {
  try {
    const apiDefinitions = await require('../mocking/openApiDefinitionsModel').getApiDefinitions()
    const reqVersionArr = req.params.version.split('.')
    const apiType = req.params.type

    const reqApiDefinition = apiDefinitions.find((item) => {
      if ( item.majorVersion == reqVersionArr[0] && item.minorVersion == reqVersionArr[1] && item.type == apiType ) {
        return true
      } else {
        return false
      }
    })
    if (reqApiDefinition) {
      try {
        const rawdata = await readFileAsync(reqApiDefinition.callbackMapFile)
        const reqCallbackMap = JSON.parse(rawdata)

        res.status(200).json(reqCallbackMap)
      } catch (err) {
        console.log(err)
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
      if ( item.majorVersion == reqVersionArr[0] && item.minorVersion == reqVersionArr[1] && item.type == apiType ) {
        return true
      } else {
        return false
      }
    })
    if (reqApiDefinition) {
      try {
        const rawdata = await readFileAsync(reqApiDefinition.responseMapFile)
        const reqResponseMap = JSON.parse(rawdata)
        res.status(200).json(reqResponseMap)
      } catch (err) {
        console.log(err)
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
