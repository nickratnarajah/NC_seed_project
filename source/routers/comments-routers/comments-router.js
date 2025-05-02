const commentsRouter = require("express").Router();
const { deleteCommentById } = require("../../controllers/news.controller");

//Comments
commentsRouter
    .route("/:comment_id")
    .delete(deleteCommentById)

module.exports = commentsRouter