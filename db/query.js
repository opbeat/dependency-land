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
    if (!headFlushed) flushHead()

    let prefix = total++ > 0 ? ',' : ''

    json.write(prefix + JSON.stringify({
      name: pkg.name,
      version: pkg.version,
      range: opts.devDependencies ? pkg.devDependencies[name] : pkg.dependencies[name]
    }) + '\n')
  }

  function onEnd () {
    if (!headFlushed) flushHead()
    flushTail()
    console.log('results for %s@%s: %d', name, range, total)
  }

  function flushHead () {
    headFlushed = true
    json.write('{"results":[')
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
