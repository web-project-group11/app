import { Router } from 'express'
import { getMovieData, getNowPlayingMovies, getMovieReviews } from '../controllers/MovieController.js'

const router = Router()

router.get('/', getMovieData)
router.get('/now-playing', getNowPlayingMovies)
router.get('/reviews/:mediatype/:movieid', getMovieReviews);

export default router