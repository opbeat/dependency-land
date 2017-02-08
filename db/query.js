const Promise = require('bluebird')
const semver = require('semver')
const DepDb = require('dependency-db')
const sub = require('subleveldown')

const db = require('./db.js')
const depDb = new DepDb(sub(db.level(), 'depdb'))

module.exports = (name, range) => {
  return new Promise((resolve, reject) => {
    range = range || '*'

    if (!name) return reject(new Error('missing required name'))

    let response = {}

    console.log('Looking up %s %s dependants...', name, range)

    response['query'] = {
      name,
      range
    }

    var total = 0
    var pkgs = []
    var lastName, lastVersion, lastRange
    var results = depDb.query(name, range)

    results.on('error', function (err) {
      reject(err)
    })

    results.on('data', function (pkg) {
      total++

      if (lastName && lastName !== pkg.name) {
        flush()
      } else if (lastVersion && semver.lt(pkg.version, lastVersion)) {
        return
      }

      lastName = pkg.name
      lastVersion = pkg.version
      lastRange = pkg.dependencies[name]
    })

    results.on('end', function () {
      flush()
      console.log('query: %s@%s, results: %d, unique: %d', name, range, total, pkgs.length)

      response['results'] = {
        total_packages_count: total,
        unique_packages_count: pkgs.length,
        unique_packages: pkgs
      }

      resolve(response)
    })

    function flush () {
      pkgs.push({
        name: lastName,
        version: lastVersion,
        range: lastRange
      })
    }
  })
}
