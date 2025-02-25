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
 * Georgi Logodazhki <georgi.logodazhki@modusbox.com>
 * Vijaya Kumar Guthi <vijaya.guthi@modusbox.com> (Original Author)
 --------------
 ******/

'use strict'

const RulesEngine = require('../../../src/lib/rulesEngine')

describe('RulesEngine', () => {
  const numberStringLessThanInclusiveRule = {
    conditions: {
      all: [
        {
          fact: 'amount',
          operator: 'numberStringLessThanInclusive',
          value: '50'
        }
      ]
    },
    event: {
      type: 'numberStringLessThanInclusive'
    }
  }
  const numberStringGreaterThanInclusiveRule = {
    conditions: {
      all: [
        {
          fact: 'amount',
          operator: 'numberStringGreaterThanInclusive',
          value: '50'
        }
      ]
    },
    event: {
      type: 'numberStringGreaterThanInclusive'
    }
  }
  const numericEqualRule = {
    conditions: {
      all: [
        {
          fact: 'amount',
          operator: 'numericEqual',
          value: '50'
        }
      ]
    },
    event: {
      type: 'numericEqual'
    }
  }
  const numericNotEqualRule = {
    conditions: {
      all: [
        {
          fact: 'amount',
          operator: 'numericNotEqual',
          value: '50'
        }
      ]
    },
    event: {
      type: 'numericNotEqual'
    }
  }
  const numericLessThanRule = {
    conditions: {
      all: [
        {
          fact: 'amount',
          operator: 'numericLessThan',
          value: '50'
        }
      ]
    },
    event: {
      type: 'numericLessThan'
    }
  }
  const numericGreaterThanRule = {
    conditions: {
      all: [
        {
          fact: 'amount',
          operator: 'numericGreaterThan',
          value: '50'
        }
      ]
    },
    event: {
      type: 'numericGreaterThan'
    }
  }
  const numericLessThanInclusiveRule = {
    conditions: {
      all: [
        {
          fact: 'amount',
          operator: 'numericLessThanInclusive',
          value: '50'
        }
      ]
    },
    event: {
      type: 'numericLessThanInclusive'
    }
  }
  const numericGreaterThanInclusiveRule = {
    conditions: {
      all: [
        {
          fact: 'amount',
          operator: 'numericGreaterThanInclusive',
          value: '50'
        }
      ]
    },
    event: {
      type: 'numericGreaterThanInclusive'
    }
  }
  describe('Load Rules Engine', () => {
    const sampleRulesEngine = new RulesEngine()
    it('Load a rule without event', async () => {
      const {event, ...wrongRule} = numericLessThanRule
      expect( () => { 
        sampleRulesEngine.loadRules([wrongRule])
      }).toThrow()
    })
    it('Load a rule without conditions', async () => {
      const {conditions, ...wrongRule} = numericLessThanRule
      expect( () => { 
        sampleRulesEngine.loadRules([wrongRule])
      }).toThrow()
    })
    it('Load a sample rule', async () => {
      expect( () => { 
        sampleRulesEngine.loadRules([numericLessThanRule])
      }).not.toThrow()
    })
  })
  describe('Evaluate Facts in Rules Engine', () => {
    const sampleRulesEngine = new RulesEngine()
    it('Prioritize rules', async () => {
      expect( () => { 
        sampleRulesEngine.loadRules([
          numberStringLessThanInclusiveRule,
          numberStringGreaterThanInclusiveRule,
          numericEqualRule,
          numericNotEqualRule,
          numericLessThanRule,
          numericGreaterThanRule,
          numericLessThanInclusiveRule,
          numericGreaterThanInclusiveRule
        ])
      }).not.toThrow()
    })
    it('Evaluate matching facts', async () => {
      const numberStringLessThanInclusiveFacts = {
        amount: '50'
      }
      const numberStringGreaterThanInclusiveFacts = {
        amount: '50'
      }
      const numericEqualFacts = {
        amount: '50'
      }
      const numericNotEqualFacts = {
        amount: '51'
      }
      const numericLessThanFacts = {
        amount: '49',
      }
      const numericGreaterThanFacts = {
        amount: '51',
      }
      const numericLessThanInclusiveRuleFacts = {
        amount: '50',
      }
      const numericGreaterThanInclusiveRuleFacts = {
        amount: '50',
      }
      await expect(sampleRulesEngine.evaluate(numberStringLessThanInclusiveFacts)).resolves.toEqual([
        {type: 'numberStringLessThanInclusive'},
        {type: 'numberStringGreaterThanInclusive'},
        {type: 'numericEqual'},
        {type: 'numericLessThanInclusive'},
        {type: 'numericGreaterThanInclusive'}
      ])
      await expect(sampleRulesEngine.evaluate(numberStringGreaterThanInclusiveFacts)).resolves.toEqual([
        {type: 'numberStringLessThanInclusive'},
        {type: 'numberStringGreaterThanInclusive'},
        {type: 'numericEqual'},
        {type: 'numericLessThanInclusive'},
        {type: 'numericGreaterThanInclusive'}
      ])
      await expect(sampleRulesEngine.evaluate(numericEqualFacts)).resolves.toEqual([
        {type: 'numberStringLessThanInclusive'},
        {type: 'numberStringGreaterThanInclusive'},
        {type: 'numericEqual'},
        {type: 'numericLessThanInclusive'},
        {type: 'numericGreaterThanInclusive'}
      ])
      await expect(sampleRulesEngine.evaluate(numericNotEqualFacts)).resolves.toEqual([
        {type: 'numberStringGreaterThanInclusive'},
        {type: 'numericNotEqual'},
        {type: 'numericGreaterThan'},
        {type: 'numericGreaterThanInclusive'}
      ])
      await expect(sampleRulesEngine.evaluate(numericLessThanFacts)).resolves.toEqual([
        {type: 'numberStringLessThanInclusive'},
        {type: 'numericNotEqual'},
        {type: 'numericLessThan'},
        {type: 'numericLessThanInclusive'}
      ])
      await expect(sampleRulesEngine.evaluate(numericGreaterThanFacts)).resolves.toEqual([
        {type: 'numberStringGreaterThanInclusive'},
        {type: 'numericNotEqual'},
        {type: 'numericGreaterThan'},
        {type: 'numericGreaterThanInclusive'}
      ])
      await expect(sampleRulesEngine.evaluate(numericLessThanInclusiveRuleFacts)).resolves.toEqual([
        {type: 'numberStringLessThanInclusive'},
        {type: 'numberStringGreaterThanInclusive'},
        {type: 'numericEqual'},
        {type: 'numericLessThanInclusive'},
        {type: 'numericGreaterThanInclusive'}
      ])
      await expect(sampleRulesEngine.evaluate(numericGreaterThanInclusiveRuleFacts)).resolves.toEqual([
        {type: 'numberStringLessThanInclusive'},
        {type: 'numberStringGreaterThanInclusive'},
        {type: 'numericEqual'},
        {type: 'numericLessThanInclusive'},
        {type: 'numericGreaterThanInclusive'}
      ])
    })
  })
  describe('Evaluate Facts in Rules Engine', () => {
    const sampleRulesEngine = new RulesEngine()
    it('Prioritize rules', async () => {
      expect( () => { 
        sampleRulesEngine.loadRules([
          numericLessThanRule,
          numberStringLessThanInclusiveRule
        ])
      }).not.toThrow()
    })
    it('Evaluate non matching facts', async () => {
      const facts1 = {
        amount: 150
      }
      await expect(sampleRulesEngine.evaluate(facts1)).resolves.toEqual(null)
    })
  })

})
