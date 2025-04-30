const { selectEndpoints, selectTopics } = require('../models/news.model');

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

module.exports = { getEndpoints, getTopics }