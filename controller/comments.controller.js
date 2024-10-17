const {
  modelPatchComment,
  modelDeleteComment,
} = require("../model/comments.model");

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

exports.patchComment = (request, response, next) => {
  const params = request.params.comment_id;
  const body = request.body.inc_votes;
  modelPatchComment(params, body)
    .then((result) => {
      response.status(200).send({ comment: result });
    })
    .catch((err) => {
      next(err);
    });
};
