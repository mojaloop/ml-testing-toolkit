const utils = require('../../../src/lib/utils')
const { readFileSync, existsSync } = require('fs')
const tmpdir = require('os').tmpdir()

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
        const url = 'invalid-url'
        const result = utils.urlToPath(url)
        expect(result).toBeNull()
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
})