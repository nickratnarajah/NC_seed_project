const handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    } else {
      next(err);
    }
  };
  
  const handlePsqlErrors = (err, req, res, next) => {
    const psqlErrorCodes = {
      '22P02': 'Invalid request',
      '23503': 'Foreign key violation',
      '42703': 'Column does not exist'
    };
  
    if (psqlErrorCodes[err.code]) {
      if (err.constraint === 'comments_article_id_fkey') {
        return res.status(404).send({ msg: 'Article not found' })
      }
      if (err.constraint === 'comments_author_fkey') {
        return res.status(400).send({ msg: "invalid username" })
      }
      res.status(400).send({ msg: psqlErrorCodes[err.code] });
    } else {
      next(err);
    }
  };
  
 const handleServerErrors = (err, req, res, next) => {
    console.error(err); // log full error for debugging
    res.status(500).send({ msg: 'Internal Server Error' });
  };
  
 const handlePathNotFound = (req, res, next) => {
    next({ status: 404, msg: "Path not found" });
  };
  
  const checkNewVotesValid = (newVotes) => {
    if (!newVotes.inc_votes) {
      return Promise.reject({ status: 400, msg: "Invalid request" });
    }
    if (typeof newVotes.inc_votes !== 'number') {
      return Promise.reject({ status: 400, msg: "New Votes must be a number" })
    }
    return Promise.resolve()
  }

  const checkValidParams = (reqQuery) => {
    if (!reqQuery) {
      return Promise.resolve()
    }
      else {const { sort_by, order, topic, limit, page } = reqQuery
    const validParams = ["sort_by", "order", "topic", "limit", "p"]

    const invalidParams = Object.keys(reqQuery).filter(
      (key) => !validParams.includes(key)
    );

    if (invalidParams.length > 0) {
      return Promise.reject({
        status: 400,
        msg: "Invalid sort query"});
    }

    // Otherwise, resolve
    return Promise.resolve();
  }
};

const checkArticleValid = (newArticle) => {
  const requiredFields = {
    author: "author",
    title: "title",
    body: "body",
    topic: "topic",
    article_img_url: "image url"
  };

  for (const [field, name] of Object.entries(requiredFields)) {
    if (!newArticle[field]) {
      return Promise.reject({
        status: 400,
        msg: `New article must have ${name}`
      });
    }
  }

  return Promise.resolve();
};


  module.exports = { handleCustomErrors, handlePsqlErrors, handleServerErrors, handlePathNotFound, checkNewVotesValid, checkValidParams, checkArticleValid } 