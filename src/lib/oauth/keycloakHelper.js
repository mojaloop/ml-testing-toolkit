const Config = require('../config')
const querystring = require('querystring')
const axios = require('axios').default
const objectStore = require('../objectStore/objectStoreInterface')
const customLogger = require('../requestLogger')

const getKeyCloakUsers = async (keycloakToken) => {
  const systemConfig = Config.getSystemConfig()
  const getUsersResp = await axios.get(systemConfig.KEYCLOAK.API_URL + `/auth/admin/realms/${systemConfig.KEYCLOAK.REALM}/users`, { headers: { Authorization: `Bearer ${keycloakToken.accessToken}` } })
  if (getUsersResp.status === 200) {
    const users = []
    getUsersResp.data.map(user => {
      if (user.username !== systemConfig.KEYCLOAK.USERNAME) {
        let userId = user.attributes.dfspId[0]
        if (Array.isArray(user.attributes.dfspId)) {
          userId = user.attributes.dfspId[0]
        }
        users.push({
          id: userId,
          name: `${user.firstName} ${user.lastName}`
        })
      }
    })
    return users
  } else {
    throw new Error(`Some error while getting users from as ${systemConfig.KEYCLOAK.USERNAME}`)
  }
}

const getTokenInfo = async (authInfo) => {
  const formData = {
    client_id: authInfo.clientId,
    client_secret: authInfo.clientSecret,
    grant_type: 'client_credentials'
  }
  try {
    const tokenResponse = await axios.post(authInfo.tokenEndpoint, querystring.stringify(formData), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
    if (tokenResponse.status === 200) {
      return tokenResponse.data
    } else {
      throw new Error('Some error while generating token')
    }
  } catch (error) {
    throw new Error('Token generation failed', error.error)
  }
}

const keycloakAuth = async () => {
  let keycloakToken = await objectStore.get('KEYCLOAK_TOKEN')
  // if token not set or expires in 1 min, then generate a new one
  if (Object.keys(keycloakToken).length === 0 || Date.now() >= (keycloakToken.expiresAt - (60 * 1000))) {
    const systemConfig = Config.getSystemConfig()
    const loginFormData = {
      grant_type: 'password',
      client_id: systemConfig.KEYCLOAK.ADMIN_CLIENT_ID,
      // client_secret: systemConfig.OAUTH.APP_OAUTH_CLIENT_SECRET,
      username: systemConfig.KEYCLOAK.ADMIN_USERNAME,
      password: systemConfig.KEYCLOAK.ADMIN_PASSWORD
    }
    const loginResp = await axios.post(systemConfig.KEYCLOAK.API_URL + `/auth/realms/${systemConfig.KEYCLOAK.ADMIN_REALM}/protocol/openid-connect/token`, querystring.stringify(loginFormData), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
    if (loginResp.status === 200) {
      await objectStore.set('KEYCLOAK_TOKEN', {
        accessToken: loginResp.data.access_token,
        expiresAt: Date.now() + (loginResp.data.expires_in * 1000)
      })
      keycloakToken = await objectStore.get('KEYCLOAK_TOKEN')
    } else {
      throw new Error(`Some error while login to the Keycloak as ${systemConfig.KEYCLOAK.ADMIN_USERNAME}`)
    }
  }
  return keycloakToken
}

const getClientAuthInfo = async (user) => {
  try {
    const systemConfig = Config.getSystemConfig()
    const keycloakToken = await keycloakAuth()
    const clientId = user.dfspId
    let clientInfo = await _findClient(clientId, keycloakToken)
    if (!clientInfo) {
      // No clients with the client ID, so create one
      // TODO: Create a new client with the clientId
      await _createClient(clientId, keycloakToken)
      clientInfo = await _findClient(clientId, keycloakToken)
    }
    // Get the client secret
    const clientKeycloakID = clientInfo.id
    const clientSecretResp = await axios.get(systemConfig.KEYCLOAK.API_URL + `/auth/admin/realms/${systemConfig.KEYCLOAK.REALM}/clients/${clientKeycloakID}/client-secret`, { params: { clientId }, headers: { Authorization: `Bearer ${keycloakToken.accessToken}` } })
    if (clientSecretResp.status === 200 && clientSecretResp.data.type && clientSecretResp.data.type === 'secret') {
      return {
        clientId: clientId,
        clientSecret: clientSecretResp.data.value,
        tokenEndpoint: systemConfig.OAUTH.OAUTH2_ISSUER
      }
    } else {
      throw new Error('Client secret not found: Contact Hub operator')
    }
  } catch (error) {
    customLogger.logMessage('error', error.stack, error, { notification: false })
    if (error && error.statusCode === 400 && error.message.includes('Authentication failed')) {
      throw new Error('Authentication failed', error.error)
    }
    throw error
  }
}

const _findClient = async (clientId, keycloakToken) => {
  try {
    const systemConfig = Config.getSystemConfig()
    const clientResp = await axios.get(systemConfig.KEYCLOAK.API_URL + `/auth/admin/realms/${systemConfig.KEYCLOAK.REALM}/clients`, { params: { clientId }, headers: { Authorization: `Bearer ${keycloakToken.accessToken}` } })
    if (clientResp.status === 200) {
      const clientsFound = clientResp.data
      if (clientsFound.length > 0) {
        // Pick the first client
        return clientsFound[0]
      } else {
        return null
      }
    }
    throw new Error('Can not get client list from keycloak')
  } catch (error) {
    customLogger.logMessage('error', error.stack, error, { notification: false })
    if (error && error.statusCode === 400 && error.message.includes('Authentication failed')) {
      throw new Error('Authentication failed', error.error)
    }
    throw error
  }
}

const _createClient = async (clientId, keycloakToken) => {
  const clientRepresentationObj = {
    clientId: clientId,
    enabled: true,
    protocol: 'openid-connect',
    rootUrl: '',
    clientAuthenticatorType: 'client-secret',
    surrogateAuthRequired: false,
    alwaysDisplayInConsole: false,
    redirectUris: ['http://ml-testing-toolkit-keycloak.local'],
    bearerOnly: false,
    consentRequired: false,
    standardFlowEnabled: true,
    implicitFlowEnabled: false,
    directAccessGrantsEnabled: true,
    serviceAccountsEnabled: true,
    authorizationServicesEnabled: true,
    publicClient: false,
    frontchannelLogout: false,
    attributes: {
      'oauth2.device.authorization.grant.enabled': 'false',
      'backchannel.logout.revoke.offline.tokens': 'false',
      'use.refresh.tokens': 'true',
      'oidc.ciba.grant.enabled': 'false',
      'id.token.signed.response.alg': 'RS256',
      'backchannel.logout.session.required': 'true',
      'client_credentials.use_refresh_token': 'false',
      'require.pushed.authorization.requests': 'false',
      'id.token.as.detached.signature': 'false',
      'access.token.signed.response.alg': 'RS256',
      'exclude.session.state.from.auth.response': 'false',
      'tls.client.certificate.bound.access.tokens': 'false',
      'display.on.consent.screen': 'false'
    },
    fullScopeAllowed: true,
    access: { view: true, configure: true, manage: true }
  }

  try {
    const systemConfig = Config.getSystemConfig()
    const clientCreateResp = await axios.post(systemConfig.KEYCLOAK.API_URL + `/auth/admin/realms/${systemConfig.KEYCLOAK.REALM}/clients`, clientRepresentationObj, { headers: { Authorization: `Bearer ${keycloakToken.accessToken}` } })
    if (clientCreateResp.status === 201) {
      // const clientsFound = clientResp.data
      console.log(clientCreateResp.data)
    } else {
      throw new Error(`Can not create client in keycloak: ${clientCreateResp.status} ${clientCreateResp.statusText}`)
    }
  } catch (error) {
    customLogger.logMessage('error', error.stack, error, { notification: false })
    if (error && error.statusCode === 400 && error.message.includes('Authentication failed')) {
      throw new Error('Authentication failed', error.error)
    }
    throw error
  }
}

module.exports = {
  getKeyCloakUsers,
  getClientAuthInfo,
  getTokenInfo,
  keycloakAuth
}
