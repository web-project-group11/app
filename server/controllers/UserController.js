import { insertAccount, getLoginData } from '../models/User.js'
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

const logIn = async (req, res, next) => {
    try {
        const username = req.body.user?.username.trim()
        const password = req.body.user?.password

        if(!username || !password){
            return next(new ApiError('Username and password are required'), 400)
        }

        const result = await getLoginData(username)
        const dbUser = result.rows[0]
        if(!dbUser || !(await compare(dbUser.password, password))){
            return next(new ApiError('Invalid username or password'), 401)
        }

        const token = sign(
            { 
                userId: dbUser.id, 
                username: dbUser.username
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h'}
        )
        return res.status(200).json({id: dbUser.id, username: dbUser.username, token})

    }catch(error){
        return next(error)        
    }

}

export { signUp, logIn }