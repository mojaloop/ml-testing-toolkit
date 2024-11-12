const Engine = require('json-rules-engine').Engine
new Engine().addRule({
  conditions: {
    all: [{
      fact: 'x',
      operator: 'equal',
      value: null,
      path: '$.y'
    }]
  },
  event: {
    type: 'x'
  }
}).run({
  x: {}
}).then(console.log, console.error)
