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
  let headFlushed = false
  let lastName, lastVersion, lastRange

  if (!name) {
    flushError(new Error('missing required name'))
    return json
  }

  console.log('Looking up %s %s dependants...', name, range)

  results.once('error', flushError)
  results.on('data', onData)
  results.on('end', onEnd)

  return json

  function onData (pkg) {
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
    console.log('results for %s@%s: %d', name, range, total)
  }

  function flush () {
    if (!headFlushed) flushHead()
    if (!lastName) return

    let prefix = total > 0 ? ',' : ''

    json.write(prefix + JSON.stringify({
      name: lastName,
      version: lastVersion,
      range: lastRange
    }) + '\n')

    total++
  }

  function flushHead () {
    headFlushed = true
    json.write(`{
      "query": {"name":"${name}","range":"${range}"},
      "results": [
    `)
  }

  function flushTail () {
    json.end(']}')
  }

  function flushError (err) {
    results.removeListener('data', onData)
    results.removeListener('end', onEnd)

    opbeat.captureError(err)

    if (headFlushed) {
      json.end(`],
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
