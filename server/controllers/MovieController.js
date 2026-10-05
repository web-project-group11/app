import "dotenv/config";
import { ApiError } from "../helper/ApiError.js";
import { getReviewsByMovieId, getUserMediaReview, insertMediaReview, editMediaReview, deleteReview } from "../models/Review.js";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
  },
};

const getMovieData = async (req, res) => {
  const { movieid, mediatype } = req.query
  try {
    const result = await fetch(
      `https://api.themoviedb.org/3/${mediatype}/${movieid}`,
      options,
    )
    const data = await result.json();
    return res.status(200).json(data) || []
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message })
  }
}

const getMovieList = (listType) => async (req, res, next) => {
  const { page = "1" } = req.query;

  try {
    const params = new URLSearchParams({
      language: "en-US",
      page: page,
    })

    const result = await fetch(`https://api.themoviedb.org/3/movie/${listType}?${params}`, options)

    if (!result.ok) {
      throw new ApiError("TMDB request failed", result.status)
    }

    const data = await result.json()

    res.status(200).json({
      results: data.results.map(({ id, title, poster_path, vote_average }) => ({
        id,
        title,
        poster_path,
        vote_average,
      })),
      page: data.page,
      total_pages: data.total_pages,
    })
  } catch (error) {
    return next(error)
  }
}

const getNowPlayingMovies = getMovieList("now_playing")
const getTopRatedMovies = getMovieList("top_rated")

const getMovieReviews = async (req, res, next) => {
  const { mediaType, mediaId } = req.params
  try {
    const result = await getReviewsByMovieId(mediaId, mediaType);
    res.status(200).json(result)
  } catch (error) {
    return next(error)
  }
}

const postMovieReview = async (req, res, next) => {
  try {
    const { mediaType, mediaId } = req.params
    const userId = req.user.userId
    const description = req.body.description
    const grade = req.body.grade

    if (grade < 1 || grade > 5) {
      return next(new ApiError('Grade cant be under 1 or over 5 stars', 400))
    }

    const result = await insertMediaReview(userId, mediaId, mediaType, description, grade);
    res.status(201).json(result)
  } catch (error) {
    return next(error)
  }
}

const getUserReview = async (req, res, next) => {
  try {
    const { mediaType, mediaId, userId } = req.params

    const result = await getUserMediaReview(userId, mediaType, mediaId)
    const data = result.rows[0]
    res.status(201).json(data)
  } catch (error) {
    return next(error)
  }
}

const updateUserReview = async (req, res, next) => {
  try {
    const { description, grade } = req.body
    const { reviewId } = req.params
    const userId = req.user.userId

    const result = await editMediaReview(description, grade, reviewId, userId)

    if (result.rowCount === 0) {
      return next(new ApiError('Review not found or you are not the owner', 403))
    }

    res.status(200).json({message: "Review updated succesfully"})
  } catch(error) {
    return next(error)
  }
}

const removeReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params
    const result = await deleteReview(reviewId)
    res.status(201).json({message: "Review deleted succesfully"})
  } catch(error) {
    return next(error)
  }
}

export { getMovieData, getNowPlayingMovies, getTopRatedMovies, getMovieReviews, postMovieReview, getUserReview, updateUserReview, removeReview }
