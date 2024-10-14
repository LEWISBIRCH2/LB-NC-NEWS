const express = require("express");
const app = express();
const { getTopics } = require("../LB-NC-NEWS/controller/topics.controller");
const {getEndpoints} = require('../LB-NC-NEWS/controller/endpoints.controller')
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.use((err, request, response, next) => {
  response.status(500).send({ msg: "Server Error!" });
});

module.exports = app;
