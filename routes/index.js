module.exports.init = function(server) {

    // Route for client app
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: 'client/build/'
            }
        }
    });

    // Route for api
    require('./api.js')(server);
}
