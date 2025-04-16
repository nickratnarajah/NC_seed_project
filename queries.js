const db = require('./db/connection')

/* 
Get all of the users
Get all of the articles where the topic is coding
Get all of the comments where the votes are less than zero
Get all of the topics
Get all of the articles by user grumpy19
Get all of the comments that have more than 10 votes.
*/

db.query('SELECT * FROM users;')
  .then((result) => {
    console.log(result.rows); // This is an array of user objects
  })
  .catch((err) => {
    console.error('Error querying users:', err);
  });


  db.query("SELECT title FROM articles WHERE topic = 'coding';")
  .then((result) => {
    console.log(result.rows); // This is an array of user objects
  })
  .catch((err) => {
    console.error('Error querying users:', err);
  });
  

  db.query("SELECT * FROM comments WHERE votes < 0;")
  .then((result) => {
    console.log(result.rows); // This is an array of user objects
  })
  .catch((err) => {
    console.error('Error querying users:', err);
  });

  db.query("SELECT * FROM topics;")
  .then((result) => {
    console.log(result.rows); // This is an array of user objects
  })
  .catch((err) => {
    console.error('Error querying users:', err);
  });

  db.query("SELECT title FROM articles WHERE author = 'grumpy19';")
  .then((result) => {
    console.log(result.rows); // This is an array of user objects
  })
  .catch((err) => {
    console.error('Error querying users:', err);
  });

  db.query("SELECT * FROM comments WHERE votes > 0;")
  .then((result) => {
    console.log(result.rows); // This is an array of user objects
  })
  .catch((err) => {
    console.error('Error querying users:', err);
  });