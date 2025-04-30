const db = require('../../db/connection');
const format = require('pg-format');
const endpointsJson = require('../../endpoints.json');

const selectEndpoints = (req, res, next) => {
    return Promise.resolve(endpointsJson)
}

const selectTopics = (req, res, next) => {
return db.query('SELECT * FROM topics')
.then((result) => {
    const topics = result.rows
    return topics
})
}

module.exports = { selectEndpoints, selectTopics }