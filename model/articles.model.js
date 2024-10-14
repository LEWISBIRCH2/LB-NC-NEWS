const db = require("../db/connection");

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
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, message: "Article not found" });
      }
      return result.rows;
    });
}
module.exports = { fetchArticle, fetchAllArticles };
