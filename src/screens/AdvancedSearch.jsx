import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Poster from "../components/Poster.jsx";
import genres from "../helper/Genres.js";

// API base URL for backend requests
const apiUrl = import.meta.env.VITE_API_URL;

function AdvancedSearch() {
  // State variables for search filters
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchType, setSearchType] = useState("all");
  const [Name, setMovieName] = useState("");
  const [Genre, setMovieGenre] = useState("");
  const [Year, setMovieYear] = useState("");
  
  // State variables for search results and pagination
  const [result, setResult] = useState([]);
  const [page, setPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);


  useEffect(() => {
    const type = searchParams.get("type");
    const query = searchParams.get("query");
    const genre = searchParams.get("genre");
    const year = searchParams.get("year");
    const urlPage = Number(searchParams.get("page")) || 1;

    // Jos URL:ssa ei ole hakua, ei tehdä mitään
  if (!type && !query && !genre && !year) {
    setResult([]);
    setHasSearched(false);
    setPage(1);
    setSearchType("all");
    setMovieName("");
    setMovieGenre("");
    setMovieYear("");
    return;
  }

    // Täytetään lomakkeen kentät URL:n perusteella
    setSearchType(type || "all");
    setMovieName(query || "");
    setMovieGenre(genre || "");
    setMovieYear(year || "");
    setPage(urlPage);

    // Haetaan URL:n arvoilla
    axios
      .get(`${apiUrl}/api/search`, {
        params: {
          type: type || "all",
          query: query || "",
          genre: genre || "",
          year: year || "",
          page: urlPage,
        },
      })
      .then((response) => {
        setResult(response.data.results);
        setHasSearched(true);
      })
      .catch((error) => {
        alert(error.response?.data?.message || error.message);
        console.error(error);
      });
  }, [searchParams]);

  useEffect(() => {
    if (!hasSearched) return;

    axios
      .get(`${apiUrl}/api/search`, {
        params: {
          type: searchType,
          query: Name,
          genre: Genre,
          year: Year,
          page: page,
        },
      })
      .then((response) => {
        setResult(response.data.results);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [page]);
  
  const search = (e) => {
    e.preventDefault();
    console.log("Search type:", searchType, "Searching for:", Name, "Genre:", Genre, "Year:", Year, "Page:", page);
    setHasSearched(true);
    setSearchParams({
      type: searchType,
      query: Name,
      genre: Genre,
      year: Year,
      page: page,
    });
    
    // Fetch movies from API with search parameters
  };

  return (
    <div id="search-container">
      <h3>Movie Search</h3>
      <form id="search-form" onSubmit={search}>
        <select id="type-select" value={searchType} onChange={(e) => setSearchType(e.target.value)}>
          <option value="all">All</option>
          <option value="movie">Movie</option>
          <option value="tv">TV-Series</option>
        </select>
        <input
          type="text"
          placeholder="Name..."
          value={Name}
          onChange={(e) => setMovieName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Year"
          value={Year}
          onChange={(e) => setMovieYear(e.target.value)}
        />
        <select id="genre-select" value={Genre} onChange={(e) => setMovieGenre(e.target.value)}>
          <option value="">Genre</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
        <button type="submit" onClick={() => setPage(1)}>Search</button>
      </form>
      {hasSearched && result.length === 0 && (
        <p>No results found</p>
      )}
      {hasSearched && result.length > 0 && (
        <div>
          <div className="poster-grid">
            {result.map(media => (
              <Poster
                media={media}
                mediaType={media.media_type || searchType}
                key={media.id}
              />
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

export default AdvancedSearch;