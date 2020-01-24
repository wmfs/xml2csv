'use strict'

const fs = require('fs-extra')
const sax = require('sax')
const dottie = require('dottie')
const _ = require('lodash')
const debug = require('debug')

const endOfLine = require('os').EOL
const comma = ','

const main = function (options, callback) {
  try {
    if ((options.xmlStream && options.xmlPath) || (!options.xmlStream && !options.xmlPath)) {
      throw (new Error('Please provide either xmlStream or xmlPath'))
    }
    if ((options.csvStream && options.csvPath) || (!options.csvStream && !options.csvPath)) {
      throw (new Error('Please provide either csvStream or csvPath'))
    }

    if (options.csvPath) {
      fs.ensureFileSync(options.csvPath)
    }

    const source = options.xmlStream || fs.createReadStream(options.xmlPath)
    const output = options.csvStream || fs.createWriteStream(options.csvPath)

    const saxStream = sax.createStream(true)

    saxStream.on('error', function (err) {
      console.log(err)
    })

    let count = 0
    let accepting = false
    let currentObj
    let pathParts = []
    let pathPartsString

    writeHeadersToFile(options.headerMap, output)

    saxStream.on(
      'opentag',
      function (t) {
        if (t.name === options.rootXMLElement) {
          accepting = true
          pathParts = []
          currentObj = {}
        } else {
          if (accepting) {
            pathParts.push(t.name)
            pathPartsString = pathParts.join('.')
          }
        }
      }
    )

    saxStream.on(
      'text',
      function (text) {
        if (accepting) {
          if (text.trim() !== '\n' && text.trim() !== '') {
            dottie.set(currentObj, pathPartsString, text)
          }
        }
      }
    )

    saxStream.on(
      'cdata',
      function (text) {
        if (accepting) {
          dottie.set(currentObj, pathPartsString, text)
        }
      }
    )

    saxStream.on(
      'closetag',
      function (tagName) {
        if (tagName === options.rootXMLElement) {
          writeRecordToFile(currentObj, options.headerMap, output)
          count++
          accepting = false
          currentObj = {}
        } else {
          pathParts.pop()
        }
      }
    )

    saxStream.on('end', function () {
      callback(null, { count: count })
    })

    source.pipe(saxStream)
  } catch (err) {
    debug(err)
    callback(err)
  }
}

function writeHeadersToFile (headerMap, outputStream) {
  let headerString = ''
  for (const [idx, header] of headerMap.entries()) {
    const separator = (idx === headerMap.length - 1) ? endOfLine : comma
    headerString += header[1] + separator
  }
  outputStream.write(headerString)
}

function writeRecordToFile (record, headerMap, outputStream) {
  let recordString = ''

  for (const [idx, header] of headerMap.entries()) {
    const field = _.isObject(record[header[3]]) ? record[header[3]][header[0]] : record[header[0]]
    const separator = (idx === headerMap.length - 1) ? endOfLine : comma

    recordString += writeField(field, header[2], separator)
  }
  outputStream.write(recordString)
}

function writeField (field, type, separator) {
  if (!field) return separator

  const quote = type === 'string' ? '"' : ''

  return `${quote}${field.replace(/"/g, '""')}${quote}${separator}`
}

module.exports = function (options, callback) {
  if (typeof callback === 'function') {
    return main(options, callback)
  }
  return new Promise((resolve, reject) => {
    return main(options, (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}
