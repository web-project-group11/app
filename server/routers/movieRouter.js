import { Router } from 'express'
import { getMovieData, getNowPlayingMovies, getMovieReviews } from '../controllers/MovieController.js'
import { myFavorite } from '../controllers/FavoriteController.js'
import { auth } from '../middleware/auth.js'

const router = Router()

router.get('/', getMovieData)
router.get('/now-playing', getNowPlayingMovies)
router.get('/reviews/:movieId', getMovieReviews);
router.post('/favorites/:movieId', auth, myFavorite)

export default router