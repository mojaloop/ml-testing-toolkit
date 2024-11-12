'use strict'

const { DiagConsoleLogger, DiagLogLevel, diag } = require('@opentelemetry/api')
const { MeterProvider } = require('@opentelemetry/sdk-metrics')
const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus')

module.exports = function metrics (app) {
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG)

  const exporter = new PrometheusExporter({ preventServerStart: true })
  const meterProvider = new MeterProvider({
    readers: [exporter]
  })
  const meter = meterProvider.getMeter('prometheus')
  const metrics = {
    assertSuccess: meter.createCounter('assertSuccess', { description: 'Successful assertions' }),
    assertFail: meter.createCounter('assertFail', { description: 'Failed assertions' }),
    testSuccess: meter.createCounter('testSuccess', { description: 'Successful tests' }),
    testFail: meter.createCounter('testFail', { description: 'Failed tests' })
  }

  return (req, res, next) => {
    if (req.url === '/metrics') {
      exporter.getMetricsRequestHandler(req, res)
    } else {
      req.metrics = metrics
      next()
    }
  }
}
