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
      expect(msg).toBe("Invalid request")
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
describe("GET /api/articles", () => {
  test("200: responds with an array of articles if no id", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body: { articles }}) => {
      expect(Array.isArray(articles)).toBe(true)
    })
  })
  test("200: responds with an array of objects each with the correct properties", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body: { articles }}) => {
      articles.forEach((article) => {
        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("article_id");
        expect(article).toHaveProperty("comment_count");
        expect(article).toHaveProperty("topic");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes");
        expect(article).toHaveProperty("article_img_url");
        expect(typeof article.author).toBe("string");
        expect(typeof article.title).toBe("string");
        expect(typeof article.article_id).toBe("number");
        expect(typeof article.comment_count).toBe("number");
        expect(typeof article.topic).toBe("string");
        expect(typeof article.created_at).toBe("string");
        expect(typeof article.votes).toBe("number");
        expect(typeof article.article_img_url).toBe("string");
      })
    })
   })
   test("200: responds with articles sorted by date in descending order", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body: { articles }}) => {
      const sortedArticles = [...articles].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      expect(articles).toEqual(sortedArticles);
    })
   })
   //typo in the endpoint
  test("404: responds with an error message", () => {
    return request(app)
    .get("/api/articless")
    .expect(404)
    .then(({body: { msg }}) => {
      expect(msg).toBe("Path not found")
    })
  })
 })

 describe("GET /api/articles/:article_id/comments", () => {
  test("200 responds with an array of comments for the given article_id", () => {
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(({body: { comments }}) => {
      comments.forEach((comment) => {
        expect(comment).toHaveProperty("author");
        expect(comment).toHaveProperty("comment_id");
        expect(comment).toHaveProperty("article_id");
        expect(comment).toHaveProperty("body");
        expect(comment).toHaveProperty("created_at");
        expect(comment).toHaveProperty("votes");
        expect(typeof comment.author).toBe("string");
        expect(typeof comment.comment_id).toBe("number");
        expect(typeof comment.article_id).toBe("number");
        expect(typeof comment.body).toBe("string");
        expect(typeof comment.created_at).toBe("string");
        expect(typeof comment.votes).toBe("number");
      })
    })
  })
  test("200: responds with comments sorted by date in descending order", () => {
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(({body: { comments }}) => {
      const sortedComments = [...comments].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      expect(comments).toEqual(sortedComments);
    })
  })
  test("400: responds with error message if no article_id", () => {
    return request(app)
    .get("/api/articles/comments")
    .expect(400)
    .then(({body: { msg }}) => {
      expect(msg).toBe("Invalid request")
    })
  })
  test("404: responds with error message if out of range article_id", () => {
    return request(app)
    .get("/api/articles/1000/comments")
    .expect(404)
    .then(({body: { msg }}) => {
      expect(msg).toBe("Article not found")
    })
  })
  test("200: responds with no comments yet message if article exists but no comments", () => {
    return request(app)
    .get("/api/articles/2/comments")
    .expect(200)
    .then(({body: { msg }}) => {
      expect(msg).toBe("No comments yet")
    })
  })
 })

 describe("POST /api/articles/:article_id/comments", () => {
  test("201: responds with the posted comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "test database comment for task 6"
    }
    return request(app)
    .post("/api/articles/1/comments")
    .send(newComment)
    .expect(201)
    .then(({body: { comment }}) => {
      expect(comment).toHaveProperty("author");
      expect(comment).toHaveProperty("comment_id");
      expect(comment).toHaveProperty("body");
      expect(comment).toHaveProperty("created_at");
      expect(typeof comment.comment_id).toBe("number");
      expect(typeof comment.author).toBe("string");
      expect(typeof comment.body).toBe("string");
      expect(typeof comment.created_at).toBe("string");
    })
  })
  //error handling for invalid username
  test("400: responds with error message if invalid username", () => {
    const newComment = {
      username: "invalid_user",
      body: "this comment should not be posted"
    }
    return request(app)
    .post("/api/articles/1/comments")
    .send(newComment)
    .expect(400)
    .then(({body: { msg }}) => {
      expect(msg).toBe("invalid username")
    })
  })
  //error handling for invalid article_id
  test("404: responds with error message if invalid article_id", () => {
    const newComment = {
      username: "butter_bridge",
      body: "this comment should not be posted"
    }
    return request(app)
    .post("/api/articles/1000/comments")
    .send(newComment)
    .expect(404)
    .then(({body: { msg }}) => {
      expect(msg).toBe("Article not found")
    })
  })
 })

 describe("PATCH /api/articles/:article_id", () => {
  test("200: responds with the updated article object", () => {
    const newVote = {
      inc_votes: 10
    }
    return request(app)
    .patch("/api/articles/1")
    .send(newVote)
    .expect(200)
    .then(({body: { article }}) => {
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
        expect(typeof article.article_img_url).toBe("string")
    })
  })
  test("404: responds with error message if invalid article_id", () => {
    const newVote = {
      inc_votes: 10
    }
    return request(app)
    .patch("/api/articles/1000")
    .send(newVote)
    .expect(404)
    .then(({body: { msg }}) => {
      expect(msg).toBe("Article not found")
    })
  })
  test("400: responds with error message if inc_votes = NaN", () => {
    const newVote = {
      inc_votes: "anything other than a number"
    }
    return request(app)
    .patch("/api/articles/1")
    .send(newVote)
    .expect(400)
    .then(({body: { msg }}) => {
      expect(msg).toBe("New Votes must be a number")
    })
  })
 })

 describe("DELETE /api/comments/:comment_id", () => {
  test("204: responds with no content", () => {
    return request(app)
    .delete("/api/comments/1")
    .expect(204)
  })
  test("404: responds with error message if comment_id does not exist", () => {
    return request(app)
    .delete("/api/comments/1000")
    .expect(404)
    .then(({body: { msg }}) => {
      expect(msg).toBe("Comment not found")
    })
  })
  test("400: responds with error message if comment_id is invalid type", () => {
    return request(app)
    .delete("/api/comments/a")
    .expect(400)
    .then(({body: { msg }}) => {
      expect(msg).toBe("Invalid request")
    })
  })
 })

 describe("GET /api/users", () => {
  test("200: responds with an array of user objects", () => {
    return request(app)
    .get("/api/users")
    .expect(200)
    .then(({body: { users }}) => {
      expect(Array.isArray(users)).toBe(true)
      users.forEach((user) => {
        expect(user).toHaveProperty("username");
        expect(user).toHaveProperty("avatar_url");
        expect(user).toHaveProperty("name");
        expect(typeof user.username).toBe("string");
        expect(typeof user.avatar_url).toBe("string");
        expect(typeof user.name).toBe("string");
      })
    })
  })
  test("404: responds with error message if endpoint not found", () => {
    return request(app)
    .get("/api/user")
    .expect(404)
    .then(({body: { msg }}) => {
      expect(msg).toBe("Path not found")
    })
  })
  test("200: responds with a correct code and a message of no users yet if users table empty", () => {
    return db.query("DELETE FROM users")
    .then(() => {
      return request(app)
      .get("/api/users")
      .expect(200)
      .then(({body: { msg }}) => {
        expect(msg).toBe("No users yet")
      })
    })
  })
 })