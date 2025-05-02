require('dotenv').config();
require('../db/connection');
const express = require('express');
const apiRouter = require ("./routers/api-router")
const { handleCustomErrors, handlePsqlErrors, handleServerErrors, handlePathNotFound } = require('./errors/news.errors');

const app = express();

app.use(express.json());
app.use("/api", apiRouter);


//Error Handling
app.all('/*splat', handlePathNotFound);


app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);


module.exports = app
