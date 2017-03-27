exports.init = function (server) {
  // Route for api
  require('./api')(server)

  // Route for static client assets
  server.route({
    method: 'GET',
    path: '/static/{param*}',
    handler: {
      directory: {
        path: 'client/build/static'
      }
    }
  })

  // Route for client app
  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: (request, reply) => {
      reply.file('client/build/index.html')
    }
  })
}
