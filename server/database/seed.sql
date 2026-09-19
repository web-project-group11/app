-- Test users
-- Test users
INSERT INTO public."account" (email, hashed_password, username)
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
INSERT INTO public.review (user_id, movie_id, type, grade, description)
VALUES
    (1, 1368337, 'movie', 5, 'Todella hyvä elokuva.'),
    (2, 1368337, 'movie', 4, NULL),
    (3, 1368337, 'movie', 5, 'Loistava elokuva.'),
    (4, 1368337, 'movie', 3, NULL),
    (5, 1368337, 'movie', 4, 'Hyvä kokonaisuus.'),
    (6, 1368337, 'movie', 5, NULL),
    (7, 1368337, 'movie', 4, 'Viihdyttävä ja hyvin tehty.'),
    (8, 1368337, 'movie', 3, NULL),
    (9, 1368337, 'movie', 5, 'Todella onnistunut elokuva.'),
    (10, 1368337, 'movie', 4, NULL);

    -- Test Reviews for TV series with ID 5920
INSERT INTO public.review (user_id, movie_id, type, grade, description)
VALUES
    (1, 5920, 'tv', 5, 'Koukuttava ja erittäin hyvin toteutettu sarja.'),
    (2, 5920, 'tv', 4, 'Juoni toimi hyvin ja hahmot olivat kiinnostavia.'),
    (3, 5920, 'tv', 5, NULL),
    (4, 5920, 'tv', 3, 'Ihan hyvä, mutta kaikki jaksot eivät vakuuttaneet.'),
    (5, 5920, 'tv', 4, NULL),
    (6, 5920, 'tv', 5, 'Jaksot tuli katsottua nopeasti yksi toisensa jälkeen.'),
    (7, 5920, 'tv', 4, 'Mielenkiintoinen juoni ja sopivasti jännitystä.'),
    (8, 5920, 'tv', 3, NULL),
    (9, 5920, 'tv', 5, 'Todella koukuttava ja viihdyttävä kokonaisuus.'),
    (10, 5920, 'tv', 4, 'Hyvä sarja, jonka parissa viihtyi hyvin.');