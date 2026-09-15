import { ApiError } from '../helper/ApiError.js'
import { addMyFavorite } from '../models/MyFavorites.js'


const myFavorite = async (req, res, next) => {
    try {
        const userId = req.user.userId
        const movieId = req.params.movieId

        if(!userId || !movieId){
            return next(new ApiError('userid and movieid required',400))
        }
        
        const result = await addMyFavorite(userId, movieId)
        if(result.rowCount === 0) {
            return next(new ApiError('Adding favorite failed', 400 ))
        }

        return res.status(200).json({ id: userId, movieid: movieId })

    } catch (error) {
        return next(error)
    }
}

export { myFavorite }
