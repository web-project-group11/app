import { useState } from "react";
import Review from "./Review/Review.jsx";
import "./Reviews.css";

export default function Reviews({ reviews, mediaType }) {
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const currentReviews = reviews.slice(startIndex, startIndex + reviewsPerPage);
  const averageGrade =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.grade, 0) / reviews.length
      : 0;

  const type = mediaType === "movie" ? "movie" : "series";

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // console.log("In Reviews.jsx:", reviews);
  // console.log("Current reviews:", currentReviews);

  return (
    <div id="reviews-container">
      {reviews.length === 0 ? (
        <p>No reviews available for this {type}.</p>
      ) : (
        <div>
          <p>Average Grade: {averageGrade.toFixed(1)}</p>
        </div>
      )}

      {/* Mapping through the current reviews and rendering the Review component for each review */}
      {currentReviews.map((review) => (
        <Review key={review.id} review={review} mediaType={mediaType} />
      ))}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span> </span>
          <span>
            Page {currentPage} / {totalPages}
          </span>
          <span> </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
