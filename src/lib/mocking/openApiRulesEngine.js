const util = require('util')
const { Engine } = require('json-rules-engine')
const customLogger = require('../requestLogger')

class RulesEngine {
  constructor (config) {
    this.config = config
    // this.logger = config.logger || console
    this.engine = new Engine()
    this._addCustomOperators()
  }

  _addCustomOperators () {
    this.engine.addOperator('numberStringLessThanInclusive', (a, b) => Number(a) <= b)
    this.engine.addOperator('numberStringGreaterThanInclusive', (a, b) => Number(a) >= b)
  }

  /**
   * Loads an array of rules into the engine
   *
   * @param {object[]} rules - an array of rules to load into the engine
   * @returns {undefined}
   */
  loadRules (rules) {
    try {
      rules.forEach((r) => { this.engine.addRule(r) })
      // customLogger.logMessage('info', `Rules loaded: ${util.inspect(rules, { depth: 20 })}`)
    } catch (err) {
      customLogger.logMessage('error', 'Error loading rules ' + err)
      throw err
    }
  }

  /**
   * Runs the engine to evaluate facts
   *
   * @async
   * @param {Object} facts facts to evalute
   * @returns {Promise.<Object>} response
   */
  async evaluate (facts) {
    return new Promise((resolve, reject) => {
      // customLogger.logMessage('info', `Rule engine evaluating facts: ${util.inspect(facts)}`)
      this.engine
        .run(facts)
        .then((events) => {
          // customLogger.logMessage('debug', 'Rule engine returning events', events)
          return resolve(events.events.length === 0 ? null : events.events)
        }).catch(reject)
    })
  }
}

module.exports = RulesEngine
