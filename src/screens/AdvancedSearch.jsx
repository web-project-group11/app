import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Poster from "../components/Poster/Poster.jsx";
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
  const [hasMore, setHasMore] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [cursorHistory, setCursorHistory] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const type = searchParams.get("type");
    const query = searchParams.get("query");
    const genre = searchParams.get("genre");
    const year = searchParams.get("year");
    const urlPage = Number(searchParams.get("page")) || 1;
    const urlCursor = searchParams.get("cursor");

    if (!type && !query && !genre && !year) {
      setResult([]);
      setHasSearched(false);
      setPage(1);
      setSearchType("all");
      setMovieName("");
      setMovieGenre("");
      setMovieYear("");
      setCursor(null);
      return;
    }

    setSearchType(type || "all");
    setMovieName(query || "");
    setMovieGenre(genre || "");
    setMovieYear(year || "");
    setPage(urlPage);
    setCursor(urlCursor);
    setLoading(true);

    axios
      .get(`${apiUrl}/api/search`, {
        params: {
          type: type || "all",
          query: query || "",
          genre: genre || "",
          year: year || "",
          page: urlPage,
          cursor: urlCursor || null,
        },
      })
      .then((response) => {
        setResult(response.data.results);
        setHasMore(response.data.hasMore);
        setHasSearched(true);
        // console.log("Fetched results:", response.data.results);
        // console.log("Cursor:", response.data.nextCursor);
        console.log("Has more results:", response.data.hasMore);
        setCursor(response.data.nextCursor);
      })
      .catch((error) => {
        alert(error.response?.data?.message || error.message);
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchParams]);

  const search = (e) => {
    e.preventDefault();

    setSearchParams({
      type: searchType,
      query: Name,
      genre: Genre,
      year: Year,
      page: 1,
    });

    setHasSearched(true);
  };

  const nextPage = () => {
    if (!cursor) return;

    const nextPageNumber = page + 1;

    setCursorHistory((prev) => ({
      ...prev,
      [nextPageNumber]: cursor,
    }));

    setSearchParams({
      type: searchType,
      query: Name,
      genre: Genre,
      year: Year,
      page: nextPageNumber,
      cursor,
    });
  };

  const previousPage = () => {
    if (page <= 1) return;

    const previousPageNumber = page - 1;
    const previousCursor = cursorHistory[previousPageNumber];

    setSearchParams({
      type: searchType,
      query: Name,
      genre: Genre,
      year: Year,
      page: previousPageNumber,
      ...(previousCursor ? { cursor: previousCursor } : {}),
    });
  };

  return (
    <div id="search-container">
      <h3>Advanced Search</h3>
      <form id="search-form" onSubmit={search}>
        <select
          id="type-select"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
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
        <select
          id="genre-select"
          value={Genre}
          onChange={(e) => setMovieGenre(e.target.value)}
        >
          <option value="">Genre</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
        <button type="submit" onClick={search}>
          Search
        </button>
      </form>
      {loading && <p>Loading...</p>}
      {hasSearched && result.length === 0 && !hasMore && (
        <p>No results found</p>
      )}
      {hasSearched && hasMore && (
        <div>
          {result.length < 5 && (
            <p className="search-info">
              Using many parameters, search may be slow
              {result.length === 0 && "...and one page may not have results"}
            </p>
          )}
          <div className="poster-grid">
            {result.map((media) => (
              <Poster
                media={media}
                mediaType={media.media_type || searchType}
                key={media.id}
              />
            ))}
          </div>
          <p id="pagination">
            <button
              id="prev-page"
              type="button"
              onClick={previousPage}
              disabled={loading || page <= 1}
            >
              Previous
            </button>
            Page {page}
            <button
              id="next-page"
              type="button"
              onClick={nextPage}
              disabled={loading || !cursor}
            >
              Next
            </button>
          </p>
        </div>
      )}
    </div>
  );
}

export default AdvancedSearch;
