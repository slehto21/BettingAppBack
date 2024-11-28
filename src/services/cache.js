import { memcached, CACHE_EXPIRATION } from '../config/cacheConfig.js';

const cacheData = async (key, data) => {
    try {
        const jsonData = JSON.stringify(data);
        return memcached.set(key, jsonData, CACHE_EXPIRATION);
    } catch (e) {
        console.error('Error caching data: ', e);
    }
};

const getCachedData = async (key) => {
    try {
        const cachedData = await memcached.get(key);
        if (cachedData && cachedData.value && Buffer.isBuffer(cachedData.value)) {
            // Convert Buffer to string and parse JSON
            const cachedDataString = cachedData.value.toString('utf-8');
            if (cachedDataString.trim().startsWith('{') || cachedDataString.trim().startsWith('[')) {
                return JSON.parse(cachedDataString);
            } else {
                console.warn('Cached data is not in valid JSON format:', cachedDataString);
                return null;
            }
        } else {
            console.warn('Cached data is not a Buffer or does not have a value property:', cachedData);
            return null;
        }
    } catch (e) {
        console.error('Error getting cached data: ', e);
    }
};

export { cacheData, getCachedData };