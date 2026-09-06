import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Poster from "./Poster.jsx";

const apiUrl = "http://localhost:3001";

function MovieDetails() {
  const { movieId } = useParams();
  //console.log("MovieDetails component, movieId:", movieId);

  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetchMovieDetails();
  }, [movieId]);

  const fetchMovieDetails = () => {
    // console.log("Fetching movie url:", `${apiUrl}/api/movie?query=${movieId}`);
    axios
      .get(`${apiUrl}/api/movie?query=${movieId}`)
      .then((response) => {
        setMovie(response.data);
        console.log("Movie data in MovieDetails.jsx:", response.data);
        console.log("Movie ID in MovieDetails.jsx:", movie.id);
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
    </div>
  );
}

export default MovieDetails;
