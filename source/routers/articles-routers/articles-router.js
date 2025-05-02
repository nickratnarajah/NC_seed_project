const articlesRouter = require("express").Router();
const { getArticles, getArticleById, getArticleComments, postNewComment, patchArticleVotes, postArticle } = require("../../controllers/news.controller")

//Articles
articlesRouter
    .route("/")
    .get(getArticles)
    .post(postArticle)

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