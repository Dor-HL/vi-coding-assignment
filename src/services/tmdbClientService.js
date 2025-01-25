const axios = require('axios');
const apiKey = process.env.TMDB_API_KEY;
const baseUrl = 'https://api.themoviedb.org/3';


async function fetchMovieCredits(movieId) {
    try {
        const response = await axios.get(`${baseUrl}/movie/${movieId}/credits`, {
            params: {
                api_key: apiKey,
                language: 'en-US',
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching movie credits for movieId ${movieId}:`, error.message);
        throw error;
    }
}

module.exports = {
    fetchMovieCredits,
};