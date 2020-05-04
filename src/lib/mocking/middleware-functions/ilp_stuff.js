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
const base64url = require('base64url')
// must be pinned at ilp-packet@2.2.0 for ILP v1 compatibility
const ilpPacket = require('ilp-packet')
// const customLogger = require('./requestLogger')

const handleQuoteIlp = (context, response) => {
  // Check whether the request is PUT /quotes
  const pathMatch = new RegExp(/\/quotes\/([^/]+)$/)
  if (context.request.method === 'post' && response.method === 'put' && pathMatch.test(response.path)) {
    this.ilp = new Ilp({
      secret: 'asdf'
    })
    const transactionObject = {
      mockData: 'This is a test data from self testing toolkit'
    }
    // const transactionObject = {
    //   transactionId: 'asdf',
    //   quoteId: 'asdf',
    //   payee: 'asdf',
    //   payer: 'asdf',
    //   amount: '12.5',
    //   transactionType: 'safd',
    //   note: 'asdf'
    // }

    const ilpData = Buffer.from(base64url(JSON.stringify(transactionObject)))

    const packetInput = {
      amount: this.ilp._getIlpCurrencyAmount(context.request.body.amount), // unsigned 64bit integer as a string
      account: this.ilp._getIlpAddress(context.request.body.payee), // ilp address
      data: ilpData // base64url encoded attached data
    }

    const packet = ilpPacket.serializeIlpPayment(packetInput)

    const base64encodedIlpPacket = base64url.fromBase64(packet.toString('base64')).replace('"', '')

    const generatedFulfilment = this.ilp.caluclateFulfil(base64encodedIlpPacket).replace('"', '')
    const generatedCondition = this.ilp.calculateConditionFromFulfil(generatedFulfilment).replace('"', '')
    response.body.ilpPacket = base64encodedIlpPacket
    response.body.condition = generatedCondition
  }
}

const handleTransferIlp = (context, response) => {
  // Check whether the request is PUT /quotes
  const pathMatch = new RegExp(/\/transfers\/([^/]+)$/)
  if (context.request.method === 'post' && response.method === 'put' && pathMatch.test(response.path)) {
    this.ilp = new Ilp({
      secret: 'asdf'
    })

    const generatedFulfilment = this.ilp.caluclateFulfil(context.request.body.ilpPacket).replace('"', '')
    // const generatedCondition = this.ilp.calculateConditionFromFulfil(generatedFulfilment).replace('"', '')
    response.body.fulfilment = generatedFulfilment
  }
}

module.exports.handleQuoteIlp = handleQuoteIlp
module.exports.handleTransferIlp = handleTransferIlp
