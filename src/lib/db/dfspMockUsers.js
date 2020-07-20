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
  return tempDfspList
}

const checkDFSP = async (dfspId) => {
  const dfspFound = tempDfspList.find(item => item.id === dfspId)
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
