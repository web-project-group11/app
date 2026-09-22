import { useState, useEffect } from 'react'
import axios from 'axios'

import { useUser } from '../../context/useUser.jsx'

import './ReviewForm.css'

const apiUrl = import.meta.env.VITE_API_URL

function ReviewForm({ mediaType, mediaId, fetchMovieReviews }) {
    const { authUser } = useUser()
    const [review, setReview] = useState({ grade: 0, description: '' })
    const [reviewId, setReviewId] = useState(null)

    useEffect(() => {
        if (!authUser.token) {
            return
        }

        const headers = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authUser.token
            }
        }
        // console.log('Fetching user review for mediaType:', mediaType, 'mediaId:', mediaId, 'userId:', authUser.id)

        axios.get(`${apiUrl}/api/movie/reviews/${mediaType}/${mediaId}/${authUser.id}`, headers)
            .then(response => {
                setReview(response.data)
                setReviewId(response.data.id)
                console.log(response.data)
            })
            .catch(error => {
                alert(error.response.data ? error.response.data.message : error)
            })
    }, []);

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

        if (!reviewId) {
            axios.post(`${apiUrl}/api/movie/reviews/${mediaType}/${mediaId}`, JSON.stringify(review), headers)
                .then(response => {
                    setReviewId(response.data.rows[0].id)
                    console.log('Review submitted with id:', response.data.rows[0].id)
                    fetchMovieReviews()
                    console.log(response.data)
                })
                .catch(error => {
                    alert(error.response.data ? error.response.data.message : error)
                })
        } else {
            if (confirm('Are you sure you want to update your review?')) {
                // console.log('Updating review with id:', reviewId)
                // console.log('Review data:', review)
                axios.put(`${apiUrl}/api/movie/review/${reviewId}`, JSON.stringify(review), headers)
                    .then(response => {
                        fetchMovieReviews()
                        // console.log(response.data)
                        alert(response.data.message)
                    })
                    .catch(error => {
                        alert(error.response.data ? error.response.data.message : error)
                    })
            } 
        }
    }

    const deleteReview = () => {
        if (!authUser.token) {
            alert('Cant delete review without an account')
            return
        }

        if (!reviewId) {
            alert('No review to delete')
            return
        }

        const headers = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authUser.token
            }
        }

        if (confirm('Are you sure you want to delete your review?')) {
            axios.delete(`${apiUrl}/api/movie/review/delete/${reviewId}`, headers)
                .then(response => {
                    setReview({ grade: 0, description: '' })
                    setReviewId(null)
                    fetchMovieReviews()
                    alert(response.data.message)
                    // console.log(response.data)
                })
                .catch(error => {
                    alert(error.response.data ? error.response.data.message : error)
                })
        } else {
            return
        }
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
                                        checked={review.grade === rating}
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

                    <button type='submit'>{reviewId ? 'Update review' : 'Submit review'}</button>
                    <div>
                        {reviewId && <button type='button' onClick={deleteReview}>Delete review</button>}
                    </div>
                </form>
            </div>
        )
    }

    export default ReviewForm