const { post } = require("superagent");
const db = require("../db/connection");
const { patchArticleVotes } = require("../controller/articles.controller");

function fetchAllArticles(sort_by = "created_at", order = "desc", topic) {
  const validSortBys = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
  ];
  const validOrders = ["asc", "desc"];

  if (!validSortBys.includes(sort_by) || !validOrders.includes(order)) {
    return Promise.reject({ status: 400, message: "Bad Request" });
  }

  let query = `SELECT author,title,article_id,topic,created_at,votes,
      article_img_url,comment_count FROM articles`;
  let queryTop = [];

  if (topic) {
    query += ` WHERE topic = $1`;
    queryTop.push(topic);
  }

  query += ` ORDER BY ${sort_by} ${order}`;

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
      return db.query(query, queryTop);
    })
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 400, message: "Bad Request" });
      }
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

module.exports = {
  fetchArticle,
  fetchAllArticles,
  fetchArticleComments,
  publishArticleComment,
  modelPatchArticleVotes,
  patchArticleVotes,
};
