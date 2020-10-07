const Config = require('../config')
const querystring = require('querystring')
const axios = require('axios').default
const objectStore = require('../objectStore/objectStoreInterface')

const tempDfspList = [
  {
    id: 'userdfsp',
    name: 'User DFSP'
  },
  {
    id: 'userdfsp1',
    name: 'User DFSP 1'
  },
  {
    id: 'userdfsp2',
    name: 'User DFSP 2'
  }
]

const getDFSPList = async (user) => {
  const userConfig = await Config.getUserConfig(user)
  const systemConfig = Config.getSystemConfig()
  let users = []
  if (systemConfig.HOSTING_ENABLED) {
    if (systemConfig.KEYCLOAK.ENABLED) {
      const keycloakToken = await keycloakAuth()
      users = await getKeyCloakUsers(keycloakToken)
    } else {
      users = tempDfspList
    }
  } else if (userConfig.HUB_ONLY_MODE) {
    const dfsps = Object.keys(userConfig.ENDPOINTS_DFSP_WISE.dfsps || {})
    if (dfsps.length > 0) {
      dfsps.forEach(dfspId => {
        users.push({
          id: dfspId,
          name: dfspId
        })
      })
    }
  }
  if (users.length === 0) {
    users.push({
      id: userConfig.DEFAULT_USER_FSPID,
      name: 'User DFSP'
    })
  }
  return users
}

const getKeyCloakUsers = async (keycloakToken) => {
  const systemConfig = Config.getSystemConfig()
  const getUsersResp = await axios.get(systemConfig.KEYCLOAK.API_URL + `/auth/admin/realms/${systemConfig.KEYCLOAK.REALM}/users`, { headers: { Authorization: `Bearer ${keycloakToken.accessToken}` } })
  if (getUsersResp.status === 200) {
    const users = []
    getUsersResp.data.map(user => {
      if (user.username !== systemConfig.KEYCLOAK.USERNAME) {
        users.push({
          id: user.username,
          name: `${user.firstName} ${user.lastName}`
        })
      }
    })
    return users
  } else {
    throw new Error(`Some error while getting users from as ${systemConfig.KEYCLOAK.USERNAME}`)
  }
}

const keycloakAuth = async () => {
  let keycloakToken = await objectStore.get('KEYCLOAK_TOKEN')
  // if token not set or expires in 1 min, then generate a new one
  if (Object.keys(keycloakToken).length === 0 || Date.now() >= (keycloakToken.expiresAt - (60 * 1000))) {
    const systemConfig = Config.getSystemConfig()
    const loginFormData = {
      grant_type: 'password',
      client_id: systemConfig.OAUTH.APP_OAUTH_CLIENT_KEY,
      client_secret: systemConfig.OAUTH.APP_OAUTH_CLIENT_SECRET,
      username: systemConfig.KEYCLOAK.USERNAME,
      password: systemConfig.KEYCLOAK.PASSWORD
    }
    const loginResp = await axios.post(systemConfig.OAUTH.OAUTH2_ISSUER, querystring.stringify(loginFormData), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
    if (loginResp.status === 200) {
      await objectStore.set('KEYCLOAK_TOKEN', {
        accessToken: loginResp.data.access_token,
        expiresAt: Date.now() + (loginResp.data.expires_in * 1000)
      })
      keycloakToken = await objectStore.get('KEYCLOAK_TOKEN')
    } else {
      throw new Error(`Some error while login to the Keycloak as ${systemConfig.KEYCLOAK.USERNAME}`)
    }
  }
  return keycloakToken
}

const checkDFSP = async (dfspId) => {
  const dfspFound = (await getDFSPList()).find(item => item.id === dfspId)
  if (dfspFound) {
    return true
  } else {
    return false
  }
}

module.exports = {
  getDFSPList,
  checkDFSP,
  getKeyCloakUsers,
  keycloakAuth
}
