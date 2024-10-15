const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const endpoints = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

describe("Topics endpoint", () => {
  test("GET:200 - Returns an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).toBe(3);
        body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("API endpoint", () => {
  test("GET:200 - Returns an array of potential valid endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpoints);
      });
  });
});

describe("Articles endpoint", () => {
  test("GET:200 - Returns the provided article", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        body.article.forEach((result) => {
          expect(result.author).toBe("icellusedkars");
          expect(result.title).toBe("Sony Vaio; or, The Laptop");
          expect(typeof result.article_id).toBe("number");
          expect(typeof result.body).toBe("string");
          expect(result.topic).toBe("mitch");
          expect(typeof result.created_at).toBe("string");
          expect(typeof result.votes).toBe("number");
        });
      });
  });
  test("GET:400 - Returns a 400 error when given an invalid URL endpoint", () => {
    return request(app)
      .get("/api/articles/two")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("GET:404 - Returns a 404 when specified article_id does not exist", () => {
    return request(app)
      .get("/api/articles/679")
      .expect(404)
      .then((body) => {
        expect(body.text).toBe("Article Not Found");
      });
  });
  test("GET:200 - Returns all articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((result) => {
        const parsedData = JSON.parse(result.text);
        expect(parsedData.articles).toBeSorted({ descending: true });

        parsedData.articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.comment_count).toBe("number");
        });
      });
  });
  test("GET:200 - Return an array of comments about the specified article", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(11);
        expect(body.comments).toBeSorted({ ascending: true });
        body.comments.forEach((result) => {
          expect(typeof result.comment_id).toBe("number");
          expect(typeof result.votes).toBe("number");
          expect(typeof result.created_at).toBe("string");
          expect(typeof result.author).toBe("string");
          expect(typeof result.body).toBe("string");
          expect(typeof result.article_id).toBe("number");
        });
      });
  });
  test("GET:400 - Returns a 400 error when given an invalid URL endpoint, with comments endpoint", () => {
    return request(app)
      .get("/api/articles/seven/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("GET:404 - Returns a 404 error when specified article does not exist, with comments endpoint", () => {
    return request(app)
      .get("/api/articles/666/comments")
      .expect(404)
      .then((body) => {
        expect(body.text).toBe("Article Not Found");
      });
  });
});
