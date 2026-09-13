import { insertAccount, getLoginData, removeAccount, getProfileData, updateAccountData } from '../models/User.js'
import { ApiError } from '../helper/ApiError.js'
import { hash, compare } from 'bcrypt'
import jwt from 'jsonwebtoken'

const { sign } = jwt

const signUp = async (req, res, next) => {
    try {
        const username = req.body.user?.username.trim()
        const email = req.body.user?.email?.trim().toLowerCase()
        const password = req.body.user?.password

        if (!email || !password || !username) {
            return next(new ApiError('Username, email and password are required', 400))
        }

        const hashedPassword = await hash(password, 10)
        const result = await insertAccount(username, email, hashedPassword)

        // Returns user ID, username and email
        return res.status(201).json(result.rows[0])
    } catch (error) {
        return next(error)
    }
}

const logIn = async (req, res, next) => {
    try {
        const username = req.body.user?.username.trim()
        const password = req.body.user?.password

        if (!username || !password) {
            return next(new ApiError('Username and password are required', 400))
        }

        const result = await getLoginData(username)
        const dbUser = result.rows[0]
        if (!dbUser || !(await compare(password, dbUser.hashed_password))) {
            return next(new ApiError('Invalid username or password', 401))
        }

        const token = sign(
            {
                userId: dbUser.id,
                username: dbUser.username,
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
        )
        return res.status(200).json({ id: dbUser.id, username: dbUser.username, token })

    } catch (error) {
        return next(error)
    }

}

const deleteAccount = async (req, res, next) => {
    try {
        const userID = req.user.userId
        const result = await removeAccount(userID)

        if (result.rowCount === 0) {
            return next(new ApiError('User not found', 404))
        }

        res.status(200).json({
            message: "Account deleted"
        })
    } catch (error) {
        console.log(error)
        return next(new ApiError('Failed to delete account', 500))
    }
}

const fetchProfileData = async (req, res, next) => {
    try {
        const userId = req.user.userId
        const result = await getProfileData(userId)
        if (result.rowCount === 0) {
            return next(new ApiError('User not found', 404))
        }
        res.status(200).json(result.rows[0])
    } catch (error) {
        console.log(error)
        return next(new ApiError('Failed to get profile data', 500))
    }
}

const updateProfileData = async (req, res, next) => {
    const { username, email } = req.body
    const userId = req.user.userId
    try {
        const result = await updateAccountData(username, email, userId)
        if (result.rowCount === 0) {
            return next(new ApiError('User not found', 404))
        }

        return res.status(200).json({
            message: 'Account data updated succesfully'
        })
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({
                message: 'Username or email is already in used'
            })
        }
        return next(new ApiError('Failed to update profile data', 500))
    }
}

export { signUp, logIn, deleteAccount, fetchProfileData, updateProfileData }