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

 * ModusBox
 * Vijaya Kumar Guthi <vijaya.guthi@modusbox.com> (Original Author)
 --------------
 ******/

const { ilpFactory, ILP_VERSIONS } = require('@mojaloop/sdk-standard-components').Ilp
const customLogger = require('../../requestLogger')
const { logger } = require('../../logger')

let ilpObj = null
let ilpV4Obj = null

const init = (secret) => {
  ilpObj = ilpFactory(ILP_VERSIONS.v1, { secret, logger })
  ilpV4Obj = ilpFactory(ILP_VERSIONS.v4, { secret, logger })
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
        expiration: response.body.expiration,
        note: response.body.note
      }
    } else {
      const payeePartyIdType = context.request.body.CdtTrfTxInf.Cdtr.Id.OrgId?.Othr.Id ||
        context.request.body.CdtTrfTxInf.Cdtr.Id.PrvtId?.Othr.Id
      const payeePartyIdentifier = context.request.body.CdtTrfTxInf.Cdtr.Id.OrgId?.Othr.SchmeNm.Prtry ||
        context.request.body.CdtTrfTxInf.Cdtr.Id.PrvtId?.Othr.SchmeNm.Prtry
      const payerPartyIdType = context.request.body.CdtTrfTxInf.Dbtr.Id.OrgId?.Othr.Id ||
        context.request.body.CdtTrfTxInf.Dbtr.Id.PrvtId?.Othr.Id
      const payerPartyIdentifier = context.request.body.CdtTrfTxInf.Dbtr.Id.OrgId?.Othr.SchmeNm.Prtry ||
        context.request.body.CdtTrfTxInf.Dbtr.Id.PrvtId?.Othr.SchmeNm.Prtry
      transactionObject = {
        transactionId: context.request.body.CdtTrfTxInf.PmtId.EndToEndId,
        quoteId: context.request.body.CdtTrfTxInf.PmtId.TxId,
        payee: {
          partyIdInfo: {
            partyIdType: payeePartyIdType,
            partyIdentifier: payeePartyIdentifier,
            fspId: context.request.body.CdtTrfTxInf.CdtrAgt.FinInstnId.Othr.Id
          }
        },
        payer: {
          partyIdInfo: {
            partyIdType: payerPartyIdType,
            partyIdentifier: payerPartyIdentifier,
            fspId: context.request.body.CdtTrfTxInf.DbtrAgt.FinInstnId.Othr.Id
          }
        },
        amount: {
          currency: context.request.body.CdtTrfTxInf.IntrBkSttlmAmt.Ccy,
          amount: context.request.body.CdtTrfTxInf.IntrBkSttlmAmt.ActiveCurrencyAndAmount
        },
        transactionType: context.request.body.GrpHdr?.CdtTrfTxInf?.Purp?.Prtry || null,
        expiration: response.body.GrpHdr?.PmtInstrXpryDtTm,
        note: context.request.body.CdtTrfTxInf?.InstrForNxtAgt?.InstrInf || null
      }
    }

    let fulfilment
    if (!_isIso20022(response)) {
      const ilpResult = ilpObj.getResponseIlp(transactionObject)
      fulfilment = ilpResult.fulfilment
      response.body.ilpPacket = ilpResult.ilpPacket
      response.body.condition = ilpResult.condition
    } else {
      const ilpResult = ilpV4Obj.getResponseIlp(transactionObject)
      fulfilment = ilpResult.fulfilment
      response.body.CdtTrfTxInf.VrfctnOfTerms = {
        IlpV4PrepPacket: ilpResult.ilpPacket
      }
    }
    return fulfilment
  }
  return null
}

const handleTransferIlp = (context, response) => {
  // Check whether the request is POST /transfers
  const pathMatch = /\/transfers\/([^/]+)$/
  if (context.request.method === 'post' && response.method === 'put' && pathMatch.test(response.path)) {
    if (
      response.eventInfo && response.eventInfo.params && response.eventInfo.params.body &&
      (
        response.eventInfo.params.body.fulfilment ||
        (response.eventInfo.params.body.TxInfAndSts && response.eventInfo.params.body.TxInfAndSts.ExctnConf)
      )
    ) {
      return null
    }
    if (context.request.body.ilpPacket) {
      const generatedFulfilment = ilpObj.calculateFulfil(context.request.body.ilpPacket).replace('"', '')
      response.body.fulfilment = generatedFulfilment
    }
    if (context.request.body.CdtTrfTxInf?.VrfctnOfTerms?.IlpV4PrepPacket) {
      const generatedFulfilment = ilpV4Obj.calculateFulfil(context.request.body.CdtTrfTxInf.VrfctnOfTerms.IlpV4PrepPacket).replace('"', '')
      response.body.TxInfAndSts.ExctnConf = generatedFulfilment
    }
  }

  customLogger.logMessage('debug', 'Generated callback body', { additionalData: { context, response } })
  if (context.request.method === 'get' && response.method === 'put' && pathMatch.test(response.path)) {
    customLogger.logMessage('debug', 'Returning stored fulfilment if exists for transfer GET')
    const transferId = response.path.match(pathMatch)[1]
    customLogger.logMessage('debug', 'Fetching stored transfer for fulfilment', { additionalData: { transferId } })
    const storedTransfer = context.storedTransfers?.[transferId]
    customLogger.logMessage('debug', 'Stored transfer fetched for fulfilment', { additionalData: { storedTransfer } })
    // Check if stored request exists and is within 30 seconds
    if (storedTransfer) {
      if (storedTransfer.request.ilpPacket) {
        customLogger.logMessage('debug', 'Stored transfer has ilpPacket. Generating fulfilment.', { additionalData: { transferId, ilpPacket: storedTransfer.request.ilpPacket } })
        const generatedFulfilment = ilpObj.calculateFulfil(storedTransfer.request.ilpPacket).replace('"', '')
        response.body.fulfilment = generatedFulfilment
        customLogger.logMessage('debug', 'Fulfilment set in response body', { additionalData: { transferId, fulfilment: generatedFulfilment } })
      } else if (storedTransfer.request.CdtTrfTxInf?.VrfctnOfTerms?.IlpV4PrepPacket) {
        customLogger.logMessage('debug', 'Stored transfer has IlpV4PrepPacket. Generating fulfilment.', { additionalData: { transferId, IlpV4PrepPacket: storedTransfer.request.CdtTrfTxInf.VrfctnOfTerms.IlpV4PrepPacket } })
        const generatedFulfilment = ilpV4Obj.calculateFulfil(storedTransfer.request.CdtTrfTxInf.VrfctnOfTerms.IlpV4PrepPacket).replace('"', '')
        response.body.TxInfAndSts.ExctnConf = generatedFulfilment
        customLogger.logMessage('debug', 'ExctnConf set in response body', { additionalData: { transferId, ExctnConf: generatedFulfilment } })
      } else {
        customLogger.logMessage('warn', 'No ILP packet or IlpV4PrepPacket found in stored transfer request', { additionalData: { transferId, storedTransfer } })
      }
      delete context.storedTransfers[transferId]
    } else {
      delete response.body.fulfilment
    }
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
        return ilpObj.validateIlpAgainstTransferRequest(validationBody)
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
        return ilpV4Obj.validateIlpAgainstTransferRequest(validationBody)
      }
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
        if (request.payload.ilpPacket) {
          fulfilment = ilpObj.calculateFulfil(request.payload.ilpPacket).replace('"', '')
        } else if (request.payload.CdtTrfTxInf) {
          fulfilment = ilpV4Obj.calculateFulfil(request.payload.CdtTrfTxInf.VrfctnOfTerms.IlpV4PrepPacket).replace('"', '')
        }
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
      condition = ilpV4Obj.getResponseIlp(ilpV4Obj.getTransactionObject(request.payload.CdtTrfTxInf.VrfctnOfTerms.IlpV4PrepPacket)).condition
    }
    try {
      if (!_isIso20022(request)) {
        return ilpObj.validateFulfil(fulfilment, condition)
      } else {
        return ilpV4Obj.validateFulfil(fulfilment, condition)
      }
    } catch (err) {
      customLogger.logMessage('error', 'Failed to validate the fulfilment. Error: ' + err.message, { request })
      return false
    }
  }
  return true
}

// Decoding functions

const getIlpTransactionObject = (ilpPacket, isIso20022) => {
  return isIso20022 ? ilpV4Obj.getTransactionObject(ilpPacket) : ilpObj.getTransactionObject(ilpPacket)
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
