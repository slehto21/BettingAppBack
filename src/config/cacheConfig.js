import memjs from 'memjs';

const CACHE_EXPIRATION = 60 * 60 * 24; // 1 day
const memcached = memjs.Client.create(process.env.MEMCACHED_PORT);

export { memcached, CACHE_EXPIRATION };