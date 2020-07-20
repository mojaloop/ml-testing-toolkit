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

const fs = require('fs')
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile)
const outbound = require('../../test-outbound/outbound-initiator')
const TraceHeaderUtils = require('../../traceHeaderUtils')

const handleRequest = async (context, request, callback, triggerFolder) => {
  // Check whether the request is POST /transactionRequests
  if (request.method === 'post' && request.path === '/transactionRequests') {
    if (callback.body.transactionRequestState === 'RECEIVED') {
      const transactionRequest = request.payload
      try {
        const contents = await readFileAsync(triggerFolder + '/transaction_request_followup.json')
        const outboundTemplate = JSON.parse(contents)
        // Replace the input values in the template with inbound transactionRequest params
        outboundTemplate.inputValues.TrsNote = transactionRequest.note
        outboundTemplate.inputValues.TrsCurrency = transactionRequest.amount.currency
        outboundTemplate.inputValues.TrsAmount = transactionRequest.amount.amount
        outboundTemplate.inputValues.TrsPayerIdType = transactionRequest.payer.partyIdType
        outboundTemplate.inputValues.TrsPayerIdValue = transactionRequest.payer.partyIdentifier
        outboundTemplate.inputValues.TrsPayerFspId = transactionRequest.payer.fspId
        outboundTemplate.inputValues.TrsPayeeIdType = transactionRequest.payee.partyIdInfo.partyIdType
        outboundTemplate.inputValues.TrsPayeeIdValue = transactionRequest.payee.partyIdInfo.partyIdentifier
        outboundTemplate.inputValues.TrsPayeeFspId = transactionRequest.payee.partyIdInfo.fspId
        outboundTemplate.inputValues.TrsScenario = transactionRequest.transactionType.scenario
        outboundTemplate.inputValues.TrsInitiator = transactionRequest.transactionType.initiator
        outboundTemplate.inputValues.TrsInitiatorType = transactionRequest.transactionType.initiatorType

        // Replace the transaction ID from the generated callback
        outboundTemplate.inputValues.transactionId = callback.body.transactionId
        if (request.customInfo.sessionID) {
          outbound.OutboundSend(outboundTemplate, TraceHeaderUtils.getTraceIdPrefix() + request.customInfo.sessionID + '0000', callback.fspId)
        } else {
          outbound.OutboundSend(outboundTemplate, null, callback.fspId)
        }
      } catch (err) {
        console.log(err)
      }
    }
  }

  return true
}

module.exports = {
  handleRequest
}
