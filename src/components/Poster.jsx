import { Link } from "react-router-dom";

export default function Poster({ movie }) {

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  return (
    <div className="poster">
      <Link to={`/movie/${movie.id}`}>
        <img src={posterUrl} alt={movie.title} />
      </Link>
    </div>
  );
}
