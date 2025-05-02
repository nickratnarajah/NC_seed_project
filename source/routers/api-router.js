const apiRouter = require ("express").Router();
const articlesRouter = require("./articles-routers/articles-router")
const topicsRouter = require("./topics-routers/topics-router")
const usersRouter = require("./users-routers/users-router")
const commentsRouter = require("./comments-routers/comments-router")
const { getEndpoints } = require('../controllers/news.controller');


apiRouter.use("/articles", articlesRouter)
apiRouter.use("/topics", topicsRouter)
apiRouter.use("/users", usersRouter)
apiRouter.use("/comments", commentsRouter)

//GET Routes

apiRouter.get("/", getEndpoints);



module.exports = apiRouter