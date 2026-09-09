import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Poster from "../components/Poster.jsx";
import Reviews from "../components/MovieReviews.jsx";

const apiUrl = import.meta.env.VITE_API_URL

function MovieDetails() {
  const { movieid } = useParams();
  
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchMovieDetails();
    fetchMovieReviews();
  }, [movieid]);

  const fetchMovieDetails = () => {
    axios
      .get(`${apiUrl}/api/movie?movieid=${movieid}`)
      .then((response) => {
        setMovie(response.data);
      })
      .catch((error) => {
        alert(error.response.data ? error.response.data.message : error);
        console.error(error);
      });
  };

  const fetchMovieReviews = () => {
    axios
      .get(`${apiUrl}/api/movie/reviews/${movieid}`)
      .then((response) => {
        setReviews(response.data);
      })
      .catch((error) => {
        alert(error.response.data ? error.response.data.message : error);
        console.error(error);
      });

  };

  return (
    <div>
      <h3>Movie Details</h3>
      {movie && <Poster movie={movie} />}
      <p>Id: {movie?.id}</p>
      <p>Title: {movie?.title}</p>
      <p>Overview: {movie?.overview}</p>
      <p>Release Date: {movie?.release_date}</p>
      <Reviews reviews={reviews} />      
    </div>
  );
}

export default MovieDetails;
