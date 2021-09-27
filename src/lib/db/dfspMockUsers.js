const Config = require('../config')
const { keycloakAuth, getKeyCloakUsers } = require('../oauth/KeycloakHelper')

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

const getDFSPList = async (defaultTestingToolkitFspId) => {
  const userConfig = await Config.getUserConfig({
    dfspId: defaultTestingToolkitFspId
  })
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
  checkDFSP
}
