import { Router } from 'express'
import { getMovieData, getNowPlayingMovies, getMovieReviews, postMovieReview } from '../controllers/MovieController.js'
import { auth } from '../middleware/auth.js'

const router = Router()

router.get('/', getMovieData)
router.get('/now-playing', getNowPlayingMovies)

router.get('/reviews/:mediaType/:mediaId', getMovieReviews);
router.post('/reviews/:mediaType/:mediaId', auth, postMovieReview)
router.get('/reviews/:mediaType/:mediaId', getMovieReviews);

export default router