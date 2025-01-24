const { movies, actors } = require('../../dataForQuestions');
const { fetchMovieCredits } = require('./tmdbClientService');
const { normalizeCharacterName, getRefinedCharacterName } = require("../utils/parsingUtils");
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
        const ActorToCharactersCounter = {};
        for (const [actorName, movies] of actorCharacterMovieMap) {
            movies.forEach(({ characterName, movieName }) => {
                if (!characterName) {
                    console.warn(`Skipping entry for ${actorName} in movie ${movieName} due to missing character name.`);
                    return;
                }

                if (!result[actorName]) {
                    result[actorName] = [];
                    ActorToCharactersCounter[actorName] = 0;
                }

                const actorCharacters = result[actorName].map(entry => entry.characterName);

                const refinedCharacterName = getRefinedCharacterName(characterName, actorCharacters);

                if(!actorCharacters.some(name => name === refinedCharacterName)) {
                    ActorToCharactersCounter[actorName]++;
                }

                result[actorName].push({ movieName, characterName: refinedCharacterName });
            });
        }

        const actorsWithMultipleRoles = {};
        Object.keys(result).forEach(actor => {
            if (ActorToCharactersCounter[actor] > 1) {
                actorsWithMultipleRoles[actor] = result[actor];
            }
        });

        return actorsWithMultipleRoles;

    } catch (error) {
        console.error('Error fetching actors with multiple characters: ', error);
        throw new Error(error);
    }
}

async function findCharactersWithMultipleActors() {
    try {
        await populateMapsIfNecessary();

        const characterActorMap = {};
        const characterActorsCounter = {};

        for (const [actorName, movies] of actorCharacterMovieMap) {
            movies.forEach(({ characterName, movieName }) => {
                if (!characterName) {
                    console.warn(`Skipping entry for ${actorName} in movie ${movieName} due to missing character name.`);
                    return;
                }

                let characters = Object.keys(characterActorMap);
                const normalizedCharacterName = normalizeCharacterName(characterName);
                const refinedCharacterName = getRefinedCharacterName(normalizedCharacterName, characters);

                if (!characterActorMap[refinedCharacterName]) {
                    characterActorMap[refinedCharacterName] = [];
                    characterActorsCounter[refinedCharacterName] = 0;
                }

                if(!characterActorMap[refinedCharacterName].some(entry => entry.actorName === actorName)) {
                    characterActorsCounter[refinedCharacterName]++;
                }

                characterActorMap[refinedCharacterName].push({movieName, actorName});
            });
        }


        const charactersWithMultipleActors = {};
        Object.keys(characterActorMap).forEach(characterName => {
            if (characterActorsCounter[characterName] > 1) {
                charactersWithMultipleActors[characterName] = characterActorMap[characterName];
            }
        });

        return charactersWithMultipleActors;

    } catch (error) {
        console.error('Error fetching characters with multiple actors: ', error);
        throw new Error(error);
    }
}

async function populateMapsIfNecessary() {
    if (characterToActorsMap.size === 0 && actorToMoviesMap.size === 0) {
        console.log("Populating actor and character maps...");
        await mapActorsAndCharacters();
    }
}

async function fetchActorToMoviesMap() {
    await populateMapsIfNecessary();
    return actorToMoviesMap;
}


module.exports = {fetchActorToMoviesMap, findActorsWithMultipleCharacters, findCharactersWithMultipleActors};