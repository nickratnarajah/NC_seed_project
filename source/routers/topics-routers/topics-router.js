const topicsRouter = require("express").Router();
const { getTopics,  } = require("../../controllers/news.controller")

//Topics
topicsRouter
    .route("/")
    .get(getTopics)

module.exports = topicsRouter