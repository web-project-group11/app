import { Link } from "react-router-dom";
import "./Poster.css"

export default function Poster({ media, mediaType, context }) {

  const type = media.media_type || mediaType;
  
  console.log("In Poster.jsx, context:", context);

  const posterUrl = media.poster_path
    ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  return (
    <div className="poster">
      {context === "moviePage" ? (
        <img src={posterUrl} alt={media.title} />
      ) : (
        <Link to={`/${type}/${media.id}`}>
          <img src={posterUrl} alt={media.title} />
        </Link>
      )}  
    </div>
  );
}
