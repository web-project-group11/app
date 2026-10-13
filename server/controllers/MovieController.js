import 'dotenv/config';
import { ApiError } from '../helper/ApiError.js';
import { getReviewsByMovieId, getMovieReviewAverage, getAllMovieReviewAverages, getUserMediaReview, insertMediaReview, editMediaReview, deleteReview } from '../models/Review.js';

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
    },
};

const getMovieData = async (req, res) => {
    const { movieId, mediaType } = req.query;
    try {
        const result = await fetch(
            `https://api.themoviedb.org/3/${mediaType}/${movieId}?append_to_response=images&include_image_language=en,null`,
            options,
        );
        const data = await result.json();

        // Retrieve average rating from our database and add to response. If movie has no reviews, this will return null so in that case we set avg rating to 0
        const averageResult = await getMovieReviewAverage(mediaType, movieId);
        data.average_local_rating = averageResult;
    
        // Right now we are returning the entire response from tmdb, this could be updated to only return fields we actually need
        return res.status(200).json(data) || [];
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
};

const getNowPlayingMovies = async (req, res, next) => {
    const { page = '1' } = req.query;

    try {
        const params = new URLSearchParams({
            language: 'en-US',
            page: page,
            region: 'FI'
        });

        const result = await fetch(`https://api.themoviedb.org/3/movie/now_playing?${params}`, options);

        if (!result.ok) {
            throw new ApiError('TMDB request failed.', result.status);
        }

        const data = await result.json()

        const results = await Promise.all(
            data.results.map(async ({ id, title, poster_path }) => {
                const averageResult = await getMovieReviewAverage('movie', id);

                return {
                    id,
                    type: 'movie',
                    title,
                    poster_path,
                    average_local_rating: averageResult,
                };
            })
        );

        res.status(200).json({
            results,
            page: data.page,
            total_pages: data.total_pages,
        });
    } catch (error) {
        return next(error);
    }
};

const getTopRatedMovies = async (req, res, next) => {
    try {
        // Gets average rating for each movie/show that has a review, ordered by descending rating so best rated will be first
        const topRatedResult = await getAllMovieReviewAverages();
        const results = await Promise.all(
            topRatedResult.rows.map(async ({id, type, average_local_rating}) => {
                // Need to get fields we dont store in our database, such as title and poster
                const result = await fetch(
                    `https://api.themoviedb.org/3/${type}/${id}?append_to_response=images&include_image_language=en,null`,
                    options,
                );
                const data = await result.json();
                
                return {
                    id,
                    type,
                    title: data.title || data.name,
                    poster_path: data.poster_path,
                    average_local_rating: Number(average_local_rating),
                };
            })
        );

        return res.status(200).json({
            results
        });
    } catch (error) {
        return next(error);
    }
};

//const getNowPlayingMovies = getMovieList('now_playing');
//const getTopRatedMovies = getMovieList('top_rated');

const getMovieReviews = async (req, res, next) => {
    const { mediaType, mediaId } = req.params;
    try {
        const result = await getReviewsByMovieId(mediaId, mediaType);
        res.status(200).json(result);
    } catch (error) {
        return next(error);
    }
};

const postMovieReview = async (req, res, next) => {
    try {
        const { mediaType, mediaId } = req.params;
        const userId = req.user.userId;
        const description = req.body.description;
        const grade = req.body.grade;

        if (grade < 1 || grade > 5) {
            return next(new ApiError('Grade cant be under 1 or over 5 stars.', 400));
        }

        const result = await insertMediaReview(userId, mediaId, mediaType, description, grade);
        res.status(201).json(result);
    } catch (error) {
        return next(error);
    }
};

const getUserReview = async (req, res, next) => {
    try {
        const { mediaType, mediaId, userId } = req.params;

        const result = await getUserMediaReview(userId, mediaType, mediaId);
        const data = result.rows[0];
        res.status(201).json(data);
    } catch (error) {
        return next(error);
    }
};

const updateUserReview = async (req, res, next) => {
    try {
        const { description, grade } = req.body;
        const { reviewId } = req.params;
        const userId = req.user.userId;

        const result = await editMediaReview(description, grade, reviewId, userId);

        if (result.rowCount === 0) {
            return next(new ApiError('Review not found or you are not the owner.', 403));
        }

        res.status(200).json({ message: 'Review updated succesfully.' });
    } catch (error) {
        return next(error);
    }
};

const removeReview = async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        await deleteReview(reviewId);
        res.status(201).json({ message: 'Review deleted succesfully.' });
    } catch (error) {
        return next(error);
    }
};

export { 
    getMovieData, 
    getNowPlayingMovies, 
    getTopRatedMovies, 
    getMovieReviews, 
    postMovieReview, 
    getUserReview, 
    updateUserReview, 
    removeReview 
};