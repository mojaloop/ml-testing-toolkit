/*****
 License
 --------------
 Copyright © 2017 Bill & Melinda Gates Foundation
 The Mojaloop files are made available by the Bill & Melinda Gates Foundation under the Apache License, Version 2.0 (the "License") and you may not use these files except in compliance with the License. You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, the Mojaloop files are distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 Contributors
 --------------
 This is the official list of the Mojaloop project contributors for this file.
 Names of the original copyright holders (individuals or organizations)
 should be listed with a '*' in the first column. People who have
 contributed from an organization can be listed under the organization
 that actually holds the copyright for their contributions (see the
 Gates Foundation organization for an example). Those individuals should have
 their names indented and be marked with a '-'. Email address can be added
 optionally within square brackets <email>.
 * Gates Foundation

 * ModusBox
 * Vijaya Kumar Guthi <vijaya.guthi@modusbox.com> (Original Author)
 --------------
 ******/

'use strict'

const RulesEngine = require('../../../src/lib/rulesEngine')

describe('RulesEngine', () => {
  const sampleRule1 = {
      conditions: {
        all: [
          {
            fact: 'name',
            operator: 'equal',
            value: 'a'
          }
        ]
      },
      event: {
        type: 'test1'
      }
  }
  const sampleRule2 = {
      conditions: {
        all: [
          {
            fact: 'name',
            operator: 'equal',
            value: 'b'
          }
        ]
      },
      event: {
        type: 'test2'
      }
  }
  describe('Load Rules Engine', () => {
    const sampleRulesEngine = new RulesEngine()
    it('Load a rule without event', async () => {
      const {event, ...wrongRule} = sampleRule1
      expect( () => { 
        sampleRulesEngine.loadRules([wrongRule])
      }).toThrow()
    })
    it('Load a rule without conditions', async () => {
      const {conditions, ...wrongRule} = sampleRule1
      expect( () => { 
        sampleRulesEngine.loadRules([wrongRule])
      }).toThrow()
    })
    it('Load a sample rule', async () => {
      expect( () => { 
        sampleRulesEngine.loadRules([sampleRule1])
      }).not.toThrow()
    })
  })
  describe('Evaluate Facts in Rules Engine', () => {
    const sampleRulesEngine = new RulesEngine()
    it('Load two sample rules', async () => {
      expect( () => { 
        sampleRulesEngine.loadRules([sampleRule1, sampleRule2])
      }).not.toThrow()
    })
    it('Evaluate matching facts', async () => {
      const facts1 = {
        name: 'a'
      }
      const facts2 = {
        name: 'b'
      }
      await expect(sampleRulesEngine.evaluate(facts1)).resolves.toEqual([{type: 'test1'}])
      await expect(sampleRulesEngine.evaluate(facts2)).resolves.toEqual([{type: 'test2'}])
    })
    it('Evaluate non matching facts', async () => {
      const facts1 = {
        name: 'c'
      }
      await expect(sampleRulesEngine.evaluate(facts1)).resolves.toEqual(null)
    })
  })

})
