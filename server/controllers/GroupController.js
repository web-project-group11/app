import { getGroups, createGroup, removeGroup } from "../models/Group.js";
import { ApiError } from "../helper/ApiError.js";

const getAllGroups = async (req, res, next) => {
    try {
        const result = await getGroups();
        res.status(200).json(result);
    } catch (error) {
        return next(error);
    }
}

const createNewGroup = async (req, res, next) => {
    try {
        const name = req.body.group?.groupName?.trim()
        const desc = req.body.group?.groupDesc?.trim()
        const ownerId = req.user.userId

        if (!ownerId || !name || !desc) {
            return next(new ApiError('group owner, group name and description are required', 400))
        }

        const result = await createGroup(ownerId, name, desc)
        return res.status(201).json(result.rows[0])

    } catch (error) {
        return next(error)
    }
}

const deleteGroup = async (req, res, next) => {
    try {
        const groupId = Number(req.params.groupId)
        const ownerId = req.user.userId

        if (!Number.isInteger(groupId) || groupId <= 0) {
            return next(new ApiError('A valid group ID is required', 400))
        }

        const result = await removeGroup(groupId, ownerId)

        if (result.rowCount === 0) {
            return next(new ApiError('Group not found or you are not the owner', 404))
        }

        return res.status(200).json({ message: 'Group deleted' })
    } catch (error) {
        return next(error)
    }
}

export { getAllGroups, createNewGroup, deleteGroup }