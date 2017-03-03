const {expect} = require('chai')
const fs = require('fs')
const path = require('path')
const replaceLine = require('../src/line-replace')
const testFile = path.join(__dirname, '/test.txt')
let testFileContent

describe('programatic api', () => {
  beforeEach(resetTestFile)

  it('should replace text on first line', (done) => {
    replaceLine({
      file: testFile,
      line: 1,
      text: 'Hi there!',
      callback: onReplace
    })

    function onReplace (replaceData) {
      const fileData = fs.readFileSync(testFile, {encoding: 'utf8'})
      expect(fileData).to.equal(testFileContent.replace('First line.', 'Hi there!'))
      done()
    }
  })

  it('should set text on an empty line', (done) => {
    replaceLine({
      file: testFile,
      line: 3,
      text: `Let's rock!`,
      callback: onReplace
    })

    function onReplace (replaceData) {
      const fileData = fs.readFileSync(testFile, {encoding: 'utf8'})
      expect(fileData).to.equal(testFileContent.replace('This kinda works!\n', `This kinda works!\nLet's rock!`))
      done()
    }
  })

  it('should clear a non empty line', (done) => {
    replaceLine({
      file: testFile,
      line: 2,
      text: '',
      callback: onReplace
    })

    function onReplace (replaceData) {
      const fileData = fs.readFileSync(testFile, {encoding: 'utf8'})
      expect(fileData).to.equal(testFileContent.replace('This kinda works!', ''))
      done()
    }
  })

  it('should not add new line', (done) => {
    replaceLine({
      file: testFile,
      line: 1,
      text: 'mmm... ',
      addNewLine: false,
      callback: onReplace
    })

    function onReplace (replaceData) {
      const fileData = fs.readFileSync(testFile, {encoding: 'utf8'})
      const newContent = testFileContent
        .replace('This kinda works!\n', '')
        .replace('First line.', 'mmm... This kinda works!')
      expect(fileData).to.equal(newContent)
      done()
    }
  })

  it('should pass replacement data to callback', (done) => {
    replaceLine({
      file: testFile,
      line: 1,
      text: 'Hello, everything ok there?',
      callback: onReplace
    })

    function onReplace (replaceData) {
      expect(replaceData.text).to.equal('Hello, everything ok there?')
      expect(replaceData.replacedText).to.equal('First line.')
      expect(replaceData.line).to.equal(1)
      expect(replaceData.file).to.equal(testFile)
      done()
    }
  })
})

function resetTestFile () {
  testFileContent = `First line.
This kinda works!

Here, another one.
And... Some more text.

Bye!
`

  // Set initial content on test file.
  fs.writeFileSync(testFile, testFileContent)
}
