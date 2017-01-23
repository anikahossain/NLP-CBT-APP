DROP TABLE IF EXISTS entries;
DROP TABLE IF EXISTS users;



CREATE TABLE users (
id SERIAL PRIMARY KEY,
email VARCHAR(250) UNIQUE NOT NULL,
password_digest VARCHAR(100) NOT NULL
);

CREATE TABLE entries (
id SERIAL PRIMARY KEY UNIQUE NOT NULL,
users_id INTEGER,
entry TEXT,
time_stamp VARCHAR(15),
FOREIGN KEY (users_id) REFERENCES users (id)
);








INSERT INTO users (email, password_digest) VALUES ('h@test.com', 'hello123');
INSERT INTO entries (users_id, entry, time_stamp) VALUES (1, 'blah', '9');

