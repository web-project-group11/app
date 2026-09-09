import { pool } from '../helper/db.js'

const getReviewsByMovieId = async (movieId) => {

    const result = await pool.query(
    `SELECT review.*, "account".username
    FROM review
    JOIN "account" ON review.user_id = "account".id
    WHERE review.movie_id = $1`,
    [movieId]
    );

  return result.rows;
};

export { getReviewsByMovieId }