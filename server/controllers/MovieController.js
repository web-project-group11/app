import "dotenv/config";
import { ApiError } from "../helper/ApiError.js";
import { getReviewsByMovieId } from "../models/Review.js";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
  },
};

const getMovieData = async (req, res) => {
  const { movieid } = req.query;
  try {
    const result = await fetch(
      `https://api.themoviedb.org/3/movie/${movieid}`,
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
  const { movieId } = req.params;
  try {
    const result = await getReviewsByMovieId(movieId);
    res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

export { getMovieData, getNowPlayingMovies, getMovieReviews }
