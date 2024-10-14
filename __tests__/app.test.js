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
          expect(typeof result.author).toBe("string");
          expect(typeof result.title).toBe("string");
          expect(typeof result.article_id).toBe("number");
          expect(typeof result.body).toBe("string");
          expect(typeof result.topic).toBe("string");
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
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});
