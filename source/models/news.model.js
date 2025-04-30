const db = require('../../db/connection');
const format = require('pg-format');
const endpointsJson = require('../../endpoints.json');

const selectEndpoints = () => {
    return Promise.resolve(endpointsJson)
}

const selectTopics = () => {
return db.query('SELECT * FROM topics')
.then((result) => {
    const topics = result.rows
    return topics
})
}

const selectArticles = () => {
    return db.query(`SELECT * FROM articles`)
    .then((result) => {
        const articles = result.rows
        return articles
    })
}

const selectArticleById = (articleId) => {
    return db.query(`SELECT * FROM articles
        WHERE article_id = $1`, [articleId])
        .then((result) => {
        const article = result.rows[0]
        return article
        })
}

module.exports = { selectEndpoints, selectTopics, selectArticles, selectArticleById }