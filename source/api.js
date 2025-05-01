require('dotenv').config();
require('../db/connection');
const express = require('express');
const { getEndpoints, getTopics, getArticles, getArticleById, getArticleComments, postNewComment, patchArticleVotes, deleteCommentById, getAllUsers } = require('./controllers/news.controller');
const { handleCustomErrors, handlePsqlErrors, handleServerErrors, handlePathNotFound } = require('./errors/news.errors');

const app = express();
app.use(express.json());

//Get Requests
app.get('/api', getEndpoints)
app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles/:article_id/comments', getArticleComments)
app.get('/api/users', getAllUsers)

//Post Requests
app.post('/api/articles/:article_id/comments', postNewComment)

//Patch Requests
app.patch('/api/articles/:article_id', patchArticleVotes)

//Delete Requests
app.delete('/api/comments/:comment_id', deleteCommentById)

//Error Handling
app.all('/*splat', handlePathNotFound);


app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);


module.exports = app
