import { Routes, Route } from "react-router-dom";
import "./App.css";
import SimpleSearch from "./components/SimpleSearch.jsx";
import MovieDetails from "./components/MovieDetails.jsx";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/search" element={<SimpleSearch />} />
        <Route path="/movie/:movieId" element={<MovieDetails />} />
      </Routes>
    </div>
  );
}

export default App;
