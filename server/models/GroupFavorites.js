import { pool } from '../helper/db.js';

const getGroupFavorites = async (group_id) => {
    return await pool.query(
        'SELECT movie_id, type FROM group_favourite WHERE group_id = $1',
        [group_id]
    );
};

const isGroupFavorite = async (group_id, movie_id, mediaType) => {
    return await pool.query(
        'SELECT 1 FROM group_favourite WHERE group_id = $1 AND movie_id = $2 AND type = $3',
        [group_id, movie_id, mediaType]
    );
};

const insertGroupFavorite = async (group_id, movie_id, mediaType) => {
    return await pool.query(
        'INSERT INTO group_favourite (group_id, movie_id, type) VALUES ($1, $2, $3) RETURNING group_id, movie_id, type',
        [group_id, movie_id, mediaType] 
    );
};

const deleteGroupFavorite = async (group_id, movie_id, mediaType) => {
    return await pool.query(
        'DELETE FROM group_favourite WHERE group_id = $1 AND movie_id = $2 AND type = $3 RETURNING group_id, movie_id, type',
        [group_id, movie_id, mediaType]
    );
};

export { getGroupFavorites, isGroupFavorite, insertGroupFavorite, deleteGroupFavorite };