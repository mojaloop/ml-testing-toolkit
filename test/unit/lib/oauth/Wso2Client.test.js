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

 const Config = require('../../../../src/lib/config')
 jest.mock('../../../../src/lib/config')
 Config.getSystemConfig.mockReturnValue({
   OAUTH: {
     OAUTH2_ISSUER: ''
   }
 })
 
 const Wso2Client = require('../../../../src/lib/oauth/Wso2Client')
 const axios = require('axios')
 const AxiosMockAdapter = require('axios-mock-adapter')
 const customLogger = require('../../../../src/lib/requestLogger')
 
 jest.mock('../../../../src/lib/requestLogger')
 
 describe('Wso2Client tests', () => {
   let axiosMock
 
   beforeAll(() => {
     customLogger.logMessage.mockReturnValue()
     axiosMock = new AxiosMockAdapter(axios)
   })
 
   afterEach(() => {
     axiosMock.reset() // Reset Axios mocks between tests
   })
 
   afterAll(() => {
     axiosMock.restore() // Restore Axios to its original state
   })
 
   describe('get token', () => {
     it('should not throw an error', async () => {
       // Arrange
       axiosMock.onPost('').reply(200, {})
 
       // Act
       await Wso2Client.getToken('username', 'password')
 
       // Assert
       expect(customLogger.logMessage).toHaveBeenCalledWith(
         'info',
         expect.stringContaining('Wso2Client.getToken received'),
         { notification: false }
       )
     })
 
     it('should throw an error for failed authentication', async () => {
       // Arrange
       axiosMock.onPost('').reply(400, { message: 'Authentication failed' })
 
       // Act & Assert
       await expect(Wso2Client.getToken('username', 'password')).rejects.toThrow(
         'Authentication failed for user username'
       )
     })
 
     it('should throw an error for generic failures', async () => {
       // Arrange
       axiosMock.onPost('').networkError()
 
       // Act & Assert
       await expect(Wso2Client.getToken('username', 'password')).rejects.toThrow()
     })
   })
 })
 