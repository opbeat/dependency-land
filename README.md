# ModuleVersions

Find the npm modules that depend on a specific module and semver range.

Think of it as a reverse dependency search; instead of finding dependencies, it finds dependents. 🔍

Available at [module-versions.com](http://module-versions.com/). The project is created and hosted by [Opbeat](https://opbeat.com).

**Note: This project is very much in beta, please share your feedback and contribute to the development.**

## Development

This project contains a simple client website and a small server with a REST API. Once deployed it runs the server and a background service that keeps the local data set up-to-date continously.

The client is based on [create-react-app](https://github.com/facebookincubator/create-react-app), it talks to the API and renders the results. The server is a [hapi](https://hapijs.com/) server with a couple of plugins. It wraps the functionality of [npm-dependency-db](https://www.npmjs.com/package/npm-dependency-db) and [dependency-db](https://www.npmjs.com/package/dependency-db).

1. Install server dependencies and client dependencies.

		npm install && cd client && npm install && cd ..

2. Start both the server and the client in development mode.

		npm start


## Credits

Thanks to [@watson](https://github.com/watson) and [@mafintosh](https://github.com/mafintosh) for creating the dependency-db modules and infrastructure. Thanks to the [dat project](https://datproject.org/) for hosting the hypercore service that dependency-db depends on. Thanks to [@terezka](https://github.com/terezka) for sanity checking the client code.

And a big thanks to all the authors of all the modules that are used in this project.

## License

MIT

<br>Made with ♥️ and ☕️ by Opbeat and our community.
