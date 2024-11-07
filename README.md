This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)

All work was completed independently, using the skills that have been taught in the last six weeks.

This project aims to mimic the basic functionality of a text-based forum site, such as Reddit.
This database holds ficticious information about articles, comments, and users, which can then be interacted with by using SQL and JavaScript methods.

---

To clone this repo:

- Select the green "code" button on the repo's homepage and copy the URL provided
- Open up the preferred CLI and type "git clone <COPIED_URL>"
- Navigate to the newly-cloned directory, and type "npm install" to install the required npm packages
- Create two ".env" files in the root of the directory. Title these ".env.development" and ".env.test"

  **This repo contains no private information, as such, the [setup.sql] file contains the database names. This set-up should be amended outside of a learning environment**

- In each .env file, create a variable called "PGDATABASE=", with the following value being the <database_name>, or <database_name_test> respectively.
- To set-up, seed, and test; run the following commands: "npm run setup-dbs" , "npm run seed" , "npm test"

---

List of DevDependencies - Husky, Jest, Jest-Extended

---

List of Dependencies - Dotenv, Express, Jest-Sorted, PG, PG-Format, Supertest

---

Using Supabase and Render, this project has been made live and can be viewed by affixing the appropriate endpoint onto the following link:
https://lb-nc-news.onrender.com/api

A hosted / front end version can be viewed by clicking the link below:
https://lb-nc-news-frontend.netlify.app/

---

Recommended minimum version of Node.js: v20.12.2
Recommended minimum version of Postgres: 8.13.0
