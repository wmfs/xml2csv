/* eslint-env mocha */

const path = require('path')
const fs = require('fs-extra')
const expect = require('chai').expect
const xml2csv = require('./../lib')

describe('Run integration tests', function () {
  it('should convert the XML file to a CSV file with callback', function (done) {
    const outputFile = path.resolve(__dirname, 'output', 'simpsons.csv')
    const expectedFile = path.resolve(__dirname, 'expected', 'simpsons.csv')

    xml2csv(
      {
        xmlPath: path.resolve(__dirname, 'fixtures', 'simpsons.xml'),
        csvPath: outputFile,
        rootXMLElement: 'Person',
        headerMap: [
          ['Name', 'name', 'string'],
          ['Age', 'age', 'integer'],
          ['Gender', 'gender', 'string'],
          ['Brother', 'brother', 'string', 'Siblings'],
          ['Sister', 'sister', 'string', 'Siblings']
        ]
      },
      function (err, res) {
        if (err) return done(err)

        expect(res).to.deep.equal({ count: 4 })
        const output = fs.readFileSync(outputFile, { encoding: 'utf8' }).split('\n')
        const expected = fs.readFileSync(expectedFile, { encoding: 'utf8' }).split('\n')

        expect(output).to.eql(expected)

        done()
      }
    )
  })

  it('should convert the XML file to a CSV file with async/await', async function () {
    const outputFile = path.resolve(__dirname, 'output', 'simpsons.csv')
    const expectedFile = path.resolve(__dirname, 'expected', 'simpsons.csv')

    const res = await xml2csv({
      xmlPath: path.resolve(__dirname, 'fixtures', 'simpsons.xml'),
      csvPath: outputFile,
      rootXMLElement: 'Person',
      headerMap: [
        ['Name', 'name', 'string'],
        ['Age', 'age', 'integer'],
        ['Gender', 'gender', 'string'],
        ['Brother', 'brother', 'string', 'Siblings'],
        ['Sister', 'sister', 'string', 'Siblings']
      ]
    })

    expect(res).to.deep.equal({ count: 4 })
    const output = fs.readFileSync(outputFile, { encoding: 'utf8' }).split('\n')
    const expected = fs.readFileSync(expectedFile, { encoding: 'utf8' }).split('\n')

    expect(output).to.eql(expected)
  })

  it('should convert the XML file to a CSV file with stream', async function () {
    const outputFile = path.resolve(__dirname, 'output', 'simpsons.csv')
    const expectedFile = path.resolve(__dirname, 'expected', 'simpsons.csv')
    fs.ensureFileSync(outputFile)
    const xmlStream = fs.createReadStream(path.resolve(__dirname, 'fixtures', 'simpsons.xml'))
    const csvStream = fs.createWriteStream(outputFile)
    const res = await xml2csv({
      xmlStream,
      csvStream,
      rootXMLElement: 'Person',
      headerMap: [
        ['Name', 'name', 'string'],
        ['Age', 'age', 'integer'],
        ['Gender', 'gender', 'string'],
        ['Brother', 'brother', 'string', 'Siblings'],
        ['Sister', 'sister', 'string', 'Siblings']
      ]
    })

    expect(csvStream._writableState.ended).to.equal(true)
    expect(res).to.deep.equal({ count: 4 })
    const output = fs.readFileSync(outputFile, { encoding: 'utf8' }).split('\n')
    const expected = fs.readFileSync(expectedFile, { encoding: 'utf8' }).split('\n')

    expect(output).to.eql(expected)
  })

  it('should convert the XML file to a CSV file with particular cases', async function () {
    const outputFile = path.resolve(__dirname, 'output', 'weirdCases.csv')
    const expectedFile = path.resolve(__dirname, 'expected', 'weirdCases.csv')

    const res = await xml2csv({
      xmlPath: path.resolve(__dirname, 'fixtures', 'weirdCases.xml'),
      csvPath: outputFile,
      rootXMLElement: 'Case',
      headerMap: [
        ['First', 'first', 'string'],
        ['Second', 'second', 'string']
      ]
    })

    expect(res).to.deep.equal({ count: 10 })
    const output = fs.readFileSync(outputFile, { encoding: 'utf8' }).split('\n')
    const expected = fs.readFileSync(expectedFile, { encoding: 'utf8' }).split('\n')

    expect(output).to.eql(expected)
  })
})

describe('Run unit tests', () => {
  it('Should fail if xmlStream and xmlPath options are provided', async function () {
    try {
      const input = path.resolve(__dirname, 'fixtures', 'simpsons.xml')
      const output = path.resolve(__dirname, 'output', 'weirdCases.csv')

      await xml2csv({
        xmlPath: input,
        xmlStream: fs.createReadStream(input),
        csvPath: output,
        rootXMLElement: 'Person',
        headerMap: [
          ['Name', 'name', 'string'],
          ['Age', 'age', 'integer'],
          ['Gender', 'gender', 'string'],
          ['Brother', 'brother', 'string', 'Siblings'],
          ['Sister', 'sister', 'string', 'Siblings']
        ]
      })
    } catch (err) {
      expect(err.message).to.equal('Please provide either xmlStream or xmlPath')
      return
    }
    throw (new Error('Should not succeed'))
  })

  it('Should fail if none of xmlStream and xmlPath options are provided', async function () {
    try {
      await xml2csv({
        csvPath: 'output.csv',
        rootXMLElement: 'Person',
        headerMap: [
          ['Name', 'name', 'string'],
          ['Age', 'age', 'integer'],
          ['Gender', 'gender', 'string'],
          ['Brother', 'brother', 'string', 'Siblings'],
          ['Sister', 'sister', 'string', 'Siblings']
        ]
      })
    } catch (err) {
      expect(err.message).to.equal('Please provide either xmlStream or xmlPath')
      return
    }
    throw (new Error('Should not succeed'))
  })

  it('Should fail if csvStream and csvPath options are provided', async function () {
    try {
      const input = path.resolve(__dirname, 'fixtures', 'simpsons.xml')
      const output = path.resolve(__dirname, 'output', 'weirdCases.csv')

      await xml2csv({
        xmlPath: input,
        csvPath: output,
        csvStream: fs.createWriteStream(output),
        rootXMLElement: 'Person',
        headerMap: [
          ['Name', 'name', 'string'],
          ['Age', 'age', 'integer'],
          ['Gender', 'gender', 'string'],
          ['Brother', 'brother', 'string', 'Siblings'],
          ['Sister', 'sister', 'string', 'Siblings']
        ]
      })
    } catch (err) {
      expect(err.message).to.equal('Please provide either csvStream or csvPath')
      return
    }
    throw (new Error('Should not succeed'))
  })

  it('Should fail if none of csvStream and csvPath options are provided', async function () {
    try {
      const input = path.resolve(__dirname, 'fixtures', 'simpsons.xml')

      await xml2csv({
        xmlPath: input,
        rootXMLElement: 'Person',
        headerMap: [
          ['Name', 'name', 'string'],
          ['Age', 'age', 'integer'],
          ['Gender', 'gender', 'string'],
          ['Brother', 'brother', 'string', 'Siblings'],
          ['Sister', 'sister', 'string', 'Siblings']
        ]
      })
    } catch (err) {
      expect(err.message).to.equal('Please provide either csvStream or csvPath')
      return
    }
    throw (new Error('Should not succeed'))
  })
})
