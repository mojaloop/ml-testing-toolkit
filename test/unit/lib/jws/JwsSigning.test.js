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

'use strict'

const JwsSigning = require('../../../../src/lib/jws/JwsSigning')
const Config = require('../../../../src/lib/config')
const ConnectionProvider = require('../../../../src/lib/configuration-providers/mb-connection-manager')
jest.mock('../../../../src/lib/config')
jest.mock('../../../../src/lib/configuration-providers/mb-connection-manager')

Config.getUserConfig.mockImplementation(() => {
  return {
    JWS_SIGN: true,
    VALIDATE_INBOUND_JWS: true,
    DEFAULT_USER_FSPID: 'userdfsp'
  }
})

Config.getSystemConfig.mockImplementation(() => {
  return {}
})

const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEpQIBAAKCAQEAwczEjlUeOPutgPRlpZSbcbJJwsmmxsBfoPDw1sjBiR7L6Doh
VqKd810+TmiDRYgCzOLabje/mtLiDC95MtuPF5yUiVE04ar6Ny5pZLxJEnbDEOAE
TxOn1gzCKeRHYOcgybDi6TLhnvyFyIaXKzyBhEYvxI8VvRV11UawLqvpgVrdsbZy
1FQOMLq7OB+J6qC7fhR61F6Wu45RZlZMB482c658P7dCQCdQtEMEF5kuBNB/JuUR
e0qKjl2udKVL3wgBC7J7o7Tx8kY5T63q/ZC3TfoTclFeXtIePt8Eu74u3d6WpSWb
Z12mewRBVPtmbGHgEXpih3uayaqIeC8Dc4zO5QIDAQABAoIBAQCPMGJR36YS6DGL
xAeOTbyERvykxSVKWDzPxvXLXE1SqMRz8u9K+Z/GfjBY8nN7XkDjbQGCygHxvLpz
0me0IfEZuwEsbCmsSw3Q06PfYBaFY+ZAg6PrYVRynL6hAR+UA3GAVAdz0bpOI7od
LQRoV65CMzF8A1RGfqKvUClAcph2j4lbjjRZ1OExDdcbRCI4h9qgGOMo9o9OEB1X
HHiPhtS1ZwjczqCyJHkkHbOgYNPN7SDy8vHFOVjMDIADF+S/NLrxGUUIUDvNMnGV
D4G8thQD2zSatMjlbJJ+oNt++T/SJMSIiuQTB5zy/KpiMPUN+AXhq5h/dHDcFXhA
ng2deEcJAoGBAOQr1g/s/3V32tQpYloTMOPqIJoVnZnlcXbKy3nWLuOrkVlM0x3V
AEwC7ntb2eOSQ331AvBd/EESgtZr1jvxfsHG+MjwEylcOE33g4MqCKthGcnFA8zG
Z5h6OqTtHdY1bmuiisPvBA4/x2o7mWJz35vT0Sny3cci3f2D6pmPpuq3AoGBANlv
wjWgeDQSR8nTdM1P7zepVdN51f8Fl3r49kMhceVHdwL5iL7q4GkxUgpCyBkFoElW
vmsLgR1fnb+qBtF2kvljQtlRrlgwz1GgYNhp+aAgcAjvQ9fQcvCLr1leXzf6VBHx
jXEIUAlAJVlJ5gWKlDNK9ytjurOvOXipRC4GQKdDAoGBALNOt6RATOjVTYSZGQ9M
MYmKPiCYiAeexbHi4FBYvvRvqYOR2f6BmwAg9aS/o9Uw5hUf7DVUxp2knGlAyVTG
DSTe5jeSYpyIOj8bGaCD8dgsMIXda4ULDfJHa7qcFGx4BNRVIdOkC33fJSkYuQsj
oD/nD2J1109c2TMW7c/LkhK1AoGAUD8xws7tbfJNMkxrMBbPJ5DETx8I/myW4lid
slrWiRLd9mgXsrZGiiwcphLNfIaaCFcOQb1mMmwGcSUUDRwg1A9xLXk6yeuBqBNz
iotaCGHQV0vOkwioUuSKm4X7yFIH0vN+CvhRaYiWACUI0oS5e1CwdgABeK0znbeC
pSXDmLcCgYEA1ls595Ue5cUCmFDvpCIifsATNOMPguKeFuPbYSItQod3P3Bj6txV
phe0jUtWPhIF3I0XOtea2Usvbrj64GMNWLaeK2pdsbIWBlsu2tuqaAfKYiGpGCAh
QWGAPwZ4w7Z3nmA6IhaD6zUnzBGserHv59XttKK0AiQwYMn6UvUIq0M=
-----END RSA PRIVATE KEY-----`

const publicCert = `-----BEGIN CERTIFICATE-----
MIIDbjCCAlYCCQDudXfDH36/JjANBgkqhkiG9w0BAQsFADB5MRswGQYDVQQDDBJ0
ZXN0aW5ndG9vbGtpdGRmc3AxCzAJBgNVBAYTAlVTMQ0wCwYDVQQIDARPaGlvMREw
DwYDVQQHDAhDb2x1bWJ1czEYMBYGA1UECgwPVGVzdGluZyBUb29sa2l0MREwDwYD
VQQLDAhQYXltZW50czAeFw0yMDAzMjQxNzU1MjZaFw0yNTAzMjMxNzU1MjZaMHkx
GzAZBgNVBAMMEnRlc3Rpbmd0b29sa2l0ZGZzcDELMAkGA1UEBhMCVVMxDTALBgNV
BAgMBE9oaW8xETAPBgNVBAcMCENvbHVtYnVzMRgwFgYDVQQKDA9UZXN0aW5nIFRv
b2xraXQxETAPBgNVBAsMCFBheW1lbnRzMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A
MIIBCgKCAQEAwczEjlUeOPutgPRlpZSbcbJJwsmmxsBfoPDw1sjBiR7L6DohVqKd
810+TmiDRYgCzOLabje/mtLiDC95MtuPF5yUiVE04ar6Ny5pZLxJEnbDEOAETxOn
1gzCKeRHYOcgybDi6TLhnvyFyIaXKzyBhEYvxI8VvRV11UawLqvpgVrdsbZy1FQO
MLq7OB+J6qC7fhR61F6Wu45RZlZMB482c658P7dCQCdQtEMEF5kuBNB/JuURe0qK
jl2udKVL3wgBC7J7o7Tx8kY5T63q/ZC3TfoTclFeXtIePt8Eu74u3d6WpSWbZ12m
ewRBVPtmbGHgEXpih3uayaqIeC8Dc4zO5QIDAQABMA0GCSqGSIb3DQEBCwUAA4IB
AQAZ1lQ/KcSGwy/jQUIGF87JugLU17nnIEG2TrkC5n+fZDQqs8QqU6itbkdGQyNj
F5aLoPEdrKzevnBztlAEq0bofR0uDnQPN74A/NwOUfWds0hq5elZnO9Uq0G15Go4
pfqLbSjHxSu6LZaHP6f9+WvMqNbGr3kipz8GSIQWixzdKBnNxCwWjZmk4gD5cahU
XIpMAZumsnKk6pWilmuMIxC579CyLkGdVze3Kj6GunUJ1pieZzv4+RUJz8NgXxjW
ZRwqCkEqPe/8S1X9srtcrdbHryDdC18Ldu/rADEKbSqy0BhQdKYDcxulaQuqibwD
i0dWSdTWoseAbUqp2ACc6aF/
-----END CERTIFICATE-----`

const mockDefinePrivateKey = (key) => {
  ConnectionProvider.getTestingToolkitDfspJWSPrivateKey.mockImplementation(async () => {
    return Promise.resolve(key)
  })
}

const mockDefinePublicCert = (cert) => {
  ConnectionProvider.getUserDfspJWSCerts.mockImplementation(async () => {
    return Promise.resolve(cert)
  })
}

describe('JwsSigning', () => {
  const origReqOpts = {
    method: 'post',
    url: 'http://localhost' + '/parties/MSISDN/1234567890',
    path: '/parties/MSISDN/1234567890',
    headers: {
      Accept: 'application/vnd.interoperability.parties+json;version=1.0',
      'Content-Type': 'application/vnd.interoperability.parties+json;version=1.0',
      Date: '2019-01-01 00:00:00',
      'FSPIOP-Source': 'payerfsp',
      'FSPIOP-Destination': 'payeefsp'
    },
    body: {
      test: 'test'
    }
  }

  describe('Happy Path Sign and Validate', () => {
    mockDefinePrivateKey(privateKey)
    mockDefinePublicCert(publicCert)
    // Deep copy reqOpts
    var reqOpts = JSON.parse(JSON.stringify(origReqOpts))
    // Rename the body prop with data
    reqOpts.data = reqOpts.body
    it('Signed request should contain required fspiop headers', async () => {
      // Sign with JWS
      await expect(JwsSigning.sign(reqOpts)).resolves.toBeDefined();
      expect(reqOpts.headers).toHaveProperty('fspiop-uri')
      expect(reqOpts.headers).toHaveProperty('fspiop-http-method')
      expect(reqOpts.headers).toHaveProperty('fspiop-signature')
      const fspIopSignature = JSON.parse(reqOpts.headers['fspiop-signature'])
      expect(fspIopSignature).toHaveProperty('signature')
      expect(fspIopSignature).toHaveProperty('protectedHeader')
    })
    it('Validate the signed request', async () => {
      // Replace the data prop with payload
      reqOpts.payload = reqOpts.data
      // Validate with JWS
      await expect(JwsSigning.validate(reqOpts)).resolves.toBeDefined();
    })
  })

  describe('Validation request should fail when', () => {
    it('request method is get', async () => {
      const req = {
        method: 'get'
      }
      const signed = await JwsSigning.validate(req)
      expect(signed).toBe(false)
    })
    it('request method is put and path starts with /parties/', async () => {
      const req = {
        method: 'put',
        path: '/parties/'
      }
      const signed = await JwsSigning.validate(req)
      expect(signed).toBe(false)
    })
  })

  describe('Signed request should fail when', () => {
    it('request method is get', async () => {
      const req = {
        method: 'get'
      }
      const signed = await JwsSigning.sign(req)
      expect(signed).toBe(false)
    })
    it('request method is put and path starts with /parties/', async () => {
      const req = {
        method: 'put',
        path: '/parties/'
      }
      const signed = await JwsSigning.sign(req)
      expect(signed).toBe(false)
    })
  })

  describe('Signing Negative scenarios', () => {
    describe('Passing wrong request', () => {
      mockDefinePrivateKey(privateKey)
      // Deep copy reqOpts
      var reqOpts = JSON.parse(JSON.stringify(origReqOpts))
      // Rename the body prop with data
      reqOpts.data = reqOpts.body
      it('Without data property', async () => {
        const { data, tmpReqOpts } = reqOpts
        await expect(JwsSigning.sign(tmpReqOpts)).rejects.toThrowError()
      })
      it('Without header property', async () => {
        const { header, tmpReqOpts } = reqOpts
        await expect(JwsSigning.sign(tmpReqOpts)).rejects.toThrowError()
      })
    })
    describe('Passing invalid key', () => {
      // Deep copy reqOpts
      var reqOpts = JSON.parse(JSON.stringify(origReqOpts))
      // Rename the body prop with data
      reqOpts.data = reqOpts.body
      it('Without private key', async () => {
        mockDefinePrivateKey(null)
        await expect(JwsSigning.sign(reqOpts)).rejects.toThrowError()
      })
      it('With invalid key', async () => {
        mockDefinePrivateKey('asdf')
        await expect(JwsSigning.sign(reqOpts)).rejects.toThrowError()
      })
    })
  })

  describe('Validation negative scenarios', async () => {

    // Signing
    mockDefinePrivateKey(privateKey)
    // Deep copy reqOpts
    var reqOpts = JSON.parse(JSON.stringify(origReqOpts))
    // Rename the body prop with data
    reqOpts.data = reqOpts.body
    delete reqOpts.headers['FSPIOP-Destination']
    await JwsSigning.sign(reqOpts)
    // Replace the data prop with payload
    reqOpts.payload = reqOpts.data
  
    describe('Passing wrong request', () => {
      mockDefinePublicCert(publicCert)
      it('Without payload property', async () => {
        const { payload, tmpReqOpts } = reqOpts
        await expect(JwsSigning.validate(tmpReqOpts)).resolves.toBeDefined();
      })
      it('Without header property', async () => {
        const { header, tmpReqOpts } = reqOpts
        await expect(JwsSigning.validate(tmpReqOpts)).resolves.toBeDefined();
      })
    })
    describe('Passing invalid keys', () => {
      it('Without public certificate', async () => {
        mockDefinePublicCert(null)
        await expect(JwsSigning.validate(reqOpts)).resolves.toBeDefined();
      })
      it('With invalid certificate4', async () => {
        mockDefinePublicCert('asdf')
        await expect(JwsSigning.validate(reqOpts)).resolves.toBeDefined();
      })
    })
  })

})
