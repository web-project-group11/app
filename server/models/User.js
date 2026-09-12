import { pool } from '../helper/db.js'

const insertAccount = async (username, email, hashedPassword) => {
    return await pool.query(
        'INSERT INTO account (email, hashed_password, username) VALUES ($1, $2, $3) RETURNING id, username, email',
        [email, hashedPassword, username]
    )
}

const getLoginData = async (username) => {
    return await pool.query(
        'SELECT id, username, hashed_password FROM account WHERE username=$1', 
        [username]
    )
}

const removeAccount = async(userID) => {
    return await pool.query('DELETE FROM account WHERE id = $1 RETURNING id, username, email',
        [userID]
    )
}

export { insertAccount, getLoginData, removeAccount }