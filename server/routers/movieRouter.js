import { Router } from 'express'
import { addMyFavorite, removeMyFavorite, getMyFavorites, checkMyFavorite } from '../controllers/FavoriteController.js'
import { getMovieData, getNowPlayingMovies, getMovieReviews, postMovieReview, getUserReview, updateUserReview, removeReview } from '../controllers/MovieController.js'
import { auth } from '../middleware/auth.js'

const router = Router()

router.get('/', getMovieData)
router.get('/now-playing', getNowPlayingMovies)

router.post('/myfavorites/:mediaType/:movieId', auth, addMyFavorite)
router.delete('/myfavorites/:mediaType/:movieId', auth, removeMyFavorite)
router.get('/myfavorites/:mediaType/:movieId', auth, checkMyFavorite)
router.get('/myFavorites', auth, getMyFavorites)

router.get('/reviews/:mediaType/:mediaId', getMovieReviews);
router.post('/reviews/:mediaType/:mediaId', auth, postMovieReview)
router.get('/reviews/:mediaType/:mediaId/:userId', auth, getUserReview)
router.put('/review/:reviewId', auth, updateUserReview)
router.delete('/review/delete/:reviewId', auth, removeReview)
router.get('/reviews/:mediaType/:mediaId', getMovieReviews);

export default router