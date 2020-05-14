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
'use strict'

const axios = require('axios')
const spyReport = jest.spyOn(require('../../../src/cli_client/utils/report'), 'outbound')
const spyLogger = jest.spyOn(require('../../../src/cli_client/utils/logger'), 'outbound')
const spyExit = jest.spyOn(process, 'exit')
const spyAxios = jest.spyOn(axios, 'post')
const spyPromisify = jest.spyOn(require('util'), 'promisify')

const outbound = require('../../../src/cli_client/modes/outbound')

describe('Cli client', () => {
  describe('run outbound mode', () => {
    it('when status is FINISHED and assertion passed should not throw an error', async () => {
      const progress = {
        "status": "FINISHED"
      }
      spyReport.mockReturnValueOnce({})
      spyLogger.mockReturnValueOnce(true)
      spyExit.mockReturnValueOnce({})
      expect(() => {
        outbound.handleIncomingProgress(progress)
      }).not.toThrowError()
    })
    it('when status is FINISHED, assertions passed and there is an error should not throw an error', async () => {
      const progress = {
        "status": "FINISHED"
      }
      spyReport.mockImplementationOnce(() => {throw new Error('expected error')})
      spyLogger.mockReturnValueOnce(true)
      spyExit.mockReturnValueOnce({})
      expect(() => {
        outbound.handleIncomingProgress(progress)
      }).not.toThrowError()
    })
    it('when status is FINISHED and assertions failed should not throw an error', async () => {
      const progress = {
        "status": "FINISHED"
      }
      spyReport.mockReturnValueOnce({})
      spyLogger.mockReturnValueOnce(false)
      spyExit.mockReturnValueOnce({})
      expect(() => {
        outbound.handleIncomingProgress(progress)
      }).not.toThrowError()
    })
    it('when status is not FINISHED should not throw an error', async () => {
      const progress = {
        "status": "IN PROGRESS"
      }
      spyExit.mockReturnValueOnce({})
      expect(() => {
        outbound.handleIncomingProgress(progress)
      }).not.toThrowError()
    })
  })
  describe('run sendTemplate', () => {
    it('when readFile returns data should not throw an error', async () => {
      spyPromisify.mockReturnValueOnce(() => {
        return JSON.stringify({
          "test_cases": [
            {
              "requests": []
            }
          ]
        })
      })
      const configuration = {
        "inputFile": "sample-cli.json"
      }
      spyAxios.mockReturnValue({})
      await expect(outbound.sendTemplate(configuration)).resolves.toBe(undefined)
    })
    it('when readFile throws error should not throw an error', async () => {
      spyPromisify.mockReturnValueOnce(() => {throw new Error('expected error')})
      const configuration = {
        "inputFile": "sample-cli.json"
      }
      await expect(outbound.sendTemplate(configuration)).resolves.toBe(undefined)
    })
  })
})
