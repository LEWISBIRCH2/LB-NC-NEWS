const modelDeleteComment = require("../model/comments.model");

exports.deleteComment = (request, response, next) => {
  const commentNum = request.params.comment_id;
  modelDeleteComment(commentNum)
    .then(() => {
      response.status(204).send({});
    })
    .catch((err) => {
      next(err);
    });
};
