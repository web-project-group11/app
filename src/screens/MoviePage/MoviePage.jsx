import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "../../context/useUser.jsx";
import axios from "axios";
import Poster from "../../components/Poster.jsx";
import Reviews from "../../components/Reviews.jsx";
import ReviewForm from "../../components/ReviewForm/ReviewForm.jsx";
import genres from "../../helper/Genres.js";

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
          <h3>{mediaType === "movie" ? "Movie" : "Series"} Details</h3>
          <p>Id: {media?.id}</p>
          <p>Title: {media?.title || media?.name}</p>
          <p>Overview: {media?.overview}</p>
          <p>Release Date: {media?.release_date || media?.first_air_date}</p>
          <p>
            Genres: {media?.genres?.length
              ? media.genres
                  .map((genre) => {
                    if (typeof genre === "object") return genre.name;

                    return genres.find((item) => item.id === Number(genre))?.name;
                  })
                  .filter(Boolean)
                  .join(", ") || "N/A"
              : "N/A"}
          </p>
        </div>
      </div>
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
  );
}

export default MoviePage;
