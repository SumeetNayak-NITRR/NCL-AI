// Simple in-memory cache
const cache = new Map();

/**
 * Fetch data with caching
 * @param {string} key - Unique key for the data
 * @param {Function} fetcher - Async function to fetch data if not cached
 * @param {number} ttlMinutes - Time to live in minutes (default: 5)
 * @returns {Promise<any>}
 */
export const fetchWithCache = async (key, fetcher, ttlMinutes = 5) => {
    const cached = cache.get(key);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < (ttlMinutes * 60 * 1000)) {
        // console.log(`[Cache] Hit for ${key}`);
        return cached.data;
    }

    // console.log(`[Cache] Miss for ${key}. Fetching...`);
    try {
        const data = await fetcher();
        cache.set(key, {
            data,
            timestamp: now
        });
        return data;
    } catch (error) {
        console.error(`[Cache] Error fetching ${key}:`, error);
        throw error;
    }
};

export const clearCache = (key) => {
    if (key) {
        cache.delete(key);
    } else {
        cache.clear();
    }
}
