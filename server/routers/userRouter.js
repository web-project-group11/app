import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { logIn, signUp, deleteAccount, fetchProfileData, updateProfileData, fetchUserPageData } from '../controllers/UserController.js'
import { getMyFavorites } from '../controllers/FavoriteController.js'
import { getFavoritesForUser } from '../controllers/FavoriteController.js'

const router = Router()

router.post('/signup', signUp)
router.post('/login', logIn)

// Public data
router.get('/:username', fetchUserPageData)
router.get('/:username/reviews')

router.get('/myFavorites', auth, getMyFavorites)
router.get('/:username/favorites', getFavoritesForUser)

// Private data
router.get('/data', auth, fetchProfileData)
router.put('/data/update', auth, updateProfileData)
router.delete('/delete', auth, deleteAccount)

export default router