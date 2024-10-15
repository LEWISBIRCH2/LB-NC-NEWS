const express = require("express");
const app = express();
const { getTopics } = require("./controller/topics.controller");
const { getEndpoints } = require("./controller/endpoints.controller");
const {
  getArticle,
  getAllArticles,
  getArticleComments,
  postArticleComment,
  patchArticleVotes,
} = require("./controller/articles.controller");

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticle);

app.patch("/api/articles/:article_id", patchArticleVotes);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", postArticleComment);

app.use((err, request, response, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    response.status(400).send({ msg: "Bad Request" });
  }
  if (err.code == "23503" && err.constraint === "comments_author_fkey") {
    response.status(400).send({ msg: "User Not Found" });
  }
  if (err.code == "23503") {
    response.status(404).send({ msg: "Article Not Found" });
  }
  if (err.status && err.message) {
    response.status(err.status).send(err.message);
  } else {
    response.status(500).send({ msg: "Server Error" });
  }
});

module.exports = app;
