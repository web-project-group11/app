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

const getUserMediaReviews = async (userId, page, limit) => {
  // calculate which record to start returning records from
  // ordering by created_at DESC to return newest review first
  const offset = (page - 1) * limit
  return await pool.query(
    'SELECT * FROM review WHERE review.user_id = $1 ORDER BY review.created_at DESC LIMIT $2 OFFSET $3', [userId, limit, offset]
  )
}

const getUserReviewCount = async (userId) => {
  const countResult = await pool.query(
    'SELECT COUNT(*) as total_count FROM review WHERE user_id = $1', [userId]
  )
  return countResult.rows[0].total_count
}

const getUserReviewAverage = async (userId) => {
  const averageResult = await pool.query(
    'SELECT AVG(grade) FROM review WHERE user_id = $1', [userId]
  )
  return averageResult.rows[0].avg
}

const insertMediaReview = async (userId, mediaId, mediaType, description, grade) => {
  return await pool.query(
    'INSERT INTO review (user_id, movie_id, type, description, grade) VALUES ($1, $2, $3, $4, $5) RETURNING id',
    [userId, mediaId, mediaType, description, grade]
  )
}

const editMediaReview = async (description, grade, reviewId) => {
  return await pool.query('UPDATE review SET description = $1, grade = $2 WHERE id = $3 RETURNING id',
    [description, grade, reviewId]
  )
}

const deleteReview = async (reviewId) => {
  return await pool.query('DELETE from review WHERE id=$1',
    [reviewId]
  )
}

export { getReviewsByMovieId, getUserMediaReview, getUserReviewCount, getUserReviewAverage, getUserMediaReviews, insertMediaReview, editMediaReview, deleteReview }