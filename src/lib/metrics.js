const Metrics = require('@mojaloop/central-services-metrics')

module.exports = function metrics () {
  Metrics.setup({
    timeout: 5000,
    defaultLabels: {},
    defaultMetrics: false
  })

  const client = Metrics.getClient()
  const assertSuccess = new client.Counter({
    name: 'assert_success_total',
    help: 'Successful assertions',
    labelNames: ['job', 'test']
  })
  const assertFail = new client.Counter({
    name: 'assert_fail_total',
    help: 'Failed assertions',
    labelNames: ['job', 'test']
  })
  const testSuccess = new client.Counter({
    name: 'test_success_total',
    help: 'Successful tests',
    labelNames: ['job']
  })
  const testFail = new client.Counter({
    name: 'test_fail_total',
    help: 'Failed tests',
    labelNames: ['job']
  })
  const metrics = {
    assertSuccess: { add (value, labels) { assertSuccess.inc(labels, value) } },
    assertFail: { add (value, labels) { assertFail.inc(labels, value) } },
    testSuccess: { add (value, labels) { testSuccess.inc(labels, value) } },
    testFail: { add (value, labels) { testFail.inc(labels, value) } }
  }

  return (req, res, next) => {
    if (req.url === '/metrics') {
      res.set('Content-Type', 'text/plain; version=0.0.4')
      Metrics.getMetricsForPrometheus().then(metrics => {
        res.send(metrics)
      })
    } else {
      req.metrics = metrics
      next()
    }
  }
}
