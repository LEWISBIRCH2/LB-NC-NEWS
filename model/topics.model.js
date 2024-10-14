const db = require("../db/connection");

exports.fetchTopics = (request, response) => {
  return db.query("SELECT * FROM topics").then((result) => {
    return result.rows;
  });
};
