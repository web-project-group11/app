import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { logIn, signUp, deleteAccount, fetchProfileData, updateProfileData } from '../controllers/UserController.js'
import { getMyFavorites } from '../controllers/FavoriteController.js'
import { getFavoritesForUser } from '../controllers/FavoriteController.js'

const router = Router()

router.post('/signup', signUp)
router.post('/login', logIn)
router.delete('/delete', auth, deleteAccount)
router.get('/data', auth, fetchProfileData)
router.put('/data/update', auth, updateProfileData)
router.get('/myFavorites', auth, getMyFavorites)
router.get('/favorites/:username', getFavoritesForUser)

export default router