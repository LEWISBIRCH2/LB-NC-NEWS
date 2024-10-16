const fetchUsers = require('../model/users.model')

exports.getUsers = (request, response, next) => {
  fetchUsers()
    .then((result) => {
      response.status(200).send({ users: result });
    })
    .catch((err) => {
      next(err);
    });
};
