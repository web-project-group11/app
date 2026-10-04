import { pool } from '../helper/db.js'

const getGroupMember = async (groupId, userId) => {
    return await pool.query(
        'SELECT * FROM group_member WHERE user_id = $1 AND group_id = $2', 
        [userId, groupId]
    )
}

const getGroupMembers = async (groupId, page, limit) => {
    // Calculate which record to start returning records from
    // Ordering by created_at ASC to return oldest members first
    const offset = (page - 1) * limit
    return await pool.query(
        `
        SELECT
            group_member.*,
            account.username
        FROM group_member
        JOIN account
            ON group_member.user_id = account.id
        WHERE group_member.group_id = $1
          AND group_member.status = $2
        ORDER BY group_member.created_at ASC
        LIMIT $3
        OFFSET $4
        `,
        [groupId, 'member', limit, offset]
    )
}

const getGroupMemberCount = async (groupId) => {
    const countResult = await pool.query(
        'SELECT COUNT(*) as total_count FROM group_member WHERE group_id = $1 AND status = $2', 
        [groupId, 'member']
    )
    return countResult.rows[0].total_count
}

const insertGroupMember = async (groupId, userId, status) => {
    return await pool.query(
        'INSERT INTO group_member (group_id, user_id, status) VALUES ($1, $2, $3) RETURNING *',
        [groupId, userId, status]
    )
}

const updateGroupMemberStatus = async (groupId, userId, status) => {
    return await pool.query(
        `
        UPDATE group_member SET status = $1 WHERE group_id = $2 AND user_id = $3
        RETURNING *
        `,
        [status, groupId, userId]
    )
}

const deleteGroupMember = async (groupId, userId) => {
    return await pool.query(
        'DELETE FROM group_member WHERE group_id = $1 AND user_id = $2',
        [groupId, userId]
    )
}

export {getGroupMember, getGroupMembers, getGroupMemberCount, insertGroupMember, updateGroupMemberStatus, deleteGroupMember}