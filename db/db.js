global.utils = require('../utils.js');

const fs = require('fs');
const path = require('path');
const level = require('level-party');
const mkdirp = require('mkdirp');

// Create db path
let pathPrefix;

if (process.env.NODE_ENV !== 'production') {
    pathPrefix = process.env.HOME;
} else {
    pathPrefix = '/storage'
}

const dbPath = path.join(pathPrefix, '.npm-dependency-db');

mkdirp.sync(dbPath);

module.exports.level = () => {
    const db = level(dbPath);

    utils.log(`Database loaded from: ${db.location}`);

    return db;
};
