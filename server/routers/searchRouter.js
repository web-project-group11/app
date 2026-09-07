import { Router } from 'express'
import { getMovies, getMovieData, getNowPlayingMovies, getMovieReviews } from '../controllers/MovieController.js'

const router = Router()

router.get('/search', getMovies)
router.get('/movie', getMovieData)
router.get('/now-playing', getNowPlayingMovies)
router.get('/movie/reviews/:movieId', getMovieReviews);

export default router