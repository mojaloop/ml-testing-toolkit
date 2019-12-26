const express = require('express')
const router = new express.Router()

router.get('/definition/:version', async (req, res, next) => {
  try {
    const openApiObjects = require('../mocking/openApiMockHandler').getOpenApiObjects()
    const reqVersionArr = req.params.version.split('.')

    const reqOpenApiDefinition = openApiObjects.find((item) => {
      if ( item.majorVersion == reqVersionArr[0] && item.minorVersion == reqVersionArr[1] ) {
        return true
      } else {
        return false
      }
    })
    if (reqOpenApiDefinition) {
      res.status(200).json(reqOpenApiDefinition.openApiBackendObject.definition)
    } else {
      res.status(404).json({ error: 'Unknown Version' })
    }
  } catch (err) {
    next(err)
  }
})

module.exports = router
