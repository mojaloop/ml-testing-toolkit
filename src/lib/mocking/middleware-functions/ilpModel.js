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
const customLogger = require('../../requestLogger')

let ilpObj = null

const init = (secret) => {
  ilpObj = new Ilp({
    secret
  })
}

// ILP Packet inclusion functions
const handleQuoteIlp = (context, response) => {
  // Check whether the request is POST /quotes
  const pathMatch = /\/quotes\/([^/]+)$/
  if (context.request.method === 'post' && response.method === 'put' && pathMatch.test(response.path)) {
    if (response.eventInfo && response.eventInfo.params && response.eventInfo.params.body &&
      (response.eventInfo.params.body.ilpPacket || response.eventInfo.params.body.condition)
    ) {
      return null
    }
    // const transactionObject = {
    //   mockData: 'This is a test data from self testing toolkit'
    // }
    let transactionObject
    if (!_isIso20022(context.request)) {
      transactionObject = {
        transactionId: context.request.body.transactionId,
        quoteId: context.request.body.quoteId,
        payee: context.request.body.payee,
        payer: context.request.body.payer,
        amount: response.body.transferAmount,
        transactionType: context.request.body.transactionType,
        note: response.body.note
      }
    } else {
      transactionObject = {
        transactionId: context.request.body.CdtTrfTxInf.PmtId.EndToEndId,
        quoteId: context.request.body.CdtTrfTxInf.PmtId.TxId,
        payee: {
          partyIdInfo: {
            partyIdType: context.request.body.CdtTrfTxInf.Cdtr.Id.OrgId.Othr.Id,
            partyIdentifier: context.request.body.CdtTrfTxInf.Cdtr.Id.OrgId.Othr.SchmeNm.Prtry,
            fspId: context.request.body.CdtTrfTxInf.CdtrAgt.FinInstnId.Othr.Id
          }
        },
        payer: {
          partyIdInfo: {
            partyIdType: context.request.body.CdtTrfTxInf.Dbtr.Id.OrgId.Othr.Id,
            partyIdentifier: context.request.body.CdtTrfTxInf.Dbtr.Id.OrgId.Othr.SchmeNm.Prtry,
            fspId: context.request.body.CdtTrfTxInf.DbtrAgt.FinInstnId.Othr.Id
          }
        },
        amount: {
          currency: context.request.body.CdtTrfTxInf.IntrBkSttlmAmt.Ccy,
          amount: context.request.body.CdtTrfTxInf.IntrBkSttlmAmt.ActiveCurrencyAndAmount
        },
        transactionType: context.request.body.transactionType,
        note: context.request.body.CdtTrfTxInf?.InstrForNxtAgt?.InstrInf || null
      }
    }

    const { ilpPacket, fulfilment, condition } = ilpObj.getResponseIlp(transactionObject)
    if (!_isIso20022(response)) {
      response.body.ilpPacket = ilpPacket
      response.body.condition = condition
    } else {
      response.body.CdtTrfTxInf.VrfctnOfTerms.IlpV4PrepPacket = ilpPacket
    }
    return fulfilment
  }
  return null
}

const handleTransferIlp = (context, response) => {
  // Check whether the request is POST /transfers
  const pathMatch = /\/transfers\/([^/]+)$/
  if (context.request.method === 'post' && response.method === 'put' && pathMatch.test(response.path)) {
    if (response.eventInfo && response.eventInfo.params && response.eventInfo.params.body &&
      response.eventInfo.params.body.fulfilment) {
      return null
    }
    const generatedFulfilment = ilpObj.calculateFulfil(context.request.body.ilpPacket ||
      context.request.body.CdtTrfTxInf.VrfctnOfTerms.IlpV4PrepPacket).replace('"', '')
    // const generatedCondition = ilpObj.calculateConditionFromFulfil(generatedFulfilment).replace('"', '')
    if (context.request.body.ilpPacket) {
      response.body.fulfilment = generatedFulfilment
    }
    if (context.request.body.TxInfAndSts) {
      response.body.TxInfAndSts.ExctnConf = generatedFulfilment
    }
  }
  if (context.request.method === 'get' && response.method === 'put' && pathMatch.test(response.path)) {
    // const generatedCondition = ilpObj.calculateConditionFromFulfil(generatedFulfilment).replace('"', '')
    delete response.body.fulfilment
  }
}

// Validation Functions

// Check the contents of ILP Packet against the values from body
const validateTransferIlpPacket = (context, request) => {
  if (request.method === 'post' && request.path === '/transfers') {
    customLogger.logMessage('info', 'Validating Ilp packet against the transfer request', { request })
    try {
      let validationBody
      if (!_isIso20022(request)) {
        validationBody = request.payload
      } else {
        validationBody = {
          payeeFsp: request.payload.CdtTrfTxInf.CdtrAgt.FinInstnId.Othr.Id,
          payerFsp: request.payload.CdtTrfTxInf.DbtrAgt.FinInstnId.Othr.Id,
          amount: {
            currency: request.payload.CdtTrfTxInf.IntrBkSttlmAmt.Ccy,
            amount: request.payload.CdtTrfTxInf.IntrBkSttlmAmt.ActiveCurrencyAndAmount
          },
          ilpPacket: request.payload.CdtTrfTxInf.VrfctnOfTerms.IlpV4PrepPacket
        }
      }
      return ilpObj.validateIlpAgainstTransferRequest(validationBody)
    } catch (err) {
      customLogger.logMessage('error', 'Failed to validate the Ilp packet. Error: ' + err.message, { request })
      return false
    }
  }
  return true
}

// Check the condition is matched with fulfilment stored
const validateTransferCondition = (context, request) => {
  if (request.method === 'post' && request.path === '/transfers') {
    let fulfilment = null
    if (request.customInfo.storedTransaction && request.customInfo.storedTransaction.fulfilment) {
      fulfilment = request.customInfo.storedTransaction.fulfilment
      customLogger.logMessage('info', 'Validating condition with the stored fulfilment', { request })
    } else {
      try {
        fulfilment = ilpObj.calculateFulfil(request.payload.ilpPacket).replace('"', '')
        customLogger.logMessage('info', 'Validating condition with the generated fulfilment', { request })
      } catch (err) {
        customLogger.logMessage('error', 'Failed to calculate the fulfilment. Error: ' + err.message, { request })
        return false
      }
    }
    let condition
    if (!_isIso20022(request)) {
      condition = request.payload?.condition
    } else {
      // Construct the ILP object from the request payload
      // since ISO20022 expect the condition in the ilpPacket
      condition = ilpObj.getResponseIlp(ilpObj.getTransactionObject(request.payload.CdtTrfTxInf.VrfctnOfTerms.IlpV4PrepPacket)).condition
    }
    try {
      return ilpObj.validateFulfil(fulfilment, condition)
    } catch (err) {
      customLogger.logMessage('error', 'Failed to validate the fulfilment. Error: ' + err.message, { request })
      return false
    }
  }
  return true
}

// Decoding functions

const getIlpTransactionObject = (ilpPacket) => {
  return ilpObj.getTransactionObject(ilpPacket)
}

const _isIso20022 = (requestOrResponse) => {
  return requestOrResponse.body?.CdtTrfTxInf || requestOrResponse.payload?.CdtTrfTxInf
}

module.exports = {
  init,
  handleQuoteIlp,
  handleTransferIlp,
  validateTransferIlpPacket,
  validateTransferCondition,
  getIlpTransactionObject
}
