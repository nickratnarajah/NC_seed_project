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

const selectArticleComments = (articleId) => {
    return db.query(`SELECT * FROM comments
        WHERE article_id = $1
        ORDER BY comments.created_at DESC`, [articleId])
        .then((result) => {
            const comments = result.rows
            return comments
        })

}

const checkArticleExists = (articleId) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
    })
}

const insertNewComment = (articleId, newComment) => {
    return db.query(`INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING author, body, comment_id, created_at`, [newComment.username, newComment.body, articleId]
    ).then((result) => {
        const comment = result.rows[0]
        return comment
    })
}

const updateArticleVotes = (articleId, newVotes) => {
    return db.query(
        `UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *`,
        [newVotes.inc_votes, articleId]
        )
        .then((result) => {
            const article = result.rows[0]
            return article 
        })
}

const deleteComment = (commentId) => {
    return db.query(
        `DELETE FROM comments
        WHERE comment_id = $1`,
        [commentId]
    )
    .then(() => {
        Promise.resolve()
    })
}

const checkCommentExists = (commentId) => {
    return db.query(`SELECT * FROM comments WHERE comment_id = $1`, [commentId])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      }
    })  
}

module.exports = { selectEndpoints, selectTopics, selectArticles, selectArticleById, selectArticleComments, checkArticleExists, insertNewComment, updateArticleVotes, deleteComment, checkCommentExists }