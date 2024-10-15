const {
  fetchArticle,
  fetchAllArticles,
  fetchArticleComments,
} = require("../model/articles.model");

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

exports.getArticleComments = (request, response,next) => {
  const artComNum = request.params.article_id;
  fetchArticleComments(artComNum)
    .then((result) => {
      response.status(200).send({ comments: result });
    })
    .catch((err) => {
      next(err);
    });
};
