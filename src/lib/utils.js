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

const fs = require('fs')
const mv = require('mv')
const { files } = require('node-dir')
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)
const accessFileAsync = promisify(fs.access)
const readDirAsync = promisify(fs.readdir)
const deleteFileAsync = promisify(fs.unlink)
const renameFileAsync = promisify(fs.rename)
const makeDirectoryAsync = promisify(fs.mkdir)
const fileStatAsync = promisify(fs.stat)
const readRecursiveAsync = promisify(files)
const rmdirAsync = promisify(fs.rmdir)
const mvAsync = promisify(mv)
const { resolve } = require('path')
const yaml = require('js-yaml')

const getHeader = (headers, name) => {
  return Object.entries(headers).find(
    ([key]) => key.toLowerCase() === name.toLowerCase()
  )?.[1]
}

const headersToLowerCase = (headers) => Object.fromEntries(
  Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v])
)

const urlToPath = (url) => {
  try {
    const parsedUrl = new URL(url)
    // Combine the hostname and path, replacing '/' with the platform-specific separator
    const path = parsedUrl.pathname.replace(/\//g, '/')
    return path // Remove leading separator if present
  } catch (error) {
    console.error('Invalid URL:', error)
    return null
  }
}

const resolveRoot = path => resolve(process.env.TTK_ROOT || '.', path)
const resolve1 = fn => (arg1, ...rest) => fn(resolveRoot(arg1), ...rest)
const resolve2 = fn => (arg1, arg2, ...rest) => fn(resolveRoot(arg1), resolveRoot(arg2), ...rest)

// check if the file contains URL and return it instead of the file name
const checkUrl = async fileName => {
  const buffer = Buffer.alloc(10)
  const fileHandle = await fs.promises.open(fileName, 'r')
  try {
    await fileHandle.read(buffer, 0, 10, 0)
  } finally {
    await fileHandle.close()
  }
  const prefix = buffer.toString('utf8').replace('\uFEFF', '') // Remove BOM
  if (prefix.startsWith('"http') || prefix.startsWith("'http")) {
    const content = fs.readFileSync(fileName, 'utf8')
    try {
      return JSON.parse(content)
    } catch (jsonErr) {
      try {
        return yaml.load(content)
      } catch (yamlErr) {
        throw new Error(`Failed to parse file as JSON or YAML: ${jsonErr.message}; ${yamlErr.message}`)
      }
    }
  } else {
    return fileName
  }
}

module.exports = {
  readFileAsync: resolve1(readFileAsync),
  writeFileAsync: resolve1(writeFileAsync),
  accessFileAsync: resolve1(accessFileAsync),
  readDirAsync: resolve1(readDirAsync),
  deleteFileAsync: resolve1(deleteFileAsync),
  renameFileAsync: resolve2(renameFileAsync),
  makeDirectoryAsync: resolve1(makeDirectoryAsync),
  fileStatAsync: resolve1(fileStatAsync),
  readRecursiveAsync: resolve1(readRecursiveAsync),
  rmdirAsync: resolve1(rmdirAsync),
  mvAsync: resolve2(mvAsync),
  getHeader,
  headersToLowerCase,
  urlToPath,
  checkUrl,
  resolve: resolveRoot
}
