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

const importExport = require('../../../src/lib/importExport')

describe('importExport', () => {
  describe('validateRules should not throw an error when', () => {
    it('rule types matched, version supported and rule is valid', async () => {
      const rule = {
        "type": "response",
        "version": 1,
        "ruleId": 1,
        "priority": 1,
        "description": "post /settlementWindows/{id}",
        "apiVersion": {
          "minorVersion": 0,
          "majorVersion": 1,
          "type": "settlements",
          "asynchronous": false
        },
        "conditions": {
          "all": [
            {
              "fact": "operationPath",
              "operator": "equal",
              "value": "/settlementWindows/{id}"
            },
            {
              "fact": "method",
              "operator": "equal",
              "value": "post"
            }
          ]
        },
        "event": {
          "method": null,
          "path": null,
          "params": {
            "body": {
              "state": "OPEN"
            },
            "statusCode": "200"
          },
          "delay": 0,
          "type": "MOCK_RESPONSE"
        }
      }
      expect(() => {
        importExport.validateRules('test', 'response', 1.0, [rule])
      }).not.toThrowError();
    })
  })
  describe('validateRules should throw an error when', () => {
    it('rule types not matched, version supported and rule is valid', () => {
      const rule = {
        "type": "not-response",
        "version": 1,
        "ruleId": 1,
        "priority": 1,
        "description": "post /settlementWindows/{id}",
        "apiVersion": {
          "minorVersion": 0,
          "majorVersion": 1,
          "type": "settlements",
          "asynchronous": false
        },
        "conditions": {
          "all": [
            {
              "fact": "operationPath",
              "operator": "equal",
              "value": "/settlementWindows/{id}"
            },
            {
              "fact": "method",
              "operator": "equal",
              "value": "post"
            }
          ]
        },
        "event": {
          "method": null,
          "path": null,
          "params": {
            "body": {
              "state": "OPEN"
            },
            "statusCode": "200"
          },
          "delay": 0,
          "type": "MOCK_RESPONSE"
        }
      }
      let error
      try {
        importExport.validateRules('test', 'response', 1.0, [rule])
      } catch (err) {
        error = err
      }
      expect(error.message).toBe('validation error: rule 1 in test should be of type response');
    })
    it('rule types matched, version is not supported and rule is valid', () => {
      const rule = {
        "type": "response",
        "version": 1.1,
        "ruleId": 1,
        "priority": 1,
        "description": "post /settlementWindows/{id}",
        "apiVersion": {
          "minorVersion": 0,
          "majorVersion": 1,
          "type": "settlements",
          "asynchronous": false
        },
        "conditions": {
          "all": [
            {
              "fact": "operationPath",
              "operator": "equal",
              "value": "/settlementWindows/{id}"
            },
            {
              "fact": "method",
              "operator": "equal",
              "value": "post"
            }
          ]
        },
        "event": {
          "method": null,
          "path": null,
          "params": {
            "body": {
              "state": "OPEN"
            },
            "statusCode": "200"
          },
          "delay": 0,
          "type": "MOCK_RESPONSE"
        }
      }
      let error
      try {
        importExport.validateRules('test', 'response', 1.0, [rule])
      } catch (err) {
        error = err
      }
      expect(error.message).toBe('validation error: rule 1 in test version should at most 1');
    })
    it('rule types matched, version is supported and rule is not valid', () => {
      const rule = {
        "type": "response",
        "version": 1.0,
        "ruleId": 1,
        "priority": 1,
        "description": "post /settlementWindows/{id}",
        "apiVersion": {
          "minorVersion": 0,
          "majorVersion": 1,
          "type": "settlements",
          "asynchronous": false
        },
        "conditions": {
          "all": [
            {
              "fact": "operationPath",
              "operator": "equal",
              "value": "/settlementWindows/{id}"
            },
            {
              "fact": "method",
              "operator": "equal",
              "value": "post"
            }
          ]
        }
      }
      let error
      try {
        importExport.validateRules('test', 'response', 1.0, [rule])
      } catch (err) {
        error = err
      }
      expect(error.message).toBe('validation error: rule 1 in test is not valid: Engine: addRule() argument requires \"event\" property');
    })
  })
  describe('exportSpecFiles should not throw an error when', () => {
    it('export 1 file', async () => {
      expect(() => {
        importExport.exportSpecFiles(['rules_response'])
      }).not.toThrowError();
    })
    it('export more than 1 file', async () => {
      expect(() => {
        importExport.exportSpecFiles(['rules_response','rules_callbacks'])
      }).not.toThrowError();
    })
  })
  describe('importSpecFiles should not throw an error when', () => {
    it('export 1 file', async () => {
      expect(() => {
        importExport.exportSpecFiles(['rules_response'])
      }).not.toThrowError();
    })
    it('export more than 1 files', async () => {
      expect(() => {
        importExport.exportSpecFiles(['rules_response','rules_callbacks'])
      }).not.toThrowError();
    })
  })
})
