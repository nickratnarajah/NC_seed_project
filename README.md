# NC News Seeding

Hosted Version:
https://nick-nc-news-first-project.onrender.com/api
Visit the API endpoint to view available routes and their descriptions


Summary:
NC News is a RESTful API that provides news articles, topics, comments, and users. It was built as a backend project to develop skills in:

* Express.js and RESTful routing;
* PostgreSQL and advanced SQL queries;
* Test-Driven Development using Jest and Supertest
* Error handling and validation
* Deployment with Render



Getting Started: 
1. Clone the Repository
git clone https://github.com/your-username/nc-news.git
cd nc-news

2. Install Dependencies
npm install



Running Tests:
To run all tests: npm test
Tests are written using Jest and Supertest.



Environment Variables: 
You will need to create two .env files in the root of the project:

* .env.test (for the test database).
* .env.development (for the development database).


Seeding the Database:
To set up and seed the development database:
npm run setup-dbs
npm run seed



Minimum versions required:
Postgres: 8.13.3
Node: 23.9.0