import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../context/useUser.jsx";
import axios from "axios";
import Review from "../../components/Review/Review.jsx";

const apiUrl = import.meta.env.VITE_API_URL;

import "./UserPage.css";

function UserPage() {
  const { authUser } = useUser();
  const { username } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);

  // Reviews currently being shown
  const [shownReviews, setShownReviews] = useState([]);
  // All reviews retrieved so far
  const [reviews, setReviews] = useState([]);
  const reviewsPerPage = 5;

  // Fetch user
  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user.id) return;
    setPageCount(Math.ceil(user.review_count / reviewsPerPage));
    fetchReviews(1);
  }, [user.id]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/user/${username}`);

      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchReviews = async (page, userId = user.id) => {
    try {
      const params = {
        page,
        limit: reviewsPerPage,
      };

      const response = await axios.get(
        `${apiUrl}/api/user/${userId}/reviews`,
        { params },
      );

      const newReviews = response.data;

      // need to fetch movie title for each review since review only has the movie_id
      const reviewsWithMovies = await Promise.all(
        newReviews.map(async (review) => {
          const movieResponse = await axios.get(`${apiUrl}/api/movie`, {
            params: {
              movieid: review.movie_id,
              mediatype: review.type,
            },
          });

          // Add movie data to review object
          return {
            ...review,
            movie: movieResponse.data,
          };
        }),
      );

      // Add fetched reviews with movie data to reviews state
      setReviews((prevReviews) => [...prevReviews, ...reviewsWithMovies]);

      setShownReviews(reviewsWithMovies);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNext = async () => {
    const nextPage = currentPage + 1;

    // If we already retrieved this page, don't fetch it again
    const startIndex = (nextPage - 1) * reviewsPerPage;
    const endIndex = startIndex + reviewsPerPage;

    if (reviews.length >= endIndex) {
      setShownReviews(reviews.slice(startIndex, endIndex));
      setCurrentPage(nextPage);
      return;
    }

    // Otherwise fetch it
    await fetchReviews(nextPage);
    setCurrentPage(nextPage);
  };

  const handlePrevious = () => {
    if (currentPage === 1) return;

    const previousPage = currentPage - 1;

    // Need to calculate which reviews to slice from list of all reviews fetched so far so we can show the correct page
    const startIndex = (previousPage - 1) * reviewsPerPage;
    const endIndex = startIndex + reviewsPerPage;

    setShownReviews(reviews.slice(startIndex, endIndex));
    setCurrentPage(previousPage);
  };

  const deleteReview = async (reviewId) => {
    if (!confirm("Are you sure you want to delete your review?")) {
      return;
    }
    // console.log("Deleting review with id:", reviewId);
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authUser.token,
      },
    };

    try {
      await axios
        .delete(`${apiUrl}/api/movie/review/delete/${reviewId}`, headers)
        .then((response) => {
          alert(response.data.message);
        });
      const updatedUser = await fetchUser();

      setReviews([]);
      setShownReviews([]);
      setCurrentPage(1);
      setPageCount(
        Math.ceil((updatedUser?.review_count ?? 0) / reviewsPerPage),
      );

      if (updatedUser?.id) {
        await fetchReviews(1, updatedUser.id);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  //   console.log("UserPage.jsx: shownReviews:", shownReviews);
  //   console.log("UserPage.jsx: reviews amount:", user.review_count);

  return (
    <main className="user-page">
      <h1>{user.username}</h1>

      <p>
        Account created{" "}
        {user.created_at &&
          new Date(user.created_at).toLocaleDateString("fi-FI")}
      </p>

      <div className="user-page-stats">
          <div>
              <h2>Total reviews:</h2>
              <p>{user.review_count}</p>
          </div>

          <div>
              <h2>Average grade:</h2>
              <p>{Number(user.review_average).toFixed(2)}</p>
          </div>
      </div>

      <button onClick={() => navigate(`/users/${username}/favorites`)}>
        Favorites
      </button>

      <h2>Reviews</h2>
      <div id="reviews-container">
        {shownReviews.map((review) => (
          <Review
            key={review.id}
            review={review}
            onDelete={deleteReview}
            context="userPage"
          />
        ))}
      </div>

      {user.review_count > 5 && (
        <div className="pagination">
          <button onClick={handlePrevious} disabled={currentPage === 1}>
            Previous
          </button>

          <span>
            Page {currentPage} / {pageCount}
          </span>

          <button onClick={handleNext} disabled={currentPage >= pageCount}>
            Next
          </button>
        </div>
      )}
    </main>
  );
}

export default UserPage;
