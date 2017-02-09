const semver = require('semver')
const DepDb = require('dependency-db')
const sub = require('subleveldown')
const PassThrough = require('readable-stream').PassThrough
const opbeat = require('opbeat')

const db = require('./db.js')
const depDb = new DepDb(sub(db.depdb(), 'depdb'))

module.exports = (name, range, opts) => {
  if (!opts) opts = {}
  range = range || '*'

  let results = depDb.query(name, range, opts)
  let json = new PassThrough()
  let total = 0
  let resultCount = 0
  let headFlushed = false
  let lastName, lastVersion, lastRange

  if (!name) {
    flushError(new Error('missing required name'))
    return json
  }

  console.log('Looking up %s %s dependants...', name, range)

  results.on('error', flushError)
  results.on('data', onData)
  results.on('end', onEnd)

  return json

  function onData (pkg) {
    total++

    if (lastName && lastName !== pkg.name) {
      flush()
    } else if (lastVersion && semver.lt(pkg.version, lastVersion)) {
      return
    }

    lastName = pkg.name
    lastVersion = pkg.version
    lastRange = opts.devDependencies ? pkg.devDependencies[name] : pkg.dependencies[name]
  }

  function onEnd () {
    flush()
    flushTail()
    console.log('query: %s@%s, results: %d, unique: %d', name, range, total, resultCount)
  }

  function flush () {
    if (!lastName) return

    let prefix = ','
    if (resultCount === 0) {
      flushHead()
      prefix = ''
    }

    json.write(prefix + JSON.stringify({
      name: lastName,
      version: lastVersion,
      range: lastRange
    }) + '\n')

    resultCount++
  }

  function flushHead () {
    headFlushed = true
    json.write(`{
      "query": {"name":"${name}","range":"${range}"},
      "results": {
        "unique_packages": [
    `)
  }

  function flushTail () {
    json.end(`
        ],
        "total_packages_count": ${total},
        "unique_packages_count": ${resultCount}
      }
    }`)
  }

  function flushError (err) {
    results.removeListener('data', onData)
    results.removeListener('end', onEnd)

    opbeat.captureError(err)

    if (headFlushed) {
      json.end(`
          ]
        },
        "error": true,
        "message": "${err.message}"
      }`)
    } else {
      json.end(`{
        "error": true,
        "message": "${err.message}"
      }`)
    }
  }
}
