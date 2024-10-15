const {
  fetchArticle,
  fetchAllArticles,
  fetchArticleComments,
  publishArticleComment,
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

exports.getArticleComments = (request, response, next) => {
  const artComNum = request.params.article_id;
  const promises = [fetchArticleComments(artComNum)];

  if (artComNum) {
    promises.push(fetchArticle(artComNum));
  }

  Promise.all(promises)
    .then((result) => {
      response.status(200).send({ comments: result[0] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postArticleComment = (request, response, next) => {
  const postAuthor = request.body.username;
  const postBody = request.body.body;
  const postNum = request.params.article_id;

  publishArticleComment(postAuthor, postBody, postNum)
    .then((result) => {
      response.status(201).send({ comment: result });
    })
    .catch((err) => {
      next(err);
    });
};
