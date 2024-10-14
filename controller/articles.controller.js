const { fetchArticle, fetchAllArticles } = require("../model/articles.model");

exports.getArticle = (request, response, next) => {
  const artNum = request.params.article_id;
  fetchArticle(artNum)
    .then((result) => {
      response.status(200).send({ article: result });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllArticles = (request, response) => {
  fetchAllArticles().then((result) => {
    response.status(200).send({ articles: result });
  });
};
