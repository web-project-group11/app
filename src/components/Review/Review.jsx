import { Link } from "react-router-dom";
import star from "../../img/star.png";
import { useUser } from "../../context/useUser.jsx";
import "./Review.css";

export default function Review({ review, context, onDelete }) {
  const { authUser } = useUser();
  const isOwner = String(authUser.id) === String(review.user_id);
  //   console.log("in Review.jsx", review);

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  //   const userame = reviews[0].username || "Unknown User";
  //   console.log("username:", userName);
  //   console.log("review in Review.jsx:", review);
//   console.log("Is owner:", isOwner);

  const handleDelete = async () => {
    onDelete(review.id);
  }


  const createdAt = new Date(review.created_at);

  return (
    <article className="review">
      <div className="review-heading">
        <div className="review-meta">
          <div
            className="stars"
            role="img"
            aria-label={`${review.grade} out of 5 stars`}
          >
            {Array.from({ length: 5 }, (_, index) => (
              <img
                key={index}
                src={star}
                alt=""
                className={index < review.grade ? "star filled" : "star empty"}
              />
            ))}
          </div>
          <span className="review-meta-separator" aria-hidden="true">
            ·
          </span>
          {context === "mediaPage" ? (
            <Link className="review-link" to={`/users/${review.username}`}>
              {review.username}
            </Link>
          ) : (
            <Link className="review-link" to={`/${review.type}/${review.movie_id}`}>
              {review.movie?.title || review.movie?.name}
            </Link>
          )}
          <span className="review-meta-separator" aria-hidden="true">
            ·
          </span>
          <time dateTime={review.created_at}>
            {dateFormatter.format(createdAt)}
          </time>
        </div>
        {isOwner && (
          <button className="delete-review" type="button" onClick={handleDelete}>
            Delete
          </button>
        )}
      </div>
      {review.description && (
        <p className="review-description">{review.description}</p>
      )}
    </article>
  );
}
