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

const selectArticles = (sortBy, order, topic, limit, page) => {
    //Define initial strings for use in query later
    let baseString = "SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT (comments.comment_id) ::int AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id"
    let groupString = " GROUP BY articles.article_id"
    let defaultSort = "ORDER BY articles.created_at"
    let defaultOrder = "DESC"
    
    //Greenlist parameters
    const allowedSortBy = ['article_id', 'title', 'topic', 'author', 'created_at', 'votes', 'comment_count']
    const allowedOrder = ['asc', 'desc']
    const allowedTopics = ['coding', 'football', 'cooking', 'mitch', 'cats']


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
        topicSuffix = ` WHERE articles.topic = $1`
        baseString += topicSuffix
    }

    //logic for handling limit
    let defaultLimit = 10
    if (limit) {defaultLimit = limit}
    queryValues.push(defaultLimit)

    //logic for handling pagination
    let defaultPage = 1
    if (page) {defaultPage = page}
    const offset = (defaultPage - 1) * defaultLimit
    queryValues.push(offset)

    
    const limitString = `LIMIT $${queryValues.length-1} OFFSET $${queryValues.length}`
    
    //Readding the group by string to ensure the join works correctly accounting for the topic selection
    baseString += groupString
    
    //Reassemble the final query string
    const queryString = `${baseString} ${defaultSort} ${defaultOrder} ${limitString}`
    
    //Retrieve pagination metadata for response
    let countQuery = `SELECT COUNT(*)::INT AS total_count FROM articles`
    if (topic) {countQuery += topicSuffix}
    const countValues = topic ? [topic] : [];
    
    
     
    return Promise.all([
        db.query(countQuery, countValues),
        db.query(queryString, queryValues)
    ])
    .then(([countResult, articlesResult]) => {
        const total_count = countResult.rows[0].total_count;
        const totalPages = Math.ceil(total_count / defaultLimit);
      
        if (defaultPage > totalPages && total_count !== 0) {
          return Promise.reject({ status: 404, msg: "Page not found" });
        }
      
        return {
          total_count,
          page: defaultPage,
          articles: articlesResult.rows
        };
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

const selectUsername = (username) => {
    return db.query(
        `SELECT username, avatar_url, name
        FROM users
        WHERE username = $1`,
        [username]
    )
    .then((result) => {
        const user = result.rows[0]
        return user
    })
}

const updateCommentVotes = (commentId, newVotes) => {
    return db.query(
        `UPDATE comments
        SET votes = votes + $1
        WHERE comment_id = $2
        RETURNING *`,
        [newVotes.inc_votes, commentId]
    )
    .then((result) => {
        const comment = result.rows[0]
        return comment
    })
}

const insertArticle = (newArticle) => {
    return db.query(
        `INSERT INTO articles (author, title, body, topic, article_img_url)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [newArticle.author, newArticle.title, newArticle.body, newArticle.topic, newArticle.article_img_url]
      ).then((result) => {
        const articleId = result.rows[0].article_id;
        return db.query(
          `SELECT articles.*, COUNT(comments.comment_id)::int AS comment_count
           FROM articles
           LEFT JOIN comments ON articles.article_id = comments.article_id
           WHERE articles.article_id = $1
           GROUP BY articles.article_id`,
          [articleId]
        );
      })
      .then((result) => {
        const article = result.rows[0]
        return article
    })
}

module.exports = { selectEndpoints, selectTopics, selectArticles, selectArticleById, selectArticleComments, checkArticleExists, insertNewComment, updateArticleVotes, deleteComment, checkCommentExists, selectAllUsers, selectUsername, updateCommentVotes, insertArticle }