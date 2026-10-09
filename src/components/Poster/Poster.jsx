import { Link } from "react-router-dom";
import "./Poster.css";

export default function Poster({ media, mediaType, context }) {
  let isPlaceholder = false;
  const type = media.media_type || mediaType;
  const title = media.title || media.name || "Untitled";
  const rating =
    Number.isFinite(Number(media.vote_average)) && media.vote_average !== null
      ? Math.min(5, Math.max(0, Number(media.vote_average) / 2))
      : null;

  let posterUrl = media.poster_path
    ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
    : "NoImage";

  if (posterUrl.includes("NoImage")) {
    isPlaceholder = true;
    if (mediaType === "tv") {
      posterUrl = "/img/tvshow_placeholder.png";
    } else {
      posterUrl = "/img/movie_placeholder.png";
    }
  }

  // console.log("Context in Poster.jsx:", context);

  return (
    <div className="poster">
      {context === "moviePage" ? (
        <img src={posterUrl} alt={media.title || media.name} />
      ) : (
        <Link to={`/${type}/${media.id}`}>
          <img src={posterUrl} alt={media.title || media.name} />
        </Link>
      )}
      {isPlaceholder && (
        <div>
          <div className="placeholder-top-text">
            <p>No Image Available</p>
          </div>
          <div className="placeholder-bottom-text">
            <p>{media.title || media.name}</p>
          </div>
        </div>
      )}
      {context !== "moviePage" && (
        <div className="poster-details">
          <h3 className="poster-title">{title}</h3>
          {rating !== null && (
            <div
              className="poster-rating"
              role="img"
              aria-label={`Rating ${rating.toFixed(1)} out of 5`}
            >
              <span
                className="poster-stars"
                style={{ "--rating": `${rating * 20}%` }}
                aria-hidden="true"
              >
                ★★★★★
              </span>
              <span>{rating.toFixed(1)}/5.0</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
