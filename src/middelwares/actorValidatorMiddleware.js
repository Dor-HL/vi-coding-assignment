const { actors } = require('../../dataForQuestions');

function validateActorInList(req, res, next) {
    const { actorName } = req.query;

    if (!actorName || !actors.includes(actorName)) {
        return res.status(404).send({ error: 'Actor not found' });
    }

    next();
}

module.exports = { validateActorInList };