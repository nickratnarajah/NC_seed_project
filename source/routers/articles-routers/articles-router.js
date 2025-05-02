const articlesRouter = require("express").Router();
const { getArticles, getArticleById, getArticleComments, postNewComment, patchArticleVotes } = require("../../controllers/news.controller")

//Articles
articlesRouter
    .route("/")
    .get(getArticles)

//Article by ID Number
articlesRouter
    .route("/:article_id")
    .get(getArticleById)
    .patch(patchArticleVotes)

//Comments on Article by ID Number
articlesRouter
    .route("/:article_id/comments")
    .get(getArticleComments)
    .post(postNewComment)


module.exports = articlesRouter