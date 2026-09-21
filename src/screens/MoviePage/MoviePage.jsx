import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Poster from "../../components/Poster.jsx";
import Reviews from "../../components/MovieReviews.jsx";
import ReviewForm from "../../components/ReviewForm/ReviewForm.jsx"

import { useUser } from "../../context/useUser.jsx";

import './MoviePage.css'

const apiUrl = import.meta.env.VITE_API_URL

function MoviePage() {
  const { authUser } = useUser();
  //const { movieid } = useParams();
  const { mediatype, mediaid } = useParams();

  
  const [media, setMedia] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchMovieDetails();
    fetchMovieReviews();
  }, [mediaid]);

  // Get data from TMDB API
  const fetchMovieDetails = () => {
    axios
      .get(`${apiUrl}/api/movie?mediatype=${mediatype}&movieid=${mediaid}`)
      .then((response) => {
        setMedia(response.data);
      })
      .catch((error) => {
        alert(error.response.data ? error.response.data.message : error);
        console.error(error);
      });
  };

  // Get reviews for the movie from database
  const fetchMovieReviews = () => {
    axios
      .get(`${apiUrl}/api/movie/reviews/${mediatype}/${mediaid}`)
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
      <h3>{mediatype === 'movie' ? 'Movie' : 'Serie'} Details</h3>
      {media && <Poster media={media} />}
      <p>Id: {media?.id}</p>
      <p>Title: {media?.title}</p>
      <p>Overview: {media?.overview}</p>
      <p>Release Date: {media?.release_date}</p>
      {authUser.token && <ReviewForm mediaType={mediaType} mediaId={mediaId} fetchMovieReviews={fetchMovieReviews} />}
      <Reviews reviews={reviews} mediatype={mediatype} />      

    </div>
  );
}

export default MoviePage;
