handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    } else {
      next(err);
    }
  };
  
  handlePsqlErrors = (err, req, res, next) => {
    const psqlErrorCodes = {
      '22P02': 'Invalid input syntax',
      '23503': 'Foreign key violation',
      '42703': 'Column does not exist'
    };
  
    if (psqlErrorCodes[err.code]) {
      res.status(400).send({ msg: psqlErrorCodes[err.code] });
    } else {
      next(err);
    }
  };
  
  handleServerErrors = (err, req, res, next) => {
    console.error(err); // log full error for debugging
    res.status(500).send({ msg: 'Internal Server Error' });
  };
  
  handlePathNotFound = (req, res, next) => {
    next({ status: 404, msg: "Path not found" });
  };
  

  module.exports = { handleCustomErrors, handlePsqlErrors, handleServerErrors, handlePathNotFound } 