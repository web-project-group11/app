-- Test users
INSERT INTO public."user" (email, hashed_password, username)
VALUES
    ('alice@example.com', 'testhash1', 'alice'),
    ('bob@example.com', 'testhash2', 'bob'),
    ('charlie@example.com', 'testhash3', 'charlie'),
    ('david@example.com', 'testhash4', 'david'),
    ('emma@example.com', 'testhash5', 'emma'),
    ('frank@example.com', 'testhash6', 'frank'),
    ('grace@example.com', 'testhash7', 'grace'),
    ('henry@example.com', 'testhash8', 'henry'),
    ('isla@example.com', 'testhash9', 'isla'),
    ('jack@example.com', 'testhash10', 'jack');

-- Test Reviews for movie with ID 1368337
INSERT INTO public.review (user_id, movie_id, grade, description)
VALUES
    (1, 1368337, 5, 'Todella hyvä elokuva.'),
    (2, 1368337, 4, NULL),
    (3, 1368337, 5, 'Loistava elokuva.'),
    (4, 1368337, 3, NULL),
    (5, 1368337, 4, 'Hyvä kokonaisuus.'),
    (6, 1368337, 5, NULL),
    (7, 1368337, 4, 'Viihdyttävä ja hyvin tehty.'),
    (8, 1368337, 3, NULL),
    (9, 1368337, 5, 'Todella onnistunut elokuva.'),
    (10, 1368337, 4, NULL);