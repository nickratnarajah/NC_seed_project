const db = require("../connection")
const format = require(`pg-format`)
const { convertTimestampToDate, createRef } = require('./utils')

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
  .query(`DROP TABLE IF EXISTS comments;`)
  .then(() => {
  return db.query(`DROP TABLE IF EXISTS articles;`)
  })
  .then(() => {
    return db.query(`DROP TABLE IF EXISTS users;`)
  })
  .then (() => {
    return db.query(`DROP TABLE IF EXISTS topics;`)
  }) //more .thens to DROP here as needed
  .then(() => {
    return db.query(
    `CREATE TABLE topics (
     slug VARCHAR(100) PRIMARY KEY,
     description VARCHAR(100) NOT NULL,
     img_url VARCHAR(1000) NOT NULL);`
  )
})
  .then (() => {
    return db.query(
      `CREATE TABLE users (
      username VARCHAR(200) PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      avatar_url VARCHAR(1000) NOT NULL);`
    )
  })
  .then (() => {
    return db.query(
      `CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      topic VARCHAR(200) NOT NULL,
      author VARCHAR (200) NOT NULL,
      body TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      votes INT DEFAULT 0,
      article_img_url VARCHAR(1000),
      FOREIGN KEY(topic) REFERENCES topics(slug) ON DELETE CASCADE,
      FOREIGN KEY(author) REFERENCES users(username) ON DELETE CASCADE);`
    )
  })
  .then (() => {
    return db.query(
      `CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      article_id INT NOT NULL,
      body TEXT NOT NULL,
      votes INT DEFAULT 0,
      author VARCHAR(200) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(author) REFERENCES users(username) ON DELETE CASCADE,
      FOREIGN KEY(article_id) REFERENCES articles(article_id) ON DELETE CASCADE);`
    )
  })
  .then (() => {
    const formattedTopicData = topicData.map((topic) => {
      return [topic.slug, 
        topic.description, 
        topic.img_url]
    })
    const insertTopicQuery = format(
      `INSERT INTO topics(slug, description, img_url) VALUES %L`, 
      formattedTopicData
    );
    return db.query(insertTopicQuery)
  })
  .then (() => {
    const formattedUserData = userData.map((user) => {
      return [user.username,
        user.name,
        user.avatar_url
      ]
    })
    const insertUserQuery = format(
    `INSERT INTO users(username, name, avatar_url) VALUES %L`,
    formattedUserData
  );
  return db.query(insertUserQuery)
    //<< write your first query in here.
})
.then (() => {
  const convertedArticles = articleData.map(convertTimestampToDate);
const formattedArticleData = convertedArticles.map((convertedArticle) => {
  return [convertedArticle.title,
    convertedArticle.topic,
    convertedArticle.author,
    convertedArticle.body,
    convertedArticle.created_at,
    convertedArticle.votes,
    convertedArticle.article_img_url
  ]
})
const insertArticleQuery = format(
  `INSERT INTO articles(title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *`,
  formattedArticleData
);
return db.query(insertArticleQuery)
})
.then((result) => {
const commentsReferenceObject = createRef(result.rows);
const convertedComments = commentData.map(convertTimestampToDate);
const formattedCommentData = convertedComments.map((convertedComment) => {
  return [commentsReferenceObject[convertedComment.article_title],
    convertedComment.body,
    convertedComment.votes,
    convertedComment.author,
    convertedComment.created_at
  ]
})
const insertCommentQuery = format(
  `INSERT INTO comments(article_id, body, votes, author, created_at) VALUES %L`, 
  formattedCommentData
)
return db.query(insertCommentQuery)
})
.then(() => {
  console.log("seeding complete")
})
;
}
module.exports = seed;