import { Link } from "react-router-dom";
import star from "../../img/star.png";
import "./Review.css";

export default function Review({ review }) {
//   console.log("in Review.jsx", review);

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  //   const userame = reviews[0].username || "Unknown User";
  //   console.log("username:", userName);

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
        <span> </span>--- <span> </span>
        <Link className="user-link" to={`/users/${review.username}`}>
          {review.username}
        </Link>
        <span> --- </span> {dateFormatter.format(new Date(review.created_at))}
      </p>
      {review.description && <p>{review.description}</p>}
    </div>
  );
}
