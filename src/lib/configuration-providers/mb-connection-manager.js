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
const CONNECTION_MANAGER_API_URL = 'http://localhost:5031'

var currentEnvironment = null
// var currentTestingToolkitDFSP = null
// var currentUserDFSP = null

var currentTestingToolkitDfspJWSCerts = null
var currentUserDfspJWSCerts = null
var currentTestingToolkitDfspJWSPrivateKey = null

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

const checkConnectionManager = async () => {
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
}

const initialize = async () => {
  await checkConnectionManager()
  setInterval(checkConnectionManager, CM_CHECK_INTERVAL)
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

module.exports = {
  initialize,
  getTestingToolkitDfspJWSCerts,
  getUserDfspJWSCerts,
  getTestingToolkitDfspJWSPrivateKey
}
