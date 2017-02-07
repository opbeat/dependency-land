const opbeat = require('opbeat')
const Joi = require('joi')
const Boom = require('boom')

const semver = require('semver')

const query = require('../db/query.js')

// Exports = exports? Read: http://stackoverflow.com/a/7142924/5210
module.exports = exports = (server) => {
  server.route({
    method: 'GET',
    path: '/api/query/{name}/{range?}',
    config: {
      validate: {
        params: {
          name: Joi.string().required().min(1).max(214),
          range: Joi.string().min(1).max(50)
        }
      }
    },
    handler: apiHandler
  })
}

const apiHandler = (request, reply) => {
  // Decode package name
  let packageName = decodeURIComponent(request.params.name)

  // Decode version range
  let versionRange
  if (request.params.range) {
    versionRange = decodeURIComponent(request.params.range)
  } else {
    versionRange = '*'
  }

  // Validate semver range
  let isVersionRangeValid = semver.validRange(versionRange)

  if (!isVersionRangeValid) {
    reply(
      Boom.badData('Invalid semver range provided')
    )
  } else {
    // Start Opbeat custom trace
    let trace = opbeat.buildTrace()

    if (trace) {
      trace.start('db query', 'db.leveldb.query')
    }

    // Run db query
    query(packageName, versionRange)
      .then((response) => {
        if (trace) {
          trace.end()
        }
        reply(response)
      })
      .catch((error) => {
        if (trace) {
          trace.end()
        }
        reply(
          Boom.badImplementation('An error occurred.')
        )
        opbeat.captureError(error)
      })
  }
}
