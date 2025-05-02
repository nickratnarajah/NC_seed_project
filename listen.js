const express = require('express');
const app = express();

const api = require("./api")
const { PORT = 9090 } = process.env

app.listen(PORT, () => console.log(`Server is listening on ${PORT}...`));