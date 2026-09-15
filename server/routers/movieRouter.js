import { Router } from 'express'
import { getMovieData, getNowPlayingMovies, getMovieReviews } from '../controllers/MovieController.js'
import { addMyFavorite, removeMyFavorite, getMyFavorites } from '../controllers/FavoriteController.js'
import { auth } from '../middleware/auth.js'

const router = Router()

router.get('/', getMovieData)
router.get('/now-playing', getNowPlayingMovies)
router.get('/reviews/:movieId', getMovieReviews)

router.post('/favorites/:movieId', auth, addMyFavorite)
router.delete('/favorites/:movieId', auth, removeMyFavorite)
router.get('/myFavorites', getMyFavorites)

export default router