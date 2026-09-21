import { pool } from '../helper/db.js'

const getGroups = async() => {
    return await pool.query(
        `SELECT public.group.*, COUNT(group_member.user_id)::int AS member_count
         FROM public.group
         LEFT JOIN public.group_member ON group_member.group_id = public.group.id
         GROUP BY public.group.id
         ORDER BY public.group.group_name`
    )
}

const createGroup = async(owner_id, group_name, description) => {
    return await pool.query(
        'INSERT INTO public.group (owner_id, group_name, description) VALUES ($1, $2, $3) RETURNING owner_id, group_name, description',
        [owner_id, group_name, description]
    )
}

const removeGroup = async(groupId, ownerId) => {
    return await pool.query(
        'DELETE FROM public.group WHERE id = $1 AND owner_id = $2',
        [groupId, ownerId]
    )
}

export { getGroups, createGroup, removeGroup }
