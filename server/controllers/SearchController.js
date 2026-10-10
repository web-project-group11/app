import 'dotenv/config';
import { searchAll } from './search/searchAll.js';
import { searchMovies } from './search/searchMovies.js';
import { searchTv } from './search/searchTv.js';

const searchContent = async (req, res) => {
    const { type } = req.query;
    const params = new URLSearchParams({
        language: 'en-US'
    });

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
        },
    };

    if (type === 'all') {
        return searchAll(req, res, params, options);
    } else if (type === 'movie') {
        return searchMovies(req, res, params, options);
    } else if (type === 'tv') {
        return searchTv(req, res, params, options);
    } else {
        return res.status(400).json({ message: 'Invalid search type.' });
    }
};

export { searchContent };
