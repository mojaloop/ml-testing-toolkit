/*****
 License
 --------------
 Copyright © 2020-2025 Mojaloop Foundation
 The Mojaloop files are made available by the Mojaloop Foundation under the Apache License, Version 2.0 (the "License") and you may not use these files except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, the Mojaloop files are distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

 Contributors
 --------------
 This is the official list of the Mojaloop project contributors for this file.
 Names of the original copyright holders (individuals or organizations)
 should be listed with a '*' in the first column. People who have
 contributed from an organization can be listed under the organization
 that actually holds the copyright for their contributions (see the
 Mojaloop Foundation for an example). Those individuals should have
 their names indented and be marked with a '-'. Email address can be added
 optionally within square brackets <email>.

 * Mojaloop Foundation
 - Name Surname <name.surname@mojaloop.io>

 * ModusBox
 * Vijaya Kumar Guthi <vijaya.guthi@modusbox.com> (Original Author)
 --------------
 ******/

const { Engine } = require('json-rules-engine')
const customLogger = require('./requestLogger')

class RulesEngine {
  constructor (config) {
    this.config = config
    this.init()
  }

  init () {
    this.engine = new Engine()
    this._addCustomOperators()
  }

  _addCustomOperators () {
    this.engine.addOperator('numberStringLessThanInclusive', (a, b) => Number(a) <= b)
    this.engine.addOperator('numberStringGreaterThanInclusive', (a, b) => Number(a) >= b)
    this.engine.addOperator('numericEqual', (a, b) => Number(a) === Number(b))
    this.engine.addOperator('numericNotEqual', (a, b) => Number(a) !== Number(b))
    this.engine.addOperator('numericLessThan', (a, b) => Number(a) < Number(b))
    this.engine.addOperator('numericGreaterThan', (a, b) => Number(a) > Number(b))
    this.engine.addOperator('numericLessThanInclusive', (a, b) => Number(a) <= Number(b))
    this.engine.addOperator('numericGreaterThanInclusive', (a, b) => Number(a) >= Number(b))
    this.engine.addOperator('includesString', (a, b) => a.includes(b))
    this.engine.addOperator('excludesString', (a, b) => !a.includes(b))
  }

  /**
   * Loads an array of rules into the engine
   *
   * @param {object[]} rules - an array of rules to load into the engine
   * @returns {undefined}
   */
  loadRules (rules, user) {
    try {
      this.init()
      const rulesLength = rules.length
      rules.forEach((r, index) => {
        r.priority = rulesLength - index
        this.engine.addRule(r)
      })
    } catch (err) {
      customLogger.logMessage('error', 'Error loading rules ' + err, { notification: false })
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
      this.engine
        .run(facts)
        .then((events) => {
          return resolve(events.events.length === 0 ? null : events.events)
        }).catch(reject)
    })
  }
}

module.exports = RulesEngine
