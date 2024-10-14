const express = require("express");
const app = express();
const { getTopics } = require("../LB-NC-NEWS/controller/topics.controller");
app.use(express.json());

app.get("/api/topics", getTopics);

app.use((err, request, response, next) => {
  response.status(500).send({ msg: "Server Error!" });
});

module.exports = app;
