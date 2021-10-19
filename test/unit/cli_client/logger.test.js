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
'use strict'

const logger = require('../../../src/cli_client/utils/logger')
const objectStore = require('../../../src/cli_client/objectStore')
const spyConsole = jest.spyOn(console, 'log')

jest.mock('../../../src/cli_client/objectStore')

const sampleOutboundProgress = {
  "status": "FINISHED",
  "test_cases": [
    {
      "id": 1,
      "name": "P2P Transfer Happy Path",
      "requests": [
        {
          "request": {
            "id": 1,
            "description": "Get party information",
            "apiVersion": {
              "minorVersion": 0,
              "majorVersion": 1,
              "type": "fspiop",
              "asynchronous": true
            },
            "operationPath": "/parties/{Type}/{ID}",
            "method": "get",
            "headers": {
              "Accept": "application/vnd.interoperability.parties+json;version=1.0",
              "Content-Type": "application/vnd.interoperability.parties+json;version=1.0",
              "Date": "Thu, 07 May 2020 10:44:00 GMT",
              "FSPIOP-Source": "testingtoolkitdfsp"
            },
            "params": {
              "Type": "MSISDN",
              "ID": "9876543210"
            },
            "tests": {
              "assertions": [
                {
                  "id": 1,
                  "description": "Response status to be 202",
                  "exec": [
                    "expect(response.status).to.equal(202)"
                  ],
                  "resultStatus": {
                    "status": "SUCCESS"
                  }
                },
                {
                  "id": 2,
                  "description": "Response statusText be Accepted",
                  "exec": [
                    "expect(response.statusText).to.equal('Accepted')"
                  ],
                  "resultStatus": {
                    "status": "SUCCESS"
                  }
                }
              ],
              "passedAssertionsCount": 2
            },
            "path": "/parties/MSISDN/9876543210"
          },
          "response": {
            "status": 202,
            "statusText": "Accepted",
            "data": ""
          },
          "callback": {
            "headers": {
              "content-type": "application/vnd.interoperability.parties+json;version=1.0",
              "date": "Thu, 07 May 2020 10:44:00 GMT",
              "fspiop-source": "userdfsp",
              "fspiop-destination": "testingtoolkitdfsp",
              "authorization": "Bearer 7718fa9b-be13-3fe7-87f0-a12cf1628168",
              "host": "docker.for.mac.localhost:5000",
              "content-length": "231",
              "connection": "close"
            },
            "body": {
              "party": {
                "partyIdInfo": {
                  "partyIdType": "MSISDN",
                  "partyIdentifier": "9876543210",
                  "fspId": "userdfsp"
                },
                "personalInfo": {
                  "complexName": {
                    "firstName": "Test",
                    "middleName": "Test",
                    "lastName": "Test"
                  },
                  "dateOfBirth": "1970-01-01"
                },
                "name": "Test"
              }
            }
          }
        },
        {
          "request": {
            "id": 1,
            "description": "Get party information",
            "apiVersion": {
              "minorVersion": 0,
              "majorVersion": 1,
              "type": "fspiop",
              "asynchronous": true
            },
            "operationPath": "/parties/{Type}/{ID}",
            "method": "get",
            "headers": {
              "Accept": "application/vnd.interoperability.parties+json;version=1.0",
              "Content-Type": "application/vnd.interoperability.parties+json;version=1.0",
              "Date": "Thu, 07 May 2020 10:44:00 GMT",
              "FSPIOP-Source": "testingtoolkitdfsp"
            },
            "params": {
              "Type": "MSISDN",
              "ID": "9876543210"
            },
            "tests": {
              "assertions": [
                {
                  "id": 1,
                  "description": "Response status to be 202",
                  "exec": [
                    "expect(response.status).to.equal(202)"
                  ],
                  "resultStatus": {
                    "status": "SUCCESS"
                  }
                },
                {
                  "id": 2,
                  "description": "Response statusText be Accepted",
                  "exec": [
                    "expect(response.statusText).to.equal('Accepted')"
                  ],
                  "resultStatus": {
                    "status": "FAILED"
                  }
                }
              ],
              "passedAssertionsCount": 1
            },
            "path": "/parties/MSISDN/9876543210"
          },
          "response": {
            "status": 202,
            "statusText": "Accepted",
            "data": ""
          },
          "callback": {
            "headers": {
              "content-type": "application/vnd.interoperability.parties+json;version=1.0",
              "date": "Thu, 07 May 2020 10:44:00 GMT",
              "fspiop-source": "userdfsp",
              "fspiop-destination": "testingtoolkitdfsp",
              "authorization": "Bearer 7718fa9b-be13-3fe7-87f0-a12cf1628168",
              "host": "docker.for.mac.localhost:5000",
              "content-length": "231",
              "connection": "close"
            },
            "body": {
              "party": {
                "partyIdInfo": {
                  "partyIdType": "MSISDN",
                  "partyIdentifier": "9876543210",
                  "fspId": "userdfsp"
                },
                "personalInfo": {
                  "complexName": {
                    "firstName": "Test",
                    "middleName": "Test",
                    "lastName": "Test"
                  },
                  "dateOfBirth": "1970-01-01"
                },
                "name": "Test"
              }
            }
          }
        }
      ]
    }
  ],
  "runtimeInformation": {
    "completedTimeISO": "2020-05-07T10:44:01.687Z",
    "startedTime": "Thu, 07 May 2020 10:44:00 GMT",
    "completedTime": "Thu, 07 May 2020 10:44:01 GMT",
    "runDurationMs": 1195,
    "avgResponseTime": "NA"
  }
}

describe('Cli client', () => {
  describe('run logger functionality', () => {
    it('when the cli mode is outbound should not throw an error', async () => {
      objectStore.get.mockReturnValueOnce({})
      expect(() => {
        logger.outbound(sampleOutboundProgress)
      }).not.toThrowError()
    })
    it('when extraSummaryInformation is supplied, it should be logged', async () => {
      objectStore.get.mockReturnValueOnce({
        extraSummaryInformation: 'Title:Mocktitle,Summary:MockSummary'
      })
      logger.outbound(sampleOutboundProgress)
      expect(spyConsole).toBeCalled()
    })
    it('when the cli mode is monitoring should not throw an error 1', async () => {
      const sampleMonitoringProgress = {
        "logTime": "Thu, 07 May 2020 10:44:00 GMT",
        "message": "SUCCESS",
        "verbosity": "info",
        "additionalData": {}
      }
      expect(() => {
        logger.monitoring(sampleMonitoringProgress)
      }).not.toThrowError()
    })
    it('when the cli mode is monitoring should not throw an error 2', async () => {
      const sampleMonitoringProgress = {
        "logTime": "Thu, 07 May 2020 10:44:00 GMT",
        "message": "SUCCESS",
        "verbosity": "info",
        "uniqueId": "uniqueId"
      }
      expect(() => {
        logger.monitoring(sampleMonitoringProgress)
      }).not.toThrowError()
    })
  })
})
