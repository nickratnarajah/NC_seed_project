const { selectEndpoints } = require('../models/news.model');

getEndpoints = (req, res, next) => {
    return selectEndpoints().then((endpoints) => {
        console.log(endpoints, "in controller promise")
        res.status(200).send({ endpoints })
    }) 
}

module.exports = { getEndpoints }