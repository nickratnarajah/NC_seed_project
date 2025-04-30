require('dotenv').config();
require('../db/connection');
const express = require('express');
const { getEndpoints, getTopics, getArticles, getArticleById } = require('./controllers/news.controller');
const { handleCustomErrors, handlePsqlErrors, handleServerErrors, handlePathNotFound } = require('./errors/news.errors');

const app = express();

app.get('/api', getEndpoints)
app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleById)


app.all('/*splat', handlePathNotFound);


app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);


module.exports = app
