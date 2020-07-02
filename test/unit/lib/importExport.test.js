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

const AdmZip = require('adm-zip')
const Utils = require('../../../src/lib/utils')

const Config = require('../../../src/lib/config')

const SpyRmdirAsync = jest.spyOn(Utils, 'rmdirAsync')
const spyConfig = jest.spyOn(Config, 'getSystemConfig')

jest.mock('adm-zip')

const importExport = require('../../../src/lib/importExport')


describe('importExport', () => {
  describe('exportSpecFiles should not throw an error when', () => {
    it('export 1 file', async () => {
      AdmZip.mockImplementationOnce(() => {
        return ({
          addLocalFolder: () => {},
          toBuffer: () => {return []}
        })
      })
      const exportSpecFiles = await importExport.exportSpecFiles(['rules_response'])
      expect(exportSpecFiles.namePrefix).toBe('rules_response');
      expect(exportSpecFiles.buffer).toHaveLength(0);
    })
    it('export more than 1 files', async () => {
      AdmZip.mockImplementationOnce(() => {
        return ({
          addLocalFile: () => {},
          addLocalFolder: () => {},
          toBuffer: () => {return []}
        })
      })
      const exportSpecFiles = await importExport.exportSpecFiles(['rules_response','user_config.json'])
      expect(exportSpecFiles.namePrefix).toBe('spec_files');
      expect(exportSpecFiles.buffer).toHaveLength(0);
    })
  })

  describe('importSpecFiles', () => {
    it('should not throw an error when import all files', async () => {
      spyConfig.mockReturnValue({CONFIG_VERSIONS: {response: 1.0, validation: 1.0, callback: 1.0, userSettings: 1.0}})
      AdmZip.mockImplementationOnce(() => {
        return ({
          extractEntryTo: () => {},
          getEntries: () => {
            return [
              {
                entryName: 'rules_response/example-1.json',
                getData: () => {return {
                  toString: () => { return JSON.stringify([{
                    "type": "response",
                    "version": 1.0,
                    "conditions": {
                      "all": [
                        {
                          "fact": "operationPath",
                          "operator": "equal",
                          "value": "/settlementWindows/{id}"
                        }
                      ]
                    },
                    "event": {
                      "type": "MOCK_RESPONSE"
                    }
                  }])}
                }}
              },
              {
                entryName: 'rules_response/config.json',
                getData: () => {return {
                  toString: () => { return '{}'}
                }}
              },
              {
                entryName: 'rules_validation/example-1.json',
                getData: () => {return {
                  toString: () => { return JSON.stringify([{
                    "type": "validation",
                    "version": 1.0,
                    "conditions": {
                      "all": [
                        {
                          "fact": "operationPath",
                          "operator": "equal",
                          "value": "/settlementWindows/{id}"
                        }
                      ]
                    },
                    "event": {
                      "type": "MOCK_RESPONSE"
                    }
                  }])}
                }}
              },
              {
                entryName: 'rules_validation/config.json',
                getData: () => {return {
                  toString: () => { return '{}'}
                }}
              },
              {
                entryName: 'rules_callback/example-1.json',
                getData: () => {return {
                  toString: () => { return JSON.stringify([{
                    "type": "callback",
                    "version": 1.0,
                    "conditions": {
                      "all": [
                        {
                          "fact": "operationPath",
                          "operator": "equal",
                          "value": "/settlementWindows/{id}"
                        }
                      ]
                    },
                    "event": {
                      "type": "MOCK_RESPONSE"
                    }
                  }])}
                }}
              },
              {
                entryName: 'rules_callback/config.json',
                getData: () => {return {
                  toString: () => { return '{}'}
                }}
              },
              {
                entryName: 'user_config.json',
                getData: () => {return {
                  toString: () => {
                    return JSON.stringify({
                      VERSION: 1.0
                    })
                  }
                }}
              },
              {
                entryName: 'ignore.json',
                getData: () => {return {
                  toString: () => {return '{}'}
                }}
              }
            ]
          },
          addLocalFile: () => {},
          addLocalFolder: () => {},
          toBuffer: () => {return []}
        })
      })
      SpyRmdirAsync.mockResolvedValue()

      await expect(importExport.importSpecFiles([],['rules_response', 'rules_callback', 'rules_validation','user_config.json'])).resolves.toBe(undefined)
    })

    it('should throw an error when type not matched', async () => {
      spyConfig.mockReturnValue({CONFIG_VERSIONS: {response: 1.0}})
      AdmZip.mockImplementationOnce(() => {
        return ({
          getEntries: () => {
            return [
              {
                entryName: 'rules_response/example-1.json',
                getData: () => {return {
                  toString: () => { return JSON.stringify([{
                    "type": "not-response",
                    "ruleId": 1,
                    "version": 1.0,
                    "conditions": {
                      "all": [
                        {
                          "fact": "operationPath",
                          "operator": "equal",
                          "value": "/settlementWindows/{id}"
                        }
                      ]
                    },
                    "event": {
                      "type": "MOCK_RESPONSE"
                    }
                  }])}
                }}
              }
            ]
          }
        })
      })
      await expect(importExport.importSpecFiles([],['rules_response'])).rejects.toThrow('validation error: rule 1 in rules_response/example-1.json should be of type response')
    })
    it('should throw an error when version is not supported', async () => {
      spyConfig.mockReturnValue({CONFIG_VERSIONS: {response: 1.0}})
      AdmZip.mockImplementationOnce(() => {
        return ({
          getEntries: () => {
            return [
              {
                entryName: 'rules_response/example-1.json',
                getData: () => {return {
                  toString: () => { return JSON.stringify([{
                    "type": "response",
                    "ruleId": 1,
                    "version": 999.0,
                    "conditions": {
                      "all": [
                        {
                          "fact": "operationPath",
                          "operator": "equal",
                          "value": "/settlementWindows/{id}"
                        }
                      ]
                    },
                    "event": {
                      "type": "MOCK_RESPONSE"
                    }
                  }])}
                }}
              }
            ]
          }
        })
      })
      await expect(importExport.importSpecFiles([],['rules_response'])).rejects.toThrow('validation error: rule 1 in rules_response/example-1.json version should at most 1')
    })
    it('should throw an error when rule.event is missing', async () => {
      spyConfig.mockReturnValue({CONFIG_VERSIONS: {response: 1.0}})
      AdmZip.mockImplementationOnce(() => {
        return ({
          getEntries: () => {
            return [
              {
                entryName: 'rules_response/example-1.json',
                getData: () => {return {
                  toString: () => { return JSON.stringify([{
                    "type": "response",
                    "ruleId": 1,
                    "version": 1.0,
                    "conditions": {
                      "all": [
                        {
                          "fact": "operationPath",
                          "operator": "equal",
                          "value": "/settlementWindows/{id}"
                        }
                      ]
                    }
                  }])}
                }}
              }
            ]
          }
        })
      })
      await expect(importExport.importSpecFiles([],['rules_response'])).rejects.toThrow('validation error: rule 1 in rules_response/example-1.json is not valid: Engine: addRule() argument requires \"event\" property')
    })
    it('should throw an error when user config version is not supported', async () => {
      spyConfig.mockReturnValue({CONFIG_VERSIONS: {userSettings: 1.0}})
      AdmZip.mockImplementationOnce(() => {
        return ({
          getEntries: () => {
            return [
              {
                entryName: 'user_config.json',
                getData: () => {return {
                  toString: () => { return JSON.stringify({
                    VERSION: 2.0
                  })}
                }}
              }
            ]
          }
        })
      })
      await expect(importExport.importSpecFiles([],['user_config.json'])).rejects.toThrow('validation error: user_config.json version 2 not supproted be at most 1')
    })
  })
})
