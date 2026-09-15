import { pool } from '../helper/db.js'

const getMyFavoritesData = async (user_id) => {
    return await pool.query(
        'SELECT movie_id FROM user_favourite WHERE user_id = $1',
        [user_id]
    )
}

const insertMyFavorite = async (user_id, movie_id) => {
    return await pool.query(
        'INSERT INTO user_favourite (user_id, movie_id) VALUES ($1, $2) RETURNING user_id, movie_id',
        [user_id, movie_id] 
    )
}

const deleteMyFavorite = async (user_id, movie_id) => {
    return await pool.query(
        'DELETE FROM user_favourite WHERE user_id = $1 AND movie_id = $2 RETURNING user_id, movie_id',
        [user_id, movie_id]
    )
}

export { insertMyFavorite, deleteMyFavorite, getMyFavoritesData }
