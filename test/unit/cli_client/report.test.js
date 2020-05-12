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

const util = require('util')
const spyPromisify = jest.spyOn(util, 'promisify')
const axios = require('axios')
jest.mock('axios')
const report = require('../../../src/cli_client/utils/report')

const data = { 
  runtimeInformation: {
    completedTimeISO: "2020-05-07T10:44:01.687Z"
  }
}

describe('Cli client', () => {
  describe('run report functionality', () => {
    it('when the report format is json should not throw an error', async () => {
      spyPromisify.mockReturnValueOnce(jest.fn())
      await expect(report.outbound(data, {reportFormat: 'json'})).resolves.toBe(undefined)
    })
    it('when the report format is html and reportFilename present should not throw an error', async () => {
      const response = {
        'headers': {
          'content-disposition': 'attachment; filename=TTK-Assertion-Report-Test1-2020-05-08T13:53:51.887Z.html'
        }
      }
      axios.post.mockReturnValueOnce(response)
      spyPromisify.mockReturnValueOnce(jest.fn())
      await expect(report.outbound(data, {reportFormat: 'html', reportFilename: 'report'})).resolves.not.toBeNull
    })
    it('when the report format is html and reportFilename not present should not throw an error', async () => {
      const response = {
        'headers': {
          'content-disposition': 'attachment; filename=TTK-Assertion-Report-Test1-2020-05-08T13:53:51.887Z.html'
        }
      }
      axios.post.mockReturnValueOnce(response)
      spyPromisify.mockReturnValueOnce(jest.fn())
      await expect(report.outbound(data, {reportFormat: 'html'})).resolves.toBe(undefined)
    })
    it('when the report format is html and content-disposition not present should not throw an error', async () => {
      const response = {
        'headers': {}
      }
      axios.post.mockReturnValueOnce(response)
      spyPromisify.mockReturnValueOnce(jest.fn())
      await expect(report.outbound(data, {reportFormat: 'printhtml'})).resolves.toBe(undefined)
    })
    it('when the report format is html and wrong data not present should not throw an error', async () => {
      const response = {
        'headers': {
          'content-disposition': 'attachment; filname=TTK-Assertion-Report-Test1-2020-05-08T13:53:51.887Z.html'
        }
      }
      axios.post.mockReturnValueOnce(response)
      spyPromisify.mockReturnValueOnce(jest.fn())
      await expect(report.outbound(data, {reportFormat: 'printhtml'})).resolves.toBe(undefined)
    })
    it('when the report format is printhtml and reportFilename not present should not throw an error', async () => {
      const response = {
        'headers': {
          'content-disposition': 'attachment; filename=TTK-Assertion-Report-Test1-2020-05-08T13:53:51.887Z.html'
        }
      }
      axios.post.mockReturnValueOnce(response)
      spyPromisify.mockReturnValueOnce(jest.fn())
      await expect(report.outbound(data, {reportFormat: 'printhtml'})).resolves.toBe(undefined)
    })
    it('when the report format is printhtml and reportFilename not present should not throw an error', async () => {
      const response = {
        'headers': {
          'content-disposition': 'attachment; filename=TTK-Assertion-Report-Test1-2020-05-08T13:53:51.887Z.html'
        }
      }
      axios.post.mockReturnValueOnce(response)
      spyPromisify.mockReturnValueOnce(jest.fn())
      await expect(report.outbound(data, {reportFormat: 'printhtml'})).resolves.toBe(undefined)
    })
    it('when the report format is not supported should not throw an error', async () => {
      await expect(report.outbound(data, {reportFormat: 'default'})).resolves.toBe(undefined)
    })
  })
})
