const { movies, actors } = require('../../dataForQuestions');
const { fetchMovieCredits } = require('../tmdbClient');
let actorToMoviesMap = new Map();
let characterToActorsMap = new Map();
let actorCharacterMovieMap = new Map();


async function mapActorsAndCharacters() {
    for (const movieTitle in movies) {
        const movieId = movies[movieTitle];
        try {
            const response = await fetchMovieCredits(movieId);
            const cast = response.cast;

            const filteredCast = cast.filter(actor => actors.includes(actor.name));

            filteredCast.forEach(actor => {
                if (!actorToMoviesMap.has(actor.name)) {
                    actorToMoviesMap.set(actor.name, new Set());
                }
                actorToMoviesMap.get(actor.name).add(movieTitle);

                if (actor.character) {
                    if (!characterToActorsMap.has(actor.character)) {
                        characterToActorsMap.set(actor.character, new Set());
                    }
                    characterToActorsMap.get(actor.character).add(actor.name);

                    if (!actorCharacterMovieMap.has(actor.name)) {
                        actorCharacterMovieMap.set(actor.name, []);
                    }
                    actorCharacterMovieMap.get(actor.name).push({
                        movieName: movieTitle,
                        characterName: actor.character
                    });
                }
            });
        } catch (error) {
            console.error(`Error processing movie "${movieTitle}" with ID: ${movieId}:`, error.message);
            throw new Error(error);
        }
    }
}



async function findActorsWithMultipleCharacters() {
    try {
        await populateMapsIfNecessary();

        const result = {};

        for (const [actorName, movieCharacterData] of actorCharacterMovieMap) {
            movieCharacterData.forEach(({ movieName, characterName }) => {
                if (!result[actorName]) {
                    result[actorName] = [];
                }

                const actorCharacters = result[actorName].map(entry => entry.characterName);

                if (!actorCharacters.includes(characterName)) {
                    result[actorName].push({ movieName, characterName });
                }
            });
        }

        const actorsWithMultipleRoles = {};
        Object.keys(result).forEach(actor => {
            if (result[actor].length > 1) {
                actorsWithMultipleRoles[actor] = result[actor];
            }
        });

        return actorsWithMultipleRoles;


    } catch (error) {
        console.error('Error fetching actors with multiple characters: ', error);
        throw new Error(error);
    }
}

async function populateMapsIfNecessary() {
    if (Object.keys(characterToActorsMap).length === 0 && Object.keys(actorToMoviesMap).length === 0) {
        console.log("Populating actor and character maps...");
        await mapActorsAndCharacters();
    }
}

async function fetchActorToMoviesMap() {
    await populateMapsIfNecessary();
    return actorToMoviesMap;
}


module.exports = {fetchActorToMoviesMap, findActorsWithMultipleCharacters};