const { fetchUsers, fetchSingleUser } = require("../model/users.model");

exports.getUsers = (request, response, next) => {
  fetchUsers()
    .then((result) => {
      response.status(200).send({ users: result });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getSingleUser = (request, response, next) => {
  const userParam = request.params.username;
  fetchSingleUser(userParam)
    .then((result) => {
      response.status(200).send({ user: result });
    })
    .catch((err) => {
      next(err);
    });
};
