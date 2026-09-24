import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"

const apiUrl = import.meta.env.VITE_API_URL

function UserPage() {
    const { username } = useParams()
    const [user, setUser] = useState({})
    const [ reviews, setReviews ] = useState([])
    const averageGrade = reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.grade, 0) / reviews.length : 0;

    useEffect(() => {
        const fetchUser = async() => {
            try {
                const response = await axios.get(`${apiUrl}/api/user/${username}`)
                setUser(response.data)
            } catch (error) {
                console.error(error)
            }
        }
        fetchUser()
    }, [username])

    useEffect(() => {
        const fetchReviews = async() => {
            try {
                const params = {
                    page: 1,
                    limit: 20
                }
                const response = await axios.get(`${apiUrl}/api/user/${username}/reviews`, {params})
                setReviews(response.data)
            } catch (error) {
                console.error(error)
            }
        }
        fetchReviews()
    }, [user])


    return (
        <div>
            <h1>{user?.username}</h1>
            <p>
                Account created {new Date(user?.created_at).toLocaleDateString('fi-FI')}
            </p>
            <div>
                <h2>Total reviews:</h2>
                <h1>{reviews?.length}</h1>
            </div>
            <div>
                <h2>Average grade:</h2>
                <h1>{averageGrade}</h1>
            </div>
        </div>
    )
}

export default UserPage