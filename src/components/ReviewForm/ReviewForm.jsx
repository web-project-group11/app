import { useState, useEffect } from "react";
import axios from "axios";

import { useUser } from "../../context/useUser.jsx";

import "./ReviewForm.css";

const apiUrl = import.meta.env.VITE_API_URL;
const emptyReview = { grade: 0, description: "" };

const getAuthConfig = (token) => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});

const showRequestError = (error) => {
  alert(error.response?.data?.message || error.message || "Request failed");
};

function ReviewForm({ mediaType, mediaId, fetchMovieReviews, reviewDeleted }) {
  const { authUser } = useUser();
  const [review, setReview] = useState(emptyReview);
  const [reviewId, setReviewId] = useState(null);
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    if (!authUser.token) {
      setReview(emptyReview);
      setReviewId(null);
      return;
    }

    setReview(emptyReview);
    setReviewId(null);
    let isCurrent = true;

    axios
      .get(
        `${apiUrl}/api/movie/reviews/${mediaType}/${mediaId}/${authUser.id}`,
        getAuthConfig(authUser.token),
      )
      .then(({ data }) => {
        if (!isCurrent) return;
        setReview({
          grade: data?.grade ?? 0,
          description: data?.description ?? "",
        });
        setReviewId(data?.id ?? null);
      })
      .catch((error) => {
        if (isCurrent) showRequestError(error);
      });

    return () => {
      isCurrent = false;
    };
  }, [authUser.id, authUser.token, mediaId, mediaType]);

  useEffect(() => {
    if (reviewDeleted) {
      setReview(emptyReview);
      setReviewId(null);
    }
  }, [reviewDeleted]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authUser.token) {
      alert("Cant post review without an account");
      return;
    }

    if (reviewId && !confirm("Are you sure you want to update your review?")) {
      return;
    }

    try {
      if (reviewId) {
        const { data } = await axios.put(
          `${apiUrl}/api/movie/review/${reviewId}`,
          review,
          getAuthConfig(authUser.token),
        );
        alert(data.message);
      } else {
        const { data } = await axios.post(
          `${apiUrl}/api/movie/reviews/${mediaType}/${mediaId}`,
          review,
          getAuthConfig(authUser.token),
        );
        setReviewId(data.rows[0].id);
      }

      fetchMovieReviews();
    } catch (error) {
      showRequestError(error);
    }
  };

  const deleteReview = async () => {
    if (!authUser.token) {
      alert("Cant delete review without an account");
      return;
    }

    if (!reviewId) {
      alert("No review to delete");
      return;
    }

    if (!confirm("Are you sure you want to delete your review?")) {
      return;
    }

    try {
      const { data } = await axios.delete(
        `${apiUrl}/api/movie/review/delete/${reviewId}`,
        getAuthConfig(authUser.token),
      );
      setReview(emptyReview);
      setReviewId(null);
      fetchMovieReviews();
      alert(data.message);
    } catch (error) {
      showRequestError(error);
    }
  };

  return (
    <div className="review-form">
      <h3>Submit a review</h3>
      <form onSubmit={handleSubmit}>
        <fieldset
          className="rating"
          onMouseLeave={() => setHoveredRating(0)}
        >
          <legend>Your rating</legend>
          {Array.from({ length: 5 }, (_, i) => {
            const rating = i + 1;
            const displayedRating = hoveredRating || review.grade;

            return (
              <span className="rating-choice" key={rating}>
                <input
                  id={`rating-${rating}`}
                  type="radio"
                  name="rating"
                  checked={review.grade === rating}
                  value={rating}
                  aria-label={`${rating} star${rating === 1 ? "" : "s"}`}
                  onFocus={() => setHoveredRating(rating)}
                  onBlur={() => setHoveredRating(0)}
                  onChange={() =>
                    setReview((currentReview) => ({
                      ...currentReview,
                      grade: rating,
                    }))
                  }
                />
                <label
                  htmlFor={`rating-${rating}`}
                  className={rating <= displayedRating ? "is-filled" : ""}
                  onMouseEnter={() => setHoveredRating(rating)}
                >
                  ★
                </label>
              </span>
            );
          })}
        </fieldset>
        <textarea
          className="review-description"
          placeholder="Write your review"
          aria-label="Review description"
          rows={5}
          value={review.description}
          onChange={(e) =>
            setReview((currentReview) => ({
              ...currentReview,
              description: e.target.value,
            }))
          }
        />
        <div className="Buttons">
          <button
            className={reviewId ? "update-review-button" : undefined}
            type="submit"
          >
            {reviewId ? "Update review" : "Submit review"}
          </button>
          {reviewId && (
            <button
              className="delete-review-button"
              type="button"
              onClick={deleteReview}
            >
              Delete review
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ReviewForm;
