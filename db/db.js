'use strict'

global.utils = require('../utils')
const path = require('path')
const level = require('level-party')
const mkdirp = require('mkdirp')

// Create db path
let pathPrefix

if (process.env.NODE_ENV !== 'production') {
  pathPrefix = process.env.HOME
} else {
  pathPrefix = '/storage'
}

const dbPath = path.join(pathPrefix, '.npm-dependency-db')

mkdirp.sync(dbPath)

exports.hypercore = () => {
  const db = level(path.join(dbPath, 'hypercore'))

  utils.log(`hypercore database loaded from: ${db.location}`)

  return db
}

exports.depdb = () => {
  const db = level(path.join(dbPath, 'dependency-db'))

  utils.log(`dependency-db database loaded from: ${db.location}`)

  return db
}
