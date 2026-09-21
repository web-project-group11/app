import { Router } from 'express'
import { searchContent } from '../controllers/SearchController.js'

const router = Router()

router.get('/', searchContent)

export default router

