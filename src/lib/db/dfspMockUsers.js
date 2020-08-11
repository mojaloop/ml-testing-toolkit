const Config = require('../config')

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

const getDFSPList = async () => {
  if (Config.getSystemConfig().HOSTING_ENABLED) {
    return tempDfspList
  } else if (Config.getUserConfig().HUB_ONLY_MODE) {
    const dfsps = Object.keys(Config.getUserConfig().ENDPOINTS_DFSP_WISE.dfsps)
    if (dfsps) {
      const dfspsList = []
      dfsps.forEach(dfspId => {
        dfspsList.push({
          id: dfspId,
          name: dfspId
        })
      })
      return dfspsList
    }
  }
  return [{
    id: Config.getUserConfig().DEFAULT_USER_FSPID,
    name: 'User DFSP'
  }]
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
