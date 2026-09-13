import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { logIn, signUp, deleteAccount, fetchProfileData, updateProfileData } from '../controllers/UserController.js'

const router = Router()

router.post('/signup', signUp)
router.post('/login', logIn)
router.delete('/delete', auth, deleteAccount)
router.get('/data', auth, fetchProfileData)
router.put('/data/update', auth, updateProfileData)

export default router