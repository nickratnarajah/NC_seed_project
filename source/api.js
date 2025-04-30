require('dotenv').config();
require('../db/connection');
const express = require('express');
const { getEndpoints, getTopics, getArticles } = require('./controllers/news.controller');
const { handleCustomErrors, handlePsqlErrors, handleServerErrors, handlePathNotFound } = require('./errors/news.errors');

const app = express();

app.get('/api', getEndpoints)
app.get('/api/topics', getTopics)
//app.get('/api/articles', getArticles)


app.use(handlePathNotFound);
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);


module.exports = app
