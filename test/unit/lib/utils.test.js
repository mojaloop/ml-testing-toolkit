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
 - Shashikant Hirugade <shashi.mojaloop@gmail.com>

 --------------
 ******/

const utils = require('../../../src/lib/utils')
const { readFileSync, existsSync, writeFileSync, mkdtempSync, rmSync } = require('fs')
const { join } = require('path')
const tmpdir = require('os').tmpdir()
const os = require('os')
const http = require('http')

describe('utils', () => {
    afterEach(() => {
        delete process.env.TTK_ROOT
    })

    describe('getHeader', () => {
        it('should return the header value', () => {
        const headers = {
            'Content-Type': 'application/json'
        }
        const name = 'Content-Type'
        const result = utils.getHeader(headers, name)
        expect(result).toBe('application/json')
        })
        it('should return undefined if the header does not exist', () => {
        const headers = {
            'Content-Type': 'application/json'
        }
        const name = 'Authorization'
        const result = utils.getHeader(headers, name)
        expect(result).toBeUndefined()
        })
    })
    describe('headersToLowerCase', () => {
        it('should convert all headers to lowercase', () => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer token'
        }
        const result = utils.headersToLowerCase(headers)
        expect(result).toEqual({
            'content-type': 'application/json',
            'authorization': 'Bearer token'
        })
        })
    })
    describe('urlToPath', () => {
        it('should return the path from the URL', () => {
            const url = 'https://example.com/path/to/resource'
            const result = utils.urlToPath(url)
            expect(result).toBe('/path/to/resource')
        })
        it('should return null if the URL is invalid', () => {
            const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
            const result = utils.urlToPath('invalid-url')
            expect(result).toBeNull()
            spy.mockRestore()
        })
    })
    describe('resolve', () => {
        it('should resolve the path', () => {
        process.env.TTK_ROOT = '/root'
        const path = 'file.txt'
        const result = utils.resolve(path)
        expect(result).toBe('/root/file.txt')
        })
    })
    describe('file functions', () => {
        it('should work from CWD', async () => {
            const tempFile = 'temp.log'
            const newFile = 'new.log'
            await utils.writeFileAsync(tempFile, 'Hello, World!')
            await utils.renameFileAsync(tempFile, newFile)
            await utils.accessFileAsync(newFile)
            expect(readFileSync(newFile, 'utf8')).toBe('Hello, World!')
            await utils.deleteFileAsync(newFile)
            expect(existsSync(newFile)).toBe(false)
        })
        it('should work from TTK_ROOT', async () => {
            const tempFile = 'temp.log'
            const newFile = 'new.log'
            process.env.TTK_ROOT = tmpdir
            await utils.writeFileAsync(tempFile, 'Hello, World!')
            await utils.renameFileAsync(tempFile, newFile)
            await utils.accessFileAsync(newFile)
            expect(readFileSync(tmpdir + '/' + newFile, 'utf8')).toBe('Hello, World!')
            await utils.deleteFileAsync(newFile)
            expect(existsSync(tmpdir + '/' + newFile)).toBe(false)
        })
    })
    describe('resolveAndLoad', () => {
        let baseDir
    
        beforeEach(() => {
          baseDir = mkdtempSync(join(os.tmpdir(), 'ttk-utils-'))
          process.env.TTK_ROOT = baseDir
        })
    
        afterEach(() => {
          try {
            rmSync(baseDir, { recursive: true, force: true })
          } catch (e) {
            // ignore cleanup errors in CI
          }
        })
    
        it('should load and parse JSON from a local file', async () => {
          const file = 'local.json'
          writeFileSync(join(baseDir, file), JSON.stringify({ a: 1, b: 'x' }), 'utf8')
    
          const result = await utils.resolveAndLoad(file)
          expect(result).toEqual({ a: 1, b: 'x' })
        })
    
        it('should load and parse YAML from a local file', async () => {
          const file = 'local.yaml'
          writeFileSync(join(baseDir, file), 'a: 1\nb: x\n', 'utf8')
    
          const result = await utils.resolveAndLoad(file)
          expect(result).toEqual({ a: 1, b: 'x' })
        })
    
        it('should follow a URL stored as JSON string inside a local file and load remote JSON', async () => {
          // Start a local HTTP server to act as the "remote" URL
          const server = http.createServer((req, res) => {
            if (req.url === '/response_map.json') {
              res.writeHead(200, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ from: 'remote', ok: true }))
              return
            }
            res.writeHead(404)
            res.end()
          })
    
          await new Promise((resolve) => server.listen(0, resolve))
          const port = server.address().port
          const url = `http://127.0.0.1:${port}/response_map.json`
    
          try {
            const file = 'urlref.json'
            // file contains ONLY a JSON string with the URL
            writeFileSync(join(baseDir, file), JSON.stringify(url), 'utf8')
    
            const result = await utils.resolveAndLoad(file)
            expect(result).toEqual({ from: 'remote', ok: true })
          } finally {
            await new Promise((resolve) => server.close(resolve))
          }
        })
    
        it('should accept a direct URL argument and load remote JSON', async () => {
          const server = http.createServer((req, res) => {
            if (req.url === '/data') {
              res.writeHead(200, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ direct: true }))
              return
            }
            res.writeHead(404)
            res.end()
          })
    
          await new Promise((resolve) => server.listen(0, resolve))
          const port = server.address().port
          const url = `http://127.0.0.1:${port}/data`
    
          try {
            const result = await utils.resolveAndLoad(url)
            expect(result).toEqual({ direct: true })
          } finally {
            await new Promise((resolve) => server.close(resolve))
          }
        })
    
        it('should throw if remote returns non-2xx', async () => {
          const server = http.createServer((req, res) => {
            res.writeHead(404, { 'Content-Type': 'text/plain' })
            res.end('not found')
          })
    
          await new Promise((resolve) => server.listen(0, resolve))
          const port = server.address().port
          const url = `http://127.0.0.1:${port}/missing`
    
          try {
            await expect(utils.resolveAndLoad(url)).rejects.toThrow(/Failed to fetch .*HTTP 404/)
          } finally {
            await new Promise((resolve) => server.close(resolve))
          }
        })
    
        it('should throw if local file is neither valid JSON nor YAML', async () => {
          const file = 'bad.txt'
          writeFileSync(join(baseDir, file), '{ not-valid-json: ', 'utf8')
    
          await expect(utils.resolveAndLoad(file)).rejects.toThrow(/Failed to parse .* as JSON or YAML/)
        })
    
        it('should return a string if local file contains a URL string and remote content is a YAML scalar', async () => {
            const server = http.createServer((req, res) => {
              if (req.url === '/html') {
                res.writeHead(200, { 'Content-Type': 'text/html' })
                res.end('<html>nope</html>')
                return
              }
              res.writeHead(404)
              res.end()
            })
          
            await new Promise((resolve) => server.listen(0, resolve))
            const port = server.address().port
            const url = `http://127.0.0.1:${port}/html`
          
            try {
              const file = 'urlref.json'
              writeFileSync(join(baseDir, file), JSON.stringify(url), 'utf8')
          
              const result = await utils.resolveAndLoad(file)
              expect(result).toBe('<html>nope</html>')
            } finally {
              await new Promise((resolve) => server.close(resolve))
            }
          })
      })
    
      describe('checkUrl', () => {
        it('should return the same file name if file does not start with quoted http(s)', async () => {
          const baseDir = mkdtempSync(join(os.tmpdir(), 'ttk-utils-checkurl-'))
          process.env.TTK_ROOT = baseDir
          const file = join(baseDir, 'noturl.json')
          writeFileSync(file, JSON.stringify({ hello: 'world' }), 'utf8')
    
          const result = await utils.checkUrl(file)
          expect(result).toBe(file)
    
          rmSync(baseDir, { recursive: true, force: true })
        })
    
        it('should return the URL string when the file contains a quoted URL', async () => {
          const baseDir = mkdtempSync(join(os.tmpdir(), 'ttk-utils-checkurl-'))
          process.env.TTK_ROOT = baseDir
          const file = join(baseDir, 'url.json')
          writeFileSync(file, JSON.stringify('http://example.com/x'), 'utf8')
    
          const result = await utils.checkUrl(file)
          expect(result).toBe('http://example.com/x')
    
          rmSync(baseDir, { recursive: true, force: true })
        })
      })
})