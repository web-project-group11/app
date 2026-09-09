import { useState } from "react";
import star from "../img/star.png";
import "./MovieReviews.css";

export default function Reviews({ reviews }) {
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const currentReviews = reviews.slice(startIndex, startIndex + reviewsPerPage);
  const averageGrade =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.grade, 0) / reviews.length
      : 0;

  return (
    <div id = "reviews-container">
        {reviews.length === 0 ? (
          <p>No reviews available for this movie.</p>
        ) : (
          <div>
            <p>Average Grade: {averageGrade.toFixed(1)}</p>
          </div>
        )}
      {currentReviews.map((review) => (
        <div className="review" key={review.id}>
            <p>{review.username}</p>
          <div className="stars">
            {Array.from({ length: 5 }, (_, index) => (
              <img
                key={index}
                src={star}
                alt=""
                className={index < review.grade ? "star filled" : "star empty"}
              />
            ))}
            {review.description}
          </div>
          <p></p>
        </div>
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
