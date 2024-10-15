const {
  fetchArticle,
  fetchAllArticles,
  fetchArticleComments,
  publishArticleComment,
  modelPatchArticleVotes,
  modelDeleteComment,
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

exports.patchArticleVotes = (request, response, next) => {
  const patchNum = request.params.article_id;
  const patchBody = request.body.inc_votes;

  modelPatchArticleVotes(patchNum, patchBody)
    .then((result) => {
      response.status(200).send({ article: result });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComment = (request, response, next) => {
  const commentNum = request.params.comment_id;
  modelDeleteComment(commentNum)
    .then(() => {
      response.status(204).send({ message: "Deletion Successful!" });
    })
    .catch((err) => {
      next(err);
    });
};
