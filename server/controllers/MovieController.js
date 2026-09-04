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
    //console.log(data)
    return res.status(200).json({
        results: data.results,
        total_pages: data.total_pages
    } || []);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

export { getMovies };
