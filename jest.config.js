module.exports = {
  verbose: true,
  collectCoverageFrom: [
    '**/src/**/**/*.js'
  ],
  coverageThreshold: {
    global: {
      statements: 95,
      functions: 95,
      branches: 85,
      lines: 95
    }
  },
  modulePathIgnorePatterns: ['spec_files']
}
