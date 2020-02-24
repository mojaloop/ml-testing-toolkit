const { stub } = require('sinon')

const mockRequest = (options = {}) => ({
  body: {},
  cookies: {},
  query: {},
  params: {},
  headers: {},
  customInfo: {},
  get: stub(),
  ...options
})

module.exports = mockRequest
