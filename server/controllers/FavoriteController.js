import { ApiError } from '../helper/ApiError.js'
import { insertMyFavorite, deleteMyFavorite, getMyFavoritesData } from '../models/MyFavorites.js'


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
        return res.status(200).json(result)
    }catch(error){
        return next(error)
    }
}

const addMyFavorite = async (req, res, next) => {
    try {
        const userId = req.user.userId
        const movieId = req.params.movieId

        if(!userId || !movieId){
            return next(new ApiError('userid and movieid required',400))
        }
        
        const result = await insertMyFavorite(userId, movieId)
        if(result.rowCount === 0) {
            return next(new ApiError('Adding favorite failed', 400 ))
        }

        return res.status(200).json({ id: userId, movieid: movieId })

    } catch (error) {
        return next(error)
    }
}

const removeMyFavorite = async (req, res, next) => {
    try {
        const userId = req.user.userId
        const movieId = req.params.movieId

        if(!userId || !movieId){
            return next(new ApiError('userid and movieid required', 400))
        }

        const result = await deleteMyFavorite(userId, movieId)
        if(result.rowCount === 0) {
            return next(new ApiError('Favorite not found', 404))
        }

        return res.status(200).json({ id: userId, movieid: movieId })
    } catch (error) {
        return next(error)
    }
}

export { addMyFavorite, removeMyFavorite, getMyFavorites }
