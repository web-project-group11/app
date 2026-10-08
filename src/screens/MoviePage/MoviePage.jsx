import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "../../context/useUser.jsx";
import axios from "axios";
import Poster from "../../components/Poster/Poster.jsx";
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

  const [groups, setGroups] = useState([]);
  const [groupFavoriteStatuses, setGroupFavoriteStatuses] = useState({});
  const [groupIds, setGroupIds] = useState([]);
  const [isGroupListOpen, setIsGroupListOpen] = useState(false);

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

  const handleGroupFavorites = async (groupId) => {
    if (!groupId || !authUser?.token) return;

    const isFavoriteForGroup = groupFavoriteStatuses[groupId] ?? false;
    const url = `${apiUrl}/api/movie/${groupId}/groupfavorites/${mediaType}/${mediaId}`;
    const config = {
      headers: {
        Authorization: `Bearer ${authUser.token}`,
      },
    };

    try {
      if (isFavoriteForGroup) {
        await axios.delete(url, config);
      } else {
        await axios.post(url, {}, config);
      }

      setGroupFavoriteStatuses((currentStatuses) => ({
        ...currentStatuses,
        [groupId]: !isFavoriteForGroup,
      }));
    } catch (error) {
      alert(error.response?.data?.message ?? "Group favorite update failed");
      console.error(error);
    }
  };
  
  useEffect(() => {
    if (!authUser?.token) return;
    
      const fetchGroups = async () => {
        try {
          const response = await axios.get(
            `${apiUrl}/api/group/mine`,
            {
              headers: {
                Authorization: `Bearer ${authUser.token}`,
              },
            }
          );
    
          console.log("Ryhmädata:", response.data);
          setGroups(response.data);
          setGroupIds(response.data.map((group) => group.id))
        } catch (error) {
          console.error("Ryhmien haku epäonnistui:", error);
        }
      };
  
    fetchGroups();
  }, [authUser?.token]);

  useEffect(() => {
  if (!authUser?.token || groupIds.length === 0) return;

  const fetchGroupFavoriteStatuses = async () => {
    try {
      const results = await Promise.all(
        groupIds.map(async (groupId) => {
          const response = await axios.get(
            `${apiUrl}/api/movie/${groupId}/groupfavorites/${mediaType}/${mediaId}`,
            {
              headers: {
                Authorization: `Bearer ${authUser.token}`,
              },
            }
          );

          return [groupId, response.data.isFavorite];
        })
      );
      
      setGroupFavoriteStatuses(Object.fromEntries(results));
    } catch (error) {
      console.error("Ryhmäsuosikkien haku epäonnistui:", error);
    }
  };

  fetchGroupFavoriteStatuses();
}, [authUser?.token, groupIds, mediaType, mediaId]);

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
          <button
            className="favorite-button"
            type="button"
            onClick={() => setIsGroupListOpen((isOpen) => !isOpen)}
            aria-expanded={isGroupListOpen}
            aria-controls="group-favorites-list"
          >
            {isGroupListOpen ? "Hide group favorites" : "Manage group favorites"}
          </button>
          {isGroupListOpen && (
            <div className="group-favorites-list" id="group-favorites-list">
              <p className="group-favorites-title">Group favorites</p>
              {groups.length === 0 ? (
                <p className="group-favorites-empty">You are not a member of any group.</p>
              ) : (
                groups.map((group) => {
                  const isFavoriteForGroup = groupFavoriteStatuses[group.id] ?? false;

                  return (
                    <div className="group-favorite-row" key={group.id}>
                      <span className="group-favorite-name">{group.group_name}</span>
                      <button
                        className="group-favorite-action"
                        type="button"
                        onClick={() => handleGroupFavorites(group.id)}
                      >
                        {isFavoriteForGroup ? "Remove" : "Add"}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
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
