const { MarvelCharactersExcludeList } = require('./marvelCharactersExcludeList');

function normalizeCharacterName(characterName) {
    if (!characterName) {
        return '';
    }

    let cleanCharacterName = characterName.replace(/\(uncredited\)/g, "").replace("The", "").trim();

    MarvelCharactersExcludeList.forEach((word) => {
        const wordRegex = new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "g");
        cleanCharacterName = cleanCharacterName.replace(wordRegex, "").trim();
    });

    cleanCharacterName = cleanCharacterName.replace(/\s+/g, " ");

    return normalizeNameFormat(cleanCharacterName);
}

function getRefinedCharacterName(characterName, existingNamesArray) {
    const normalizedCharacterName = normalizeCharacterName(characterName);
    let refinedCharacterName;

    if(isSingleWord(normalizedCharacterName)) {
        refinedCharacterName = existingNamesArray.find((item) => item === normalizedCharacterName) || normalizedCharacterName;
    } else {
        const [partA, partB] = normalizedCharacterName.trim().split('/').map(part => part.trim());
        refinedCharacterName =  existingNamesArray.find(item => item.trim().includes(partA) || item.trim().includes(partB) || item.includes(normalizedCharacterName)) || normalizedCharacterName;
    }

    return refinedCharacterName;
}

function normalizeNameFormat(name) {
    return name.split(' ').map(word=> word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

function isSingleWord(str) {
    return !/\s/.test(str);
}

module.exports = { normalizeCharacterName, getRefinedCharacterName };