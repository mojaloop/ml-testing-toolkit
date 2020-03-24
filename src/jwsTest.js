const fs = require('fs')
const { Jws } = require('@mojaloop/sdk-standard-components')
// const connectionProvider = require('./lib/configuration-providers/mb-connection-manager')

// Signing
const jwsSigningKey = fs.readFileSync('secrets/privatekey.pem')

const jwsSigner = new Jws.signer({ // eslint-disable-line
  signingKey: jwsSigningKey
})

const body = {
  quoteId: '123'
}
const reqOpts = {
  method: 'POST',
  uri: 'http://localhost:5000/quotes',
  headers: {
    'fspiop-http-method': 'post',
    'fspiop-uri': '/quotes',
    'fspiop-source': 'payerfsp'
  },
  body: body,
  agent: 'test1',
  resolveWithFullResponse: true,
  simple: false
}

reqOpts.body = JSON.stringify(body)

jwsSigner.sign(reqOpts)
console.log(reqOpts)

// Validation
const keys = {}
keys.payerfsp = fs.readFileSync('secrets/publickey.cer')

const jwsValidator = new Jws.validator({ // eslint-disable-line
  validationKeys: keys
})

try {
  reqOpts.body = body
  jwsValidator.validate(reqOpts)
} catch (err) {
  console.log(err)
}

// Testing the connection provider
// const fn = async () => {
//   await connectionProvider.initialize()
//   console.log(connectionProvider.getTestingToolkitDfspJWSCerts())
//   console.log(connectionProvider.getUserDfspJWSCerts())
// }
// fn()
