import { ApiError } from '../helper/ApiError.js';
import { insertMyFavorite, deleteMyFavorite, getMyFavoritesData, getFavoritesByUsername, isMyFavorite } from '../models/UserFavorites.js';

const getMyFavorites = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return next(new ApiError('User ID required.', 400));
        }
        
        const result = await getMyFavoritesData(userId);
        if (result.rowCount === 0) {
            return next(new ApiError('Getting favorites failed.', 400));
        }
        return res.status(200).json(result.rows);
    } catch (error) {
        return next(error);
    }
};

const getFavoritesForUser = async (req, res, next) => {
    try {
        const { username } = req.params;

        if (!username) {
            return next(new ApiError('Username required.', 400));
        }

        const result = await getFavoritesByUsername(username);
        return res.status(200).json(result.rows);
    } catch (error) {
        return next(error);
    }
};

const checkMyFavorite = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { mediaId, mediaType } = req.params;

        if (!userId || !mediaId || !mediaType) {
            return next(new ApiError('User ID, media ID and media type required.', 400));
        }

        const result = await isMyFavorite(userId, mediaId, mediaType);
        return res.status(200).json({ isFavorite: result.rowCount > 0 });
    } catch (error) {
        return next(error);
    }
};

const addMyFavorite = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { mediaId, mediaType } = req.body;

        if (!userId || !mediaId || !mediaType) {
            return next(new ApiError('User ID, media ID and media type required.', 400));
        }
        
        const result = await insertMyFavorite(userId, mediaId, mediaType);
        if (result.rowCount === 0) {
            return next(new ApiError('Adding favorite failed.', 400));
        }

        return res.status(200).json({ userId, mediaId, mediaType });

    } catch (error) {
        return next(error);
    }
};

const removeMyFavorite = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { mediaId, mediaType } = req.params;

        if (!userId || !mediaId || !mediaType) {
            return next(new ApiError('User ID, media ID and media type required.', 400));
        }

        const result = await deleteMyFavorite(userId, mediaId, mediaType);
        if (result.rowCount === 0) {
            return next(new ApiError('Favorite not found.', 404));
        }

        return res.status(200).json({ userId, mediaId, mediaType });
    } catch (error) {
        return next(error);
    }
};

export { addMyFavorite, removeMyFavorite, getMyFavorites, getFavoritesForUser, checkMyFavorite };