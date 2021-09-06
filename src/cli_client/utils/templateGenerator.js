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

const generateTemplate = async (fileList) => {
  try {
    let testCases = []
    for (let i = 0; i < fileList.length; i++) {
      const importFolderRawData = await getFolderRawData(fileList[i])
      const folderData = FolderParser.getFolderData(importFolderRawData)
      const folderTestCases = FolderParser.getTestCases(folderData)
      testCases = testCases.concat(folderTestCases)
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
