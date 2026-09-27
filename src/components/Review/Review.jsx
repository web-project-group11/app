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
  console.log("Is owner:", isOwner);

  return (
    <div className="review">
      <p>
        {Array.from({ length: 5 }, (_, index) => (
          <img
            key={index}
            src={star}
            alt=""
            className={index < review.grade ? "star filled" : "star empty"}
          />
        ))}
        <span>--- </span>
        {context === "mediaPage" ? (
          <Link className="user-link" to={`/users/${review.username}`}>
            {review.username}
          </Link>
        ) : (
          <Link to={`/${review.type}/${review.movie_id}`}>
            {review.movie?.title || review.movie?.name}
          </Link>
        )}
        <span> --- </span> {dateFormatter.format(new Date(review.created_at))}
        {isOwner && (
          <button className="delete-review" onClick={() => onDelete(review.id)}>
            Delete
          </button>
        )}
      </p>
      {review.description && <p>{review.description}</p>}
    </div>
  );
}
