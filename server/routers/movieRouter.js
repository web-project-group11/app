import { Router } from 'express'
import { getMovieData, getNowPlayingMovies, getMovieReviews } from '../controllers/MovieController.js'

const router = Router()

router.get('/', getMovieData)
router.get('/now-playing', getNowPlayingMovies)
router.get('/reviews/:movieId', getMovieReviews);

export default router