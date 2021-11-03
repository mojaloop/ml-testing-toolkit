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

const spyExit = jest.spyOn(process, 'exit')
const { cli } = require('../../../src/cli_client/router')

jest.mock('../../../src/cli_client/utils/listeners')
jest.mock('../../../src/cli_client/modes/outbound')
jest.mock('../../../src/cli_client/modes/testcaseDefinitionReport')

describe('Cli client', () => {
  describe('running router', () => {
    it('when mode is monitoring should not throw an error', async () => {
      const config = {
        "mode": "monitoring"
      }  
      spyExit.mockImplementationOnce(jest.fn())
      expect(() => {
        cli(config)
      }).not.toThrowError();
    })
    it('when mode is outbound and inputFiles is provided should not throw an error', async () => {
      const config = {
        "mode": "outbound",
        "inputFiles": "test"
      }
      spyExit.mockImplementationOnce(jest.fn())
      expect(() => {
        cli(config)
      }).not.toThrowError();
    })
    it('when mode is outbound, inputFiles and environmentFile is provided should not throw an error', async () => {
      const config = {
        "mode": "outbound",
        "inputFiles": "test",
        "environmentFile": "test"
      }
      spyExit.mockImplementationOnce(jest.fn())
      expect(() => {
        cli(config)
      }).not.toThrowError();
    })
    it('when mode is outbound and inputFile was not provided should not throw an error', async () => {
      const config = {
        "mode": "outbound"
      }
      spyExit.mockImplementationOnce(jest.fn())
      expect(() => {
        cli(config)
      }).not.toThrowError();
    })
    it('when mode is testcaseDefinitionReport and inputFile was provided should not throw an error', async () => {
      const config = {
        "mode": "testcaseDefinitionReport",
        "inputFiles": "test"
      }
      spyExit.mockImplementationOnce(jest.fn())
      expect(() => {
        cli(config)
      }).not.toThrowError();
    })
    it('when mode is testcaseDefinitionReport and inputFile was not provided should throw an error', async () => {
      const config = {
        "mode": "testcaseDefinitionReport"
      }
      spyExit.mockImplementationOnce(jest.fn())
      expect(() => {
        cli(config)
      }).not.toThrowError();
    })
    it('when mode is not supported should not throw an error', async () => {
      const config = {
        "mode": "unsupported"
      }
      spyExit.mockImplementationOnce(jest.fn())
      expect(() => {
        cli(config)
      }).not.toThrowError();
    })
    it('when mode is not provided should not throw an error', async () => {
      const config = {}
      spyExit.mockImplementationOnce(jest.fn())
      expect(() => {
        cli(config)
      }).not.toThrowError();
    })
  })
})
