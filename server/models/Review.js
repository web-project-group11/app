import { pool } from '../helper/db.js'

const getReviewsByMovieId = async (movieid, mediatype) => {

    const result = await pool.query(
    `SELECT review.*, "account".username
    FROM review
    JOIN "account" ON review.user_id = "account".id
    WHERE review.movie_id = $1 AND review.type = $2`,
    [movieid, mediatype]
    );

  return result.rows;
};

const getUserMovieReview = async (userId, movieId) => {
  return await pool.query(
    'SELECT * FROM review WHERE user_id = $1 AND movie_id = $2', [userId, movieId]
  )
}

const insertMovieReview = async (userId, movieId, description, grade) => {
  return await pool.query(
    'INSERT INTO review (user_id, movie_id, description, grade) VALUES ($1, $2, $3, $4) RETURNING id',
    [userId, movieId, description, grade]
  )
}

export { getReviewsByMovieId, getUserMovieReview, insertMovieReview }