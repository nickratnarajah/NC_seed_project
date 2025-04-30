const db = require('../../db/connection');
const format = require('pg-format');
const endpointsJson = require('../../endpoints.json');

const selectEndpoints = (req, res, next) => {
    return Promise.resolve(endpointsJson)
}

module.exports = { selectEndpoints }