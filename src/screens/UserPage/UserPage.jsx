import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import axios from "axios"

import star from "../../img/star.png"

const apiUrl = import.meta.env.VITE_API_URL

import './UserPage.css'

function UserPage() {
    const { username } = useParams()
    const navigate = useNavigate()

    const [user, setUser] = useState({})

    const [currentPage, setCurrentPage] = useState(1)
    const [pageCount, setPageCount] = useState(0)

    // Reviews currently being shown
    const [shownReviews, setShownReviews] = useState([])

    // All reviews retrieved so far
    const [reviews, setReviews] = useState([])

    const reviewsPerPage = 5

    // Fetch user
    useEffect(() => {
        // Get user_id so we can use it for future requests and stats such as total reviews and average grade 
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

    const fetchReviews = async (page) => {
    try {
        const params = {
            page,
            limit: reviewsPerPage
        }

        const response = await axios.get(
            `${apiUrl}/api/user/${user.id}/reviews`,
            { params }
        )

        const newReviews = response.data

        // need to fetch movie title for each review since review only has the movie_id
        const reviewsWithMovies = await Promise.all(
            newReviews.map(async (review) => {
                const movieResponse = await axios.get(
                    `${apiUrl}/api/movie`,
                    {
                        params: {
                            movieid: review.movie_id,
                            mediatype: review.type
                        }
                    }
                )

                // Add movie data to review object
                return {
                    ...review,
                    movie: movieResponse.data
                }
            })
        )

        // Add fetched reviews with movie data to reviews state
        setReviews(prevReviews => [
            ...prevReviews,
            ...reviewsWithMovies
        ])

        setShownReviews(reviewsWithMovies)

    } catch (error) {
        console.error(error)
    }
}
    useEffect(() => {
        if (!user.id) return

        setPageCount(
            Math.ceil(user.review_count / reviewsPerPage)
        )

        fetchReviews(1)
    }, [user.id])

    const handleNext = async () => {
        const nextPage = currentPage + 1

        // If we already retrieved this page, don't fetch it again
        const startIndex = (nextPage - 1) * reviewsPerPage
        const endIndex = startIndex + reviewsPerPage

        if (reviews.length >= endIndex) {
            setShownReviews(
                reviews.slice(startIndex, endIndex)
            )

            setCurrentPage(nextPage)
            return
        }

        // Otherwise fetch it
        await fetchReviews(nextPage)

        setCurrentPage(nextPage)
    }

    const handlePrevious = () => {
        if (currentPage === 1) return

        const previousPage = currentPage - 1

        // Need to calculate which reviews to slice from list of all reviews fetched so far so we can show the correct page
        const startIndex = (previousPage - 1) * reviewsPerPage
        const endIndex = startIndex + reviewsPerPage

        setShownReviews(
            reviews.slice(startIndex, endIndex)
        )

        setCurrentPage(previousPage)
    }

    return (
        <div>
            <h1>{user.username}</h1>

            <p>
                Account created{" "}
                {user.created_at && new Date(user.created_at).toLocaleDateString("fi-FI")}
            </p>

            <div>
                <h2>Total reviews:</h2>
                <h1>{user.review_count}</h1>
            </div>

            <div>
                <h2>Average grade:</h2>
                <h1>{user.review_average}</h1>
            </div>

            <button
                onClick={() =>
                    navigate(`/users/${username}/favorites`)
                }
            >
                Favorites
            </button>

            <div id="reviews-container">

                {shownReviews.length === 0 ? (
                    <p>No reviews available.</p>
                ) : (
                    shownReviews.map(review => (
                        <div
                            className="review"
                            key={review.id}
                        >

                            <p>
                                {username}'s review on {" "}
                                <Link to={`/${review.type}/${review.movie_id}`}>
                                    {review.movie?.title}
                                </Link>
                            </p>

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
                            </div>

                            {review.description && <p>{review.description}</p>}

                            <p>
                                Reviewed on {new Date(review.created_at).toLocaleDateString("fi-FI")}
                            </p>

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
                    Page {currentPage} / {pageCount}
                </span>

                <button
                    onClick={handleNext}
                    disabled={currentPage >= pageCount}
                >
                    Next
                </button>

            </div>

        </div>
    )
}

export default UserPage