const Promise = require('bluebird');
const semver = require('semver');
const DepDb = require('dependency-db');

const db = require('./db.js');
const depDb = new DepDb(db.level());

module.exports = (name, range) => {
    return new Promise((resolve, reject) => {

        range = range || '*'

        if (!name) throw new Error('missing required name');

        let response = {};

        console.log('Looking up %s %s dependants...', name, range);

        response['query'] = {
            name,
            range
        };

        depDb.query(name, range, (err, pkgs) => {
            if (err) {
                reject(err);
            }

            console.log('Found %d dependant package releases', pkgs.length)

            let unique = {};

            pkgs.forEach((pkg) => {
                if (!unique[pkg.name] || semver.gt(pkg.version, unique[pkg.name].version)) {
                    unique[pkg.name] = {
                        version: pkg.version,
                        range: pkg.dependencies[name]
                    }
                }
            });

            response['results'] = {
                total_packages_count: pkgs.length,
                unique_packages_count: Object.keys(unique).length,
                unique_packages: []
            };

            console.log('Filtered down to %d unique packages:', Object.keys(unique).length);

            Object.keys(unique).forEach((pkgName) => {
                let pkg = unique[pkgName];
                let packages = response.results.unique_packages;

                packages.push({
                    name: pkgName,
                    version: pkg.version,
                    range: pkg.range
                });
            });

            resolve(response);
        })
    });
}
