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
  describe("GET METHODS", () => {
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
            expect(typeof article.comment_count).toBe("string");
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
    test("GET:200 - Return an (empty) array when specified article has no comments", () => {
      return request(app)
        .get("/api/articles/7/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments.length).toBe(0);
          expect(Array.isArray(body.comments)).toBe(true);
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
    test("GET:200 - Returns all articles sorted/ordered by default (created_at/desc)", () => {
      return request(app)
        .get("/api/articles?sort_by=created_at&order=desc")
        .expect(200)
        .then((body) => {
          expect(body.body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
          expect(body.body.articles).not.toBeSortedBy("topic", {
            descending: false,
          });
        });
    });
    test("GET:200 - Returns all articles sorted/ordered by specified criteria", () => {
      return request(app)
        .get("/api/articles?sort_by=title&order=asc")
        .expect(200)
        .then((body) => {
          expect(body.body.articles).toBeSortedBy("title", {
            descending: false,
          });
          expect(body.body.articles).not.toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("GET:400 - Returns an error when given an invalid sort_by", () => {
      return request(app)
        .get("/api/articles?sort_by=theme")
        .expect(400)
        .then((body) => {
          expect(body.text).toBe("Bad Request");
        });
    });
    test("GET:400 - Returns an error when given an invalid order", () => {
      return request(app)
        .get("/api/articles?order=alphabetical")
        .expect(400)
        .then((body) => {
          expect(body.text).toBe("Bad Request");
        });
    });
    test("GET:200 - Returns all articles filtered by specified topic", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then((body) => {
          body.body.articles.forEach((article) => {
            expect(article.topic).toBe("mitch");
          });
        });
    });
    test("GET:400 - Returns an error when given an invalid topic", () => {
      return request(app)
        .get("/api/articles?topic=rosesrows")
        .expect(400)
        .then((body) => {
          expect(body.text).toBe("Bad Request");
        });
    });
    test("GET:200 - Returns the provided article, with a comment_count section", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          body.article.forEach((result) => {
            expect(result).toHaveProperty("comment_count");
            expect(result.comment_count).toEqual("11");
          });
        });
    });
  });

  describe("POST METHODS", () => {
    test("POST:201 - Posts a comment to the specified article", () => {
      const newPost = { username: "butter_bridge", body: "TL;DR!" };
      return request(app)
        .post("/api/articles/2/comments")
        .send(newPost)
        .expect(201)
        .then((result) => {
          expect(result.body.comment.body).toEqual(newPost.body);
          expect(result.body.comment.author).toEqual(newPost.username);
          expect(result.body.comment.article_id).toBe(2);
        });
    });
    test("POST:400 - Responds with an error message when given insufficient post data", () => {
      const newPost = { username: "butter_bridge" };
      return request(app)
        .post("/api/articles/2/comments")
        .send(newPost)
        .expect(400)
        .then((result) => {
          expect(result.body.msg).toBe("Bad Request");
        });
    });
    test("POST:400 - Responds with an error message when given invalid data entry for ID", () => {
      const newPost = { username: "butter_bridge", body: "AAAAAAAAHHH!" };
      return request(app)
        .post("/api/articles/The-Number-Two/comments")
        .send(newPost)
        .expect(400)
        .then((result) => {
          expect(result.body.msg).toBe("Bad Request");
        });
    });
    test("POST:400 - Responds with an error message when username is not found", () => {
      const newPost = { username: "MrCodez", body: "AAAAAAAAHHH!" };
      return request(app)
        .post("/api/articles/2/comments")
        .send(newPost)
        .expect(400)
        .then((result) => {
          expect(result.body.msg).toBe("User Not Found");
        });
    });
    test("POST:400 - Responds with an error message when username is invalid", () => {
      const newPost = { username: true, body: "AAAAAAAAHHH!" };
      return request(app)
        .post("/api/articles/2/comments")
        .send(newPost)
        .expect(400)
        .then((result) => {
          expect(result.body.msg).toBe("User Not Found");
        });
    });
    test("POST:404 - Responds with an error message when article is not found", () => {
      const newPost = { username: "butter_bridge", body: "Hello!" };
      return request(app)
        .post("/api/articles/0161/comments")
        .send(newPost)
        .expect(404)
        .then((result) => {
          expect(result.body.msg).toBe("Article Not Found");
        });
    });
    test("POST:201 - Posts a new article", () => {
      const newPost = {
        author: "lurker",
        title: "SQL for Cats",
        body: "This is how to teach SQL to your cat",
        topic: "cats",
      };
      return request(app)
        .post("/api/articles")
        .send(newPost)
        .expect(201)
        .then((result) => {
          expect(result.body.article.body).toEqual(newPost.body);
          expect(result.body.article.author).toEqual(newPost.author);
          expect(result.body.article).toHaveProperty(
            "article_id",
            "title",
            "topic",
            "author",
            "body",
            "created_at",
            "votes",
            "article_img_url"
          );
        });
    });
    test("POST:400 - Responds with an error when given insufficient data fields", () => {
      const newPost = {
        author: "lurker",
        title: "SQL for Cats",
      };
      return request(app)
        .post("/api/articles")
        .send(newPost)
        .expect(400)
        .then((result) => {
          expect(result.text).toBe("Insufficient Post Data");
        });
    });
  });

  describe("PATCH METHODS", () => {
    test("PATCH:200 - Responds with an updated article vote count", () => {
      const newPatch = { inc_votes: 3 };
      return request(app)
        .patch("/api/articles/1")
        .send(newPatch)
        .expect(200)
        .then((result) => {
          expect(result.body.article.votes).toBe(103);
        });
    });
    test("PATCH:200 - Responds with an updated article vote count when given a subtraction", () => {
      const newPatch = { inc_votes: -6 };
      return request(app)
        .patch("/api/articles/4")
        .send(newPatch)
        .expect(200)
        .then((result) => {
          expect(result.body.article.votes).toBe(-6);
        });
    });
    test("PATCH:404 - Responds with an error when the article is not found", () => {
      const newPatch = { inc_votes: 3 };
      return request(app)
        .patch("/api/articles/455")
        .send(newPatch)
        .expect(404)
        .then((result) => {
          expect(result.text).toBe("Article Not Found");
        });
    });
    test("PATCH:400 - Responds with an error when the given article is invalid", () => {
      const newPatch = { inc_votes: 3 };
      return request(app)
        .patch("/api/articles/sixteen")
        .send(newPatch)
        .expect(400)
        .then((result) => {
          expect(result.body.msg).toBe("Bad Request");
        });
    });
  });

  describe("PAGINATION TESTS", () => {
    test("GET:200 - Test for pagination implementation (default limit 10)", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((result) => {
          expect(result.body.articles.length).toBe(10);
        });
    });

    test("GET:200 - Test for pagination implementation (limit 5)", () => {
      return request(app)
        .get("/api/articles?limit=5")
        .expect(200)
        .then((result) => {
          expect(result.body.articles.length).toBe(5);
        });
    });

    test("GET:200 - Test for pagination implementation", () => {
      return request(app)
        .get("/api/articles?limit=5&page=3")
        .expect(200)
        .then((result) => {
          expect(result.body.articles.length).toBe(3);
        });
    });

    test("GET:200 - Test for pagination implementation - added total_count", () => {
      return request(app)
        .get("/api/articles?limit=5&page=3")
        .expect(200)
        .then((result) => {
          expect(result.body.total_count).toBe(13);
        });
    });

    test("GET:200 - Test for pagination implementation - total_count with filters", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then((result) => {
          expect(result.body.total_count).toBe(1);
        });
    });
    test("GET:400 - Returns an error when the page/offset is too high", () => {
      return request(app)
        .get("/api/articles?page=43")
        .expect(400)
        .then((result) => {
          expect(result.text).toBe("Bad Request");
        });
    });
  });
});

describe("Comments endpoint", () => {
  describe("DELETE METHODS", () => {
    test("DELETE:204 - Deletes the specified comment (by comment ID)", () => {
      return request(app).delete("/api/comments/4").expect(204);
    });
    test("DELETE:400 - Returns an error message if the specified comment is invalid", () => {
      return request(app)
        .delete("/api/comments/Ninety-Two")
        .expect(400)
        .then((result) => {
          expect(result.body.msg).toBe("Bad Request");
        });
    });
    test("DELETE:404 - Returns an error message if the specified comment does not exist", () => {
      return request(app)
        .delete("/api/comments/95")
        .expect(404)
        .then((result) => {
          expect(result.text).toBe("Comment Not Found");
        });
    });
  });
  describe("PATCH METHODS", () => {
    test("PATCH:200 - Responds with an updated comment with vote count", () => {
      const newPatch = { inc_votes: 3 };
      return request(app)
        .patch("/api/comments/2")
        .send(newPatch)
        .expect(200)
        .then((result) => {
          expect(result.body.comment.votes).toBe(17);
        });
    });

    test("PATCH:400 - Responds with an error when given an invalid comment_id", () => {
      const newPatch = { inc_votes: 3 };
      return request(app)
        .patch("/api/comments/six")
        .send(newPatch)
        .expect(400)
        .then((result) => {
          expect(result.body.msg).toBe("Bad Request");
        });
    });

    test("PATCH:404 - Responds with an error when the comment is not found", () => {
      const newPatch = { inc_votes: 3 };
      return request(app)
        .patch("/api/comments/455")
        .send(newPatch)
        .expect(404)
        .then((result) => {
          expect(result.text).toBe("Comment Not Found");
        });
    });
  });
});

describe("Users endpoint", () => {
  test("GET:200 - Returns all users in an array", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((result) => {
        result.body.users.forEach((user) => {
          expect(user).toHaveProperty("username", "name", "avatar_url");
        });
      });
  });
  test("GET:200 - Returns a single user by specified username", () => {
    return request(app)
      .get("/api/users/lurker")
      .expect(200)
      .then((result) => {
        expect(result.body.user.username).toBe("lurker");
        expect(result.body.user).toHaveProperty(
          "username",
          "name",
          "avatar_url"
        );
      });
  });
  test("GET:404 - Returns a 404 when the user is not found", () => {
    return request(app)
      .get("/api/users/soggy_doggy")
      .expect(404)
      .then((body) => {
        expect(body.text).toBe("User Not Found");
      });
  });
});
