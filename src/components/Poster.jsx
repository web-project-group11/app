import { Link } from "react-router-dom";
import "./Poster.css"

export default function Poster({ media, mediaType }) {

  const type = media.media_type || mediaType;
  
  const posterUrl = media.poster_path
    ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";
  
  // console.log("Poster mediatype: ", type);

  return (
    <div className="poster">
      <Link to={`/${type}/${media.id}`}>
        <img src={posterUrl} alt={media.title} />
      </Link>
    </div>
  );
}
