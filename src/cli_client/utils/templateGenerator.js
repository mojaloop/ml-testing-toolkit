const { FolderParser } = require('@mojaloop/ml-testing-toolkit-shared-lib')
const { readFileAsync, readRecursiveAsync, fileStatAsync } = require('../../lib/utils')
const path = require('path')

const getFileData = async (fileToRead, fileStat) => {
  try {
    const content = await readFileAsync(fileToRead, 'utf8')
    const fileContent = JSON.parse(content)
    return {
      name: path.basename(fileToRead),
      path: fileToRead.replace(/\\/g, '/'),
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

const generateTemplate = async (inputFiles, selectedLabels = null) => {
  try {
    const folderRawDataArray = []
    for (let i = 0; i < inputFiles.length; i++) {
      const inputFile = inputFiles[i]
      const folderRawData = await getFolderRawData(inputFile)
      folderRawDataArray.push(...folderRawData)
    }
    const folderData = FolderParser.getFolderData(folderRawDataArray)
    const testCases = FolderParser.getTestCases(folderData, null, selectedLabels)
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
