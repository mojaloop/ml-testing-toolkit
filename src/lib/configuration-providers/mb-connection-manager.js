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
const querystring = require('querystring')
const readFileAsync = promisify(fs.readFile)
const objectStore = require('../objectStore/objectStoreInterface')
const dfspDB = require('../db/dfspMockUsers')

const DEFAULT_ENVIRONMENT_NAME = 'TESTING-TOOLKIT'
const DEFAULT_TESTING_TOOLKIT_FSPID = 'testingtoolkitdfsp'
const CM_CHECK_INTERVAL = 10000
var CONNECTION_MANAGER_API_URL = null

const getDFSPs = async () => {
  const tempDfspList = await dfspDB.getDFSPList()
  if (Config.getSystemConfig().HOSTING_ENABLED) {
    return tempDfspList
  } else {
    return {
      id: Config.getUserConfig().DEFAULT_USER_FSPID,
      name: 'User DFSP'
    }
  }
}

var currentCookies = []
var currentEnvironment = null
// var currentTestingToolkitDFSP = null
// var currentUserDFSP = null

var currentJWSConfig = {
  dfsps: {}
}
var currentTlsConfig = {
  dfsps: {}
}
var currentEndpoints = {}

const initEnvironment = async () => {
  // Check whether an environment exists with the name testing-toolkit
  try {
    const environmentsResult = await axios.get(CONNECTION_MANAGER_API_URL + '/api/environments', { headers: { Cookie: currentCookies[0], 'Content-Type': 'application/json' } })
    if (environmentsResult.status === 200) {
      const environments = environmentsResult.data
      if (environments.length > 0) {
        const testingToolkitEnv = environments.find(item => item.name === DEFAULT_ENVIRONMENT_NAME)
        currentEnvironment = testingToolkitEnv || null
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
      const createEnvResponse = await axios.post(CONNECTION_MANAGER_API_URL + '/api/environments', environmentData, { headers: { Cookie: currentCookies[0], 'Content-Type': 'application/json' } })
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
    const dfspResult = await axios.get(CONNECTION_MANAGER_API_URL + '/api/environments/' + environmentId + '/dfsps', { headers: { Cookie: currentCookies[0], 'Content-Type': 'application/json' } })
    if (dfspResult.status === 200 && dfspResult.data.length > 0) {
      const dfspItem = dfspResult.data.find(item => item.id === dfspId)
      if (dfspItem) {
        return dfspItem
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
    const dfspCreateResponse = await axios.post(CONNECTION_MANAGER_API_URL + '/api/environments/' + environmentId + '/dfsps', dfspData, { headers: { Cookie: currentCookies[0], 'Content-Type': 'application/json' } })
    if (dfspCreateResponse.status === 200) {
      return dfspCreateResponse.data
    } else {
      console.log('Some error creating DFSP')
    }
  } catch (err) {
    console.log('Some error creating DFSP', err.response ? err.response.data : err)
  }
}

const initJWSCertificate = async (environmentId, dfspId, jwsCertificate) => {
  const intermediateCertificate = null
  const rootCertificate = null
  let certExists = false
  let certResult = null
  // Check whether a jws certificate exists for the dfspId testing-toolkit
  try {
    certResult = await axios.get(CONNECTION_MANAGER_API_URL + '/api/environments/' + environmentId + '/dfsps/' + dfspId + '/jwscerts', { headers: { Cookie: currentCookies[0], 'Content-Type': 'application/json' } })
    if (certResult.status === 200) {
      certExists = (certResult.data && certResult.data.id)
    }
  } catch (err) {}

  if (certExists && (rootCertificate === certResult.data.rootCertificate && intermediateCertificate === certResult.data.intermediateChain && jwsCertificate === certResult.data.jwsCertificate)) {
    return certResult
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
      jwsCertResponse = await axios.put(CONNECTION_MANAGER_API_URL + '/api/environments/' + environmentId + '/dfsps/' + dfspId + '/jwscerts', jwsData, { headers: { Cookie: currentCookies[0], 'Content-Type': 'application/json' } })
    } else {
      jwsCertResponse = await axios.post(CONNECTION_MANAGER_API_URL + '/api/environments/' + environmentId + '/dfsps/' + dfspId + '/jwscerts', jwsData, { headers: { Cookie: currentCookies[0], 'Content-Type': 'application/json' } })
    }
    if (jwsCertResponse.status === 200) {
      return jwsCertResponse.data
    } else {
      console.log('---------------------------here')
      console.log('Some error creating / updating JWS cert for DFSP')
    }
  } catch (err) {
    console.log('Some error creating / updating JWS cert for DFSP', err.response ? err.response.data : err)
  }
}

const fetchUserDFSPJwsCerts = async (environmentId, dfspId) => {
  // Check whether an environment exists with the name testing-toolkit
  try {
    const certResult = await axios.get(CONNECTION_MANAGER_API_URL + '/api/environments/' + environmentId + '/dfsps/' + dfspId + '/jwscerts', { headers: { Cookie: currentCookies[0], 'Content-Type': 'application/json' } })
    if (certResult.status === 200 && (certResult.data && certResult.data.id)) {
      const fetchedJwsCerts = certResult.data
      if (!_.isEqual(fetchedJwsCerts, currentJWSConfig.dfsps[dfspId])) {
        currentJWSConfig.dfsps[dfspId] = fetchedJwsCerts
        await setJWSConfig()
        // console.log('User DFSP JWS Certificate updated', fetchedJwsCerts.jwsCert)
      }
    }
  } catch (err) {}
  return currentJWSConfig.dfsps[dfspId]
}

// TLS Related

const initHubCa = async (environmentId) => {
  let certResult = null
  // Check whether a jws certificate exists for the dfspId testing-toolkit
  try {
    certResult = await axios.get(CONNECTION_MANAGER_API_URL + '/api/environments/' + environmentId + '/ca/rootCert', { headers: { Cookie: currentCookies[0], 'Content-Type': 'application/json' } })
    if (certResult.status === 200 && (certResult.data && certResult.data.certificate)) {
      return certResult.data.certificate
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

    hubCaCertResponse = await axios.post(CONNECTION_MANAGER_API_URL + '/api/environments/' + environmentId + '/cas', casData, { headers: { Cookie: currentCookies[0], 'Content-Type': 'application/json' } })

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
    const dfspCaResult = await axios.get(CONNECTION_MANAGER_API_URL + '/api/environments/' + environmentId + '/dfsps/' + dfspId + '/ca', { headers: { Cookie: currentCookies[0], 'Content-Type': 'application/json' } })
    if (dfspCaResult.status === 200 && dfspCaResult.data.rootCertificate && dfspCaResult.data.validationState === 'VALID') {
      if (currentTlsConfig.dfsps[dfspId].dfspCaRootCert !== dfspCaResult.data.rootCertificate) {
        console.log('New DFSP CA Root CERT Found')
        currentTlsConfig.dfsps[dfspId].dfspCaRootCert = dfspCaResult.data.rootCertificate
        await setTLSConfig()
      }
    }
  } catch (err) {}
}

const checkDfspCsrs = async (environmentId, dfspId) => {
  // Check for any new CSRs those need to be signed
  let dfspPendingCsrs = []
  try {
    const dfspCsrsResult = await axios.get(CONNECTION_MANAGER_API_URL + '/api/environments/' + environmentId + '/dfsps/' + dfspId + '/enrollments/inbound', { headers: { Cookie: currentCookies[0], 'Content-Type': 'application/json' } })
    if (dfspCsrsResult.status === 200) {
      dfspPendingCsrs = dfspCsrsResult.data.filter(item => item.state === 'CSR_LOADED' && item.validationState === 'VALID')
    }
  } catch (err) {}

  // Iterate through pending CSRs and sign
  for (let i = 0; i < dfspPendingCsrs.length; i++) {
    // Sign the CSR
    try {
      const signResponse = await axios.post(CONNECTION_MANAGER_API_URL + '/api/environments/' + environmentId + '/dfsps/' + dfspId + '/enrollments/inbound/' + dfspPendingCsrs[i].id + '/sign', {}, { headers: { Cookie: currentCookies[0], 'Content-Type': 'application/json' } })

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
    const hubCsrsResult = await axios.get(CONNECTION_MANAGER_API_URL + '/api/environments/' + environmentId + '/dfsps/' + dfspId + '/enrollments/outbound', { headers: { Cookie: currentCookies[0], 'Content-Type': 'application/json' } })
    if (hubCsrsResult.status === 200) {
      hubCsrs = hubCsrsResult.data.filter(item => item.validationState === 'VALID')
    }
  } catch (err) {}

  // Store if any signed CSRs found or create a CSR if no CSR found
  if (hubCsrs.length > 0) {
    const hubSignedCsrs = hubCsrs.filter(item => (item.validationState === 'VALID' && item.state === 'CERT_SIGNED' && item.certificate !== null))
    if (hubSignedCsrs.length > 0 && currentTlsConfig.dfsps[dfspId].hubClientCert !== hubSignedCsrs[0].certificate) {
      console.log('New Signed Hub client CERT Found')
      currentTlsConfig.dfsps[dfspId].hubClientCert = hubSignedCsrs[0].certificate
      await setTLSConfig()
    }
  } else {
    try {
      const hubClientCsrData = await readFileAsync('secrets/tls/hub_client.csr')
      const hubCsrData = {
        hubCSR: hubClientCsrData.toString()
      }
      let hubCsrCreateResponse = null
      hubCsrCreateResponse = await axios.post(CONNECTION_MANAGER_API_URL + '/api/environments/' + environmentId + '/dfsps/' + dfspId + '/enrollments/outbound', hubCsrData, { headers: { Cookie: currentCookies[0], 'Content-Type': 'application/json' } })
      console.log(hubCsrCreateResponse.status === 200 ? 'Hub CSR Uploaded' : 'Some error uploading Hub CSR')
    } catch (err) {
      console.log('Some error uploading Hub CSR', err.response ? err.response.data : err)
    }
  }
}

const uploadHubServerCerts = async (environmentId, rootCert, intermediateChain, serverCert) => {
  // Check for any hub server certs
  let hubServerCerts = null
  try {
    const hubServerCertsResult = await axios.get(CONNECTION_MANAGER_API_URL + '/api/environments/' + environmentId + '/hub/servercerts', { headers: { Cookie: currentCookies[0], 'Content-Type': 'application/json' } })
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
        const hubServerCertsUpdateResponse = await axios.put(CONNECTION_MANAGER_API_URL + '/api/environments/' + environmentId + '/hub/servercerts', newHubServerCerts, { headers: { Cookie: currentCookies[0], 'Content-Type': 'application/json' } })
        console.log(hubServerCertsUpdateResponse.status === 200 ? 'Hub Server certs updated' : 'Some error updating Hub server certs')
      } catch (err) {
        console.log('Some error updating Hub server certs')
      }
    }
  } else {
    try {
      const hubServerCertsCreateResponse = await axios.post(CONNECTION_MANAGER_API_URL + '/api/environments/' + environmentId + '/hub/servercerts', newHubServerCerts, { headers: { Cookie: currentCookies[0], 'Content-Type': 'application/json' } })
      console.log(hubServerCertsCreateResponse.status === 200 ? 'Hub Server certs created' : 'Some error creating Hub server certs')
    } catch (err) {
      console.log('Some error creating Hub server certs', err)
    }
  }
}

const checkDfspServerCerts = async (environmentId, dfspId) => {
  // Check for any new CSRs those need to be signed
  try {
    const dfspServerCertsResult = await axios.get(CONNECTION_MANAGER_API_URL + '/api/environments/' + environmentId + '/dfsps/' + dfspId + '/servercerts', { headers: { Cookie: currentCookies[0], 'Content-Type': 'application/json' } })
    if (dfspServerCertsResult.status === 200 && dfspServerCertsResult.data.validationState === 'VALID') {
      currentTlsConfig.dfsps[dfspId].dfspServerCaRootCert = dfspServerCertsResult.data.rootCertificate
      currentTlsConfig.dfsps[dfspId].dfspServerCaIntermediateCert = dfspServerCertsResult.data.intermediateChain
      currentTlsConfig.dfsps[dfspId].dfspServerCert = dfspServerCertsResult.data.serverCertificate
      await setTLSConfig()
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

  await setTLSConfig()
}

const tlsChecker = async () => {
  // Initialize HUB CA
  currentTlsConfig.hubCaCert = await initHubCa(currentEnvironment.id)

  const dfspList = await getDFSPs()
  for (let i = 0; i < dfspList.length; i++) {
    // TODO: Download DFSP CA and place it in trusted store
    await checkDfspCa(currentEnvironment.id, dfspList[i].id)

    // Check for DFSP CSRs
    await checkDfspCsrs(currentEnvironment.id, dfspList[i].id)

    // Upload HUB CSRs and also Check for Signed HUB CSRs and get outbound certificate
    await checkHubCsrs(currentEnvironment.id, dfspList[i].id)

    // Check for DFSP Server root CA and server cert
    await checkDfspServerCerts(currentEnvironment.id, dfspList[i].id)
  }

  // Read Hub Server Certificates
  await tlsLoadHubServerCertificates()

  // Upload Hub Server root CA and Hub Server cert
  await uploadHubServerCerts(currentEnvironment.id, currentTlsConfig.hubServerCaRootCert, null, currentTlsConfig.hubServerCert)

  // Read Hub Client Key
  const hubClientKeyData = await readFileAsync('secrets/tls/hub_client_key.key')
  currentTlsConfig.hubClientKey = hubClientKeyData.toString()
  await setTLSConfig()
}

const endpointChecker = async () => {
  // Check whether an environment exists with the name testing-toolkit
  try {
    const dfspsResult = await axios.get(CONNECTION_MANAGER_API_URL + '/api/environments/' + currentEnvironment.id + '/dfsps', { headers: { Cookie: currentCookies[0], 'Content-Type': 'application/json' } })
    if (dfspsResult.status === 200) {
      const dfspList = dfspsResult.data
      const tempEndpoints = {}
      // Iterate through all dfsps and get the endpoints
      for (let i = 0; i < dfspList.length; i++) {
        const dfspId = dfspList[i].id
        const endpointResult = await axios.get(CONNECTION_MANAGER_API_URL + '/api/environments/' + currentEnvironment.id + '/dfsps/' + dfspId + '/endpoints', { headers: { Cookie: currentCookies[0], 'Content-Type': 'application/json' } })
        if (endpointResult.status === 200) {
          const fetchedEndpoints = endpointResult.data
          for (let j = 0; j < fetchedEndpoints.length; j++) {
            if (fetchedEndpoints[j].state === 'NEW') {
              // Confirm endpoint
              await axios.post(CONNECTION_MANAGER_API_URL + '/api/environments/' + currentEnvironment.id + '/dfsps/' + dfspId + '/endpoints/' + fetchedEndpoints[j].id + '/confirmation', null, { headers: { Cookie: currentCookies[0], 'Content-Type': 'application/json' } })
            }
            if (fetchedEndpoints[j].direction === 'INGRESS' && fetchedEndpoints[j].type === 'URL') {
              // Store the URL for this DFSP
              tempEndpoints[dfspId] = fetchedEndpoints[j].value.url
            }
          }
        }
      }
      if (!_.isEqual(tempEndpoints, currentEndpoints.dfspEndpoints)) {
        currentEndpoints.dfspEndpoints = tempEndpoints
        await setEndpointsConfig()
      }
    }
  } catch (err) {}
  return currentEndpoints
}

const checkConnectionManager = async () => {
  if (Config.getUserConfig().CONNECTION_MANAGER_AUTH_ENABLED) {
    // Get the cookies from object store
    currentCookies = await objectStore.get('CONNECTION_MANAGER_COOKIES')
  }
  CONNECTION_MANAGER_API_URL = Config.getUserConfig().CONNECTION_MANAGER_API_URL
  if (Config.getUserConfig().JWS_SIGN || Config.getUserConfig().VALIDATE_INBOUND_JWS) {
    try {
      // Get private key for signing
      currentJWSConfig.testingToolkitDfspPrivateKey = await readFileAsync('secrets/privatekey.pem')
      await setJWSConfig()
      // Initialize HUB environment
      await initDFSPHelper()
      // Initialize JWS certificate for testing toolkit dfsp
      const certData = await readFileAsync('secrets/publickey.cer')
      currentJWSConfig.testingToolkitDfspCerts = await initJWSCertificate(currentEnvironment.id, DEFAULT_TESTING_TOOLKIT_FSPID, certData.toString())
      await setJWSConfig()
      // Fetch the user DFSP Jws certs once and then periodically check
      const dfspList = await getDFSPs()
      for (let i = 0; i < dfspList.length; i++) {
        await fetchUserDFSPJwsCerts(currentEnvironment.id, dfspList[i].id)
      }
    } catch (err) {
      console.log(err)
    }
  }

  if (Config.getUserConfig().OUTBOUND_MUTUAL_TLS_ENABLED || Config.getUserConfig().INBOUND_MUTUAL_TLS_ENABLED) {
    try {
      // Do TLS related stuff
      if (!currentEnvironment) {
        // Initialize HUB environment
        await initDFSPHelper()
      }
      await tlsChecker()
    } catch (err) {
      console.log(err)
    }
  }

  if (Config.getSystemConfig().HOSTING_ENABLED) {
    try {
      // Do TLS related stuff
      if (!currentEnvironment) {
        // Initialize HUB environment
        await initDFSPHelper()
      }
      await endpointChecker()
    } catch (err) {
      console.log(err)
    }
  }
}

const initDFSPHelper = async () => {
  // Initialize HUB environment
  await initEnvironment()
  // Initialize the DFSPs
  if (currentEnvironment) {
    await initDFSP(currentEnvironment.id, DEFAULT_TESTING_TOOLKIT_FSPID, 'Testing Toolkit DFSP')
    const dfspList = await getDFSPs()
    for (let i = 0; i < dfspList.length; i++) {
      await initDFSP(currentEnvironment.id, dfspList[i].id, dfspList[i].name)
    }
  }
}

const initDFSPListStuff = async () => {
  const dfspList = await getDFSPs()
  for (let i = 0; i < dfspList.length; i++) {
    currentJWSConfig.dfsps[dfspList[i].id] = {}
    currentTlsConfig.dfsps[dfspList[i].id] = {}
  }
}

const initAuth = async () => {
  if (Config.getUserConfig().CONNECTION_MANAGER_AUTH_ENABLED) {
    CONNECTION_MANAGER_API_URL = Config.getUserConfig().CONNECTION_MANAGER_API_URL
    const loginFormData = {
      username: Config.getUserConfig().CONNECTION_MANAGER_HUB_USERNAME,
      password: Config.getUserConfig().CONNECTION_MANAGER_HUB_PASSWORD
    }
    const loginResp = await axios.post(CONNECTION_MANAGER_API_URL + '/api/login', querystring.stringify(loginFormData), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
    if (loginResp.status === 200) {
      if (loginResp.headers['set-cookie']) {
        await objectStore.set('CONNECTION_MANAGER_COOKIES', loginResp.headers['set-cookie'])
      }
    } else {
      throw new Error('Some error while login to the MCM as hub')
    }
  }
}

const initialize = async () => {
  await objectStore.init()
  await initAuth()
  await initDFSPListStuff()
  await checkConnectionManager()
  setInterval(checkConnectionManager, CM_CHECK_INTERVAL)
}

const waitForTlsHubCerts = async (interval = 2) => {
  for (let i = 0; i < 10; i++) {
    if (currentTlsConfig.hubCaCert && currentTlsConfig.hubServerCert && currentTlsConfig.hubServerKey) {
      return true
    }
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true)
      }, interval * 1000)
    })
  }
  throw new Error('Timeout Hub Init')
}

const getTestingToolkitDfspJWSCerts = async () => {
  const jwsConfig = await objectStore.get('jwsConfig')
  return jwsConfig.testingToolkitDfspCerts ? jwsConfig.testingToolkitDfspCerts.jwsCertificate : null
}

const getTestingToolkitDfspJWSPrivateKey = async () => {
  const jwsConfig = await objectStore.get('jwsConfig')
  return jwsConfig.testingToolkitDfspPrivateKey
}

const getUserDfspJWSCerts = async (dfspId) => {
  const jwsConfig = await objectStore.get('jwsConfig')
  return jwsConfig.dfsps[dfspId] ? jwsConfig.dfsps[dfspId].jwsCertificate : null
}

const getTlsConfig = async () => {
  const config = await objectStore.get('tlsConfig')
  return config
}

const getEndpointsConfig = async () => {
  const config = await objectStore.get('endpointsConfig')
  return config
}

const setJWSConfig = async () => {
  await objectStore.set('jwsConfig', currentJWSConfig)
}

const setTLSConfig = async () => {
  await objectStore.set('tlsConfig', currentTlsConfig)
}

const setEndpointsConfig = async () => {
  await objectStore.set('endpointsConfig', currentEndpoints)
}

module.exports = {
  initialize,
  getTestingToolkitDfspJWSCerts,
  getUserDfspJWSCerts,
  getTestingToolkitDfspJWSPrivateKey,
  getTlsConfig,
  getEndpointsConfig,
  waitForTlsHubCerts
}
