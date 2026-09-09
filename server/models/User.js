import { pool } from '../helper/db.js'

const insertAccount = async (username, email, hashedPassword) => {
    return await pool.query(
        'INSERT INTO account (email, hashed_password, username) VALUES ($1, $2, $3) RETURNING id, username, email',
        [email, hashedPassword, username]
    )
}

export { insertAccount }