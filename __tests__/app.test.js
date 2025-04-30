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