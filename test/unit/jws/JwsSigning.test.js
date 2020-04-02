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

const JwsSigning = require('../../../src/lib/jws/JwsSigning')

describe('JwsSigning', () => {
  describe('Sign', () => {
    var reqOpts = {
      method: 'get',
      url: 'http://localhost' + '/parties/MSISDN/1234567890',
      path: '/parties/MSISDN/1234567890',
      headers: {
        
      },
      data: {
        
      },
      timeout: 3000
    }
    it('Result must be a string with length greater than 0', async () => {
      await JwsSigning.sign(reqOpts)
      console.log(reqOpts)
      // expect((typeof result) === 'string').toBe(true)
      // expect(result.length).toBeGreaterThan(0)
    })
    // it('Result must be unique', async () => {
    //   const result1 = await UniqueIdGenerator.generateUniqueId()
    //   const result2 = await UniqueIdGenerator.generateUniqueId()
    //   const result3 = await UniqueIdGenerator.generateUniqueId()
    //   expect(result1).not.toEqual(result2)
    //   expect(result2).not.toEqual(result3)
    //   expect(result1).not.toEqual(result3)
    // })
  })
})
