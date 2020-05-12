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

const Ilp = require('@mojaloop/sdk-standard-components').Ilp
// const customLogger = require('./requestLogger')
const ilpPacket = require('ilp-packet')
const base64url = require('base64url')

var ilpObj = null

const init = (secret) => {
  ilpObj = new Ilp({
    secret: secret
  })
}

// ILP Packet inclusion functions
const handleQuoteIlp = (context, response) => {
  // Check whether the request is POST /quotes
  const pathMatch = new RegExp(/\/quotes\/([^/]+)$/)
  if (context.request.method === 'post' && response.method === 'put' && pathMatch.test(response.path)) {
    // const transactionObject = {
    //   mockData: 'This is a test data from self testing toolkit'
    // }
    const transactionObject = {
      transactionId: context.request.body.transactionId,
      quoteId: context.request.body.quoteId,
      payee: context.request.body.payee,
      payer: context.request.body.payer,
      amount: response.body.transferAmount,
      transactionType: context.request.body.transactionType,
      note: response.body.note
    }
    const { ilpPacket, condition } = ilpObj.getResponseIlp(transactionObject)
    response.body.ilpPacket = ilpPacket
    response.body.condition = condition
  }
}

const handleTransferIlp = (context, response) => {
  // Check whether the request is POST /transfers
  const pathMatch = new RegExp(/\/transfers\/([^/]+)$/)
  if (context.request.method === 'post' && response.method === 'put' && pathMatch.test(response.path)) {
    const generatedFulfilment = ilpObj.calculateFulfil(context.request.body.ilpPacket).replace('"', '')
    // const generatedCondition = ilpObj.calculateConditionFromFulfil(generatedFulfilment).replace('"', '')
    response.body.fulfilment = generatedFulfilment
  }
}

// Validation Functions

// Check the contents of ILP Packet against the values from body
const validateTransferIlpPacket = (context, request) => {
  if (request.method === 'post' && request.path === '/transfers') {
    return validateIlpAgainstTransferRequest(request.payload)
  }
  return true
  // Check the fulfilment and condition matching
}

// Check the condition is matched with fulfilment stored
const validateTransferCondition = (context, request) => {
  if (request.method === 'post' && request.path === '/transfers') {
    const generatedFulfilment = ilpObj.calculateFulfil(request.payload.ilpPacket).replace('"', '')
    return ilpObj.validateFulfil(generatedFulfilment, request.payload.condition)
  }
  return true
  // Check the fulfilment and condition matching
}

// TODO: To be moved to sdk-standandard-componenets library
const decodeIlpPacket = (inputIlpPacket) => {
  const binaryPacket = Buffer.from(inputIlpPacket, 'base64')
  const jsonPacket = ilpPacket.deserializeIlpPayment(binaryPacket)
  return jsonPacket
}

// TODO: To be moved to sdk-standandard-componenets library
const getTransactionObject = (inputIlpPacket) => {
  const jsonPacket = decodeIlpPacket(inputIlpPacket)
  const decodedData = base64url.decode(jsonPacket.data.toString())
  return JSON.parse(decodedData)
}

// TODO: To be moved to sdk-standandard-componenets library
const validateIlpAgainstTransferRequest = (transferRequestBody) => {
  const transactionObject = getTransactionObject(transferRequestBody.ilpPacket)

  if (transferRequestBody.transferId !== transactionObject.transactionId) {
    return false
  }
  if (transferRequestBody.payerFsp !== transactionObject.payer.partyIdInfo.fspId) {
    return false
  }
  if (transferRequestBody.payeeFsp !== transactionObject.payee.partyIdInfo.fspId) {
    return false
  }
  if (transferRequestBody.amount.currency !== transactionObject.amount.currency) {
    return false
  }
  if (transferRequestBody.amount.amount !== transactionObject.amount.amount) {
    return false
  }
  return true
}

module.exports = {
  init,
  handleQuoteIlp,
  handleTransferIlp,
  validateTransferIlpPacket,
  validateTransferCondition
}
