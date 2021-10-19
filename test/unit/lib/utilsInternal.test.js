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

const utilsInternal = require('../../../src/lib/utilsInternal')
const customLogger = require('../../../src/lib/requestLogger')

jest.mock('../../../src/lib/requestLogger')

describe('api-server', () => {
  beforeAll(() => {
    customLogger.logMessage.mockReturnValue()
  })
  describe('when getApp is called', () => {
    it('the server should be initialized if not already', async () => {
      const functionResult = utilsInternal.getFunctionResult('{$function.generic.generateUUID}')
      expect(functionResult).not.toBe('{$function.generic.generateUUID}')
    })
    it('the server should be initialized if not already', async () => {
      const functionResult = utilsInternal.getFunctionResult('{$function.generica.generateUUID}')
      expect(functionResult).toBe('{$function.generica.generateUUID}')
    })
    it('the server should be initialized if not already', async () => {
      const functionResult = utilsInternal.getFunctionResult('{$function.generic.}')
      expect(functionResult).toBe('{$function.generic.}')
    })
    it('the server should be initialized if not already', async () => {
      const functionResult = utilsInternal.getFunctionResult('{$function.}')
      expect(functionResult).toBe('{$function.}')
    })
  })
})
