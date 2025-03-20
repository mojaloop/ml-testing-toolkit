/*****
 License
 --------------
 Copyright © 2020-2025 Mojaloop Foundation
 The Mojaloop files are made available by the Mojaloop Foundation under the Apache License, Version 2.0 (the "License") and you may not use these files except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, the Mojaloop files are distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

 Contributors
 --------------
 This is the official list of the Mojaloop project contributors for this file.
 Names of the original copyright holders (individuals or organizations)
 should be listed with a '*' in the first column. People who have
 contributed from an organization can be listed under the organization
 that actually holds the copyright for their contributions (see the
 Mojaloop Foundation for an example). Those individuals should have
 their names indented and be marked with a '-'. Email address can be added
 optionally within square brackets <email>.

 * Mojaloop Foundation
 - Name Surname <name.surname@mojaloop.io>

 * ModusBox
 * Georgi Logodazhki <georgi.logodazhki@modusbox.com> (Original Author)
 --------------
 ******/
const { readFileAsync, readRecursiveAsync, fileStatAsync } = require('./utils')
const fs = require('fs')

// load collections or environments
const getCollectionsOrEnvironments = async (exampleType, type) => {
  const data = await readRecursiveAsync(`examples/${exampleType}/${type || ''}`)
  return data.filter(filename => filename.endsWith('.json'))
}

// load collections or environments with file sizes
const getCollectionsOrEnvironmentsWithFileSize = async (exampleType, type) => {
  const dir = `examples/${exampleType}/${type || ''}`
  const data = await readRecursiveAsync(dir)
  const jsonFileList = data.filter(filename => filename.endsWith('.json'))
  const jsonFileListWithFileSize = jsonFileList.map(file => {
    return {
      name: file,
      size: fs.statSync(file).size
    }
  })
  return jsonFileListWithFileSize
}

// load samples content
const getSample = async (queryParams) => {
  const collections = []
  if (queryParams.collections) {
    for (const i in queryParams.collections) {
      const collection = await readFileAsync(queryParams.collections[i], 'utf8')
      collections.push(JSON.parse(collection))
    }
  }
  const sample = {
    name: null,
    options: null,
    inputValues: null,
    test_cases: null
  }

  if (queryParams.environment) {
    const envContent = JSON.parse(await readFileAsync(queryParams.environment, 'utf8'))
    sample.inputValues = envContent.inputValues
    sample.options = envContent.options
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

// load samples content
const getSampleWithFolderWise = async (queryParams) => {
  const collections = []
  if (queryParams.collections) {
    for (const i in queryParams.collections) {
      const fileContent = await readFileAsync(queryParams.collections[i], 'utf8')
      const fileStat = await fileStatAsync(queryParams.collections[i])
      // collections.push(JSON.parse(collection))
      collections.push({
        name: queryParams.collections[i],
        path: queryParams.collections[i],
        size: fileStat.size,
        modified: fileStat.mtime,
        content: JSON.parse(fileContent)
      })
    }
  }

  let environment = {}
  if (queryParams.environment) {
    environment = JSON.parse(await readFileAsync(queryParams.environment, 'utf8')).inputValues
  }

  return {
    collections,
    environment
  }
}

module.exports = {
  getCollectionsOrEnvironments,
  getCollectionsOrEnvironmentsWithFileSize,
  getSample,
  getSampleWithFolderWise
}
