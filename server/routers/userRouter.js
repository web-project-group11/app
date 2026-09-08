import { Router } from 'express'
import { signUp } from '../controllers/UserController.js'

const router = Router()

router.post('/signup', signUp)
//router.post('/login', signIn)
router.get('/health', (req, res, next) => {
    return res.status(201).json('works')
})

export default router