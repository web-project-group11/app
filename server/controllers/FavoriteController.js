import { ApiError } from '../helper/ApiError.js'
import { insertMyFavorite, deleteMyFavorite, getMyFavoritesData, getFavoritesByUsername, isMyFavorite } from '../models/MyFavorites.js'


const getMyFavorites = async (req, res, next) => {
    try {
        const userId = req.user.userId

        if(!userId){
            return next(new ApiError('userid required',400))
        }
        
        const result = await getMyFavoritesData(userId)
        if(result.rowCount === 0){
            return next(new ApiError('Getting favorites failed', 400))
        }
        return res.status(200).json(result.rows)
    }catch(error){
        return next(error)
    }
}

const getFavoritesForUser = async (req, res, next) => {
    try {
        const { username } = req.params

        if (!username) {
            return next(new ApiError('username required', 400))
        }

        const result = await getFavoritesByUsername(username)
        return res.status(200).json(result.rows)
    } catch (error) {
        return next(error)
    }
}

const checkMyFavorite = async (req, res, next) => {
    try {
        const userId = req.user.userId
        const { movieId, mediaType } = req.params

        if (!userId || !movieId || !mediaType) {
            return next(new ApiError('userid, movieid and mediatype required', 400))
        }

        const result = await isMyFavorite(userId, movieId, mediaType)
        return res.status(200).json({ isFavorite: result.rowCount > 0 })
    } catch (error) {
        return next(error)
    }
}

const addMyFavorite = async (req, res, next) => {
    try {
        const userId = req.user.userId
        const { movieId, mediaType } = req.params


        if(!userId || !movieId || !mediaType){
            return next(new ApiError('userid, movieid and mediatype required',400))
        }
        
        const result = await insertMyFavorite(userId, movieId, mediaType)
        if(result.rowCount === 0) {
            return next(new ApiError('Adding favorite failed', 400 ))
        }

        return res.status(200).json({ id: userId, movieid: movieId, mediaType })

    } catch (error) {
        return next(error)
    }
}

const removeMyFavorite = async (req, res, next) => {
    try {
        const userId = req.user.userId
        const { movieId, mediaType } = req.params


        if(!userId || !movieId || !mediaType){
            return next(new ApiError('userid, movieid and mediatype required', 400))
        }

        const result = await deleteMyFavorite(userId, movieId, mediaType)
        if(result.rowCount === 0) {
            return next(new ApiError('Favorite not found', 404))
        }

        return res.status(200).json({ id: userId, movieid: movieId, mediaType })
    } catch (error) {
        return next(error)
    }
}

export { addMyFavorite, removeMyFavorite, getMyFavorites, getFavoritesForUser, checkMyFavorite }
