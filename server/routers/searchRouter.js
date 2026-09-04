import { Router } from 'express'
import { getMovies, getMovieData } from '../controllers/MovieController.js'

const router = Router()

router.get('/search', getMovies)
router.get('/movie', getMovieData)

export default router