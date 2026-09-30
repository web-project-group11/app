import { pool } from '../helper/db.js'

const getGroupMember = async (groupId, userId) => {
    return await pool.query(
        'SELECT * FROM group_member WHERE user_id = $1 AND group_id = $2 AND status = $3', 
        [userId, groupId, 'member']
    )
}

const getGroupMemberCount = async (groupId) => {
    const countResult = await pool.query(
        "SELECT COUNT(*) as total_count FROM group_member WHERE group_id = $1 AND status = $2", 
        [groupId, 'member']
    )
    return countResult.rows[0].total_count
}

const insertGroupMember = async (groupId, userId, status) => {
    return await pool.query(
        'INSERT INTO group_member (group_id, user_id, status) VALUES ($1, $2, $3)',
        [groupId, userId, status]
    )
}

export {getGroupMember, getGroupMemberCount, insertGroupMember}