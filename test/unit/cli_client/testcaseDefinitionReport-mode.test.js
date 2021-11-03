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

const spyReport = jest.spyOn(require('../../../src/cli_client/utils/report'), 'testcaseDefinition')
const spyExit = jest.spyOn(process, 'exit')
const spyReadFileAsync = jest.spyOn(require('../../../src/lib/utils'), 'readFileAsync')
const objectStore = require('../../../src/cli_client/objectStore')

const testcaseDefinitionReport = require('../../../src/cli_client/modes/testcaseDefinitionReport')
const spyGenerateTemplate = jest.spyOn(require('../../../src/cli_client/utils/templateGenerator'), 'generateTemplate')

describe('Cli client', () => {
  
  describe('run testcaseDefinitionReport', () => {
    it('when download is successful should not throw an error', async () => {
      const config = {
        inputFiles: "sample-cli.json",
        labels: "p2p"
      }
      spyGenerateTemplate.mockResolvedValueOnce({
        "test_cases": [
          {
            "requests": []
          }
        ]
      })
      objectStore.set('config', config)

      spyReport.mockResolvedValueOnce({})
      spyExit.mockReturnValueOnce({})
      await expect(testcaseDefinitionReport.download()).resolves.toBe(undefined)
    })
    it('when download is not successful should throw an error', async () => {
      spyReadFileAsync.mockResolvedValueOnce(JSON.stringify({
        "inputValues": {}
      }))
      const config = {
        inputFiles: "sample-cli.json",
        environmentFile: "sample-environement.json"
      }
      spyGenerateTemplate.mockResolvedValueOnce({})

      objectStore.set('config', config)

      spyReport.mockRejectedValueOnce({})
      spyExit.mockReturnValueOnce({})
      await expect(testcaseDefinitionReport.download()).resolves.toBe(undefined)
    })
  })
})
