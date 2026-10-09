import { Router } from 'express'
import { getFavoritesForGroup } from '../controllers/GroupFavoriteController.js'
import { fetchGroup, fetchGroups, createNewGroup, fetchMyGroups, updateGroup, removeGroup, fetchGroupMember, fetchGroupMembers, joinGroup, approveGroupMember, removeGroupMember, leaveGroup, fetchGroupChatMessages, sendGroupChatMessage } from '../controllers/GroupController.js'
import { auth } from '../middleware/auth.js'

const router = Router()

router.get('/', auth, fetchGroups)
router.get('/mine', auth, fetchMyGroups)
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

router.get('/:groupId/favorites', auth, getFavoritesForGroup)
router.get('/:groupId/chat', auth, fetchGroupChatMessages)
router.post('/:groupId/chat', auth, sendGroupChatMessage)

export default router