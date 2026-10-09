import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../context/useUser.jsx";
import "./Poster.css";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Poster({ media, mediaType, context, onFavoriteChange }) {
  const { authUser } = useUser();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isUpdatingFavorite, setIsUpdatingFavorite] = useState(false);
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

  useEffect(() => {
    if (context === "moviePage" || !authUser?.token || !media.id || !type) {
      setIsFavorite(false);
      return;
    }

    let isCancelled = false;
    axios
      .get(`${apiUrl}/api/movie/myfavorites/${type}/${media.id}`, {
        headers: { Authorization: `Bearer ${authUser.token}` },
      })
      .then((response) => {
        if (!isCancelled) setIsFavorite(response.data.isFavorite);
      })
      .catch((error) => console.error(error));

    return () => {
      isCancelled = true;
    };
  }, [authUser?.token, context, media.id, type]);

  const handleFavoriteClick = async () => {
    if (!authUser?.token) {
      navigate("/login");
      return;
    }
    if (isUpdatingFavorite) return;

    setIsUpdatingFavorite(true);
    const config = {
      headers: { Authorization: `Bearer ${authUser.token}` },
    };

    try {
      if (isFavorite) {
        await axios.delete(
          `${apiUrl}/api/movie/myfavorites/${type}/${media.id}`,
          config,
        );
      } else {
        await axios.post(
          `${apiUrl}/api/movie/myfavorites/${type}/${media.id}`,
          {},
          config,
        );
      }
      const nextFavoriteState = !isFavorite;
      setIsFavorite(nextFavoriteState);
      onFavoriteChange?.(media.id, type, nextFavoriteState);
    } catch (error) {
      alert(error.response?.data?.message || "Updating favorites failed");
    } finally {
      setIsUpdatingFavorite(false);
    }
  };

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
      {context !== "moviePage" && (
        <button
          className={`poster-favorite-button${isFavorite ? " is-favorite" : ""}`}
          type="button"
          onClick={handleFavoriteClick}
          disabled={isUpdatingFavorite}
          aria-label={
            authUser?.token
              ? `${isFavorite ? "Remove" : "Add"} ${title} ${isFavorite ? "from" : "to"} favorites`
              : `Sign in to add ${title} to favorites`
          }
          aria-pressed={isFavorite}
          title={
            authUser?.token
              ? isFavorite
                ? "Remove from favorites"
                : "Add to favorites"
              : "Sign in to add to favorites"
          }
        >
          {isFavorite ? "♥" : "♡"}
        </button>
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
