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

const selectArticles = (sortBy, order, topic) => {
    //Define initial strings for use in query later
    let baseString = "SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT (comments.comment_id) ::int AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id"
    let groupString = " GROUP BY articles.article_id"
    let defaultSort = "ORDER BY articles.created_at"
    let defaultOrder = "DESC"
    
    //Greenlist paramaters
    const allowedSortBy = ['article_id', 'title', 'topic', 'author', 'created_at', 'votes', 'comment_count']
    const allowedOrder = ['asc', 'desc']
    const allowedTopics = ['mitch', 'cats']


    //I'm aware the checking for valid sort and order might violate DRY but the thinking was to practice making airtight against SQL injection
    if (sortBy !== undefined && !allowedSortBy.includes(sortBy) || order !== undefined && !allowedOrder.includes(order) || topic !== undefined && !allowedTopics.includes(topic)) {
        return Promise.reject({ status: 400, msg: "Invalid sort query" })
    } else if (sortBy !== undefined && allowedSortBy.includes(sortBy)){
        defaultSort = `ORDER BY ${sortBy}`
    } if (order !== undefined && allowedOrder.includes(order)) {
        defaultOrder = order.toUpperCase()
    }
    if (topic !== undefined && allowedTopics.includes(topic)) {
        defaultTopic = `WHERE articles.topic = ${topic}`
    }

    //Logic for handling the topic query
    let queryValues = []
    if (topic) {queryValues.push(topic);
        baseString += ` WHERE articles.topic = $1`
    }

    //Readding the group by string to ensure the join works correctly accounting for the topic selection
    baseString += groupString

    //Reassemble the final query string
    const queryString = `${baseString} ${defaultSort} ${defaultOrder}`


        return db.query(queryString, queryValues)
    .then((result) => {
        const articles = result.rows
        return articles
    })
}

const selectArticleById = (articleId) => {
    return db.query(`
        SELECT articles.*,
        COUNT (comments.comment_id)::int AS comment_count
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id`, [articleId])
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
}

const checkCommentExists = (commentId) => {
    return db.query(`SELECT * FROM comments WHERE comment_id = $1`, [commentId])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      }
    })  
}

const selectAllUsers = () => {
    return db.query(
        `SELECT * FROM users`
    )
    .then((result) => {
        const users = result.rows
        return users
    })
}

module.exports = { selectEndpoints, selectTopics, selectArticles, selectArticleById, selectArticleComments, checkArticleExists, insertNewComment, updateArticleVotes, deleteComment, checkCommentExists, selectAllUsers }