const { validateActorInList } = require('../../src/middelwares/actorValidatorMiddleware');

jest.mock('../../dataForQuestions', () => ({
    actors: ['Robert Downey Jr.', 'Chris Evans', 'Scarlett Johansson'],
}));

describe('validateActorInList middleware', () => {
    it('should return 404 if actorName is not in the query', () => {
        const req = { query: {} };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        const next = jest.fn();

        validateActorInList(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith({ error: 'Actor not found' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 404 if actorName is not in the actors list', () => {
        const req = { query: { actorName: 'Tom Hiddleston' } }; // actorName is not in the list
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        const next = jest.fn();

        validateActorInList(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith({ error: 'Actor not found' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next() if actorName is in the actors list', () => {
        const req = { query: { actorName: 'Robert Downey Jr.' } }; // actorName is in the list
        const res = {};
        const next = jest.fn();

        validateActorInList(req, res, next);

        expect(next).toHaveBeenCalled();
    });
});