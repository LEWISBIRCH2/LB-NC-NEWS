const db = require("../db/connection");

function fetchUsers() {
  return db.query("SELECT * FROM users").then((result) => {
    return result.rows;
  });
}

function fetchSingleUser(userParam) {
  return db
    .query("SELECT * FROM users WHERE username = $1", [userParam])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, message: "User Not Found" });
      }
      return result.rows[0];
    });
}
module.exports = { fetchUsers, fetchSingleUser };
