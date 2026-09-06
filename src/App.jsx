import { Link, Route, Routes } from "react-router-dom"
import SimpleSearch from "./screens/SearchPage.jsx"
import MovieDetails from "./screens/MovieDetailsPage.jsx"
import HomePage from "./screens/HomePage.jsx"

function App() {
  return (
    <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SimpleSearch />} />
          <Route path="/movie/:movieId" element={<MovieDetails />} />
        </Routes>
    </div>
  );
}

export default App;
