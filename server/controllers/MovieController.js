import "dotenv/config";
import { ApiError } from "../helper/ApiError.js";
import { getReviewsByMovieId, getUserMovieReview, insertMovieReview } from "../models/Review.js";

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

    if(!result.ok){
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
  const { mediatype, movieid  } = req.params;
  try {
    const result = await getReviewsByMovieId(movieid, mediatype);
    res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

const postMovieReview = async (req, res, next) => {  
  try {
    const { movieId } = req.params;
    const userId = req.user.userId
    const description = req.body.description
    const grade = req.body.grade

    const existingReviews = await getUserMovieReview(userId, movieId)
    if (existingReviews.rowCount > 0) {
      return next(new ApiError('Cant create another review for an already reviewed movie', 409))
    }

    if (grade < 1 || grade > 5) {
      return next(new ApiError('Grade cant be under 1 or over 5 stars', 400))
    }

    const result = await insertMovieReview(userId, movieId, description, grade);
    res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}

export { getMovieData, getNowPlayingMovies, getMovieReviews, postMovieReview }
