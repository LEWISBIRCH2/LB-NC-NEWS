const db = require("../db/connection");

function modelDeleteComment(commentNum) {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *", [
      commentNum,
    ])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, message: "Comment Not Found" });
      }
    });
}

function modelPatchComment(params, body) {
  return db
    .query(
      "UPDATE comments SET votes = comments.votes+$1 WHERE comment_id = $2 RETURNING *",
      [body, params]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, message: "Comment Not Found" });
      }
      return result.rows[0];
    });
}
module.exports = { modelDeleteComment, modelPatchComment };
