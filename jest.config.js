module.exports = {
  verbose: true,
  collectCoverageFrom: [
    '**/src/**/**/*.js'
  ],
  coverageThreshold: {
    global: {
      statements: 90,
      functions: 90,
      branches: 90,
      lines: 95
    }
  },
  modulePathIgnorePatterns: ['spec_files'],
  testEnvironment: 'node'
}
