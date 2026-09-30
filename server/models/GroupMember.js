import { pool } from '../helper/db.js'

const getGroupMember = async (groupId, userId) => {
    return await pool.query(
        'SELECT * FROM group_member WHERE user_id = $1 AND group_id = $2 AND status = member', [userId, groupId]
    )
}

const getGroupMemberCount = async (groupId) => {
    const countResult = await pool.query(
        "SELECT COUNT(*) as total_count FROM group_member WHERE group_id = $1 AND status = $2", [groupId, 'member']
    )
    return countResult.rows[0].total_count
}

export {getGroupMember, getGroupMemberCount}