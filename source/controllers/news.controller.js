const { selectEndpoints, selectTopics, selectArticles, selectArticleById, selectArticleComments, checkArticleExists, insertNewComment, updateArticleVotes, deleteComment, checkCommentExists, selectAllUsers, selectUsername, checkUsernameExists } = require('../models/news.model');
const { checkNewVotesValid, checkValidParams } = require('../errors/news.errors')

getEndpoints = (req, res, next) => {
    return selectEndpoints().then((endpoints) => {
        res.status(200).send({ endpoints })
    })
    .catch(next) 
}

getTopics = (req, res, next) => {
    return selectTopics().then((topics) => {
        res.status(200).send({ topics })
    })
    .catch(next)
}

getArticles = (req, res, next) => {
    const sortBy = req.query.sort_by
    const order = req.query.order
    const topic = req.query.topic
    return checkValidParams(req.query)
    .then(() => {return selectArticles(sortBy, order, topic).then((articles) => {
        res.status(200).send({ articles })
    })
    })
    .catch(next)
}

getArticleById = (req, res, next) => {
    const articleId = req.params.article_id
    return selectArticleById(articleId)
    .then((article) => {
        if (!article) {
            return Promise.reject({ status: 404, msg: "Article not found"})
        }
        res.status(200).send({ article })
    })
    .catch(next)
}

getArticleComments = (req, res, next) => {
    const articleId = req.params.article_id
    return checkArticleExists(articleId)
    .then(() => {
        return selectArticleComments(articleId)
    })
    .then((comments) => {
        if (comments.length === 0) {
           return res.status(200).send({ msg: "No comments yet" })
        }
        res.status(200).send({ comments })
    })
}

postNewComment = (req, res, next) => {
    const articleId = req.params.article_id
    const newComment = req.body
    return insertNewComment(articleId, newComment)
    .then((comment) => {
        res.status(201).send({ comment })
    })
}

patchArticleVotes = (req, res, next) => {
    const articleId = req.params.article_id
    const newVotes = req.body
    return checkNewVotesValid(newVotes)
    .then(() => {
        return checkArticleExists(articleId)
    })
    .then(() => {
        return updateArticleVotes(articleId, newVotes)
    })
    .then((article) => {
        res.status(200).send({ article })
    })
}

deleteCommentById = (req, res, next) => {
    const commentId = req.params.comment_id
    return checkCommentExists(commentId)
    .then(() => {
        return deleteComment(commentId)
    })
    .then(() => {
        res.status(204).send()
    })
}

getAllUsers = (req, res, next) => {
    return selectAllUsers()
    .then((users) => {
        res.status(200).send({ users })
    })
}

getUserByUsername = (req, res, next) => {
    const username = req.params.username
    return selectUsername(username)
    .then((user) => {
        if (!user) {
            return Promise.reject({ status: 404, msg: "User not found"})
        }
        res.status(200).send({ user })
    })
}

module.exports = { getEndpoints, getTopics, getArticles, getArticleById, getArticleComments, postNewComment, patchArticleVotes, deleteCommentById, getAllUsers, getUserByUsername }