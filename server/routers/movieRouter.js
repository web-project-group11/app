import { Router } from 'express'
import { addMyFavorite, removeMyFavorite, getMyFavorites } from '../controllers/FavoriteController.js'
import { getMovieData, getNowPlayingMovies, getMovieReviews, postMovieReview } from '../controllers/MovieController.js'
import { auth } from '../middleware/auth.js'

const router = Router()

router.get('/', getMovieData)
router.get('/now-playing', getNowPlayingMovies)

router.post('/favorites/:movieId', auth, addMyFavorite)
router.delete('/favorites/:movieId', auth, removeMyFavorite)
router.get('/myFavorites', auth, getMyFavorites)

router.get('/reviews/:mediaType/:mediaId', getMovieReviews);
router.post('/reviews/:mediaType/:mediaId', auth, postMovieReview)
router.get('/reviews/:mediaType/:mediaId', getMovieReviews);

export default router