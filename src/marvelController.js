const {findActorsWithMultipleCharacters, fetchActorToMoviesMap, findCharactersWithMultipleActors} = require("./services/movieDataProcessor");
const {fetchAndCache} = require("./services/nodeCacheService");




async function fetchMoviesPerActor(actorName) {
    console.log(`Fetching movies per actor with name ${actorName}`);
    const actorToMovieMapCacheKey = 'actorToMovieMap';
    try {
        let actorToMovieMap = await fetchAndCache(actorToMovieMapCacheKey);
        if(actorToMovieMap == null) {
            actorToMovieMap = await fetchActorToMoviesMap();
            await fetchAndCache(actorToMovieMapCacheKey, actorToMovieMap);
        }

        return Array.from(actorToMovieMap.get(actorName) || []);
    } catch (error) {
        console.error('Error fetching movies for actor: ', error);
        throw new Error(error);
    }

}


async function fetchActorsWithMultipleCharacters() {
    try {
        const actorsWithMultipleCharactersCacheKey = 'actorsWithMultipleCharactersCacheKey';
        let actorsWithMultipleCharacters  = await fetchAndCache(actorsWithMultipleCharactersCacheKey);
        if(actorsWithMultipleCharacters == null){
            console.log(`Fetching actors with several characters`);
            actorsWithMultipleCharacters = await findActorsWithMultipleCharacters();
            await fetchAndCache(actorsWithMultipleCharactersCacheKey,actorsWithMultipleCharacters);
        }
        return actorsWithMultipleCharacters;

    } catch (error) {
        console.error('Error fetching actors with multiple characters: ', error);
        throw new Error(error);
    }
}


async function fetchCharactersWithMultipleActors() {
    try {
        const charactersWithMultipleActorsCacheKey = 'charactersWithMultipleActorsCacheKey';
        let characterWithMultipleActorsResult = await fetchAndCache(charactersWithMultipleActorsCacheKey);
        if(characterWithMultipleActorsResult == null){
            console.log(`Fetching Characters with several actors`);
            characterWithMultipleActorsResult = await findCharactersWithMultipleActors()
            await fetchAndCache(charactersWithMultipleActorsCacheKey, characterWithMultipleActorsResult);
        }
        return characterWithMultipleActorsResult;
    } catch (error) {
        console.error('Error fetching characters with multiple actors: ', error);
        throw new Error(error);
    }
}

module.exports = { fetchMoviesPerActor, fetchActorsWithMultipleCharacters, fetchCharactersWithMultipleActors };