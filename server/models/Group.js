import { pool } from '../helper/db.js'

const getGroup = async(groupId) => {
    return await pool.query(
        'SELECT * FROM public.group WHERE id = $1', [groupId]
    )
}

const getGroups = async () => {
    return await pool.query(
        `SELECT public.group.*, COUNT(group_member.user_id)::int AS member_count
         FROM public.group
         LEFT JOIN public.group_member
             ON group_member.group_id = public.group.id
             AND group_member.status = 'member'
         GROUP BY public.group.id
         ORDER BY public.group.group_name`
    )
}

const updateGroupById = async (groupId, name, description) => {
    return await pool.query(
        `
        UPDATE public.group SET group_name = $1, description = $2 WHERE id = $3
        RETURNING *
        `,
        [name, description, groupId]
    )
}

const createGroup = async(owner_id, group_name, description) => {
    return await pool.query(
        'INSERT INTO public.group (owner_id, group_name, description) VALUES ($1, $2, $3) RETURNING id, owner_id, group_name, description',
        [owner_id, group_name, description]
    )
}

const deleteGroup = async(groupId, ownerId) => {
    return await pool.query(
        'DELETE FROM public.group WHERE id = $1 AND owner_id = $2',
        [groupId, ownerId]
    )
}

export { getGroup, getGroups, createGroup, updateGroupById, deleteGroup }
