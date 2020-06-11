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
const fs = require('fs')
const { files } = require('node-dir')
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile)
const dirFilesAsync = promisify(files)

// load collections or environments
const getCollectionsOrEnvironments = async (exampleType, type) => {
  let data
  if (type) {
    data = await dirFilesAsync(`examples/${exampleType}/${type}`)
  } else {
    data = await dirFilesAsync(`examples/${exampleType}`)
  }
  const list = []
  for (const index in data) {
    if (data[index].endsWith('.json')) {
      list.push(data[index])
    }
  }
  return list
}

// load samples content
const getSample = async (queryParams) => {
  const collections = []
  if (queryParams.collections) {
    for (const i in queryParams.collections) {
      collections.push(JSON.parse(await readFileAsync(queryParams.collections[i], 'utf8')))
    }
  }

  const sample = {
    name: null,
    inputValues: null,
    test_cases: null
  }

  if (queryParams.environment) {
    sample.inputValues = JSON.parse(await readFileAsync(queryParams.environment, 'utf8')).inputValues
  }

  if (collections.length > 1) {
    sample.name = 'multi'
    sample.test_cases = []
    let index = 1
    collections.forEach(collection => {
      collection.test_cases.forEach(testCase => {
        const { id, ...remainingTestCaseProps } = testCase
        sample.test_cases.push({
          id: index++,
          ...remainingTestCaseProps
        })
      })
    })
  } else if (collections.length === 1) {
    sample.name = collections[0].name
    sample.test_cases = collections[0].test_cases
  }

  return sample
}

module.exports = {
  getCollectionsOrEnvironments,
  getSample
}
