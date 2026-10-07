import { Router } from 'express'
import { getMovieData, getNowPlayingMovies, getTopRatedMovies, getMovieReviews, postMovieReview, getUserReview, updateUserReview, removeReview } from '../controllers/MovieController.js'
import { auth } from '../middleware/auth.js'

const router = Router()

router.get('/', getMovieData)
router.get('/now-playing', getNowPlayingMovies)
router.get('/top-rated', getTopRatedMovies)

router.get('/reviews/:mediaType/:mediaId', getMovieReviews);
router.get('/reviews/:mediaType/:mediaId/:userId', auth, getUserReview)
router.post('/reviews/:mediaType/:mediaId', auth, postMovieReview)
router.put('/review/:reviewId', auth, updateUserReview)
router.delete('/review/delete/:reviewId', auth, removeReview)

export default router