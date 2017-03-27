'use strict'

const DbUpdater = require('npm-dependency-db/updater')
const db = require('./db')
const utils = require('../utils')

const updater = new DbUpdater(db.depdb(), {
  npmDb: db.hypercore(),
  live: true
})

updater.on('init', () => {
  utils.log('dep-db updater started')
})

updater.on('running', () => {
  utils.log('dep-db updater running')
})

updater.on('processed', (block) => {
  // Throttle logging a bit
  if (block % 100 === 0) {
    utils.log(`dep-db processed npm change number ${block}`)
  }
})
