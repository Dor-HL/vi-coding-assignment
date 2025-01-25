const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 12 * 60 * 60 });

async function fetchAndCache(key, data = null, ttl = 12 * 60 * 60) {
    if (cache.has(key)) {
        console.log(`Cache hit for key: ${key}`);
        return cache.get(key);
    }
    if (data === null) {
        console.log(`No data provided for key: ${key}, returning null.`);
        return null;
    }

    console.log(`Cache miss for key: ${key}, storing data...`);

    cache.set(key, data, ttl);

    return data;
}

module.exports = { fetchAndCache };