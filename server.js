'use strict'

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "opbeat" }] */
const opbeat = require('opbeat').start()
global.utils = require('./utils')

if (utils.isDevelopment()) {
  require('dotenv').config()
}

const Hapi = require('hapi')
const Good = require('good')
const Inert = require('inert')

const server = new Hapi.Server()

server.connection({
  host: '0.0.0.0',
  port: ~~process.env.PORT || 3001
})

const configGood = {
  register: Good,
  options: {
    reporters: {
      console: [{
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{
          response: '*',
          log: '*'
        }]
      }, {
        module: 'good-console'
      }, 'stdout']
    }
  }
}

// Register hapi plugins
server.register([configGood, Inert], (err) => {
  // Handle plugin loading errors
  if (err) {
    throw err
  }

  // Load routes
  let routes = require('./routes')
  routes.init(server)

  server.start((err) => {
    // Handle server errors
    if (err) {
      throw err
    }

    utils.log(`Server running at: ${server.info.uri}`)
  })
})

module.exports = server
