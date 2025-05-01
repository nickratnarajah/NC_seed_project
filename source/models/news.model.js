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
    return db.query(`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
        COUNT (comments.comment_id) ::int AS comment_count
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        GROUP BY 
        articles.article_id
        ORDER BY articles.created_at DESC`)
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