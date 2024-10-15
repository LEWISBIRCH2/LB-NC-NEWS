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

module.exports = modelDeleteComment;
