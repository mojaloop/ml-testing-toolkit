const { FolderParser } = require('@mojaloop/ml-testing-toolkit-shared-lib')
const { readFileAsync, readRecursiveAsync, fileStatAsync } = require('../../lib/utils')

const getFileData = async (fileToRead, fileStat) => {
  try {
    const content = await readFileAsync(fileToRead, 'utf8')
    const fileContent = JSON.parse(content)
    return {
      name: fileToRead,
      path: fileToRead,
      size: fileStat.size,
      modified: '' + fileStat.mtime,
      content: fileContent
    }
  } catch (err) {
    console.log(err.message)
    return null
  }
}
const getFolderRawData = async (folderItem) => {
  const importFolderRawData = []
  const stat = await fileStatAsync(folderItem)
  if (stat.isFile() && folderItem.endsWith('.json')) {
    const fileItemData = await getFileData(folderItem, stat)
    if (fileItemData) {
      importFolderRawData.push(fileItemData)
    }
  } else if (stat.isDirectory()) {
    const fileList = await readRecursiveAsync(folderItem)
    for (let j = 0; j < fileList.length; j++) {
      const fileItemData = await getFileData(fileList[j], stat)
      if (fileItemData) {
        importFolderRawData.push(fileItemData)
      }
    }
  }
  importFolderRawData.sort((a, b) => a.path.localeCompare(b.path))
  return importFolderRawData
}

const generateTemplate = async (fileList, selectedLabels = null) => {
  try {
    const testCases = []
    for (let i = 0; i < fileList.length; i++) {
      let masterFileIndex
      const importFolderRawData = await getFolderRawData(fileList[i])
      for (let j = 0; j < importFolderRawData.length; j++) {
        if (importFolderRawData[j].name.endsWith('master.json')) {
          masterFileIndex = j
          break
        }
      }
      let masterFileContent
      if (masterFileIndex != null) {
        masterFileContent = importFolderRawData[masterFileIndex].content
        importFolderRawData.splice(masterFileIndex, 1)
      }

      let selectedFiles
      if (selectedLabels && selectedLabels.length > 0 && masterFileContent) {
        selectedFiles = []
        for (let o = 0; o < masterFileContent.order.length; o++) {
          const order = masterFileContent.order[o]
          for (let k = 0; k < importFolderRawData.length; k++) {
            if (importFolderRawData[k].name.endsWith(order.name)) {
              if (order.labels) {
                let included = false
                for (let l = 0; l < order.labels.length; l++) {
                  const label = order.labels[l]
                  if (selectedLabels.includes(label)) {
                    included = true
                    break
                  }
                }
                if (included) {
                  selectedFiles.push(importFolderRawData[k].name)
                  break
                }
              }
            }
          }
        }
      }
      if ((!selectedLabels) || (selectedLabels && selectedLabels.length > 0 && selectedFiles && selectedFiles.length > 0)) {
        const folderData = FolderParser.getFolderData(importFolderRawData)
        const folderTestCases = FolderParser.getTestCases(folderData, selectedFiles)
        if (folderTestCases) {
          testCases.push(...folderTestCases)
        }
      }
    }
    FolderParser.sequenceTestCases(testCases)
    const template = {}
    template.test_cases = testCases
    template.name = 'multi'
    return template
  } catch (err) {
    console.log(err)
    return null
  }
}

module.exports = {
  generateTemplate
}
