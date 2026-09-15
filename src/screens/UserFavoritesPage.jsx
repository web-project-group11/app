import { useEffect, useState } from "react"
import axios from "axios"
import { useUser } from "../context/useUser.jsx"

const apiUrl = import.meta.env.VITE_API_URL

function UserFavoritesPage() {
  const { authUser } = useUser()
  const [ userFavorites, setFavorites ] = useState([])

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/movie/myFavorites`, {
          headers: {
            Authorization: `Bearer ${authUser.token}`,
          },
        })
        setFavorites(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    if (authUser?.token) {
      fetchFavorites()
    }
  }, [authUser?.token])

  return (
    <div>
      <h1>My Favorites</h1>
      <ul>
        {userFavorites.map((favorite) => (
          <li key={favorite.movie_id}>{favorite.movie_id}</li>
        ))}
      </ul>
    </div>
  )
}

export default UserFavoritesPage;
