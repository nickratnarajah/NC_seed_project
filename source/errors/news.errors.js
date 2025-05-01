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
  



  module.exports = { handleCustomErrors, handlePsqlErrors, handleServerErrors, handlePathNotFound } 