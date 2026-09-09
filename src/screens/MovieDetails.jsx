import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Poster from "../components/Poster.jsx";
import Reviews from "../components/MovieReviews.jsx";

const apiUrl = import.meta.env.VITE_API_URL

function MovieDetails() {
  const { movieId } = useParams();
  //console.log("MovieDetails component, movieId:", movieId);

  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchMovieDetails();
    fetchMovieReviews();
  }, [movieId]);

  const fetchMovieDetails = () => {
    // console.log("Fetching movie details for ID:", movieId);
    axios
      .get(`${apiUrl}/api/movie?query=${movieId}`)
      .then((response) => {
        setMovie(response.data);
        // console.log("Movie data in MovieDetails.jsx:", response.data);
        // console.log("Movie ID in MovieDetails.jsx:", movie.id);
      })
      .catch((error) => {
        alert(error.response.data ? error.response.data.message : error);
        console.error(error);
      });
  };

  const fetchMovieReviews = () => {
    // console.log("Fetching movie reviews for ID:", movieId);
    axios
      .get(`${apiUrl}/api/movie/reviews/${movieId}`)
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
