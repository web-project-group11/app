import { getGroup, getGroups, createGroup, getGroupsForUser, updateGroupById, deleteGroup, getGroupChatMessages, insertGroupChatMessage } from '../models/Group.js';
import { getGroupMember, getGroupMembers, getGroupMemberCount, insertGroupMember, updateGroupMemberStatus, deleteGroupMember } from '../models/GroupMember.js';
import { ApiError } from '../helper/ApiError.js';

const fetchGroups = async (req, res, next) => {
    try {
        const result = await getGroups();
        res.status(200).json(result);
    } catch (error) {
        return next(error);
    }
};

const fetchMyGroups = async (req, res, next) => {
    try {
        const userId = req.user?.userId

        if (!userId) {
            return next(new ApiError('Authentication required', 401))
        }

        const result = await getGroupsForUser(userId)
        return res.status(200).json(result.rows)
    } catch (error) {
        return next(error)
    }
}

const fetchGroup = async (req, res, next) => {
    try {
        const groupId = Number(req.params.groupId);

        if (!Number.isInteger(groupId) || groupId <= 0) {
            return next(new ApiError('A valid group ID is required.', 400));
        }

        const result = await getGroup(groupId);

        if (result.rowCount === 0) {
            return next(new ApiError('Group not found.', 404));
        }

        // Getting membercount and adding to fetched group object
        const memberCount = await getGroupMemberCount(groupId, 'member');
        result.rows[0].member_count = Number(memberCount);

        res.status(200).json(result.rows[0]);
    } catch (error) {
        return next(error);
    }
};

const createNewGroup = async (req, res, next) => {
    try {
        const name = req.body.group?.groupName?.trim();
        const desc = req.body.group?.description?.trim();
        const ownerId = req.user.userId;

        if (!ownerId || !name || !desc) {
            return next(new ApiError('Group owner, group name and description are required.', 400));
        }

        const result = await createGroup(ownerId, name, desc);

        // add group owner to the members of that group
        await insertGroupMember(result.rows[0].id, ownerId, 'member');

        return res.status(201).json(result.rows[0]);

    } catch (error) {
        return next(error);
    }
};

const updateGroup = async (req, res, next) => {
    try {
        const groupId = Number(req.params.groupId);
        const name = req.body.group?.group_name?.trim();
        const desc = req.body.group?.description;
        const ownerId = req.user.userId;

        if (!groupId  || !name || !desc) {
            return next(new ApiError('Group, group name and description are required.', 400));
        }

        const groupResult = await getGroup(groupId);

        if (groupResult.rowCount === 0) {
            return next(new ApiError('Group not found', 404));
        }

        if (groupResult.rows[0].owner_id !== ownerId) {
            return next(new ApiError('You are not the owner of this group.', 403));
        }

        const result = await updateGroupById(groupId, name, desc);

        return res.status(200).json(result.rows[0]);

    } catch (error) {
        return next(error);
    }
};

const removeGroup = async (req, res, next) => {
    try {
        const groupId = Number(req.params.groupId);
        const ownerId = req.user.userId;

        if (!Number.isInteger(groupId) || groupId <= 0) {
            return next(new ApiError('A valid group ID is required.', 400));
        }

        const result = await deleteGroup(groupId, ownerId);

        if (result.rowCount === 0) {
            return next(new ApiError('Group not found or you are not the owner.', 404));
        }

        return res.status(200).json({ message: 'Group deleted.' });
    } catch (error) {
        return next(error);
    }
};

const fetchGroupMember = async (req, res, next) => {
    try {
        const { groupId, userId } = req.params;

        const result = await getGroupMember(groupId, userId);

        if (result.rowCount === 0) {
            return next(new ApiError('Group member not found.', 404));
        }

        return res.status(200).json(result.rows[0]);
    } catch (error) {
        return next(error);
    }
};

const fetchGroupMembers = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const { status, page, limit } = req.query;

        if (status !== 'member' && status !== 'pending') {
            return next(new ApiError('Status needs to be either "pending" or "member".', 400));
        }

        const result = await getGroupMembers(groupId, status, page, limit);

        const memberCount = await getGroupMemberCount(groupId, status);

        const response = {
            member_count: Number(memberCount),
            members: result.rows
        };

        return res.status(200).json(response);

    } catch (error) {
        console.error(error);
        return next(new ApiError('Failed to fetch members.', 500));
    }
};

const joinGroup = async (req, res, next) => {
    try {
        const groupId = Number(req.params.groupId);
        const userId = req.user.userId;

        if (!Number.isInteger(groupId)) {
            return next(new ApiError('A valid group ID is required.', 400));
        }

        const result = await insertGroupMember(groupId, userId, 'pending');

        if (result.rowCount === 0) {
            return next(new ApiError('Group or user not found.', 404));
        }

        return res.status(201).json(result.rows[0]);

    } catch (error) {
        return next(error);
    }
};

const approveGroupMember = async (req, res, next) => {
    try {
        const groupId = Number(req.params.groupId);
        const userId = Number(req.params.userId);
        const ownerId = req.user.userId;

        if (!Number.isInteger(groupId) || !Number.isInteger(userId)) {
            return next(new ApiError('A valid group and user ID is required.', 400));
        }

        const groupResult = await getGroup(groupId);

        if (groupResult.rowCount === 0) {
            return next(new ApiError('Group not found.', 404));
        }

        if (groupResult.rows[0].owner_id !== ownerId) {
            return next(new ApiError('You are not the owner of this group.', 403));
        }

        const memberResult = await updateGroupMemberStatus(groupId, userId, 'member');

        if (memberResult.rowCount === 0) {
            return next(new ApiError('Group or user not found', 404));
        }

        return res.status(200).json({ message: 'User group membership approved.' });
    } catch (error) {
        return next(error);
    }
};

const removeGroupMember = async (req, res, next) => {
    try {
        const groupId = Number(req.params.groupId);
        const userId = Number(req.params.userId);
        const ownerId = req.user.userId;

        if (!Number.isInteger(groupId) || !Number.isInteger(userId)) {
            return next(new ApiError('A valid group and user ID is required.', 400));
        }

        const groupResult = await getGroup(groupId);

        if (groupResult.rowCount === 0) {
            return next(new ApiError('Group not found', 404));
        }

        if (groupResult.rows[0].owner_id !== ownerId) {
            return next(new ApiError('You are not the owner of this group.', 403));
        }

        const memberResult = await deleteGroupMember(groupId, userId);

        if (memberResult.rowCount === 0) {
            return next(new ApiError('Group or user not found.', 404));
        }

        return res.status(200).json({ message: 'Group member removed.' });
    } catch (error) {
        return next(error);
    }
};

const leaveGroup = async (req, res, next) => {
    try {
        const groupId = Number(req.params.groupId);
        const userId = req.user.userId;

        if (!Number.isInteger(groupId)) {
            return next(new ApiError('A valid group ID is required.', 400));
        }

        const result = await deleteGroupMember(groupId, userId);

        if (result.rowCount === 0) {
            return next(new ApiError('Group or user not found.', 404));
        }

        return res.status(200).json({ message: 'Left the group.' });
    } catch (error) {
        console.log(error);
        return next(error);
    }
};

const fetchGroupChatMessages = async (req, res, next) => {
    try {
        const groupId = Number(req.params.groupId);

        if (!Number.isInteger(groupId)) {
            return next(new ApiError('A valid group ID is required.', 400));
        }

        // Check that user is a member of the group before fetching messages
        const checkMemberStatus = await getGroupMember(groupId, req.user.userId)
        if (checkMemberStatus.rowCount === 0 || checkMemberStatus.rows[0].status !== 'member') {
            return next(new ApiError('You are not a member of this group.', 403));
        }
        
        // Fetching messages from the database
        const result = await getGroupChatMessages(groupId);
        return res.status(200).json(result.rows);

    } catch (error) {
        console.log(error);
        return next(error);
    }
};

const sendGroupChatMessage = async (req, res, next) => {
    console.log("Sending message in controller");
    try {
        const groupId = Number(req.params.groupId);
        const userId = req.user.userId;
        const message = req.body.message?.trim();

        if (!Number.isInteger(groupId)) {
            return next(new ApiError('A valid group ID is required.', 400));
        }

        if (!Number.isInteger(userId)) {
            return next(new ApiError('A valid user ID is required.', 400));
        }

        if (!message) {
            return next(new ApiError('Message is required.', 400));
        }

        if (message.length > 100) {
            return next(new ApiError('Message is too long.', 400));
        }

        // Check that user is a member of the group before sending message
        const checkMemberStatus = await getGroupMember(groupId, userId);
        if (checkMemberStatus.rowCount === 0 || checkMemberStatus.rows[0].status !== 'member') {
            return next(new ApiError('You are not a member of this group.', 403));
        }

        // Send the message to the database
        const result = await insertGroupChatMessage(groupId, userId, message);

        return res.status(201).json(result.rows[0]);
    } catch (error) {
        console.log(error);
        return next(error);
    }
};

export { 
    fetchGroup,
    fetchGroups,
    createNewGroup,
    updateGroup,
    fetchMyGroups,
    removeGroup,
    fetchGroupMember,
    fetchGroupMembers,
    joinGroup,
    approveGroupMember,
    removeGroupMember,
    leaveGroup,
    fetchGroupChatMessages,
    sendGroupChatMessage
};