-- ========================================
-- Insertion de données de test (seed)
-- ========================================

-- ========================================
-- Insertion des utilisateurs
-- ========================================
-- Note: Les mots de passe doivent être hashés dans une vraie application
-- Ici, ce sont des exemples pour le développement
INSERT INTO "user" (username, email, password, is_admin) VALUES
    ('admin', 'admin@bookstore.com', '$argon2id$v=19$m=65536,t=3,p=4$ZTk68lJB+NpoahoZsjXkYQ$I+9rSlKy++ew85XhHSIqMf6oCKNcJxepcRS+sH3DR/I', TRUE),
    ('john_doe', 'john.doe@email.com', '$argon2id$v=19$m=65536,t=3,p=4$ZTk68lJB+NpoahoZsjXkYQ$I+9rSlKy++ew85XhHSIqMf6oCKNcJxepcRS+sH3DR/I', FALSE),
    ('jane_smith', 'jane.smith@email.com', '$2b$10$examplehash3', FALSE),
    ('book_lover', 'booklover@email.com', '$2b$10$examplehash4', FALSE),
    ('marie_durand', 'marie.durand@email.com', '$2b$10$examplehash5', FALSE);

-- ========================================
-- Insertion des auteurs
-- ========================================
INSERT INTO author (name, forname) VALUES
    ('Rowling', 'J.K.'),
    ('Tolkien', 'J.R.R.'),
    ('Martin', 'George R.R.'),
    ('Orwell', 'George'),
    ('Austen', 'Jane'),
    ('Hemingway', 'Ernest'),
    ('Garcia Márquez', 'Gabriel'),
    ('Murakami', 'Haruki'),
    ('Atwood', 'Margaret'),
    ('Hugo', 'Victor'),
    ('Dumas', 'Alexandre'),
    ('Camus', 'Albert'),
    ('Proust', 'Marcel'),
    ('Zola', 'Émile');

-- ========================================
-- Insertion des genres/categories
-- ========================================
INSERT INTO category (name) VALUES
    ('Fantasy'),
    ('Science-Fiction'),
    ('Romance'),
    ('Thriller'),
    ('Mystery'),
    ('Horror'),
    ('Historical Fiction'),
    ('Biography'),
    ('Self-Help'),
    ('Poetry'),
    ('Drama'),
    ('Adventure'),
    ('Classic'),
    ('Dystopian'),
    ('Contemporary');

-- ========================================
-- Insertion des livres
-- ========================================
INSERT INTO book (title, summary, date_parution, image_url) VALUES
    ('Harry Potter and the Philosopher''s Stone', 'Un jeune sorcier découvre son destin magique.', '1997-06-26', 'image_1.png'),
    ('The Lord of the Rings', 'Une quête épique pour détruire un anneau maléfique.', '1954-07-29', 'image_2.png'),
    ('A Game of Thrones', 'Intrigues politiques dans un monde médiéval fantastique.', '1996-08-06', 'image_3.png'),
    ('1984', 'Une vision dystopique d''un futur totalitaire.', '1949-06-08', 'image_1.png'),
    ('Pride and Prejudice', 'Romance et société dans l''Angleterre du 19ème siècle.', '1813-01-28', 'image_2.png'),
    ('The Old Man and the Sea', 'Un vieux pêcheur affronte un marlin géant.', '1952-09-01', 'image_3.png'),
    ('One Hundred Years of Solitude', 'L''histoire de la famille Buendía sur plusieurs générations.', '1967-05-30', 'image_1.png'),
    ('Norwegian Wood', 'Une histoire d''amour et de perte dans le Japon des années 60.', '1987-09-04', 'image_2.png'),
    ('The Handmaid''s Tale', 'Une dystopie féministe sur une théocratie totalitaire.', '1985-08-17', 'image_3.png'),
    ('Les Misérables', 'L''histoire de Jean Valjean et de la rédemption.', '1862-04-03', 'image_1.png'),
    ('The Three Musketeers', 'Aventures de d''Artagnan et ses compagnons mousquetaires.', '1844-07-01', 'image_2.png'),
    ('The Stranger', 'Un homme confronté à l''absurdité de l''existence.', '1942-06-15', 'image_3.png'),
    ('In Search of Lost Time', 'Une exploration de la mémoire et du temps.', '1913-11-14', 'image_1.png'),
    ('Germinal', 'La lutte des mineurs pour de meilleures conditions de vie.', '1885-03-02', 'image_2.png');

-- ========================================
-- Insertion des relations livre-auteur
-- ========================================
INSERT INTO book_author (book_id, author_id) VALUES
    (1, 1),  -- Harry Potter par J.K. Rowling
    (2, 2),  -- LOTR par Tolkien
    (3, 3),  -- Game of Thrones par Martin
    (4, 4),  -- 1984 par Orwell
    (5, 5),  -- Pride and Prejudice par Austen
    (6, 6),  -- Old Man and the Sea par Hemingway
    (7, 7),  -- One Hundred Years par Garcia Márquez
    (8, 8),  -- Norwegian Wood par Murakami
    (9, 9),  -- Handmaid's Tale par Atwood
    (10, 10), -- Les Misérables par Hugo
    (11, 11), -- Three Musketeers par Dumas
    (12, 12), -- The Stranger par Camus
    (13, 13), -- In Search of Lost Time par Proust
    (14, 14); -- Germinal par Zola

-- ========================================
-- Insertion des relations livre-genre
-- ========================================
INSERT INTO book_category (book_id, category_id) VALUES
    -- Harry Potter
    (1, 1),  -- Fantasy
    (1, 12), -- Adventure
    -- LOTR
    (2, 1),  -- Fantasy
    (2, 12), -- Adventure
    (2, 13), -- Classic
    -- Game of Thrones
    (3, 1),  -- Fantasy
    (3, 11), -- Drama
    -- 1984
    (4, 2),  -- Science-Fiction
    (4, 14), -- Dystopian
    (4, 13), -- Classic
    -- Pride and Prejudice
    (5, 3),  -- Romance
    (5, 13), -- Classic
    (5, 7),  -- Historical Fiction
    -- Old Man and the Sea
    (6, 13), -- Classic
    (6, 12), -- Adventure
    -- One Hundred Years of Solitude
    (7, 13), -- Classic
    (7, 7),  -- Historical Fiction
    -- Norwegian Wood
    (8, 3),  -- Romance
    (8, 15), -- Contemporary
    -- Handmaid's Tale
    (9, 2),  -- Science-Fiction
    (9, 14), -- Dystopian
    -- Les Misérables
    (10, 13), -- Classic
    (10, 7),  -- Historical Fiction
    (10, 11), -- Drama
    -- Three Musketeers
    (11, 12), -- Adventure
    (11, 7),  -- Historical Fiction
    (11, 13), -- Classic
    -- The Stranger
    (12, 13), -- Classic
    (12, 11), -- Drama
    -- In Search of Lost Time
    (13, 13), -- Classic
    -- Germinal
    (14, 13), -- Classic
    (14, 7),  -- Historical Fiction
    (14, 11); -- Drama

-- ========================================
-- Insertion des statuts de lecture des utilisateurs
-- ========================================
INSERT INTO user_book (user_id, book_id, status) VALUES
    -- John Doe
    (2, 1, 'lu'),
    (2, 2, 'en cours'),
    (2, 4, 'à lire'),
    -- Jane Smith
    (3, 1, 'lu'),
    (3, 5, 'lu'),
    (3, 8, 'en cours'),
    (3, 9, 'à lire'),
    -- Book Lover
    (4, 1, 'lu'),
    (4, 2, 'lu'),
    (4, 3, 'lu'),
    (4, 4, 'lu'),
    (4, 6, 'en cours'),
    (4, 7, 'à lire'),
    (4, 10, 'à lire'),
    -- Marie Durand
    (5, 5, 'lu'),
    (5, 10, 'lu'),
    (5, 11, 'en cours'),
    (5, 14, 'à lire');


