function normalizeCharacterName(characterName) {
    if (!characterName) {
        return '';
    }

    const cleanCharacterName = characterName.replace(/\(uncredited\)/g, "").replace("The", "").trim();

    const parts = cleanCharacterName.split(' / ').sort();
    return parts.join(' / ');
}

module.exports = { normalizeCharacterName };