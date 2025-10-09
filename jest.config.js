module.exports = {
  verbose: true,
  collectCoverageFrom: [
    '**/src/**/**/*.js'
  ],
  coverageThreshold: {
    global: {
      statements: 95,
      functions: 95,
      branches: 90,
      lines: 95
    }
  },
  modulePathIgnorePatterns: ['spec_files'],
  testEnvironment: 'node',
  testTimeout: 30000,
  // Mock ESM modules that Jest can't handle
  moduleNameMapper: {
    '^@faker-js/faker$': '<rootDir>/__mocks__/@faker-js/faker.js'
  }
}
