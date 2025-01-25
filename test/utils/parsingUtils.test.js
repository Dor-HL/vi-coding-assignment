const { normalizeCharacterName, getRefinedCharacterName, isSingleWord } = require('../../src/utils/parsingUtils');

jest.mock('../../src/utils/marvelCharactersExcludeList', () => ({
    MarvelCharactersExcludeList: ['The', 'And', 'Of', 'A'],
}));

describe('normalizeCharacterName function', () => {
    test('should return an empty string if no character name is provided', () => {
        expect(normalizeCharacterName()).toBe('');
    });

    test('should clean up the character name by removing "(uncredited)"', () => {
        expect(normalizeCharacterName('Iron Man (uncredited)')).toBe('Iron Man');
    });

    test('should remove "The" from the character name', () => {
        expect(normalizeCharacterName('The Hulk')).toBe('Hulk');
    });

    test('should remove words from the exclude list', () => {
        expect(normalizeCharacterName('The Hulk And Iron Man')).toBe('Hulk Iron Man');
    });

    test('should properly format the name (capitalize each word)', () => {
        expect(normalizeCharacterName('iron man')).toBe('Iron Man');
    });

    test('should handle multiple spaces between words', () => {
        expect(normalizeCharacterName('Iron   Man')).toBe('Iron Man');
    });
});

describe('getRefinedCharacterName function', () => {
    const existingNamesArray = ['Iron Man', 'Hulk', 'Black Widow'];

    test('should return the same name if it exists in the existingNamesArray', () => {
        expect(getRefinedCharacterName('Iron Man', existingNamesArray)).toBe('Iron Man');
    });

    test('should return the normalized name if it does not exist in the existingNamesArray', () => {
        expect(getRefinedCharacterName('Iron woman', existingNamesArray)).toBe('Iron Woman');
    });

    test('should split and refine name based on "/ "', () => {
        expect(getRefinedCharacterName('Iron Man / Tony Stark', existingNamesArray)).toBe('Iron Man');
    });

    test('should return the normalized name when no matching name is found in the existingNamesArray', () => {
        expect(getRefinedCharacterName('Black panther', existingNamesArray)).toBe('Black Panther');
    });
});

describe('isSingleWord function', () => {
    test('should return true if the string contains only one word', () => {
        expect(isSingleWord('Iron')).toBe(true);
    });

    test('should return false if the string contains multiple words', () => {
        expect(isSingleWord('Iron Man')).toBe(false);
    });
});