import { Router } from 'express'
import { getMovieData, getNowPlayingMovies, getMovieReviews, postMovieReview } from '../controllers/MovieController.js'
import { auth } from '../middleware/auth.js'

const router = Router()

router.get('/', getMovieData)
router.get('/now-playing', getNowPlayingMovies)

router.get('/reviews/:movieId', getMovieReviews);
router.post('/reviews/:movieId', auth, postMovieReview)

export default router