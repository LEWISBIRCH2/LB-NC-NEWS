const db = require("../db/connection");

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

  let query = `SELECT articles.author, articles.title, articles.article_id,
        articles.topic, articles.created_at, articles.votes,
        articles.article_img_url, COUNT(comments.comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id`;

  let queryTop = [];
  if (topic) {
    query += ` WHERE topic = $1`;
    queryTop.push(topic);
  }

  query += ` GROUP BY articles.article_id`;
  query += ` ORDER BY ${sort_by} ${order}`;

  return db.query(query, queryTop).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 400, message: "Bad Request" });
    }
    return result.rows;
  });
}

function fetchArticle(artNum) {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.comment_id) AS comment_count
      FROM articles 
      LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id`,
      [artNum]
    )
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

function publishArticle(postAuthor, postTitle, postBody, postTopic) {
  if (
    postAuthor === undefined ||
    postBody === undefined ||
    postTitle === undefined ||
    postTopic === undefined
  ) {
    return Promise.reject({ status: 400, message: "Insufficient Post Data" });
  }
  return db
    .query(
      `INSERT INTO articles (author,title,body,topic) VALUES ($1, $2, $3, $4) RETURNING *`,
      [postAuthor, postTitle, postBody, postTopic]
    )
    .then((result) => {
      return result.rows[0];
    });
}
module.exports = {
  fetchArticle,
  fetchAllArticles,
  fetchArticleComments,
  publishArticleComment,
  modelPatchArticleVotes,
  publishArticle,
};
