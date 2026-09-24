import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"

import star from "../../img/star.png"

const apiUrl = import.meta.env.VITE_API_URL

function UserPage() {
    const { username } = useParams()
    const navigate = useNavigate()

    const [user, setUser] = useState({})
    const [reviews, setReviews] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)

    const averageGrade =
        reviews.length > 0
            ? reviews.reduce((sum, review) => sum + review.grade, 0) / reviews.length
            : 0

    // Fetch user
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(
                    `${apiUrl}/api/user/${username}`
                )

                setUser(response.data)
            } catch (error) {
                console.error(error)
            }
        }

        fetchUser()
    }, [username])

    // Fetch reviews
    const fetchReviews = async (page, append = true) => {
        try {
            const params = {
                page,
                limit: 20
            }

            const response = await axios.get(
                `${apiUrl}/api/user/${username}/reviews`,
                { params }
            )

            const newReviews = response.data

            if (append) {
                setReviews(prevReviews => [
                    ...prevReviews,
                    ...newReviews
                ])
            } else {
                setReviews(newReviews)
            }

            setHasMore(newReviews.length === 20)

        } catch (error) {
            console.error(error)
        }
    }

    // Fetch first 20 reviews when username changes
    useEffect(() => {
        setReviews([])
        setCurrentPage(1)
        setHasMore(true)

        fetchReviews(1, false)
    }, [username])

    const handleNext = () => {
        const nextPage = currentPage + 1

        fetchReviews(nextPage, true)
        setCurrentPage(nextPage)
    }

    const handlePrevious = () => {
        if (currentPage === 1) return

        // Remove the last 20 reviews
        setReviews(prevReviews =>
            prevReviews.slice(0, prevReviews.length - 20)
        )

        setCurrentPage(currentPage - 1)
        setHasMore(true)
    }

    return (
        <div>

            <h1>{user?.username}</h1>

            <p>
                Account created{" "}
                {user?.created_at &&
                    new Date(user.created_at).toLocaleDateString("fi-FI")}
            </p>

            <div>
                <h2>Total reviews:</h2>
                <h1>{reviews.length}</h1>
            </div>

            <div>
                <h2>Average grade:</h2>
                <h1>{averageGrade.toFixed(1)}</h1>
            </div>

            <button onClick={() => navigate(`/users/${username}/favorites`)}>
                Favorites
            </button>

            <div id="reviews-container">

                {reviews.length === 0 ? (
                    <p>No reviews available.</p>
                ) : (
                    reviews.map(review => (
                        <div className="review" key={review.id}>

                            <p>{review.username}</p>

                            <div className="stars">

                                {Array.from(
                                    { length: 5 },
                                    (_, index) => (
                                        <img
                                            key={index}
                                            src={star}
                                            alt=""
                                            className={
                                                index < review.grade
                                                    ? "star filled"
                                                    : "star empty"
                                            }
                                        />
                                    )
                                )}

                                <span>{review.description}</span>

                            </div>

                        </div>
                    ))
                )}

            </div>

            <div className="pagination">

                <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>

                <span>
                    Page {currentPage}
                </span>

                <button
                    onClick={handleNext}
                    disabled={!hasMore}
                >
                    Next
                </button>

            </div>

        </div>
    )
}

export default UserPage