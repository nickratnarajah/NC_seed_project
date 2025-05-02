const commentsRouter = require("express").Router();
const { deleteCommentById, patchCommentVotes } = require("../../controllers/news.controller");

//Comments
commentsRouter
    .route("/:comment_id")
    .delete(deleteCommentById)
    .patch(patchCommentVotes)



module.exports = commentsRouter