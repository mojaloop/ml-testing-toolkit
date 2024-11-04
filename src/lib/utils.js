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
    const parsedUrl = new URL(url);
    // Combine the hostname and path, replacing '/' with the platform-specific separator
    const path = parsedUrl.pathname.replace(/\//g, '/');
    return path; // Remove leading separator if present
  } catch (error) {
    console.error("Invalid URL:", error);
    return null;
  }
}

module.exports = {
  readFileAsync,
  writeFileAsync,
  accessFileAsync,
  readDirAsync,
  deleteFileAsync,
  renameFileAsync,
  makeDirectoryAsync,
  fileStatAsync,
  readRecursiveAsync,
  rmdirAsync,
  mvAsync,
  getHeader,
  headersToLowerCase,
  urlToPath
}
