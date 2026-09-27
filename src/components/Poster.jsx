import { Link } from "react-router-dom";
import "./Poster.css";

export default function Poster({ media, mediaType, context }) {
  const type = media.media_type || mediaType;
  let isPlaceholder = false;
  // console.log("In Poster.jsx, context:", context);

  let posterUrl = media.poster_path
    ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  // console.log("In Poster.jsx, posterUrl:", posterUrl);
  // console.log("Includes: ", posterUrl.includes("No+Image"));

  if (posterUrl.includes("No+Image")) {
    isPlaceholder = true;
    if (mediaType === "tv") {
      posterUrl = "/img/tvshow_placeholder.png";
    } else {
      posterUrl = "/img/movie_placeholder.png";
    }
  }

  const placeholderText = mediaType === "movie" ? "Movie" : "TV-Show";

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
        <div className="poster-text">
          <div className="placeholder-top-text">
            <p>No Image Available</p>
            <p>{placeholderText}</p>
          </div>
          <div className="placeholder-bottom-text">
            <p>{media.title || media.name}</p>
          </div>
        </div>
      )}
    </div>
  );
}
