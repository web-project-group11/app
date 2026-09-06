import "dotenv/config";
import { ApiError } from "../helper/ApiError.js";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
  },
};

const getMovies = async (req, res) => {
  const { query, genre, year, page } = req.query;

  const params = new URLSearchParams({
    language: "en-US",
    page: page,
  });

  let fetchUrl;

  if (query) {
    params.append("query", query);
    if (year) {
      params.append("primary_release_year", year);
    }
    fetchUrl = `https://api.themoviedb.org/3/search/movie?${params}`;
  } else {
    params.append("with_genres", genre);
    params.append("primary_release_year", year);
    fetchUrl = `https://api.themoviedb.org/3/discover/movie?${params}`;
  }

  try {
    const result = await fetch(fetchUrl, options);

    const data = await result.json();

    let results = data.results;

    if (genre) {
      results = results.filter((movie) =>
        movie.genre_ids.includes(Number(genre)),
      );
    }

    return res.status(200).json(
      {
        results: results,
        total_pages: data.total_pages,
        poster_path: data.poster_path,
      } || [],
    );
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const getMovieData = async (req, res) => {
  const { query } = req.query;
  try {
    const result = await fetch(
      `https://api.themoviedb.org/3/movie/${query}`,
      options,
    );
    const data = await result.json();
    // console.log("Movie data in controller:", data)
    return res.status(200).json(data) || [];
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const getNowPlayingMovies = async (req, res, next) => {
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

    res.status(200).json({
      results: data.results,
      page: data.page,
      total_pages: data.total_pages,
    });
  } catch (error) {
    return next(error);
  }
}


export { getMovies, getMovieData, getNowPlayingMovies };
