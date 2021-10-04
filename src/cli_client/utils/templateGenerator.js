const { FolderParser } = require('ml-testing-toolkit-shared-lib')
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
  var importFolderRawData = []
  const stat = await fileStatAsync(folderItem)
  if (stat.isFile() && folderItem.endsWith('.json')) {
    const fileItemData = await getFileData(folderItem, stat)
    if (fileItemData) {
      importFolderRawData.push(fileItemData)
    }
  } else if (stat.isDirectory()) {
    const fileList = await readRecursiveAsync(folderItem)
    for (var j = 0; j < fileList.length; j++) {
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
    for (var i = 0; i < fileList.length; i++) {
      let masterFileIndex
      const importFolderRawData = await getFolderRawData(fileList[i])
      for (var j = 0; j < importFolderRawData.length; j++) {
        if (importFolderRawData[j].name.endsWith('master.json')) {
          masterFileIndex = j
          break
        }
      }
      const masterFileContent = importFolderRawData[masterFileIndex].content
      importFolderRawData.splice(masterFileIndex, 1)

      let selectedFiles
      if (selectedLabels && selectedLabels.length > 0 && masterFileContent) {
        selectedFiles = []
        for (var o = 0; o < masterFileContent.order.length; o++) {
          let selectedFileIndex
          const order = masterFileContent.order[o]
          for (var k = 0; k < importFolderRawData.length; k++) {
            if (importFolderRawData[k].name.endsWith(order.name)) {
              if (order.labels) {
                for (var l = 0; l < order.labels.length; l++) {
                  const label = order.labels[l]
                  if (selectedLabels.includes(label)) {
                    selectedFileIndex = k
                    break
                  }
                }
              }
            }
            if (selectedFileIndex) {
              selectedFiles.push(importFolderRawData[selectedFileIndex].name)
              break
            }
          }
        }
      }
      const folderData = FolderParser.getFolderData(importFolderRawData)
      const folderTestCases = FolderParser.getTestCases(folderData, selectedFiles)
      testCases.push(...folderTestCases)
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
