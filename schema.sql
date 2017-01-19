DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS entries;
DROP TABLE IF EXISTS conditions;

CREATE TABLE users (
id SERIAL PRIMARY KEY,
email VARCHAR(250) UNIQUE NOT NULL,
password_digest VARCHAR(100) NOT NULL
);

CREATE TABLE entries (
id SERIAL PRIMARY KEY UNIQUE NOT NULL,
users_id NUMBER,
entry VARCHAR(5000),
FOREIGN KEY (users_id) REFERENCES users (id)
);

CREATE TABLE conditions (
id SERIAL PRIMARY KEY UNIQUE NOT NULL,
users_id NUMBER,
condition VARCHAR(2000),
FOREIGN KEY (users_id) REFERENCES users (id)
)
