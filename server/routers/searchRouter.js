import { Router } from 'express'
import { getMovies } from '../controllers/SearchController.js'

const router = Router()

router.get('/', getMovies)

export default router