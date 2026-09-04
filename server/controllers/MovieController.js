import 'dotenv/config'
import { ApiError } from "../helper/ApiError.js";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
  },
};

const getMovies = async (req, res) => {
    const { query, page } = req.query
  try {
    const result = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${query}&page=${page}`,
      options,
    )
    const data = await result.json();
    return res.status(200).json({
        results: data.results,
        total_pages: data.total_pages,
        poster_path: data.poster_path
    } || []);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const getMovieData = async (req, res) => {
  // console.log("getMovieData Controller")
  const { query } = req.query
  // console.log("MovieId in controller:", query)
  try {
    const result = await fetch(
      `https://api.themoviedb.org/3/movie/${query}`,
      options,
    )
    const data = await result.json();
    // console.log("Movie data in controller:", data)
    return res.status(200).json(data) || [];
  } catch (error) {
    return res.status(error.status || 500).json ({ message: error.message })
  }
}

export { getMovies, getMovieData };
