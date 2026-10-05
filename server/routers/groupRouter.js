import { Router } from 'express'
import { fetchGroup, fetchGroups, createNewGroup, updateGroup, removeGroup, fetchGroupMember, fetchGroupMembers, joinGroup, approveGroupMember, removeGroupMember, leaveGroup } from '../controllers/GroupController.js'
import { auth } from '../middleware/auth.js'

const router = Router()

router.get('/', auth, fetchGroups)
router.get('/:groupId', auth, fetchGroup)
router.put('/:groupId', auth, updateGroup)
router.post('/', auth, createNewGroup)
router.delete('/:groupId', auth, removeGroup)

router.get('/:groupId/members/:userId', auth, fetchGroupMember)
router.get('/:groupId/members', auth, fetchGroupMembers)
router.post('/:groupId/join', auth, joinGroup)
router.put('/:groupId/members/:userId', auth, approveGroupMember)
router.delete('/:groupId/leave', auth, leaveGroup)
router.delete('/:groupId/members/:userId', auth, removeGroupMember)

export default router