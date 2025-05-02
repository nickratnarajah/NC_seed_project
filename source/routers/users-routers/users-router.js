const usersRouter = require("express").Router();
const { getAllUsers } = require("../../controllers/news.controller")

//Users
usersRouter
    .route("/")
    .get(getAllUsers)

module.exports = usersRouter