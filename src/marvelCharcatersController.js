const {findActorsWithMultipleCharacters, fetchActorToMoviesMap} = require("./services/movieDataProcessor");




async function fetchMoviesPerActor(actorName) {
    console.log(`Fetching movies per actor with name ${actorName}`);
    try {
    const actorToMovieMap = await fetchActorToMoviesMap();
    return Array.from(actorToMovieMap.get(actorName) || []);

    } catch (error) {
        console.error('Error fetching movies for actor: ', error);
        throw new Error(error);
    }

}


async function fetchActorsWithMultipleCharacters() {
    try {
        return findActorsWithMultipleCharacters();

    } catch (error) {
        console.error('Error fetching actors with multiple characters: ', error);
        throw new Error(error);
    }
}


async function fetchCharactersWithMultipleActors() {
    try {
        console.log(`Fetching Characters with several actors`);
    } catch (error) {
        console.error('Error fetching characters with multiple actors: ', error);
        throw new Error(error);
    }
}

module.exports = { fetchMoviesPerActor, fetchActorsWithMultipleCharacters, fetchCharactersWithMultipleActors };