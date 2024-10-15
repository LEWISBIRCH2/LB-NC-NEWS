const { post } = require("superagent");
const db = require("../db/connection");
const { patchArticleVotes } = require("../controller/articles.controller");

function fetchAllArticles(request, response) {
  return db
    .query(
      `ALTER TABLE articles ADD COLUMN IF NOT EXISTS comment_count INT DEFAULT 0`
    )
    .then(() => {
      return db.query(` 
      UPDATE articles SET comment_count = (SELECT COUNT (*) FROM comments 
      WHERE comments.article_id = articles.article_id);`);
    })
    .then(() => {
      return db.query(
        `SELECT author,title,article_id,topic,created_at,votes,
      article_img_url,comment_count FROM articles ORDER BY created_at DESC;`
      );
    })
    .then((result) => {
      return result.rows;
    });
}

function fetchArticle(artNum) {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [artNum])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, message: "Article Not Found" });
      }
      return result.rows;
    });
}

function fetchArticleComments(artComNum) {
  return db
    .query(
      ` SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at ASC`,
      [artComNum]
    )
    .then((result) => {
      return result.rows;
    });
}

function publishArticleComment(postAuthor, postBody, postNum) {
  return db
    .query(
      "INSERT INTO comments (author,body,article_id) VALUES ($1, $2, $3) RETURNING *;",
      [postAuthor, postBody, postNum]
    )
    .then((result) => {
      return result.rows[0];
    });
}

function modelPatchArticleVotes(patchNum, patchBody) {
  return db
    .query(
      "UPDATE articles SET votes = articles.votes+$1 WHERE article_id = $2 RETURNING *",
      [patchBody, patchNum]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, message: "Article Not Found" });
      }
      return result.rows[0];
    });
}

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

module.exports = {
  fetchArticle,
  fetchAllArticles,
  fetchArticleComments,
  publishArticleComment,
  modelPatchArticleVotes,
  patchArticleVotes,
  modelDeleteComment,
};
