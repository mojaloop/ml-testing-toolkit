'use strict'

const request = require('request-promise-native')

const {
  TEST_TOOLKIT_HOST,
  API_PORT
} = require('../util/testConfig')

describe('plugins', () => {
  describe('hapi-swagger', () => {

    it('Checks the health endpoint', async () => {
      // Arrange
      const options = {
        uri: `http://${TEST_TOOLKIT_HOST}:${API_PORT}/health`,
        json: true,
        simple: true
      }

      // Act
      const result = await request(options)

      // Assert
      expect(result.status).toBe('OK')
    })
  })
})