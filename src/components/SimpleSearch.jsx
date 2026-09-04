import { useState, useEffect } from "react";
import axios from "axios";
import Poster from "./Poster.jsx";

const apiUrl = "http://localhost:3001";

function SimpleSearch() {
  const [movieName, setMovieName] = useState("");
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  const search = (e) => {
    e.preventDefault();
    setHasSearched(true);
    axios
      .get(`${apiUrl}/api/search?query=${movieName}&page=${page}`)
      .then((response) => {
        setMovies(response.data.results);
        setPages(response.data.total_pages);
      })
      .catch((error) => {
        alert(error.response.data ? error.response.data.message : error);
        console.error(error);
      });
  };

  return (
    <div id="search-container">
      <h3>Movie Search</h3>
      <form onSubmit={search}>
        <input
          type="text"
          placeholder="Movie, serie..."
          value={movieName}
          onChange={(e) => setMovieName(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {hasSearched && movies.length === 0 && (
        <p>No results found for "{movieName}".</p>
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
                <button id="prev-page" onClick={() => setPage(page - 1)}> ← </button>
                Page {page} of {pages}
                <button id="next-page" onClick={() => setPage(page + 1)}> → </button>
            </p>
        </form>
        </div>
      )}
    </div>
  );
}

export default SimpleSearch