import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"
import Poster from "../../components/Poster.jsx"
import Reviews from "../../components/MovieReviews.jsx"
import ReviewForm from "../../components/ReviewForm/ReviewForm.jsx"

import { useUser } from "../../context/useUser.jsx"

import './MoviePage.css'

const apiUrl = import.meta.env.VITE_API_URL

function MoviePage() {
  const { authUser } = useUser()
  //const { movieid } = useParams()
  const { mediaType, mediaId } = useParams()

  
  const [media, setMedia] = useState(null)
  const [reviews, setReviews] = useState([])
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    if (!authUser?.token) {
      setIsFavorite(false)
      return
    }

    axios
      .get(`${apiUrl}/api/movie/myfavorites/${mediaType}/${mediaId}`, {
        headers: 
        { 
          Authorization: `Bearer ${authUser.token}` 
        },
      })
      .then((response) => setIsFavorite(response.data.isFavorite))
      .catch((error) => console.error(error))
  }, [authUser?.token, mediaId, mediaType])

  // Get data from TMDB API
  const fetchMovieDetails = () => {
    axios
      .get(`${apiUrl}/api/movie?mediatype=${mediaType}&movieid=${mediaId}`)
      .then((response) => {
        setMedia(response.data)
      })
      .catch((error) => {
        alert(error.response.data ? error.response.data.message : error)
        console.error(error)
      })
  }

  // Get reviews for the movie from database
  const fetchMovieReviews = () => {
    axios
      .get(`${apiUrl}/api/movie/reviews/${mediaType}/${mediaId}`)
      .then((response) => {
        setReviews(response.data)
      })
      .catch((error) => {
        alert(error.response.data ? error.response.data.message : error)
        console.error(error)
      })

  }

    useEffect(() => {
    fetchMovieDetails()
    fetchMovieReviews()
  }, [mediaId, mediaType])


  const handleMyFavorites = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${authUser.token}` },
      }

      if (isFavorite) {
        await axios.delete(`${apiUrl}/api/movie/myfavorites/${mediaType}/${mediaId}`, config)
        setIsFavorite(false)
        alert(`${mediaType} removed from favorites`)
      } else {
        await axios.post(`${apiUrl}/api/movie/myfavorites/${mediaType}/${mediaId}`, {}, config)
        setIsFavorite(true)
        alert(`${mediaType} added to favorites`)
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Adding favorite failed')
      console.error(error)
    }
  }

  return (
    <div>
      <h3>{mediaType === 'movie' ? 'Movie' : 'Series'} Details</h3>
      {media && <Poster media={media} />}
      <p>Id: {media?.id}</p>
      <p>Title: {media?.title}</p>
      <p>Overview: {media?.overview}</p>
      <p>Release Date: {media?.release_date}</p>
      {authUser?.token && <ReviewForm mediaType={mediaType} mediaId={mediaId} fetchMovieReviews={fetchMovieReviews} />}
      <Reviews reviews={reviews} mediaType={mediaType} />

      {authUser?.token && (
        <button type="button" onClick={handleMyFavorites}>
          {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        </button>
      )}

    </div>
  )
}

export default MoviePage;
