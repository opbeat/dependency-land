'use strict'

const path = require('path')
const level = require('level-party')
const mkdirp = require('mkdirp')
const utils = require('../utils')

// Create db path
let pathPrefix

if (process.env.NODE_ENV !== 'production') {
  pathPrefix = process.env.HOME
} else {
  pathPrefix = '/storage'
}

const dbPath = path.join(pathPrefix, '.npm-dependency-db')

mkdirp.sync(dbPath)

exports.hypercorePath = path.join(dbPath, 'hypercore')

exports.depdb = () => {
  const db = level(path.join(dbPath, 'dependency-db'))

  utils.log(`dependency-db database loaded from: ${db.location}`)

  return db
}
