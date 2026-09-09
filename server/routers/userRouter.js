import { Router } from 'express'
import { signUp } from '../controllers/UserController.js'

const router = Router()

router.post('/signup', signUp)
//router.post('/login', signIn)

export default router