import { Router } from 'express'
import { auth } from '../helper/Auth.js'
import { logIn, signUp, deleteAccount } from '../controllers/UserController.js'

const router = Router()

router.post('/signup', signUp)
router.post('/login', logIn)
router.delete('/delete', auth, deleteAccount)

export default router