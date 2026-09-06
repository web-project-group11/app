import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import SimpleSearch from "./components/Search.jsx";
import MovieDetails from "./components/MovieDetails.jsx";
import "./main.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <div>
        <Routes>
          <Route
            path="/"
            element={
              <Link to="/search">
                <button>Search</button>
              </Link>
            }
          />
          <Route path="/search" element={<SimpleSearch />} />
          <Route path="/movie/:movieId" element={<MovieDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  </StrictMode>,
);