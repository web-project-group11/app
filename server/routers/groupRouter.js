import { Router } from 'express'
import { getAllGroups, createNewGroup, deleteGroup } from '../controllers/GroupController.js'
import { auth } from '../middleware/auth.js'

const router = Router()

router.get('/', getAllGroups)
router.post('/', auth, createNewGroup)
router.delete('/:groupId', auth, deleteGroup)

//TODO:
// Join group
// leave group
// should this have a seperate router?

export default router