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

const Config = require('../config')
const axios = require('axios').default
const fs = require('fs')
const _ = require('lodash')
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile)

const DEFAULT_ENVIRONMENT_NAME = 'TESTING-TOOLKIT'
const DEFAULT_TESTING_TOOLKIT_FSPID = 'testingtoolkitdfsp'
const DEFAULT_USER_FSPID = 'userdfsp'
const CM_CHECK_INTERVAL = 10000
var CONNECTION_MANAGER_API_URL = null

var currentEnvironment = null
// var currentTestingToolkitDFSP = null
// var currentUserDFSP = null

var currentTestingToolkitDfspJWSCerts = null
var currentUserDfspJWSCerts = null
var currentTestingToolkitDfspJWSPrivateKey = null

var currentTlsConfig = {}

const initEnvironment = async () => {
  // Check whether an environment exists with the name testing-toolkit
  try {
    const environmentsResult = await axios.get(CONNECTION_MANAGER_API_URL + '/api/environments', { headers: { 'Content-Type': 'application/json' } })
    if (environmentsResult.status === 200) {
      const environments = environmentsResult.data
      if (environments.length > 0) {
        const testingToolkitEnv = environments.find(item => item.name === DEFAULT_ENVIRONMENT_NAME)
        if (testingToolkitEnv) {
          currentEnvironment = testingToolkitEnv
        } else {
          currentEnvironment = null
        }
      } else {
        currentEnvironment = null
      }
    }
  } catch (err) {}

  // Create if not exists
  if (!currentEnvironment) {
    try {
      const environmentData = {
        name: DEFAULT_ENVIRONMENT_NAME,
        defaultDN: {
          CN: 'tes1.centralhub.modusbox.live',
          O: 'Modusbox',
          OU: 'MCM'
        }
      }
      const createEnvResponse = await axios.post(CONNECTION_MANAGER_API_URL + '/api/environments', environmentData, { headers: { 'Content-Type': 'application/json' } })
      // console.log(createEnvResponse)
      if (createEnvResponse.status === 200) {
        currentEnvironment = createEnvResponse.data
      } else {
        throw new Error('Some error creating environment')
      }
    } catch (err) {
      throw new Error('Some error creating environment')
    }
  }
}

const initDFSP = async (environmentId, dfspId, dfspName) => {
  // Check whether a dfspId exists with the name testing-toolkit
  try {
    const dfspResult = await axios.get(CONNECTION_MANAGER_API_URL + '/api/environments/' + environmentId + '/dfsps', { headers: { 'Content-Type': 'application/json' } })
    if (dfspResult.status === 200) {
      const dfsps = dfspResult.data
      if (dfsps.length > 0) {
        const dfspItem = dfsps.find(item => item.id === dfspId)
        if (dfspItem) {
          return dfspItem
        }
      }
    }
  } catch (err) {}

  // Create if not exists
  try {
    const dfspData = {
      dfspId: dfspId,
      name: dfspName,
      monetaryZoneId: 'EUR'
    }
    const dfspCreateResponse = await axios.post(CONNECTION_MANAGER_API_URL + '/api/environments/' + environmentId + '/dfsps', dfspData, { headers: { 'Content-Type': 'application/json' } })
    if (dfspCreateResponse.status === 200) {
      return dfspCreateResponse.data
    } else {
      console.log('Some error creating DFSP')
    }
  } catch (err) {
    console.log('Some error creating DFSP', err.response ? err.response.data : err)
  }
}

const initJWSCertificate = async (environmentId, dfspId, jwsCertificate = null, intermediateCertificate = null) => {
  const rootCertificate = null
  let certExists = false
  let certResult = null
  // Check whether a jws certificate exists for the dfspId testing-toolkit
  try {
    certResult = await axios.get(CONNECTION_MANAGER_API_URL + '/api/environments/' + environmentId + '/dfsps/' + dfspId + '/jwscerts', { headers: { 'Content-Type': 'application/json' } })
    if (certResult.status === 200) {
      // const jwsCert = certResult.data
      if (certResult.data && certResult.data.id) {
        certExists = true
        // return certResult.data
      }
    }
  } catch (err) {}

  if (certExists) {
    if (rootCertificate === certResult.data.rootCertificate && intermediateCertificate === certResult.data.intermediateChain && jwsCertificate === certResult.data.jwsCertificate) {
      return certResult
    }
  }

  // Create if not exists or update if exists
  try {
    const jwsData = {
      rootCertificate: rootCertificate,
      intermediateChain: intermediateCertificate,
      jwsCertificate: jwsCertificate
    }
    let jwsCertResponse = null
    if (certExists) {
      jwsCertResponse = await axios.put(CONNECTION_MANAGER_API_URL + '/api/environments/' + environmentId + '/dfsps/' + dfspId + '/jwscerts', jwsData, { headers: { 'Content-Type': 'application/json' } })
    } else {
      jwsCertResponse = await axios.post(CONNECTION_MANAGER_API_URL + '/api/environments/' + environmentId + '/dfsps/' + dfspId + '/jwscerts', jwsData, { headers: { 'Content-Type': 'application/json' } })
    }
    if (jwsCertResponse.status === 200) {
      return jwsCertResponse.data
    } else {
      console.log('Some error creating / updating JWS cert for DFSP')
    }
  } catch (err) {
    console.log('Some error creating / updating JWS cert for DFSP', err.response ? err.response.data : err)
  }
}

const fetchUserDFSPJwsCerts = async (environmentId, dfspId) => {
  // Check whether an environment exists with the name testing-toolkit
  try {
    const certResult = await axios.get(CONNECTION_MANAGER_API_URL + '/api/environments/' + environmentId + '/dfsps/' + dfspId + '/jwscerts', { headers: { 'Content-Type': 'application/json' } })
    if (certResult.status === 200) {
      // const jwsCert = certResult.data
      if (certResult.data && certResult.data.id) {
        const fetchedJwsCerts = certResult.data
        if (!_.isEqual(fetchedJwsCerts, currentUserDfspJWSCerts)) {
          currentUserDfspJWSCerts = fetchedJwsCerts
          // console.log('User DFSP JWS Certificate updated', fetchedJwsCerts.jwsCert)
        }
      }
    }
  } catch (err) {}
  return currentUserDfspJWSCerts
}

// TLS Related

const initHubCa = async (environmentId) => {
  let certResult = null
  // Check whether a jws certificate exists for the dfspId testing-toolkit
  try {
    certResult = await axios.get(CONNECTION_MANAGER_API_URL + '/api/environments/' + environmentId + '/ca/rootCert', { headers: { 'Content-Type': 'application/json' } })
    if (certResult.status === 200) {
      // const jwsCert = certResult.data
      if (certResult.data && certResult.data.certificate) {
        return certResult.data.certificate
      }
    }
  } catch (err) {}

  // Create if not exists
  try {
    const casData = {
      default: {
        expiry: '87600h',
        usages: [
          'signing'
        ],
        signature_algorithm: 'SHA256WithRSA'
      },
      csr: {
        hosts: [
          'string'
        ],
        names: [
          {
            CN: 'testingtoolkithubca',
            O: 'Testing Toolkit Hub CA',
            OU: 'Payments',
            C: 'US',
            ST: 'NY',
            L: 'NY'
          }
        ],
        key: {
          size: 4096,
          algo: 'rsa'
        }
      }
    }
    let hubCaCertResponse = null

    hubCaCertResponse = await axios.post(CONNECTION_MANAGER_API_URL + '/api/environments/' + environmentId + '/cas', casData, { headers: { 'Content-Type': 'application/json' } })

    if (hubCaCertResponse.status === 200) {
      return hubCaCertResponse.data.certificate
    } else {
      console.log('Some error creating Hub CA Certificate')
    }
  } catch (err) {
    console.log('Some error creating Hub CA Certificate', err.response ? err.response.data : err)
  }
}

const checkDfspCa = async (environmentId, dfspId) => {
  // Check for any new CSRs those need to be signed
  try {
    const dfspCaResult = await axios.get(CONNECTION_MANAGER_API_URL + '/api/environments/' + environmentId + '/dfsps/' + dfspId + '/ca', { headers: { 'Content-Type': 'application/json' } })
    if (dfspCaResult.status === 200) {
      if (dfspCaResult.data.rootCertificate && dfspCaResult.data.validationState === 'VALID') {
        if (currentTlsConfig.dfspCaRootCert !== dfspCaResult.data.rootCertificate) {
          console.log('New DFSP CA Root CERT Found')
          currentTlsConfig.dfspCaRootCert = dfspCaResult.data.rootCertificate
        }
      }
    }
  } catch (err) {}
}

const checkDfspCsrs = async (environmentId, dfspId) => {
  // Check for any new CSRs those need to be signed
  let dfspPendingCsrs = []
  try {
    const dfspCsrsResult = await axios.get(CONNECTION_MANAGER_API_URL + '/api/environments/' + environmentId + '/dfsps/' + dfspId + '/enrollments/inbound', { headers: { 'Content-Type': 'application/json' } })
    if (dfspCsrsResult.status === 200) {
      dfspPendingCsrs = dfspCsrsResult.data.filter(item => item.state === 'CSR_LOADED' && item.validationState === 'VALID')
    }
  } catch (err) {}

  // Iterate through pending CSRs and sign
  for (let i = 0; i < dfspPendingCsrs.length; i++) {
    // Sign the CSR
    try {
      let signResponse = null

      signResponse = await axios.post(CONNECTION_MANAGER_API_URL + '/api/environments/' + environmentId + '/dfsps/' + dfspId + '/enrollments/inbound/' + dfspPendingCsrs[i].id + '/sign', {}, { headers: { 'Content-Type': 'application/json' } })

      if (signResponse.status === 200) {
        if (signResponse.data.certificate) {
          console.log('CSR signed for ' + dfspId)
        }
      } else {
        console.log('Some error signing DFSP CSR')
      }
    } catch (err) {
      console.log('Some error signing DFSP CSR', err.response ? err.response.data : err)
    }
  }
}

const checkHubCsrs = async (environmentId, dfspId) => {
  // Check for any new CSRs those need to be signed
  let hubCsrs = []
  try {
    const hubCsrsResult = await axios.get(CONNECTION_MANAGER_API_URL + '/api/environments/' + environmentId + '/dfsps/' + dfspId + '/enrollments/outbound', { headers: { 'Content-Type': 'application/json' } })
    if (hubCsrsResult.status === 200) {
      hubCsrs = hubCsrsResult.data.filter(item => item.validationState === 'VALID')
    }
  } catch (err) {}

  // Store if any signed CSRs found or create a CSR if no CSR found
  if (hubCsrs.length > 0) {
    const hubSignedCsrs = hubCsrs.filter(item => (item.validationState === 'VALID' && item.state === 'CERT_SIGNED' && item.certificate !== null))
    if (hubSignedCsrs.length > 0) {
      if (currentTlsConfig.hubClientCert !== hubSignedCsrs[0].certificate) {
        console.log('New Signed Hub client CERT Found')
        currentTlsConfig.hubClientCert = hubSignedCsrs[0].certificate
      }
    }
  } else {
    try {
      const hubClientCsrData = await readFileAsync('secrets/tls/hub_client.csr')
      const hubCsrData = {
        hubCSR: hubClientCsrData.toString()
      }
      let hubCsrCreateResponse = null
      hubCsrCreateResponse = await axios.post(CONNECTION_MANAGER_API_URL + '/api/environments/' + environmentId + '/dfsps/' + dfspId + '/enrollments/outbound', hubCsrData, { headers: { 'Content-Type': 'application/json' } })
      if (hubCsrCreateResponse.status === 200) {
        console.log('Hub CSR Uploaded')
      } else {
        console.log('Some error uploading Hub CSR')
      }
    } catch (err) {
      console.log('Some error uploading Hub CSR', err.response ? err.response.data : err)
    }
  }
}

const uploadHubServerCerts = async (environmentId, rootCert, intermediateChain, serverCert) => {
  // Check for any hub server certs
  let hubServerCerts = null
  try {
    const hubServerCertsResult = await axios.get(CONNECTION_MANAGER_API_URL + '/api/environments/' + environmentId + '/hub/servercerts', { headers: { 'Content-Type': 'application/json' } })
    if (hubServerCertsResult.status === 200) {
      hubServerCerts = hubServerCertsResult.data
    }
  } catch (err) {}

  const newHubServerCerts = {
    rootCertificate: rootCert,
    intermediateChain: intermediateChain,
    serverCertificate: serverCert
  }

  // Update if the certificates are not same
  if (hubServerCerts) {
    if (hubServerCerts.rootCertificate !== rootCert || hubServerCerts.intermediateChain !== intermediateChain || hubServerCerts.serverCertificate !== serverCert) {
      try {
        const hubServerCertsUpdateResponse = await axios.put(CONNECTION_MANAGER_API_URL + '/api/environments/' + environmentId + '/hub/servercerts', newHubServerCerts, { headers: { 'Content-Type': 'application/json' } })
        if (hubServerCertsUpdateResponse.status === 200) {
          console.log('Hub Server certs updated')
        } else {
          console.log('Some error updating Hub server certs')
        }
      } catch (err) {
        console.log('Some error updating Hub server certs')
      }
    }
  } else {
    try {
      const hubServerCertsCreateResponse = await axios.post(CONNECTION_MANAGER_API_URL + '/api/environments/' + environmentId + '/hub/servercerts', newHubServerCerts, { headers: { 'Content-Type': 'application/json' } })
      if (hubServerCertsCreateResponse.status === 200) {
        console.log('Hub Server certs created')
      } else {
        console.log('Some error creating Hub server certs')
      }
    } catch (err) {
      console.log('Some error creating Hub server certs', err)
    }
  }
}

const checkDfspServerCerts = async (environmentId, dfspId) => {
  // Check for any new CSRs those need to be signed
  try {
    const dfspServerCertsResult = await axios.get(CONNECTION_MANAGER_API_URL + '/api/environments/' + environmentId + '/dfsps/' + dfspId + '/servercerts', { headers: { 'Content-Type': 'application/json' } })
    if (dfspServerCertsResult.status === 200) {
      if (dfspServerCertsResult.data.validationState === 'VALID') {
        currentTlsConfig.dfspServerCaRootCert = dfspServerCertsResult.data.rootCertificate
        currentTlsConfig.dfspServerCaIntermediateCert = dfspServerCertsResult.data.intermediateChain
        currentTlsConfig.dfspServerCert = dfspServerCertsResult.data.serverCertificate
      }
    }
  } catch (err) {}
}

const tlsLoadHubServerCertificates = async () => {
  // Read Hub Server root CA
  const tmpHubServerCaRootCert = await readFileAsync('secrets/tls/hub_server_cacert.pem')
  currentTlsConfig.hubServerCaRootCert = tmpHubServerCaRootCert.toString()
  // Read Hub server cert
  const tmpHubServerCert = await readFileAsync('secrets/tls/hub_server_cert.pem')
  currentTlsConfig.hubServerCert = tmpHubServerCert.toString()
  // Read Hub server key
  const tmpHubServerKey = await readFileAsync('secrets/tls/hub_server_key.key')
  currentTlsConfig.hubServerKey = tmpHubServerKey.toString()
}

const tlsChecker = async () => {
  try {
    // Initialize HUB CA
    currentTlsConfig.hubCaCert = await initHubCa(currentEnvironment.id)

    // TODO: Download DFSP CA and place it in trusted store
    await checkDfspCa(currentEnvironment.id, DEFAULT_USER_FSPID)

    // Check for DFSP CSRs
    await checkDfspCsrs(currentEnvironment.id, DEFAULT_USER_FSPID)

    // Upload HUB CSRs and also Check for Signed HUB CSRs and get outbound certificate
    await checkHubCsrs(currentEnvironment.id, DEFAULT_USER_FSPID)

    // Read Hub Server Certificates
    await tlsLoadHubServerCertificates()

    // Upload Hub Server root CA and Hub Server cert
    await uploadHubServerCerts(currentEnvironment.id, currentTlsConfig.hubServerCaRootCert, null, currentTlsConfig.hubServerCert)
    // Check for DFSP Server root CA and server cert
    await checkDfspServerCerts(currentEnvironment.id, DEFAULT_USER_FSPID)

    // Read Hub Client Key
    const hubClientKeyData = await readFileAsync('secrets/tls/hub_client_key.key')
    currentTlsConfig.hubClientKey = hubClientKeyData.toString()

    // // Initialize the DFSPs
    // if (currentEnvironment) {
    //   // currentTestingToolkitDFSP = await initDFSP(currentEnvironment.id, DEFAULT_TESTING_TOOLKIT_FSPID, 'Testing Toolkit DFSP')
    //   // currentUserDFSP = await initDFSP(currentEnvironment.id, DEFAULT_USER_FSPID, 'User DFSP')
    //   await initDFSP(currentEnvironment.id, DEFAULT_TESTING_TOOLKIT_FSPID, 'Testing Toolkit DFSP')
    //   await initDFSP(currentEnvironment.id, DEFAULT_USER_FSPID, 'User DFSP')
    // }
    // // Initialize JWS certificate for testing toolkit dfsp
    // const certData = await readFileAsync('secrets/publickey.cer')
    // currentTestingToolkitDfspJWSCerts = await initJWSCertificate(currentEnvironment.id, DEFAULT_TESTING_TOOLKIT_FSPID, certData.toString())

    // // Fetch the user DFSP Jws certs once and then periodically check
    // await fetchUserDFSPJwsCerts(currentEnvironment.id, DEFAULT_USER_FSPID)

    // console.log(currentTlsConfig)
  } catch (err) {
    console.log(err)
  }
}

const checkConnectionManager = async () => {
  CONNECTION_MANAGER_API_URL = Config.getUserConfig().CONNECTION_MANAGER_API_URL
  if (Config.getUserConfig().JWS_SIGN || Config.getUserConfig().VALIDATE_INBOUND_JWS) {
    try {
      // Get private key for signing
      currentTestingToolkitDfspJWSPrivateKey = await readFileAsync('secrets/privatekey.pem')

      // Initialize HUB environment
      await initEnvironment()
      // Initialize the DFSPs
      if (currentEnvironment) {
        // currentTestingToolkitDFSP = await initDFSP(currentEnvironment.id, DEFAULT_TESTING_TOOLKIT_FSPID, 'Testing Toolkit DFSP')
        // currentUserDFSP = await initDFSP(currentEnvironment.id, DEFAULT_USER_FSPID, 'User DFSP')
        await initDFSP(currentEnvironment.id, DEFAULT_TESTING_TOOLKIT_FSPID, 'Testing Toolkit DFSP')
        await initDFSP(currentEnvironment.id, DEFAULT_USER_FSPID, 'User DFSP')
      }
      // Initialize JWS certificate for testing toolkit dfsp
      const certData = await readFileAsync('secrets/publickey.cer')
      currentTestingToolkitDfspJWSCerts = await initJWSCertificate(currentEnvironment.id, DEFAULT_TESTING_TOOLKIT_FSPID, certData.toString())

      // Fetch the user DFSP Jws certs once and then periodically check
      await fetchUserDFSPJwsCerts(currentEnvironment.id, DEFAULT_USER_FSPID)
    } catch (err) {
      console.log(err)
    }
  }

  if (Config.getUserConfig().OUTBOUND_MUTUAL_TLS_ENABLED || Config.getUserConfig().INBOUND_MUTUAL_TLS_ENABLED) {
    try {
      // Do TLS related stuff
      if (!currentEnvironment) {
        // Initialize HUB environment
        await initEnvironment()
        if (currentEnvironment) {
          await initDFSP(currentEnvironment.id, DEFAULT_TESTING_TOOLKIT_FSPID, 'Testing Toolkit DFSP')
          await initDFSP(currentEnvironment.id, DEFAULT_USER_FSPID, 'User DFSP')
        }
      }
      await tlsChecker()
    } catch (err) {
      console.log(err)
    }
  }
}

const initialize = async () => {
  await checkConnectionManager()
  setInterval(checkConnectionManager, CM_CHECK_INTERVAL)
}

const waitForFewSecs = async (secs) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true)
    }, secs * 1000)
  })
}

const waitForTlsHubCerts = async () => {
  for (let i = 0; i < 10; i++) {
    if (currentTlsConfig.hubCaCert && currentTlsConfig.hubServerCert && currentTlsConfig.hubServerKey) {
      return true
    }
    await waitForFewSecs(2)
  }
  throw new Error('Timeout Hub Init')
}

const getTestingToolkitDfspJWSCerts = () => {
  return currentTestingToolkitDfspJWSCerts ? currentTestingToolkitDfspJWSCerts.jwsCertificate : null
}

const getTestingToolkitDfspJWSPrivateKey = () => {
  return currentTestingToolkitDfspJWSPrivateKey
}

const getUserDfspJWSCerts = () => {
  return currentUserDfspJWSCerts ? currentUserDfspJWSCerts.jwsCertificate : null
}

const getTlsConfig = () => {
  return currentTlsConfig
}

module.exports = {
  initialize,
  getTestingToolkitDfspJWSCerts,
  getUserDfspJWSCerts,
  getTestingToolkitDfspJWSPrivateKey,
  getTlsConfig,
  waitForTlsHubCerts
}
