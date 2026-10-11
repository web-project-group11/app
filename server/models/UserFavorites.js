import { pool } from '../helper/db.js';

const getMyFavoritesData = async (userId) => {
    return await pool.query(
        'SELECT movie_id, type FROM user_favourite WHERE user_id = $1',
        [userId]
    );
};

const isMyFavorite = async (userId, movieId, mediaType) => {
    return await pool.query(
        'SELECT 1 FROM user_favourite WHERE user_id = $1 AND movie_id = $2 AND type = $3',
        [userId, movieId, mediaType]
    );
};

const getFavoritesByUsername = async (username) => {
    return await pool.query(
        `SELECT user_favourite.movie_id, user_favourite.type
         FROM user_favourite
         JOIN account ON account.id = user_favourite.user_id
         WHERE account.username = $1`,
        [username]
    );
};

const insertMyFavorite = async (userId, movieId, mediaType) => {
    return await pool.query(
        'INSERT INTO user_favourite (user_id, movie_id, type) VALUES ($1, $2, $3) RETURNING user_id, movie_id, type',
        [userId, movieId, mediaType]
    );
};

const deleteMyFavorite = async (userId, movieId, mediaType) => {
    return await pool.query(
        'DELETE FROM user_favourite WHERE user_id = $1 AND movie_id = $2 AND type = $3 RETURNING user_id, movie_id, type',
        [userId, movieId, mediaType]
    );
};

export {
    insertMyFavorite,
    deleteMyFavorite,
    getMyFavoritesData,
    getFavoritesByUsername,
    isMyFavorite
};