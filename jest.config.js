module.exports = {
  verbose: true,
  collectCoverageFrom: [
    '**/src/**/**/*.js'
  ],
  coverageThreshold: {
    global: {
      statements: 95,
      functions: 95,
      branches: 95,
      lines: 95
    }
  },
  modulePathIgnorePatterns: ['spec_files'],
  testEnvironment: 'node'
}
