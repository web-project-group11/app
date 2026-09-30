import { Router } from 'express'
import { fetchGroup, fetchGroups, createNewGroup, deleteGroup, fetchGroupMember, addGroupMember } from '../controllers/GroupController.js'
import { auth } from '../middleware/auth.js'

const router = Router()

router.get('/', auth, fetchGroups)
router.get('/:groupId', auth, fetchGroup)
//router.put('/:groupId', auth, updateGroup)
router.post('/', auth, createNewGroup)
router.delete('/:groupId', auth, deleteGroup)

router.get('/:groupId/members/:userId', auth, fetchGroupMember)
router.post('/:groupId/members', auth, addGroupMember)


export default router