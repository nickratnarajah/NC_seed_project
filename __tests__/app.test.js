const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const data = require('../db/data/test-data');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const request = require('supertest');
const app = require('../source/api');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});
describe("GET /api/topics", () => {
  test("200: responds with an array of topic objects", () => {
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then(({body: { topics }}) => {
      expect(Array.isArray(topics)).toBe(true)
    })
  })
  test("200: each object has slug and description properties", () => {
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then(({body: { topics }}) => {
      topics.forEach((topic) => {
        expect(topic).toHaveProperty("slug");
        expect(topic).toHaveProperty("description");
        expect(typeof topic.slug).toBe("string");
        expect(typeof topic.description).toBe("string");
      })
    })
  })
  test("404: responds with an error message if the endpoint is not found", () => {
    return request(app)
    .get("/api/topiccs")
    .expect(404)
    .then((body) => {
      expect(body.body.msg).toBe("Path not found")
    })
  })
})

describe("GET /api/articles/:article_id", () => {
  test("200: responds with an array of articles if no id", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body: { articles }}) => {
      expect(Array.isArray(articles)).toBe(true)
    })
  })
  test("200: responds with an article object with the correct properties", () => {
    return request(app)
    .get("/api/articles/1")
    .expect(200)
    .then(({ body: { article }}) => {
      expect(article).toHaveProperty("author");
      expect(article).toHaveProperty("title");
      expect(article).toHaveProperty("article_id");
      expect(article).toHaveProperty("body");
      expect(article).toHaveProperty("topic");
      expect(article).toHaveProperty("created_at");
      expect(article).toHaveProperty("votes");
      expect(article).toHaveProperty("article_img_url");
      expect(typeof article.author).toBe("string");
      expect(typeof article.title).toBe("string");
      expect(typeof article.article_id).toBe("number");
      expect(typeof article.body).toBe("string");
      expect(typeof article.topic).toBe("string");
      expect(typeof article.created_at).toBe("string");
      expect(typeof article.votes).toBe("number");
      expect(typeof article.article_img_url).toBe("string");
    })
  })
  //article id is invalid type
  test("400: responds with an error message", () => {
    return request(app)
    .get("/api/articles/a")
    .expect(400)
    .then(({body: { msg }}) => {
      expect(msg).toBe("Invalid input syntax")
    })
  })
  //article id is out of range
  test("404: responds with an error message", () => {
    return request(app)
    .get("/api/articles/1000")
    .expect(404)
    .then(({body: { msg }}) => {
      expect(msg).toBe("Article not found")
    })
  })
  //typo in the endpoint
  test("404: responds with an error message", () => {
    return request(app)
    .get("/api/articless/1")
    .expect(404)
    .then(({body: { msg }}) => {
      expect(msg).toBe("Path not found")
    })
  })
})