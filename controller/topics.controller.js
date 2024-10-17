const { fetchTopics, publishTopic } = require("../model/topics.model");

exports.getTopics = (request, response) => {
  fetchTopics().then((topics) => {
    response.status(200).send({ topics });
  });
};

exports.postTopic = (request, response, next) => {
  const postDescription = request.body.description;
  const postBody = request.body.slug;

  publishTopic(postDescription, postBody)
    .then((result) => {
      response.status(201).send({ topic: result });
    })
    .catch((err) => {
      next(err);
    });
};
