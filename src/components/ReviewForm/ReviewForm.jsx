import { useState } from 'react'
import axios from 'axios'

import { useUser } from '../../context/useUser.jsx'

import './ReviewForm.css'

const apiUrl = import.meta.env.VITE_API_URL

function ReviewForm({movieId, fetchMovieReviews}) {
    const { authUser } = useUser()
    const [ review, setReview ] = useState({grade: 0, description: ''})

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!authUser.token) {
            alert('Cant post review without an account')
            return
        }

        const headers = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authUser.token
            }
        }

        axios.post(`${apiUrl}/api/movie/reviews/${movieId}`, JSON.stringify(review), headers)
            .then(response => {
                fetchMovieReviews()
                console.log(response.data)
            })
            .catch(error => {
                alert(error.response.data ? error.response.data.message : error)
            })
    }

    return (
        <div>
            <h3>Submit a review</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    {Array.from({ length: 5 }, (_, i) => {
                        const rating = i + 1

                        return (
                            <>
                                <input 
                                    type="radio" 
                                    name="rating" 
                                    value={rating}
                                    onChange={e => setReview({ ...review, grade: Number(e.target.value) })}
                                />
                                <label key={rating}>{rating}</label>
                            </>
                        )
                    })}
                </div>

                <label>Description</label>
                <input
                    placeholder='Description'
                    type='text' value={review.description}
                    onChange={e => setReview({ ...review, description: e.target.value })}
                />

                <button type='submit'>Submit review</button>
            </form>
        </div>
    )
}

export default ReviewForm