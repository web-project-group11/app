import { pool } from '../helper/db.js'

const getReviewsByMovieId = async (movieId) => {

    const result = await pool.query(
    `SELECT review.*, "user".username
    FROM review
    JOIN "user" ON review.user_id = "user".id
    WHERE review.movie_id = $1`,
    [movieId]
    );

//   console.log("Reviews fetched from database:", result.rows);
  return result.rows;
};

export { getReviewsByMovieId }