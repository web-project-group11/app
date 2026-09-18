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

const insertMovieReview = async (userId, movieId, description, grade) => {
  return await pool.query(
    'INSERT INTO review (user_id, movie_id, description, grade) VALUES ($1, $2, $3, $4) RETURNING id',
    [userId, movieId, description, grade]
  )
}

export { getReviewsByMovieId, insertMovieReview }