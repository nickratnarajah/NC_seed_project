const usersRouter = require("express").Router();
const { getAllUsers, getUserByUsername } = require("../../controllers/news.controller")

//Users
usersRouter
    .route("/")
    .get(getAllUsers)

//User by Username
usersRouter
    .route("/:username")
    .get(getUserByUsername)

module.exports = usersRouter