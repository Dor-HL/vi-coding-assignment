const {
    fetchActorToMoviesMap,
    findActorsWithMultipleCharacters,
    findCharactersWithMultipleActors,
    mapActorsAndCharacters, fetchCharacterToActorsMap, fetchActorCharacterMovieMap, clearInMemoryMaps
} = require('../../src/services/movieDataProcessor');
const { fetchMovieCredits } = require('../../src/services/tmdbClientService');


jest.mock('../../src/services/tmdbClientService');

describe('mapActorsAndCharacters', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        fetchMovieCredits.mockImplementation(() => Promise.resolve( {
            cast: [
                {name: 'Robert Downey Jr.', character: 'Iron Man'},
                {name: 'Chris Hemsworth', character: 'Thor'},
            ],
        }));
    });

    test('should populate actorToMoviesMap, characterToActorsMap, and actorCharacterMovieMap', async () => {
        const actorToMoviesMap = await fetchActorToMoviesMap();
        expect(fetchMovieCredits).toHaveBeenCalledTimes(26);
        const characterToActorsMap = await fetchCharacterToActorsMap();
        const actorCharacterMovieMap = await fetchActorCharacterMovieMap();
        expect(actorToMoviesMap.get('Robert Downey Jr.').size).toEqual(26);
        expect(characterToActorsMap.get('Iron Man')).toEqual(new Set(['Robert Downey Jr.']));
        expect(actorCharacterMovieMap.get('Robert Downey Jr.').length).toEqual(26);
    });

    test('should throw error if fetchMovieCredits fails', async () => {
        fetchMovieCredits.mockRejectedValueOnce(new Error('API error'));

        await expect(mapActorsAndCharacters()).rejects.toThrow('API error');
    });
});

describe('findActorsWithMultipleCharacters', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        clearInMemoryMaps();
        fetchMovieCredits.mockImplementation(() => Promise.resolve( {
            cast: [
                {name: 'Michael B. Jordan', character: 'Johnny Storm / Human Torch'},
                {name: 'Michael B. Jordan', character: 'Erik Killmonger'},
            ],
        }));
    });

    test('should return actors with multiple characters', async () => {
        clearInMemoryMaps();
        const result = await findActorsWithMultipleCharacters();
        expect(Object.keys(result).length).toEqual(1);
        expect(Object.keys(result)[0]).toEqual('Michael B. Jordan');
    });
});

describe('findCharactersWithMultipleActors', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        clearInMemoryMaps();
        fetchMovieCredits.mockImplementation(() => Promise.resolve( {
            cast: [
                {name: 'Chris Evans', character: 'Johnny Storm / Human Torch'},
                {name: 'Michael B. Jordan', character: 'Johnny Storm / Human Torch'},
            ],
        }));
    });

    test('should return characters with multiple actors', async () => {
        const result = await findCharactersWithMultipleActors();
        expect(Object.keys(result).length).toEqual(1);
        expect(Object.keys(result)[0]).toEqual('Johnny Storm / Human Torch');
    });

});
