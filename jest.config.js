module.exports = {
  verbose: true,
  collectCoverageFrom: [
    '**/src/**/**/*.js'
  ],
  coverageThreshold: {
    global: {
      statements: 75,
      functions: 75,
      branches: 50,
      lines: 75
    }
  },
  modulePathIgnorePatterns: ['spec_files']
}
