import { pool } from '../helper/db.js'

const addMyFavorite = async (user_id, movie_id) => {
    return await pool.query(
        'INSERT INTO user_favourite (user_id, movie_id) VALUES ($1, $2) RETURNING user_id, movie_id',
        [user_id, movie_id] 
    )
}

export { addMyFavorite }
