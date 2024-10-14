const express = require("express");
const app = express();
const { getTopics } = require("../LB-NC-NEWS/controller/topics.controller");
const {
  getEndpoints,
} = require("../LB-NC-NEWS/controller/endpoints.controller");
const { getArticle } = require("../LB-NC-NEWS/controller/articles.controller");
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticle);

app.use((err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ msg: "Bad Request" });
  }
  if (err.status && err.message) {
    response.status(404).send({ msg: "Article not found" });
  } else {
    response.status(500).send({ msg: "Server Error" });
  }
});

module.exports = app;
