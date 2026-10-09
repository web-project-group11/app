import jwt from 'jsonwebtoken'
import { ApiError } from '../helper/ApiError.js'

const { verify } = jwt

const auth = (req, _res, next) => {
    const [scheme, token] = req.get('authorization')?.split(' ') || []

    if (scheme !== 'Bearer' || !token){
        console.log('No token provided')
        return next(new ApiError('Authentication required', 401))
    }
    try {
        console.log('Token provided:', token)
        req.user = verify(token, process.env.JWT_SECRET_KEY)
        return next()
    } catch {
        console.log('Invalid or expired token')
        return next(new ApiError('Invalid or expired token', 401))
    }
}

export { auth }