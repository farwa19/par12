CREATE TABLE blogs (

    id SERIAL PRIMARY KEY,

    author text ,

    url text NOT NULL,

    title text NOT NULL,likes integer default 0

);
CREATE TABLE
INSERT INTO blogs (author, url, title)
VALUES ('Farwa', 'https://example.com', 'My First Blog');
INSERT INTO blogs (author, url, title, likes)
VALUES
('blog1', 'https://reactpatterns.com/', 'React Patterns', 5),
('blog2', 'https://overreacted.io/', 'Overreacted', 10);
SELECT * FROM blogs;
