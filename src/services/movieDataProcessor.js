const { movies, actors } = require('../../dataForQuestions');
const { fetchMovieCredits } = require('./tmdbClientService');
const {normalizeCharacterName} = require("../utils/parsingUtils");
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
        for (const [actorName, movies] of actorCharacterMovieMap) {
            movies.forEach(({ characterName, movieName }) => {
                if (!characterName) {
                    console.warn(`Skipping entry for ${actorName} in movie ${movieName} due to missing character name.`);
                    return;
                }

                const normalizedCharacterName = normalizeCharacterName(characterName);

                if (!result[actorName]) {
                    result[actorName] = [];
                }

                const actorCharacters = result[actorName].map(entry => entry.characterName);


                const splitNormalizedCharacterName = normalizedCharacterName
                    .split(/ \/ | /) // Split by space or "/"
                    .map(part => part.trim()) // Trim any extra spaces
                    .sort();

                const isContained = actorCharacters.some(existingName => {
                    const splitExistingName = existingName
                        .split(/ \/ | /) // Split by space or "/"
                        .map(part => part.trim()) // Trim any extra spaces
                        .sort();

                    return splitNormalizedCharacterName.some(part => splitExistingName.includes(part));
                });

                if (normalizedCharacterName && !isContained) {
                    result[actorName].push({ movieName, characterName: normalizedCharacterName });
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

async function findCharactersWithMultipleActors() {
    try {
        await populateMapsIfNecessary();

        const characterActorMap = {};

        for (const [actorName, movies] of actorCharacterMovieMap) {
            movies.forEach(({ characterName, movieName }) => {
                if (!characterName) {
                    console.warn(`Skipping entry for ${actorName} in movie ${movieName} due to missing character name.`);
                    return;
                }

                const normalizedCharacterName = normalizeCharacterName(characterName);
                let keys = Object.keys(characterActorMap);

                const [partA, partB] = normalizedCharacterName.trim().split('/').map(part => part.trim());
                let match =  keys.find(item => item.trim().includes(partA) || item.trim().includes(partB) || item.includes(normalizedCharacterName)) || normalizedCharacterName;

                if (!characterActorMap[match]) {
                    characterActorMap[match] = [];
                }
                if (
                    !characterActorMap[match].some(entry => entry.actorName === actorName)
                ) {
                    characterActorMap[match].push({
                        movieName,
                        actorName
                    });
                }
            });
        }


        const charactersWithMultipleActors = {};
        Object.keys(characterActorMap).forEach(characterName => {
            if (characterActorMap[characterName].length > 0) {
                charactersWithMultipleActors[characterName] = characterActorMap[characterName];
            }
        });

        return normalizeAndMergeCharacterEntries(charactersWithMultipleActors);

    } catch (error) {
        console.error('Error fetching characters with multiple actors: ', error);
        throw new Error(error);
    }
}

function normalizeAndMergeCharacterEntries(data) {
    const normalizedData = {};

    Object.keys(data).forEach((character) => {
        // Normalize character name by trimming spaces and sorting the parts of the name
        const normalizedName = character.trim().replace(/\s*\/\s*/g, " / ");

        if (!normalizedData[normalizedName]) {
            normalizedData[normalizedName] = [];
        }

        // Merge movie data for the normalized character
        data[character].forEach((movieEntry) => {
            // Check if the movie-actor combination already exists for the character
            const existingMovie = normalizedData[normalizedName].find(
                (entry) => entry.actorName === movieEntry.actorName && entry.movieName === movieEntry.movieName
            );

            // If the movie-actor combination doesn't exist, add it
            if (!existingMovie) {
                normalizedData[normalizedName].push(movieEntry);
            }
        });
    });

    return normalizedData;
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


module.exports = {fetchActorToMoviesMap, findActorsWithMultipleCharacters, findCharactersWithMultipleActors};