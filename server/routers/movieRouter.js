import { Router } from 'express'
import { getMovieData, getNowPlayingMovies, getMovieReviews, postMovieReview } from '../controllers/MovieController.js'
import { auth } from '../middleware/auth.js'

const router = Router()

router.get('/', getMovieData)
router.get('/now-playing', getNowPlayingMovies)

router.get('/reviews/:mediatype/:movieId', getMovieReviews);
router.post('/reviews/:mediatype/:movieId', auth, postMovieReview)
router.get('/reviews/:mediatype/:movieid', getMovieReviews);

export default router