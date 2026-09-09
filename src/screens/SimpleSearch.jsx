import { useState, useEffect } from "react";
import axios from "axios";
import Poster from "../components/Poster.jsx";
import genres from "../helper/Genres.js";

// API base URL for backend requests
const apiUrl = import.meta.env.VITE_API_URL;

function SimpleSearch() {
  // State variables for search filters
  const [movieName, setMovieName] = useState("");
  const [movieGenre, setMovieGenre] = useState("");
  const [movieYear, setMovieYear] = useState("");
  
  // State variables for search results and pagination
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);

  // Handle search form submission
  const search = (e) => {
    e.preventDefault();
    // console.log("Searching for:", movieName, "Genre:", movieGenre, "Year:", movieYear, "Page:", page);
    setHasSearched(true);
    
    // Fetch movies from API with search parameters
    axios
      .get(`${apiUrl}/api/search`, {
        params: {
          query: movieName,
          genre: movieGenre,
          year: movieYear,
          page: page,
        },
      })
      .then((response) => {
        setMovies(response.data.results);
      })
      .catch((error) => {
        alert(error.response.data ? error.response.data.message : error);
        console.error(error);
      });
  };

  return (
    <div id="search-container">
      <h3>Movie Search</h3>
      <form id="search-form" onSubmit={search}>
        <input
          type="text"
          placeholder="Movie..."
          value={movieName}
          onChange={(e) => setMovieName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Year"
          value={movieYear}
          onChange={(e) => setMovieYear(e.target.value)}
        />
        <select id="genre-select" value={movieGenre} onChange={(e) => setMovieGenre(e.target.value)}>
          <option value="">Genre</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
        <button type="submit">Search</button>
      </form>
      {hasSearched && movies.length === 0 && (
        <p>No results found</p>
      )}
      {hasSearched && movies.length > 0 && (
        <div>
          <div className="poster-grid">
            {movies.map(movie => (
              <Poster movie={movie} key={movie.id} />
            ))}
          </div>
        <form onSubmit={search}>
            <p id="pagination">
                <button id="prev-page" onClick={() => setPage(page - 1)}> Previous </button>
                Page {page}
                <button id="next-page" onClick={() => setPage(page + 1)}> Next </button>
            </p>
        </form>
        </div>
      )}
    </div>
  );
}

export default SimpleSearch