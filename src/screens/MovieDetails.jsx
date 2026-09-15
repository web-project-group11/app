import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Poster from "../components/Poster.jsx";
import Reviews from "../components/MovieReviews.jsx";
import { useUser } from "../context/useUser.jsx";

const apiUrl = import.meta.env.VITE_API_URL

function MovieDetails() {
  const { movieid } = useParams();
  const { authUser } = useUser();
  
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

  const handleAddFavorite = async () => {
    try {
      if (!authUser?.token) {
        alert("You must be logged in to add favorites")
        return
      }
      await axios.post(
        `${apiUrl}/api/movie/favorites/${movieid}`,
        {},
        { 
          headers: { 
            Authorization: `Bearer ${authUser.token}` 
          } }
      )
      alert("movie added to favorites")
    }catch(error) {
      alert(error.response?.data?.message || "Adding favorite failed")
    }
  }

  return (
    <div>
      <h3>Movie Details</h3>
      {movie && <Poster movie={movie} />}
      <p>Id: {movie?.id}</p>
      <p>Title: {movie?.title}</p>
      <p>Overview: {movie?.overview}</p>
      <p>Release Date: {movie?.release_date}</p>
      <Reviews reviews={reviews} />
      {authUser.token ? (
        <button type="button" onClick={handleAddFavorite}>
          Add to MyFavorites
        </button>
      ):( 
        <button type="button">Remove from favourites</button>
       )} 
    </div>
  );
}

export default MovieDetails;
