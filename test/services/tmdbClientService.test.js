const axios = require('axios');
const { fetchMovieCredits } = require('../../src/services/tmdbClientService');

jest.mock('axios');

describe('fetchMovieCredits', () => {
    const movieId = 12345;
    const mockData = {
        id: movieId,
        cast: [
            { name: 'Actor 1', character: 'Character 1' },
            { name: 'Actor 2', character: 'Character 2' },
        ],
    };

    test('should fetch movie credits successfully', async () => {
        axios.get.mockResolvedValue({ data: mockData });

        const result = await fetchMovieCredits(movieId);

        expect(axios.get).toHaveBeenCalledTimes(1);

        expect(result).toEqual(mockData);
    });

    test('should throw error when fetch fails', async () => {
        axios.get.mockRejectedValue(new Error('Network Error'));
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        await expect(fetchMovieCredits(movieId)).rejects.toThrow('Network Error');

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            `Error fetching movie credits for movieId ${movieId}:`,
            'Network Error'
        );
        consoleErrorSpy.mockRestore();
    });
});