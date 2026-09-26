import { insertAccount, getLoginData, removeAccount, getProfileData, updateAccountData, getUserByName } from '../models/User.js'
import { getUserMediaReviews, getUserReviewAverage, getUserReviewCount } from '../models/Review.js'
import { ApiError } from '../helper/ApiError.js'
import { hash, compare } from 'bcrypt'
import jwt from 'jsonwebtoken'

const { sign } = jwt

const signUp = async (req, res, next) => {
    try {
        const username = req.body.user?.username?.trim()
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
        if (error.code === '23505') {
            return next(new ApiError('Username or email is already in use', 409))
        }
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
                message: 'Username or email is already in use'
            })
        }
        return next(new ApiError('Failed to update profile data', 500))
    }
}

const fetchUserPageData = async (req, res, next) => {
    try {
        const { username } = req.params;

        const result = await getUserByName(username)
        if (result.rowCount === 0) {
            return next(new ApiError('User not found', 404))
        }

        const countResult = await getUserReviewCount(result.rows[0].id)
        const averageResult = await getUserReviewAverage(result.rows[0].id)

        // Leaving out email since we dont want to show it to everyone
        const data = {
            id: result.rows[0].id,
            username: result.rows[0].username,
            created_at: result.rows[0].created_at,
            review_count: Number(countResult),
            review_average: Number(averageResult)
        }

        return res.status(200).json(data)

    } catch (error) {
        return next(new ApiError(error, 500))
    }
}

const fetchUserPageReviews = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const { page, limit } = req.query;

        const result = await getUserMediaReviews(user_id, page, limit)
        return res.status(200).json(result.rows)

    } catch (error) {
        return next(new ApiError('Failed to fetch reviews', 500))
    }
}


export { signUp, logIn, deleteAccount, fetchProfileData, updateProfileData, fetchUserPageData, fetchUserPageReviews }