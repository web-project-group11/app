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
  const { movieid, mediatype } = req.query;
  // console.log("getMovieData - movieid:", movieid, "mediatype:", mediatype);
  try {
    const result = await fetch(
      `https://api.themoviedb.org/3/${mediatype}/${movieid}`,
      options,
    );
    const data = await result.json();
    return res.status(200).json(data) || [];
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const getNowPlayingMovies = async (req, res, next) => {
  const { page = "1" } = req.query;

  try {
    const params = new URLSearchParams({
      language: "en-US",
      page: page,
    })

    const result = await fetch(
      `https://api.themoviedb.org/3/movie/now_playing?${params}`,
      options,
    )

    if (!result.ok) {
      throw new ApiError("TMDB request failed", result.status)
    }

    const data = await result.json()

    res.status(200).json({
      results: data.results.map(({ id, title, poster_path }) => ({
        id,
        title,
        poster_path,
      })),
      page: data.page,
      total_pages: data.total_pages,
    });
  } catch (error) {
    return next(error)
  }
}

const getMovieReviews = async (req, res, next) => {
  const { mediaType, mediaId } = req.params;
  try {
    const result = await getReviewsByMovieId(mediaId, mediaType);
    res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

const postMovieReview = async (req, res, next) => {
  try {
    const { mediaType, mediaId } = req.params;
    // console.log(mediaType, mediaId)
    const userId = req.user.userId
    const description = req.body.description
    const grade = req.body.grade

    if (grade < 1 || grade > 5) {
      return next(new ApiError('Grade cant be under 1 or over 5 stars', 400))
    }

    const result = await insertMediaReview(userId, mediaId, mediaType, description, grade);
    res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}

const getUserReview = async (req, res, next) => {
  // console.log("GetUserReview")
  try {
    const { mediaType, mediaId, userId } = req.params;
    // console.log("Fetched review data:", mediaType, mediaId, userId)

    const result = await getUserMediaReview(userId, mediaType, mediaId)
    const data = result.rows[0]
    // console.log(data)
    res.status(201).json(data)
  } catch (error) {
    return next(error);
  }
}

const updateUserReview = async (req, res, next) => {
  // console.log("UpdateUserReview")
  try {
    const { description, grade } = req.body
    const { reviewId } = req.params
    // console.log("Updating review", description, grade, reviewId)
    const result = await editMediaReview(description, grade, reviewId)
    res.status(201).json({message: "Review updated succesfully"})
  } catch(error) {
    return next(error)
  }
}

const removeReview = async (req, res, next) => {
  // console.log("Deleting review")
  try {
    const { reviewId } = req.params
    // console.log("Deleting review ID: " , reviewId)
    const result = await deleteReview(reviewId)
    res.status(201).json({message: "Review deleted succesfully"})
  } catch(error) {
    return next(error)
  }
}

export { getMovieData, getNowPlayingMovies, getMovieReviews, postMovieReview, getUserReview, updateUserReview, removeReview }
