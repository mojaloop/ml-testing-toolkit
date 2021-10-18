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

const SharedLib = require('@mojaloop/ml-testing-toolkit-shared-lib')
const Utils = require('../../../src/lib/utils')

jest.mock('@mojaloop/ml-testing-toolkit-shared-lib')
jest.mock('../../../src/lib/utils')

const TemplateGenerator = require('../../../src/cli_client/utils/templateGenerator')

describe('Cli client', () => {
  describe('run template generator', () => {
    it('when passing a file, template should be generated', async () => {
      const fileList = ['test.json']
      
      Utils.fileStatAsync.mockResolvedValueOnce({
        isFile: () => true
      })
      Utils.readFileAsync.mockResolvedValueOnce(JSON.stringify({}))
      SharedLib.FolderParser.getFolderData.mockReturnValueOnce({})
      SharedLib.FolderParser.getTestCases.mockReturnValueOnce([])

      await expect(TemplateGenerator.generateTemplate(fileList)).resolves.toBeDefined()
    })
    it('when passing a folder without master file and no selected labels, template should be generated', async () => {
      const fileList = ['test-folder']

      // fileList['test-folder']
      Utils.fileStatAsync.mockResolvedValueOnce({
        isFile: () => false,
        isDirectory: () => true
      }) 
      Utils.readRecursiveAsync.mockResolvedValueOnce(["test.json"])

      // fileList['test-folder']['test.json']
      Utils.readFileAsync.mockResolvedValueOnce(JSON.stringify({}))
      SharedLib.FolderParser.getFolderData.mockReturnValueOnce({})
      SharedLib.FolderParser.getTestCases.mockReturnValueOnce([])
      
      await expect(TemplateGenerator.generateTemplate(fileList)).resolves.toBeDefined()
    })
    it('when passing a folder with master file and selected labels, template should be generated', async () => {
      const fileList = ['test-labels']
      const selectedLabels = ["test"]
      
      // fileList['test-labels']
      Utils.fileStatAsync.mockResolvedValueOnce({
        isFile: () => false,
        isDirectory: () => true
      }) 
      Utils.readRecursiveAsync.mockResolvedValueOnce(["test.json", "test2.json", "master.json"])
      
      // fileList['test-labels']['test.json']
      Utils.readFileAsync.mockResolvedValueOnce(JSON.stringify({}))
      SharedLib.FolderParser.getFolderData.mockReturnValueOnce({})
      SharedLib.FolderParser.getTestCases.mockReturnValueOnce([])

      // fileList['test-labels']['test2.json']
      Utils.readFileAsync.mockResolvedValueOnce(JSON.stringify({}))
      SharedLib.FolderParser.getFolderData.mockReturnValueOnce({})
      SharedLib.FolderParser.getTestCases.mockReturnValueOnce()

      // fileList['test-labels']['master.json']
      Utils.readFileAsync.mockResolvedValueOnce(JSON.stringify({
        order: [
          {
            name: "test.json",
            type: "file",
            labels: ["test"]
          },
          {
            name: "test2.json",
            type: "file"
          }
        ]
      }))
      
      await expect(TemplateGenerator.generateTemplate(fileList, selectedLabels)).resolves.toBeDefined()
    })
    it('when a file can not be read, template should not be generated', async () => {
      Utils.fileStatAsync
        .mockResolvedValueOnce({
          isFile: () => true
        })
      Utils.readFileAsync
        .mockRejectedValueOnce({})
      SharedLib.FolderParser.sequenceTestCases
        .mockImplementationOnce(() => {
          throw new Error("expected error")
        })
      
      const fileList = ["test.json"]
      await expect(TemplateGenerator.generateTemplate(fileList)).resolves.toBeDefined()
    })
  })
})
