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

export { getReviewsByMovieId }