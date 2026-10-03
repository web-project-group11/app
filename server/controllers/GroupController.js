import { getGroup, getGroups, createGroup, removeGroup } from "../models/Group.js";
import { getGroupMember, getGroupMembers, getGroupMemberCount, insertGroupMember } from "../models/GroupMember.js";
import { ApiError } from "../helper/ApiError.js";

const fetchGroups = async (req, res, next) => {
    try {
        const result = await getGroups();
        res.status(200).json(result);
    } catch (error) {
        return next(error);
    }
}

const fetchGroup = async (req, res, next) => {
    try {
        const groupId = Number(req.params.groupId)

        if (!Number.isInteger(groupId) || groupId <= 0) {
            return next(new ApiError('A valid group ID is required', 400))
        }

        const result = await getGroup(groupId);

        if (result.rowCount === 0) {
            return next(new ApiError('Group not found', 404))
        }

        // Getting membercount and adding to fetched group object
        const memberCount = await getGroupMemberCount(groupId)
        result.rows[0].member_count = Number(memberCount)

        res.status(200).json(result.rows[0]);
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
            return next(new ApiError('Group owner, group name and description are required', 400))
        }

        const result = await createGroup(ownerId, name, desc)

        // add group owner to the members of that group
        const memberResult = await insertGroupMember(result.rows[0].id, ownerId, 'member')

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

const fetchGroupMember = async (req, res, next) => {
    try {
        const { groupId, userId } = req.params

        const result = await getGroupMember(groupId, userId)

        if (result.rowCount === 0) {
            return next(new ApiError('Group member not found', 404))
        }

        return res.status(200).json(result.rows[0])
    } catch (error) {
        return next(error)
    }
}

const fetchGroupMembers = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const { page, limit } = req.query;

        const result = await getGroupMembers(groupId, page, limit)

        const memberCount = await getGroupMemberCount(groupId)

        const response = {
            member_count: Number(memberCount),
            members: result.rows
        }

        return res.status(200).json(response)

    } catch (error) {
        console.error(error)
        return next(new ApiError('Failed to fetch members', 500))
    }
}

const addGroupMember = async (req, res, next) => {

}

export { fetchGroup, fetchGroups, createNewGroup, deleteGroup, fetchGroupMember, fetchGroupMembers, addGroupMember }