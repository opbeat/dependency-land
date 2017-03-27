'use strict'

const utils = require('./utils')

if (utils.isDevelopment()) {
  require('dotenv').config()
}

let opbeatRelaseTracker = require('opbeat-release-tracker')()

opbeatRelaseTracker(() => {
  utils.log('Release tracked on Opbeat!')
})
