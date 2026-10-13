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
    ('jack@example.com', 'testhash10', 'jack'),
    ('test@example.com', '$2b$10$Khk8KHdmVHbmfZED.vaafOxLniEHsHHLaAi6M/hxvEiQRdqsx45/u', 'test'),
    ('test2@example.com', '$2b$10$Khk8KHdmVHbmfZED.vaafOxLniEHsHHLaAi6M/hxvEiQRdqsx45/u', 'test2');

-- Test groups for the test and test2 accounts
INSERT INTO public."group" (owner_id, group_name, description)
VALUES
    ((SELECT id FROM public.account WHERE username = 'test'), 'Testin elokuvaryhmä', 'Ryhmä testikäyttäjän elokuva-arvosteluille.'),
    ((SELECT id FROM public.account WHERE username = 'test2'), 'Test2:n sarjaryhmä', 'Ryhmä test2-käyttäjän sarja-arvosteluille.');

-- Both test accounts belong to both groups; each owns one of them
INSERT INTO public.group_member (group_id, user_id, status)
VALUES
    ((SELECT id FROM public."group" WHERE group_name = 'Testin elokuvaryhmä'),
        (SELECT id FROM public.account WHERE username = 'test'), 'member'),
    ((SELECT id FROM public."group" WHERE group_name = 'Testin elokuvaryhmä'),
        (SELECT id FROM public.account WHERE username = 'test2'), 'member'),
    ((SELECT id FROM public."group" WHERE group_name = 'Test2:n sarjaryhmä'),
        (SELECT id FROM public.account WHERE username = 'test'), 'member'),
    ((SELECT id FROM public."group" WHERE group_name = 'Test2:n sarjaryhmä'),
        (SELECT id FROM public.account WHERE username = 'test2'), 'member');

-- Chat messages and a pending request for the test groups
INSERT INTO public.group_chat (group_id, user_id, message)
VALUES
    ((SELECT id FROM public."group" WHERE group_name = 'Testin elokuvaryhmä'),
        (SELECT id FROM public.account WHERE username = 'test'),
        'Mitä elokuvaa katsotaan seuraavaksi?'),
    ((SELECT id FROM public."group" WHERE group_name = 'Testin elokuvaryhmä'),
        (SELECT id FROM public.account WHERE username = 'test2'),
        'Voitaisiin valita jokin tämän viikon uusista elokuvista.'),
    ((SELECT id FROM public."group" WHERE group_name = 'Test2:n sarjaryhmä'),
        (SELECT id FROM public.account WHERE username = 'test2'),
        'Onko teillä suosituksia uudeksi sarjaksi?'),
    ((SELECT id FROM public."group" WHERE group_name = 'Test2:n sarjaryhmä'),
        (SELECT id FROM public.account WHERE username = 'test'),
        'Aloitetaan joku lyhyt ja koukuttava sarja.');

INSERT INTO public.group_member (group_id, user_id, status)
VALUES
    ((SELECT id FROM public."group" WHERE group_name = 'Testin elokuvaryhmä'),
        (SELECT id FROM public.account WHERE username = 'alice'), 'pending');

-- Add the other seeded testhash users as members of both groups
INSERT INTO public.group_member (group_id, user_id, status)
VALUES
    ((SELECT id FROM public."group" WHERE group_name = 'Testin elokuvaryhmä'),
        (SELECT id FROM public.account WHERE username = 'bob'), 'member'),
    ((SELECT id FROM public."group" WHERE group_name = 'Testin elokuvaryhmä'),
        (SELECT id FROM public.account WHERE username = 'charlie'), 'member'),
    ((SELECT id FROM public."group" WHERE group_name = 'Testin elokuvaryhmä'),
        (SELECT id FROM public.account WHERE username = 'david'), 'member'),
    ((SELECT id FROM public."group" WHERE group_name = 'Testin elokuvaryhmä'),
        (SELECT id FROM public.account WHERE username = 'emma'), 'member'),
    ((SELECT id FROM public."group" WHERE group_name = 'Testin elokuvaryhmä'),
        (SELECT id FROM public.account WHERE username = 'frank'), 'member'),
    ((SELECT id FROM public."group" WHERE group_name = 'Testin elokuvaryhmä'),
        (SELECT id FROM public.account WHERE username = 'grace'), 'member'),
    ((SELECT id FROM public."group" WHERE group_name = 'Testin elokuvaryhmä'),
        (SELECT id FROM public.account WHERE username = 'henry'), 'member'),
    ((SELECT id FROM public."group" WHERE group_name = 'Testin elokuvaryhmä'),
        (SELECT id FROM public.account WHERE username = 'isla'), 'member'),
    ((SELECT id FROM public."group" WHERE group_name = 'Testin elokuvaryhmä'),
        (SELECT id FROM public.account WHERE username = 'jack'), 'member'),
    ((SELECT id FROM public."group" WHERE group_name = 'Test2:n sarjaryhmä'),
        (SELECT id FROM public.account WHERE username = 'alice'), 'member'),
    ((SELECT id FROM public."group" WHERE group_name = 'Test2:n sarjaryhmä'),
        (SELECT id FROM public.account WHERE username = 'bob'), 'member'),
    ((SELECT id FROM public."group" WHERE group_name = 'Test2:n sarjaryhmä'),
        (SELECT id FROM public.account WHERE username = 'charlie'), 'member'),
    ((SELECT id FROM public."group" WHERE group_name = 'Test2:n sarjaryhmä'),
        (SELECT id FROM public.account WHERE username = 'david'), 'member'),
    ((SELECT id FROM public."group" WHERE group_name = 'Test2:n sarjaryhmä'),
        (SELECT id FROM public.account WHERE username = 'emma'), 'member'),
    ((SELECT id FROM public."group" WHERE group_name = 'Test2:n sarjaryhmä'),
        (SELECT id FROM public.account WHERE username = 'frank'), 'member'),
    ((SELECT id FROM public."group" WHERE group_name = 'Test2:n sarjaryhmä'),
        (SELECT id FROM public.account WHERE username = 'grace'), 'member'),
    ((SELECT id FROM public."group" WHERE group_name = 'Test2:n sarjaryhmä'),
        (SELECT id FROM public.account WHERE username = 'henry'), 'member'),
    ((SELECT id FROM public."group" WHERE group_name = 'Test2:n sarjaryhmä'),
        (SELECT id FROM public.account WHERE username = 'isla'), 'member'),
    ((SELECT id FROM public."group" WHERE group_name = 'Test2:n sarjaryhmä'),
        (SELECT id FROM public.account WHERE username = 'jack'), 'member');

-- Additional chat messages from the seeded testhash users
INSERT INTO public.group_chat (group_id, user_id, message)
VALUES
    ((SELECT id FROM public."group" WHERE group_name = 'Testin elokuvaryhmä'),
        (SELECT id FROM public.account WHERE username = 'alice'),
        'Minulle sopisi elokuvailta perjantaina.'),
    ((SELECT id FROM public."group" WHERE group_name = 'Testin elokuvaryhmä'),
        (SELECT id FROM public.account WHERE username = 'bob'),
        'Kannatan! Voidaan äänestää kolmesta vaihtoehdosta.'),
    ((SELECT id FROM public."group" WHERE group_name = 'Testin elokuvaryhmä'),
        (SELECT id FROM public.account WHERE username = 'charlie'),
        'Valitsen mielelläni jonkin klassikkoelokuvan.'),
    ((SELECT id FROM public."group" WHERE group_name = 'Testin elokuvaryhmä'),
        (SELECT id FROM public.account WHERE username = 'david'),
        'Sopiiko aloittaa katselu kahdeksalta?'),
    ((SELECT id FROM public."group" WHERE group_name = 'Testin elokuvaryhmä'),
        (SELECT id FROM public.account WHERE username = 'emma'),
        'Kahdeksan sopii hyvin.'),
    ((SELECT id FROM public."group" WHERE group_name = 'Test2:n sarjaryhmä'),
        (SELECT id FROM public.account WHERE username = 'alice'),
        'Voisin katsoa yhden jakson tänä iltana.'),
    ((SELECT id FROM public."group" WHERE group_name = 'Test2:n sarjaryhmä'),
        (SELECT id FROM public.account WHERE username = 'bob'),
        'Minäkin olen mukana sarjamaratonissa.'),
    ((SELECT id FROM public."group" WHERE group_name = 'Test2:n sarjaryhmä'),
        (SELECT id FROM public.account WHERE username = 'charlie'),
        'Valitaan sarja, jossa on sopivasti jännitystä.'),
    ((SELECT id FROM public."group" WHERE group_name = 'Test2:n sarjaryhmä'),
        (SELECT id FROM public.account WHERE username = 'david'),
        'Laitan muutaman ehdotuksen ryhmään.'),
    ((SELECT id FROM public."group" WHERE group_name = 'Test2:n sarjaryhmä'),
        (SELECT id FROM public.account WHERE username = 'emma'),
        'Hyvä idea, katsotaan ehdotukset yhdessä.');

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

-- Additional reviews for varied movies and TV series
INSERT INTO public.review (user_id, movie_id, type, grade, description)
VALUES
    (3, 550, 'movie', 5, 'Ajaton ja vaikuttava klassikko.'),
    (7, 550, 'movie', 4, 'Hyvä tarina ja vahvat näyttelijäsuoritukset.'),
    (1, 603, 'movie', 4, 'Tunnelmallinen ja ajatuksia herättävä elokuva.'),
    (8, 603, 'movie', 5, 'Visuaalisesti todella hieno kokonaisuus.'),
    (4, 680, 'movie', 3, 'Viihdyttävä, vaikka juoni oli hieman ennalta-arvattava.'),
    (10, 680, 'movie', 4, NULL),
    (2, 299534, 'movie', 5, 'Suuri ja näyttävä elokuvakokemus.'),
    (6, 299534, 'movie', 4, 'Paljon tapahtumia ja hyvät tehosteet.'),
    (5, 872585, 'movie', 4, 'Mielenkiintoinen maailma ja hyvä tunnelma.'),
    (9, 872585, 'movie', 3, NULL),
    (1, 693134, 'movie', 5, 'Erittäin vaikuttava elokuva valkokankaalla.'),
    (6, 693134, 'movie', 4, 'Hieno visuaalinen toteutus ja toimiva tarina.'),
    (2, 1399, 'tv', 5, 'Hahmot ja maailma veivät heti mukanaan.'),
    (8, 1399, 'tv', 4, 'Laadukas sarja, jossa riitti jännitystä.'),
    (4, 1396, 'tv', 5, 'Kerronta parani kausi kaudelta.'),
    (10, 1396, 'tv', 4, NULL),
    (3, 66732, 'tv', 4, 'Hauska ja helposti seurattava sarja.'),
    (7, 66732, 'tv', 3, 'Hyviä hetkiä, vaikka kaikki jaksot eivät toimineet.'),
    (5, 94605, 'tv', 5, 'Todella koukuttava ja jännittävä sarja.'),
    (9, 94605, 'tv', 4, 'Kiinnostavat hahmot ja hyvä rytmi.'),
    (1, 94997, 'tv', 4, 'Tyylikäs ja omaperäinen toteutus.'),
    (6, 94997, 'tv', 5, 'Sarjan tunnelma oli erinomainen.'),
    (2, 76479, 'tv', 3, 'Ihan hyvä sarja, mutta loppu jäi vaisuksi.'),
    (8, 76479, 'tv', 4, 'Viihdyttävä kokonaisuus ja sopivasti huumoria.'),
    (2, 238, 'movie', 5, 'Vahva draama ja mieleenpainuvat hahmot.'),
    (5, 238, 'movie', 4, 'Hieno elokuva, joka jäi ajatuksiin.'),
    (4, 424, 'movie', 3, 'Hyvä idea, mutta toteutus oli epätasainen.'),
    (9, 424, 'movie', 4, 'Jännittävä ja viihdyttävä kokonaisuus.'),
    (1, 299532, 'movie', 4, 'Hyvä elokuva ja toimiva tarina.'),
    (7, 299532, 'movie', 5, 'Todella onnistunut elokuvakokemus.'),
    (3, 157336, 'movie', 4, 'Kaunis animaatio ja lämmin tarina.'),
    (8, 157336, 'movie', 5, 'Erittäin viihdyttävä koko perheen elokuva.'),
    (6, 13, 'movie', 5, 'Koskettava ja hienosti näytelty klassikko.'),
    (10, 13, 'movie', 4, NULL),
    (4, 597, 'movie', 3, 'Viihdyttävä toimintaelokuva.'),
    (9, 597, 'movie', 4, 'Hyvä tempo ja näyttävät kohtaukset.'),
    (1, 11, 'movie', 5, 'Ajaton seikkailu, joka toimii edelleen.'),
    (5, 11, 'movie', 5, 'Upea maailma ja hieno musiikki.'),
    (2, 497, 'movie', 4, 'Hauska ja vauhdikas elokuva.'),
    (7, 497, 'movie', 3, 'Hyvä viihde-elokuva, vaikka juoni oli tuttu.'),
    (3, 155, 'movie', 4, 'Tunnelmallinen rikoselokuva.'),
    (6, 155, 'movie', 5, 'Näyttelijät tekivät hienoa työtä.'),
    (8, 120467, 'movie', 3, 'Mielenkiintoinen, mutta hieman pitkä.'),
    (10, 120467, 'movie', 4, 'Visuaalisesti vaikuttava elokuva.'),
    (4, 129, 'movie', 5, 'Erittäin hyvä käsikirjoitus ja tunnelma.'),
    (9, 129, 'movie', 4, 'Klassikko, joka kestää useamman katselun.'),
    (1, 27205, 'movie', 5, 'Kiehtova idea ja hieno toteutus.'),
    (6, 27205, 'movie', 4, 'Jännittävä ja ajatuksia herättävä.'),
    (2, 603, 'movie', 5, 'Todella tyylikäs tieteiselokuva.'),
    (5, 603, 'movie', 4, 'Hyvä tunnelma ja kiinnostava maailma.'),
    (3, 98, 'movie', 3, 'Viihdyttävä komedia, jossa oli hyviä hetkiä.'),
    (8, 98, 'movie', 4, 'Hauska ja helposti katsottava.'),
    (4, 105, 'movie', 5, 'Kaunis ja koskettava tarina.'),
    (7, 105, 'movie', 4, 'Hieno elokuva ja vahvat roolisuoritukset.'),
    (2, 278, 'movie', 5, 'Koskettava klassikko.'),
    (10, 278, 'movie', 4, 'Tarina ja näyttelijäntyö olivat erinomaisia.'),
    (5, 122, 'movie', 3, 'Hyvä draama, mutta hieman hidas.'),
    (9, 122, 'movie', 4, 'Hieno tunnelma ja mielenkiintoiset hahmot.'),
    (1, 100088, 'tv', 4, 'Mielenkiintoinen ja hyvin rakennettu sarja.'),
    (7, 100088, 'tv', 5, 'Kiehtova tarina ja vahvat hahmot.'),
    (3, 60625, 'tv', 4, 'Hyvä mysteeri ja sopivasti jännitystä.'),
    (6, 60625, 'tv', 3, 'Ensimmäiset jaksot olivat parhaat.'),
    (4, 78191, 'tv', 5, 'Laadukas ja tunnelmallinen sarja.'),
    (9, 78191, 'tv', 4, 'Hyvin kirjoitetut hahmot.'),
    (2, 71912, 'tv', 4, 'Hauska ja lämminhenkinen sarja.'),
    (8, 71912, 'tv', 5, 'Todella viihdyttävä kokonaisuus.'),
    (1, 82856, 'tv', 3, 'Hyvä alku, mutta loppu ei vakuuttanut.'),
    (5, 82856, 'tv', 4, 'Kiinnostava maailma ja hyvät näyttelijät.'),
    (3, 76331, 'tv', 5, 'Erittäin koukuttava sarja.'),
    (10, 76331, 'tv', 4, 'Jännittävä juoni ja hyvä rytmi.'),
    (6, 67744, 'tv', 4, 'Tyylikäs rikossarja.'),
    (7, 67744, 'tv', 3, 'Hyvä sarja, vaikka kaikki ratkaisut eivät toimineet.'),
    (4, 63174, 'tv', 5, 'Hauska ja omaperäinen komedia.'),
    (9, 63174, 'tv', 4, NULL),
    (2, 60694, 'tv', 4, 'Hieno maailma ja kiinnostava tarina.'),
    (8, 60694, 'tv', 5, 'Sarjan tunnelma oli erinomainen.'),
    (5, 69050, 'tv', 3, 'Viihdyttävä, mutta hieman epätasainen.'),
    (10, 69050, 'tv', 4, 'Hyvät hahmot ja toimiva juoni.'),
    (3, 496243, 'movie', 4, 'Viihdyttävä elokuva ja hieno visuaalinen ilme.'),
    (6, 496243, 'movie', 5, 'Todella onnistunut ja mieleenpainuva kokonaisuus.');

-- Reviews for the current Now Playing movies in Finland
INSERT INTO public.review (user_id, movie_id, type, grade, description)
VALUES
    (1, 1423191, 'movie', 4, 'Jännittävä ja näyttävä uusi elokuva.'),
    (7, 1423191, 'movie', 5, 'Tunnelma ja toiminta toimivat todella hyvin.'),
    (2, 1204680, 'movie', 4, 'Hauska idea ja viihdyttävä toteutus.'),
    (8, 1204680, 'movie', 3, 'Mukava elokuva, vaikka kaikki vitsit eivät toimineet.'),
    (3, 1400837, 'movie', 4, 'Hyvin rakennettu ja tunnelmallinen kauhuelokuva.'),
    (9, 1400837, 'movie', 5, 'Todella vaikuttava ja jännittävä kokonaisuus.'),
    (4, 1248832, 'movie', 5, 'Vahva tarina ja hienot näyttelijäsuoritukset.'),
    (10, 1248832, 'movie', 4, 'Mielenkiintoinen elokuva ja hyvä tunnelma.'),
    (5, 977942, 'movie', 3, 'Viihdyttävä, mutta juoni oli hieman tuttu.'),
    (6, 977942, 'movie', 4, 'Hyvä tempo ja näyttävät kohtaukset.'),
    (1, 1283515, 'movie', 4, 'Kiehtova mysteeri ja hyvä jännite.'),
    (8, 1283515, 'movie', 5, 'Pidin tarinasta ja sen tunnelmasta paljon.'),
    (2, 1263337, 'movie', 5, 'Vaikuttava seikkailu ja hieno kuvaus.'),
    (7, 1263337, 'movie', 4, 'Toimiva tarina ja kiinnostavat hahmot.'),
    (3, 1281331, 'movie', 4, 'Ajankohtainen ja ajatuksia herättävä elokuva.'),
    (9, 1281331, 'movie', 3, 'Hyvä idea, mutta hieman epätasainen toteutus.'),
    (4, 1302904, 'movie', 4, 'Hauska jatko-osa ja sopivasti nostalgiaa.'),
    (10, 1302904, 'movie', 5, 'Viihdyttävä elokuva, jonka katsoi mielellään.'),
    (5, 1380417, 'movie', 3, 'Jännittävä lähtökohta ja hyvä näyttelijäntyö.'),
    (6, 1380417, 'movie', 4, 'Toimiva rikoselokuva ja kiinnostava juoni.');
