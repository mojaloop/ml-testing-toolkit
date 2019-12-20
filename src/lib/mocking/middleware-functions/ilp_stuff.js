const Ilp = require('@mojaloop/sdk-standard-components').Ilp;
const base64url = require('base64url')
// must be pinned at ilp-packet@2.2.0 for ILP v1 compatibility
const ilpPacket = require('ilp-packet')
// const customLogger = require('./requestLogger')

const handleQuoteIlp = (context, response) => {
  // Check whether the request is PUT /quotes
  const pathMatch = new RegExp(/\/quotes\/([^/]+)$/)
  if (response.method === 'put' && pathMatch.test(response.path)) {
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

    const packet = ilpPacket.serializeIlpPayment(packetInput);

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
  if (response.method === 'put' && pathMatch.test(response.path)) {
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
