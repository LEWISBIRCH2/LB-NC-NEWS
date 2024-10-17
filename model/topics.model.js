const db = require("../db/connection");

exports.fetchTopics = (request, response) => {
  return db.query("SELECT * FROM topics").then((result) => {
    return result.rows;
  });
};

exports.publishTopic = (postDescription, postBody) => {
  if (postDescription === undefined || postBody === undefined) {
    return Promise.reject({ status: 400, message: "Insufficient Post Data" });
  }
  return db
    .query(
      `INSERT INTO topics (description,slug) VALUES ($1, $2) RETURNING *;`,
      [postDescription, postBody]
    )
    .then((result) => {
      return result.rows[0];
    });
};
