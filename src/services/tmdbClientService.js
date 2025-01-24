const axios = require('axios');

const apiKey = 'ac505a02032a33d65dd28b41f72182e1'; // TODO: Move this to a secure location (e.g., env variable or AWS Secrets Manager)
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