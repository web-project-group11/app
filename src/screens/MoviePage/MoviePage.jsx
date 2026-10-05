import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "../../context/useUser.jsx";
import axios from "axios";
import Poster from "../../components/Poster/Poster.jsx";
import Reviews from "../../components/Reviews.jsx";
import ReviewForm from "../../components/ReviewForm/ReviewForm.jsx";
import genres from "../../helper/Genres.js";
import star from "../../img/star.png";

import "./MoviePage.css";

const apiUrl = import.meta.env.VITE_API_URL;

function MoviePage() {
  const { authUser } = useUser();
  const { mediaType, mediaId } = useParams();
  const [media, setMedia] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviewDeleted, setReviewDeleted] = useState(false);

  useEffect(() => {
    if (!authUser?.token) {
      setIsFavorite(false);
      return;
    }

    axios
      .get(`${apiUrl}/api/movie/myfavorites/${mediaType}/${mediaId}`, {
        headers: {
          Authorization: `Bearer ${authUser.token}`,
        },
      })
      .then((response) => setIsFavorite(response.data.isFavorite))
      .catch((error) => console.error(error));
  }, [authUser?.token, mediaId, mediaType]);

  // Get data from TMDB API
  const fetchMovieDetails = () => {
    axios
      .get(`${apiUrl}/api/movie?mediatype=${mediaType}&movieid=${mediaId}`)
      .then((response) => {
        console.log("Fetched media details:", response.data);
        setMedia(response.data);
      })
      .catch((error) => {
        alert(error.response.data ? error.response.data.message : error);
        console.error(error);
      });
  };

  // Get reviews for the movie from database
  const fetchMovieReviews = () => {
    axios
      .get(`${apiUrl}/api/movie/reviews/${mediaType}/${mediaId}`)
      .then((response) => {
        setReviews(response.data);
        // console.log("Fetched reviews:", response.data);
      })
      .catch((error) => {
        alert(error.response.data ? error.response.data.message : error);
        console.error(error);
      });
  };

  useEffect(() => {
    fetchMovieDetails();
    fetchMovieReviews();
  }, [mediaId, mediaType]);

  const handleMyFavorites = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${authUser.token}` },
      };
      const message = mediaType === "tv" ? "TV show" : "Movie";

      if (isFavorite) {
        await axios.delete(
          `${apiUrl}/api/movie/myfavorites/${mediaType}/${mediaId}`,
          config,
        );
        setIsFavorite(false);
        alert(`${message} removed from favorites`);
      } else {
        await axios.post(
          `${apiUrl}/api/movie/myfavorites/${mediaType}/${mediaId}`,
          {},
          config,
        );
        setIsFavorite(true);

        alert(`${message} added to favorites`);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Adding favorite failed");
      console.error(error);
    }
  };

  const deleteReview = async (reviewId) => {
    if (!confirm("Are you sure you want to delete your review?")) {
      return;
    }

    // console.log("Deleting review with id in MoviePage:", reviewId);
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authUser.token,
      },
    };

    axios
      .delete(`${apiUrl}/api/movie/review/delete/${reviewId}`, headers)
      .then((response) => {
        fetchMovieReviews();
        setReviewDeleted((prev) => !prev);
        alert(response.data.message);
      })
      .catch((error) => {
        alert(error.response?.data?.message || error);
      });
  };

  const dateFormatter = (media) => {
    const releaseDate = media?.release_date || media?.first_air_date;
    if (!releaseDate) {
      return "No release date";
    }
    const day = new Date(releaseDate).getDate();
    const month = new Date(releaseDate).getMonth() + 1; // Months are zero-based
    const year = new Date(releaseDate).getFullYear();
    return `${day}.${month}.${year}`;
  };

  const runtimeFormatter = (media) => {
    const minutes = media?.runtime || media?.episode_run_time?.[0];
    if (!minutes) {
      return "No runtime info";
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const rating =
    Number.isFinite(Number(media?.vote_average)) && media?.vote_average !== null
      ? Math.min(5, Math.max(0, Number(media?.vote_average) / 2))
      : null;

  console.log("Media average vote:", media?.vote_average);
  console.log("Media average type:", typeof media?.vote_average);

  return (
    <div className="movie-page">
      <div className="movie-hero">
        <div className="poster-column">
          {media && <Poster media={media} context="moviePage" />}
          {authUser?.token && (
            <button
              className="favorite-button"
              type="button"
              onClick={handleMyFavorites}
            >
              {isFavorite ? "Remove from favorites" : "Add to Favorites"}
            </button>
          )}
        </div>
        <div className="movie-details">
          <h3 className="movie-title">{media?.title || media?.name}</h3>
          <p className="movie-meta">
            R - {dateFormatter(media)} -{" "}
            {media?.genres?.length
              ? media.genres
                  .map((genre) => {
                    if (typeof genre === "object") return genre.name;
                    return genres.find((item) => item.id === Number(genre))
                      ?.name;
                  })
                  .filter(Boolean)
                  .join(", ") || "N/A"
              : "No genres available"}{" "}
            - {runtimeFormatter(media)}{" "}
          </p>
          <div className="stars">
            <p>
              {Array.from({ length: 5 }, (_, index) => (
                <img
                  key={index}
                  src={star}
                  alt=""
                  className={
                    index < Math.round(media?.vote_average) / 2
                      ? "star filled"
                      : "star empty"
                  }
                />
              ))}
            </p>
          </div>
          {media?.tagline && <p className="movie-tagline">"{media.tagline}"</p>}
          <p className="movie-overview">{media?.overview}</p>
          {media?.number_of_episodes && (
            <p>
              Episodes:{" "}
              {media.number_of_episodes || "No episodes data available"}
            </p>
          )}
        </div>
      </div>
      <div className="reviews-section">
        {authUser?.token && (
          <ReviewForm
            mediaType={mediaType}
            mediaId={mediaId}
            fetchMovieReviews={fetchMovieReviews}
            reviewDeleted={reviewDeleted}
          />
        )}
        <Reviews
          reviews={reviews}
          mediaType={mediaType}
          onDelete={deleteReview}
        />
      </div>
    </div>
  );
}

export default MoviePage;
