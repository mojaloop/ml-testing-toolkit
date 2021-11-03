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
const objectStore = require('../../../src/cli_client/objectStore')
const spyObjectStoreGet = jest.spyOn(objectStore, 'get')
const s3Upload = require('../../../src/cli_client/extras/s3-upload')
jest.mock('../../../src/cli_client/extras/s3-upload')
const report = require('../../../src/cli_client/utils/report')
const Utils = require('../../../src/lib/utils')
const SpyWriteFileAsync = jest.spyOn(Utils, 'writeFileAsync')



const data = { 
  runtimeInformation: {
    completedTimeISO: "2020-05-07T10:44:01.687Z"
  }
}

describe('Cli client', () => {
  describe('run testcaseDefinitionReport functionality', () => {
    it('when the report format is json should not throw an error', async () => {
      spyPromisify.mockReturnValueOnce(jest.fn())
      const config = {
        reportFormat: 'json'
      }
      objectStore.set('config', config)
      await expect(report.testcaseDefinition(data)).resolves.not.toBeNull
    })
  })
  describe('run outbound functionality', () => {
    it('when the report format is json should not throw an error', async () => {
      spyPromisify.mockReturnValueOnce(jest.fn())
      const config = {
        reportFormat: 'json'
      }
      objectStore.set('config', config)
      await expect(report.outbound(data)).resolves.not.toBeNull
    })
    it('when the report format is html and reportAutoFilenameEnable present should not throw an error', async () => {
      const response = {
        'headers': {
          'content-disposition': 'attachment; filename=TTK-Assertion-Report-Test1-2020-05-08T13:53:51.887Z.html'
        }
      }
      axios.post.mockReturnValueOnce(response)
      spyPromisify.mockReturnValueOnce(jest.fn())
      const config = {
        reportFormat: 'html',
        reportAutoFilenameEnable: true
      }
      objectStore.set('config', config)
      await expect(report.outbound(data)).resolves.not.toBeNull
    })
    it('when the report format is html and reportFilename not present should not throw an error', async () => {
      const response = {
        'headers': {
          'content-disposition': 'attachment; filename=TTK-Assertion-Report-Test1-2020-05-08T13:53:51.887Z.html'
        }
      }
      axios.post.mockReturnValueOnce(response)
      spyPromisify.mockReturnValueOnce(jest.fn())
      const config = {
        reportFormat: 'html'
      }
      objectStore.set('config', config)
      await expect(report.outbound(data)).resolves.not.toBeNull
    })
    it('when the report format is html and content-disposition not present should not throw an error', async () => {
      const response = {
        'headers': {}
      }
      axios.post.mockReturnValueOnce(response)
      spyPromisify.mockReturnValueOnce(jest.fn())
      const config = {
        reportFormat: 'printhtml'
      }
      objectStore.set('config', config)
      await expect(report.outbound(data)).resolves.not.toBeNull
    })
    it('when the report format is html and wrong data not present should not throw an error', async () => {
      const response = {
        'headers': {
          'content-disposition': 'attachment; filname=TTK-Assertion-Report-Test1-2020-05-08T13:53:51.887Z.html'
        }
      }
      axios.post.mockReturnValueOnce(response)
      spyPromisify.mockReturnValueOnce(jest.fn())
      const config = {
        reportFormat: 'printhtml'
      }
      objectStore.set('config', config)
      await expect(report.outbound(data)).resolves.not.toBeNull
    })
    it('when the report format is printhtml and reportFilename not present should not throw an error', async () => {
      const response = {
        'headers': {
          'content-disposition': 'attachment; filename=TTK-Assertion-Report-Test1-2020-05-08T13:53:51.887Z.html'
        }
      }
      axios.post.mockReturnValueOnce(response)
      spyPromisify.mockReturnValueOnce(jest.fn())
      const config = {
        reportFormat: 'printhtml'
      }
      objectStore.set('config', config)
      await expect(report.outbound(data)).resolves.not.toBeNull
    })
    it('when the report format is printhtml and reportFilename not present should not throw an error', async () => {
      const response = {
        'headers': {
          'content-disposition': 'attachment; filename=TTK-Assertion-Report-Test1-2020-05-08T13:53:51.887Z.html'
        }
      }
      axios.post.mockReturnValueOnce(response)
      spyPromisify.mockReturnValueOnce(jest.fn())
      const config = {
        reportFormat: 'printhtml'
      }
      objectStore.set('config', config)
      await expect(report.outbound(data)).resolves.not.toBeNull
    })


    it('when the report format is printhtml and extraSummaryInformation is supplied', async () => {
      const response = {
        'headers': {
          'content-disposition': 'attachment; filename=TTK-Assertion-Report-Test1-2020-05-08T13:53:51.887Z.html'
        }
      }
      axios.post.mockReturnValueOnce(response)
      spyPromisify.mockReturnValueOnce(jest.fn())
      const config = {
        reportFormat: 'printhtml',
        extraSummaryInformation:  'Title:Mocktitle,Summary:MockSummary'
      }
      objectStore.set('config', config)
      await expect(report.outbound(data)).resolves.not.toBeNull
    })


    it('when the report format is not supported should not throw an error', async () => {
      const config = {
        reportFormat: 'default'
      }
      objectStore.set('config', config)
      await expect(report.outbound(data)).resolves.not.toBeNull
    })
    it('when the reportTarget is file should not throw an error', async () => {
      const response = {
        'headers': {
          'content-disposition': 'attachment; filename=TTK-Assertion-Report-Test1-2020-05-08T13:53:51.887Z.html'
        }
      }
      axios.post.mockReturnValueOnce(response)
      SpyWriteFileAsync.mockResolvedValueOnce()
      spyPromisify.mockReturnValueOnce(jest.fn())
      const config = {
        reportFormat: 'html',
        reportTarget: 'file://asdf'
      }
      objectStore.set('config', config)
      await expect(report.outbound(data)).resolves.not.toBeNull
    })
    it('when the reportTarget is of type file with path adn auto filename enabled should not throw an error', async () => {
      const response = {
        'headers': {
          'content-disposition': 'attachment; filename=TTK-Assertion-Report-Test1-2020-05-08T13:53:51.887Z.html'
        }
      }
      axios.post.mockReturnValueOnce(response)
      SpyWriteFileAsync.mockResolvedValueOnce()
      spyPromisify.mockReturnValueOnce(jest.fn())
      const config = {
        reportFormat: 'html',
        reportAutoFilenameEnable: true,
        reportTarget: 'file://asdf/dasfe.html'
      }
      objectStore.set('config', config)
      await expect(report.outbound(data)).resolves.not.toBeNull
    })
    it('when the reportTarget is of type file with filename and auto filename enabled should not throw an error', async () => {
      const response = {
        'headers': {
          'content-disposition': 'attachment; filename=TTK-Assertion-Report-Test1-2020-05-08T13:53:51.887Z.html'
        }
      }
      axios.post.mockReturnValueOnce(response)
      SpyWriteFileAsync.mockResolvedValueOnce()
      spyPromisify.mockReturnValueOnce(jest.fn())
      const config = {
        reportFormat: 'html',
        reportAutoFilenameEnable: true,
        reportTarget: 'file://dasfe.html'
      }
      objectStore.set('config', config)
      await expect(report.outbound(data)).resolves.not.toBeNull
    })
    it('when the reportTarget is s3 should not throw an error', async () => {
      const response = {
        'headers': {
          'content-disposition': 'attachment; filename=TTK-Assertion-Report-Test1-2020-05-08T13:53:51.887Z.html'
        }
      }
      axios.post.mockReturnValueOnce(response)
      s3Upload.uploadFileDataToS3.mockReturnValueOnce('http://some_upload_url')
      spyPromisify.mockReturnValueOnce(jest.fn())
      const config = {
        reportFormat: 'html',
        reportTarget: 's3://asdf'
      }
      objectStore.set('config', config)
      await expect(report.outbound(data)).resolves.toHaveProperty('uploadedReportURL')

    })
    it('when the reportTarget is unknown should return undefined', async () => {
      const response = {
        'headers': {
          'content-disposition': 'attachment; filename=TTK-Assertion-Report-Test1-2020-05-08T13:53:51.887Z.html'
        }
      }
      axios.post.mockReturnValueOnce(response)
      spyPromisify.mockReturnValueOnce(jest.fn())
      const config = {
        reportFormat: 'html',
        reportTarget: 'asdf://asdf'
      }
      objectStore.set('config', config)
      await expect(report.outbound(data)).resolves.toBe(undefined)
    })
  })
})
