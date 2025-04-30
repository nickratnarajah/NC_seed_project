require('dotenv').config();
require('../db/connection');
const express = require('express');
const { getEndpoints, getTopics, getArticles } = require('./controllers/news.controller');

const app = express();

app.get('/api', getEndpoints)
//app.get('/api/topics', getTopics)
//app.get('/api/articles', getArticles)

module.exports = app
