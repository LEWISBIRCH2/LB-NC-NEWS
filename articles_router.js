const apiArticlesRouter = require("express").Router();
const {
  getArticle,
  getAllArticles,
  getArticleComments,
  postArticleComment,
  patchArticleVotes,
  postArticle,
  deleteArticle
} = require("./controller/articles.controller");


apiArticlesRouter.get("/", getAllArticles);

apiArticlesRouter.get("/:article_id", getArticle);

apiArticlesRouter.patch("/:article_id", patchArticleVotes);

apiArticlesRouter.get("/:article_id/comments", getArticleComments);

apiArticlesRouter.post("/", postArticle);

apiArticlesRouter.post("/:article_id/comments", postArticleComment);

apiArticlesRouter.delete('/:article_id', deleteArticle)

module.exports = apiArticlesRouter;