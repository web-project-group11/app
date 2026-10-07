import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { logIn, signUp, deleteAccount, fetchProfileData, updateProfileData, fetchUserPageData, fetchUserPageReviews } from '../controllers/UserController.js'
import { addMyFavorite, removeMyFavorite, checkMyFavorite } from '../controllers/FavoriteController.js'
import { getFavoritesForUser } from '../controllers/FavoriteController.js'

const router = Router()

router.post('/signup', signUp)
router.post('/login', logIn)

// Private data
router.get('/data', auth, fetchProfileData)
router.put('/data', auth, updateProfileData)
router.delete('/', auth, deleteAccount)

router.get('/favorites/:mediaType/:mediaId', auth, checkMyFavorite)
router.post('/favorites', auth, addMyFavorite)
router.delete('/favorites/:mediaType/:mediaId', auth, removeMyFavorite)

// Public data
router.get('/:username', fetchUserPageData)
router.get('/:username/favorites', getFavoritesForUser)
router.get('/:user_id/reviews', fetchUserPageReviews)

export default router