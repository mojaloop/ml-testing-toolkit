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
 * Georgi Logodazhki <georgi.logodazhki@modusbox.com> (Original Author)
 --------------
 ******/

const Util = require('util')

const spyPromisify = jest.spyOn(Util, 'promisify')

const loadSamples = require('../../../src/lib/loadSamples')

describe('loadSamples', () => { 
  describe('getSample should not throw an error when', () => {
    it('sample name should be \'multi\' if there is more than one collection', async () => {
      const queryParams = {
        collections: ['collection-1.json', 'collection-2.json'],
        environment: 'environment.json'
      }
      spyPromisify
        .mockReturnValueOnce(() => {return JSON.stringify({
            name: queryParams.collections[0],
            test_cases: [{id: 1}]
        })})
        .mockReturnValueOnce(() => {return JSON.stringify({
            name: queryParams.collections[1],
            test_cases: [{id: 1}]
        })})
        .mockReturnValueOnce(() => {return JSON.stringify({inputValues: {}})})
      const sample = await loadSamples.getSample(queryParams)      
      expect(sample).toStrictEqual({
        name: 'multi',
        inputValues: {},
        test_cases: [{id : 1}, {id : 2}]
      })
    })
    it('sample name should not be \'multi\' if there is only 1 collection', async () => {
      const queryParams = {
        collections: ['collection.json']
      }
      spyPromisify
        .mockReturnValueOnce(() => {return JSON.stringify({
          name: queryParams.collections[0],
          test_cases: [{id: 1}]
        })})
      const sample = await loadSamples.getSample(queryParams)
      expect(sample).toStrictEqual({
        name: queryParams.collections[0],
        inputValues: null,
        test_cases: [{id: 1}]
      })
    })
    it('sample name should be null if there is are no collections', async () => {
      const queryParams = {
        collections: []
      }
      const sample = await loadSamples.getSample(queryParams)
      expect(sample).toStrictEqual({
        name: null,
        inputValues: null,
        test_cases: null
      })
    })
    it('sample name should be null if collections is null', async () => {
      const queryParams = {
        collections: null
      }
      const sample = await loadSamples.getSample(queryParams)
      expect(sample).toStrictEqual({
        name: null,
        inputValues: null,
        test_cases: null
      })
    })
  })
  describe('getCollectionsOrEnvironments should not throw an error when', () => {
    it('sample name should be \'multi\' if there is more than one collection', async () => {
      spyPromisify
        .mockReturnValueOnce(() => {return [
          "sample.json", "sampleFolder"
        ]})
      const collectionsOrEnvironments = await loadSamples.getCollectionsOrEnvironments('exampleType', 'type')
      expect(collectionsOrEnvironments).toStrictEqual([ 'sample.json' ]);
    })
    it('should not throw an error when type is not provided', async () => {
      spyPromisify
        .mockReturnValueOnce(() => {return [
          "sample.json", "sampleFolder"
        ]})
      const collectionsOrEnvironments = await loadSamples.getCollectionsOrEnvironments('exampleType')
      expect(collectionsOrEnvironments).toStrictEqual([ 'sample.json' ]);
    })
  })
})
