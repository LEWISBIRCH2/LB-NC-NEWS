const db = require("../db/connection");
const fs = require("fs/promises");

function fetchArticle(artNum) {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [artNum])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, message: "Article not found" });
      }
      return result.rows;
    });
}

module.exports = fetchArticle;
