const express = require('express');
const router = express.Router();
const { fetchMoviesPerActor,fetchActorsWithMultipleCharacters,fetchCharactersWithMultipleActors } = require('./marvelCharactersController');
const {validateActorInList} = require("./middelwares/actorValidatorMiddleware");


router.get('/moviesPerActor', validateActorInList, async (req, res) => {
    const { actorName } = req.query;
    try {
        const movies = await fetchMoviesPerActor(actorName);
        res.json({ [actorName]: movies });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


router.get('/actorsWithMultipleCharacters', async (req, res) => {
    try {
        const actors = await fetchActorsWithMultipleCharacters();
        res.json(actors);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


router.get('/charactersWithMultipleActors', async (req, res) => {
    try {
        const characters = await fetchCharactersWithMultipleActors();
        res.json(characters);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;