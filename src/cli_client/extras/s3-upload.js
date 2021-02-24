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
const AWS = require('aws-sdk')

// Set the region
AWS.config.update({ region: process.env.AWS_REGION })

const uploadFileDataToS3 = async (s3URL, fileData) => {
  if (!AWS.config.credentials) {
    console.log('ERROR: Upload to S3 failed. AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY not set')
    return
  }
  if (!AWS.config.region) {
    console.log('ERROR: Upload to S3 failed. AWS_REGION not set')
    return
  }

  // Match with S3 regular expression
  const s3Re = /s3:\/\/(.*)\/(.*)/g
  const s3Arr = s3Re.exec(s3URL)
  if (!s3Arr) {
    return
  }
  const bucketName = s3Arr[1]
  const objectKey = s3Arr[2]
  // Create S3 service object
  const s3 = new AWS.S3({ apiVersion: '2012-10-17' })
  const additionalParams = {}
  if (objectKey.endsWith('.html') || objectKey.endsWith('.htm')) {
    additionalParams.ContentType = 'text/html'
  }
  // call S3 to retrieve upload file to specified bucket
  const uploadParams = { Bucket: bucketName, Key: objectKey, Body: fileData, ...additionalParams }

  try {
    // call S3 to retrieve upload file to specified bucket
    const result = await s3.upload(uploadParams).promise()
    console.log('Successfully uploaded the file to S3. URL is ' + s3URL)
    return result.Location
  } catch (err) {
    console.log('ERROR: Upload to S3 failed. ', err.message)
    return null
  }
}

module.exports = {
  uploadFileDataToS3
}
