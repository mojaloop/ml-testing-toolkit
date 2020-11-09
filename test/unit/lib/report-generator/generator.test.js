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

const ReportGenerator = require('../../../../src/lib/report-generator/generator')
const Utils = require('../../../../src/lib/utils')
const Handlebars = require('handlebars')
const SpyReadFileAsync = jest.spyOn(Utils, 'readFileAsync')
const HandlebarsCompile = jest.spyOn(Handlebars, 'compile')

const sampleJsonReport  = {

}

SpyReadFileAsync.mockResolvedValue(JSON.stringify({}))


describe('Report Generator', () => {
  describe('Initialize with Handlebars compile error', () => {
    it('initialize', async () => {
      HandlebarsCompile.mockReturnValue(null)
      await ReportGenerator.initialize()
    })
    it('generateReport should throw error', async () => {
      HandlebarsCompile.mockReturnValue(null)
      await expect(ReportGenerator.generateReport(sampleJsonReport, 'html')).rejects.toThrowError()
    })
  })

  describe('With erroneos templateHandle function', () => {
    it('initialize should not throw error on empty template file and should call HandlebarsCompile', async () => {
      HandlebarsCompile.mockReset()
      HandlebarsCompile.mockReturnValue((data, options) => {
        throw new Error('Some error')
      })
      await ReportGenerator.initialize()
      expect(HandlebarsCompile).toHaveBeenCalledTimes(2);
    })

    it('generateReport should not throw error for format html', async () => {
      await expect(ReportGenerator.generateReport(sampleJsonReport, 'html')).rejects.toThrowError()
    })
  })

  describe('Happy Path', () => {
    it('initialize should not throw error on empty template file and should call HandlebarsCompile', async () => {
      HandlebarsCompile.mockReset()
      HandlebarsCompile.mockReturnValue((data, options) => {
        // Some functions
      })
      await ReportGenerator.initialize()
      expect(HandlebarsCompile).toHaveBeenCalledTimes(2);
    })

    it('generateReport should not throw error for format html', async () => {
      await expect(ReportGenerator.generateReport(sampleJsonReport, 'html')).resolves.toBeUndefined()
    })
    it('generateReport should not throw error for format pdf', async () => {
      await expect(ReportGenerator.generateReport(sampleJsonReport, 'pdf')).resolves.toBeUndefined()
    })
    it('generateReport should not throw error for format printhtml', async () => {
      await expect(ReportGenerator.generateReport(sampleJsonReport, 'printhtml')).resolves.toBeUndefined()
    })
  })
})