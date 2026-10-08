import { ApiError } from '../helper/ApiError.js'
import { getGroupFavorites, isGroupFavorite, insertGroupFavorite, deleteGroupFavorite } from '../models/GroupFavorites.js'
import { getGroupMember } from '../models/GroupMember.js'

const verifyGroupMembership = async (req, groupId, next) => {
    const userId = req.user?.userId

    if (!userId) {
        next(new ApiError('Authentication required', 401))
        return false
    }

    const membership = await getGroupMember(groupId, userId)

    if ( membership.rowCount === 0 || membership.rows[0].status !== 'member') {
        next(new ApiError('You are not a member of this group', 403))
        return false
    }

    return true
}

const getFavoritesForGroup = async (req, res, next) => {
    try {
        const groupId = Number(req.params.groupId)

        if (!Number.isInteger(groupId) || groupId <= 0) {
            return next(new ApiError('A valid group ID is required', 400))
        }

        if (!await verifyGroupMembership(req, groupId, next)) return

        const result = await getGroupFavorites(groupId)
        return res.status(200).json(result.rows)
    } catch (error) {
        return next(error)
    }
}

const checkGroupFavorite = async (req, res, next) => {
    try {
        const groupId = Number(req.params.groupId)
        const { movieId, mediaType } = req.params

        if (!Number.isInteger(groupId) || groupId <= 0 || !movieId || !mediaType) {
            return next(new ApiError('groupid, movieid and mediatype required', 400))
        }

        if (!await verifyGroupMembership(req, groupId, next)) return

        const result = await isGroupFavorite(groupId, movieId, mediaType)
        return res.status(200).json({ isFavorite: result.rowCount > 0 })
    } catch (error) {
        return next(error)
    }
}

const addGroupFavorite = async (req, res, next) => {
    try {
        const groupId = Number(req.params.groupId)
        const { movieId, mediaType } = req.params

        if (!Number.isInteger(groupId) || groupId <= 0 || !movieId || !mediaType) {
            return next(new ApiError('groupid, movieid and mediatype required', 400))
        }

        if (!await verifyGroupMembership(req, groupId, next)) return

        const result = await insertGroupFavorite(groupId, movieId, mediaType)

        if (result.rowCount === 0) {
            return next(new ApiError('Adding group favorite failed', 400))
        }

        return res.status(200).json(result.rows[0])
    } catch (error) {
        return next(error)
    }
}

const removeGroupFavorite = async (req, res, next) => {
    try {
        const groupId = Number(req.params.groupId)
        const { movieId, mediaType } = req.params

        if (!Number.isInteger(groupId) || groupId <= 0 || !movieId || !mediaType) {
            return next(new ApiError('groupid, movieid and mediatype required', 400))
        }

        if (!await verifyGroupMembership(req, groupId, next)) return

        const result = await deleteGroupFavorite(groupId, movieId, mediaType)

        if (result.rowCount === 0) {
            return next(new ApiError('Group favorite not found', 404))
        }

        return res.status(200).json(result.rows[0])
    } catch (error) {
        return next(error)
    }
}

export {
    getFavoritesForGroup,
    checkGroupFavorite,
    addGroupFavorite,
    removeGroupFavorite
}