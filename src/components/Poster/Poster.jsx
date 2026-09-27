import { Link } from "react-router-dom";
import "./Poster.css"

export default function Poster({ media, mediaType }) {

  const type = media.media_type || mediaType;
  const title = media.title || media.name || "Untitled";
  const rating = Number.isFinite(Number(media.vote_average)) && media.vote_average !== null
    ? Math.min(5, Math.max(0, Number(media.vote_average) / 2))
    : null;
  
  const posterUrl = media.poster_path
    ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  return (
    <div className="poster">
      <Link className="poster-link" to={`/${type}/${media.id}`}>
        <img src={posterUrl} alt={`${title} poster`} />
        <div className="poster-details">
          <h3 className="poster-title">{title}</h3>
          {rating !== null && (
            <div className="poster-rating" role="img" aria-label={`Rating ${rating.toFixed(1)} out of 5`}>
              <span className="poster-stars" style={{ '--rating': `${rating * 20}%` }} aria-hidden="true">★★★★★</span>
              <span>{rating.toFixed(1)}/5.0</span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
