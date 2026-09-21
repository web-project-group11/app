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

const getUserMediaReview = async (userId, mediaType, mediaId) => {
  return await pool.query(
    'SELECT * FROM review WHERE user_id = $1 AND movie_id = $2 AND type = $3', [userId, mediaId, mediaType]
  )
}

const insertMediaReview = async (userId, mediaId, mediaType, description, grade) => {
  return await pool.query(
    'INSERT INTO review (user_id, movie_id, type, description, grade) VALUES ($1, $2, $3, $4, $5) RETURNING id',
    [userId, mediaId, mediaType, description, grade]
  )
}

export { getReviewsByMovieId, getUserMediaReview, insertMediaReview }