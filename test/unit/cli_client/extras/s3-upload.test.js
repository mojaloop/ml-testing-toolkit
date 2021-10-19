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
 * Vijay Kumar Guthi <vijaya.guthi@modusbox.com> (Original Author)
 --------------
 ******/
'use strict'

const AWS = require('aws-sdk')
jest.mock('aws-sdk')
AWS.config.update.mockReturnValueOnce()
const s3UploadMockResolve = {
  upload: () => {
    return {
      promise: async () => {
        return {
          Location: 'some_url'
        }
      }
    }
  }
}
const s3UploadMockReject = {
  upload: () => {
    throw new Error()
  }
}

const s3Upload = require('../../../../src/cli_client/extras/s3-upload')

const s3SampleURL = 's3://some_bucket/file_key.html'
const sampleFileData = 'asdf'

describe('Cli client', () => {
  describe('uploadFileDataToS3', () => {
    it('when there are no AWS credentials, it should return undefined', async () => {
      AWS.config.credentials = null
      AWS.config.region = 'asdf'
      await expect(s3Upload.uploadFileDataToS3(s3SampleURL, sampleFileData)).resolves.toBe(undefined)
    })
    it('when there are some AWS credentials, and no AWS region set it should return undefined', async () => {
      AWS.config.credentials = {
        asdf: 'asdf'
      }
      AWS.config.region = null
      await expect(s3Upload.uploadFileDataToS3(s3SampleURL, sampleFileData)).resolves.toBe(undefined)
    })
    it('when the url is in wrong format it should return undefined', async () => {
      AWS.config.credentials = {
        asdf: 'asdf'
      }
      AWS.config.region = 'asdf'
      await expect(s3Upload.uploadFileDataToS3('wrong://asdf/', sampleFileData)).resolves.toBe(undefined)
    })
    it('when there are some AWS credentials, and AWS region it should return some_url', async () => {
      AWS.config.credentials = {
        asdf: 'asdf'
      }
      AWS.config.region = 'asdf'
      AWS.S3.mockReturnValueOnce(s3UploadMockResolve)
      await expect(s3Upload.uploadFileDataToS3(s3SampleURL, sampleFileData)).resolves.toBe('some_url')
    })
    it('when there are some AWS credentials, and AWS region, and sample url not ends with html or htm it should return some_url', async () => {
      AWS.config.credentials = {
        asdf: 'asdf'
      }
      AWS.config.region = 'asdf'
      AWS.S3.mockReturnValueOnce(s3UploadMockResolve)
      const s3SampleURL = 's3://some_bucket/file_key.ht'
      await expect(s3Upload.uploadFileDataToS3(s3SampleURL, sampleFileData)).resolves.toBe('some_url')
    })
    it('when there are some AWS credentials, and AWS region, and s3 upload fails, it should return null', async () => {
      AWS.config.credentials = {
        asdf: 'asdf'
      }
      AWS.config.region = 'asdf'
      AWS.S3.mockReturnValueOnce(s3UploadMockReject)
      await expect(s3Upload.uploadFileDataToS3(s3SampleURL, sampleFileData)).resolves.toBe(null)
    })
    
  })
})
