import { Router } from 'express'
import { getMovies, getMovieData, getNowPlayingMovies } from '../controllers/MovieController.js'

const router = Router()

router.get('/search', getMovies)
router.get('/movie', getMovieData)
router.get('/now-playing', getNowPlayingMovies)

export default router