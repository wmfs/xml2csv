/* eslint-env mocha */

const path = require('path')
const fs = require('fs')
const expect = require('chai').expect
const xml2csv = require('./../lib')

describe('Run some basic tests', function () {
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

  it('should convert the XML file to a CSV file with Promise', async function () {
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
})
