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
