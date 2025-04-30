const { selectEndpoints, selectTopics, selectArticles, selectArticleById } = require('../models/news.model');

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
    return selectArticles().then((articles) => {
        res.status(200).send({ articles })
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

module.exports = { getEndpoints, getTopics, getArticles, getArticleById }