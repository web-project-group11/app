import { insertAccount } from '../models/User.js'
import { ApiError } from '../helper/ApiError.js'
import { hash } from 'bcrypt'

const signUp = async (req, res, next) => {
    try {
        const username = req.body.user?.username
        const email = req.body.user?.email?.trim().toLowerCase()
        const password = req.body.user?.password

        if (!email || !password || !username) {
            const error = new ApiError('Username, email and password are required', 400)
            return next(error)
        }

        const hashedPassword = await hash(password, 10)
        const result = await insertAccount(username, email, hashedPassword)
        
        // Returns user ID, username and email
        return res.status(201).json(result.rows[0])
    } catch (error) {
        return next(error)
    }
}

export { signUp }