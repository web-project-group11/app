import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import Poster from "../../components/Poster"

const apiUrl = import.meta.env.VITE_API_URL

function UserFavoritesPage() {
  const [ favorites, setFavorites ] = useState([])
  const [ mediaItems, setMediaItems ] = useState([])
  const { username } = useParams()

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/user/${username}/favorites`)
        setFavorites(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    if (username) {
      fetchFavorites()
    }
  }, [username])

  useEffect(() => {
    const fetchMediaDetails = async () => {
      const result = await Promise.all(favorites.map(async (favorite) => {
        const response = await axios.get(
          `${apiUrl}/api/movie?mediatype=${favorite.type}&movieid=${favorite.movie_id}`
        )

        return {
          ...response.data, media_type: favorite.type,
        }
      })
    )
    setMediaItems(result)
    }
    fetchMediaDetails()
  }, [favorites])

  return (
    <div>
      <h1>{ username }'s Favorites</h1>
      <ul>
        <div className="poster-grid">
          {mediaItems.map((media) => (
            <Poster
              key={`${media.media_type}-${media.id}`}
              media={media}
              mediaType={media.media_type}
            />
          ))}
        </div>
      </ul>
    </div>
  )
}

export default UserFavoritesPage;
