'use strict'

const DepDb = require('dependency-db')
const sub = require('subleveldown')
const through2 = require('through2')
const JSONStream = require('JSONStream')
const pumpify = require('pumpify')

const db = require('./db')
const depDb = new DepDb(sub(db.depdb(), 'depdb'))

module.exports = (name, range, opts) => {
  if (!opts) opts = {}
  range = range || '*'

  let total = 0
  let results = depDb.query(name, range, opts)
  let parser = through2.obj(function (pkg, enc, cb) {
    total++
    cb(null, {
      name: pkg.name,
      version: pkg.version,
      range: opts.devDependencies ? pkg.devDependencies[name] : pkg.dependencies[name]
    })
  })

  console.log('Looking up %s %s dependants...', name, range)

  return pumpify(results, parser, JSONStream.stringify()).on('end', function () {
    console.log('results for %s@%s: %d', name, range, total)
  })
}
