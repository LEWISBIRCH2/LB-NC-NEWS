const express = require("express");
const app = express();
const { getTopics } = require("./controller/topics.controller");
const {
  getEndpoints,
} = require("./controller/endpoints.controller");
const {
  getArticle,
  getAllArticles,
  getArticleComments
} = require("./controller/articles.controller");

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticle);

app.get("/api/articles/:article_id/comments", getArticleComments);


app.use((err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ msg: "Bad Request" });
  }
  if (err.status && err.message) {
    response.status(err.status).send(err.message);
  } else {
    response.status(500).send({ msg: "Server Error" });
  }
});

module.exports = app;
